import fs from "fs";
import http from "http";
import crypto from "crypto";
import { exec } from "child_process";
import fetch from "node-fetch";
import { config } from "./config.js";
import type { AuthResult, SavedToken, TokenResponse } from "./types.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readStringField(
  value: Record<string, unknown>,
  field: string
): string | undefined {
  const fieldValue = value[field];
  return typeof fieldValue === "string" ? fieldValue : undefined;
}

function readNumberField(
  value: Record<string, unknown>,
  field: string
): number | undefined {
  const fieldValue = value[field];
  return typeof fieldValue === "number" ? fieldValue : undefined;
}

export function carregarToken(): SavedToken | null {
  if (!fs.existsSync(config.TOKEN_FILE)) return null;

  try {
    const rawData = JSON.parse(fs.readFileSync(config.TOKEN_FILE, "utf-8")) as unknown;

    if (!isObject(rawData)) {
      fs.unlinkSync(config.TOKEN_FILE);
      return null;
    }

    const accessToken = readStringField(rawData, "access_token");
    const expiresAt = readNumberField(rawData, "expires_at");
    const personId = readStringField(rawData, "person_id");

    if (!accessToken || !expiresAt || !personId) {
      fs.unlinkSync(config.TOKEN_FILE);
      return null;
    }

    if (Date.now() >= expiresAt) {
      fs.unlinkSync(config.TOKEN_FILE);
      return null;
    }

    return {
      access_token: accessToken,
      expires_at: expiresAt,
      person_id: personId,
    };
  } catch {
    return null;
  }
}

export function salvarToken(
  token: string,
  expiresIn: number,
  personId: string
): void {
  const data: SavedToken = {
    access_token: token,
    expires_at: Date.now() + expiresIn * 1000,
    person_id: personId,
  };

  fs.writeFileSync(config.TOKEN_FILE, JSON.stringify(data, null, 2));
}

function abrirNavegador(url: string): void {
  const command =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;

  exec(command);
}

function gerarAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.CLIENT_ID,
    redirect_uri: config.REDIRECT_URI,
    scope: "openid profile w_member_social",
    state,
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

function createErrorMessage(payload: unknown, fallback: string): string {
  if (!isObject(payload)) return fallback;

  return (
    readStringField(payload, "error_description") ??
    readStringField(payload, "message") ??
    readStringField(payload, "error") ??
    fallback
  );
}

async function obterToken(code: string): Promise<TokenResponse> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: config.REDIRECT_URI,
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
  });

  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const payload = (await response.json()) as unknown;

  if (!isObject(payload)) {
    throw new Error("Resposta invalida ao obter token do LinkedIn.");
  }

  const accessToken = readStringField(payload, "access_token");
  const expiresIn = readNumberField(payload, "expires_in") ?? 5_183_944;

  if (!response.ok || !accessToken) {
    throw new Error(createErrorMessage(payload, "Falha ao obter token do LinkedIn."));
  }

  return {
    access_token: accessToken,
    expires_in: expiresIn,
  };
}

async function obterPersonId(token: string): Promise<string> {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const payload = (await response.json()) as unknown;

  if (!isObject(payload)) {
    throw new Error("Resposta invalida ao obter o perfil do LinkedIn.");
  }

  const personId = readStringField(payload, "sub");

  if (!response.ok || !personId) {
    throw new Error(createErrorMessage(payload, "Falha ao obter o person id do LinkedIn."));
  }

  return personId;
}

async function aguardarCallback(stateEsperado: string): Promise<string> {
  const redirectUrl = new URL(config.REDIRECT_URI);
  const timeoutMs = 120_000;

  return new Promise((resolve, reject) => {
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      server.close();
    };

    const server = http.createServer((request, response) => {
      if (!request.url) {
        response.writeHead(400).end("Requisicao invalida.");
        cleanup();
        reject(new Error("Callback do LinkedIn sem URL."));
        return;
      }

      const requestUrl = new URL(request.url, redirectUrl.origin);

      if (requestUrl.pathname !== redirectUrl.pathname) {
        response.writeHead(204).end();
        return;
      }

      const code = requestUrl.searchParams.get("code");
      const state = requestUrl.searchParams.get("state");
      const error = requestUrl.searchParams.get("error");

      if (error) {
        response.writeHead(400).end("Erro ao autenticar no LinkedIn.");
        cleanup();
        reject(new Error(`LinkedIn retornou erro durante a autenticacao: ${error}`));
        return;
      }

      if (!code) {
        response.writeHead(400).end("Codigo de autorizacao ausente.");
        cleanup();
        reject(new Error("Codigo de autorizacao nao encontrado no callback."));
        return;
      }

      if (state !== stateEsperado) {
        response.writeHead(400).end("State invalido.");
        cleanup();
        reject(new Error("State invalido recebido no callback do LinkedIn."));
        return;
      }

      response.writeHead(200).end("Autenticacao concluida. Pode fechar esta aba.");
      cleanup();
      resolve(code);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      cleanup();

      if (error.code === "EADDRINUSE") {
        reject(new Error("A porta do callback ja esta em uso."));
        return;
      }

      reject(new Error(error.message));
    });

    timeoutHandle = setTimeout(() => {
      cleanup();
      reject(new Error("Timeout aguardando o callback do LinkedIn."));
    }, timeoutMs);

    server.listen(Number(redirectUrl.port || 80));
  });
}

export async function autenticar(): Promise<AuthResult> {
  const state = crypto.randomBytes(16).toString("hex");
  const authUrl = gerarAuthUrl(state);

  abrirNavegador(authUrl);

  const code = await aguardarCallback(state);
  const tokenData = await obterToken(code);
  const personId = await obterPersonId(tokenData.access_token);

  salvarToken(tokenData.access_token, tokenData.expires_in, personId);

  return {
    accessToken: tokenData.access_token,
    personId,
  };
}
