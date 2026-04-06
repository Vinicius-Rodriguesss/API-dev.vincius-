import { prisma } from "../../lib/prisma.js";
import type { PostData } from "../Linkedin/types.js";

function isPostData(value: unknown): value is PostData {
  if (typeof value !== "object" || value === null) return false;

  const data = value as Record<string, unknown>;

  return (
    typeof data.title === "string" &&
    typeof data.data === "string" &&
    typeof data.descricao === "string" &&
    typeof data.post === "string" &&
    typeof data.imagem_prompt === "string" &&
    Array.isArray(data.hashtags) &&
    data.hashtags.every((item) => typeof item === "string")
  );
}

function limparResultPrompt(resultPrompt: string): string {
  return resultPrompt.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
}

export function parseResultPrompt(resultPrompt: string): PostData {
  const cleaned = limparResultPrompt(resultPrompt);

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Falha ao interpretar o JSON do prompt.");
  }

  if (!isPostData(parsed)) {
    throw new Error("O prompt nao possui o formato esperado.");
  }

  return parsed;
}

export async function listarPrompts() {
  return prisma.prompt.findMany({
    orderBy: {
      id: "desc",
    },
  });
}

export async function buscarPrompt(id?: number) {
  if (id === undefined) {
    const latestPrompt = await prisma.prompt.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    if (!latestPrompt) {
      throw new Error("Nenhum prompt encontrado no banco de dados.");
    }

    return latestPrompt;
  }

  const prompt = await prisma.prompt.findUnique({
    where: {
      id,
    },
  });

  if (!prompt) {
    throw new Error(`Prompt com id=${id} nao encontrado.`);
  }

  return prompt;
}

export async function buscarPromptFormatado(id?: number): Promise<{ id: number; postData: PostData }> {
  const prompt = await buscarPrompt(id);

  if (!prompt.resultPrompt.trim()) {
    throw new Error(`O campo resultPrompt do prompt id=${prompt.id} esta vazio.`);
  }

  try {
    const postData = parseResultPrompt(prompt.resultPrompt);
    return { id: prompt.id, postData };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message} id=${prompt.id}.`);
    }

    throw error;
  }
}

export async function salvarPromptGerado(resultPrompt: string) {
  return prisma.prompt.create({
    data: {
      resultPrompt,
    },
  });
}
