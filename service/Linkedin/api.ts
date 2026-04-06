import fetch from "node-fetch";
import type { PublishResult } from "./types.js";

const LINKEDIN_API_VERSION = "202504";

function parseErrorBody(rawBody: string): string {
  if (!rawBody.trim()) return "Sem detalhes retornados pela API.";

  try {
    return JSON.stringify(JSON.parse(rawBody));
  } catch {
    return rawBody;
  }
}

export async function publicarPost(
  accessToken: string,
  personId: string,
  texto: string
): Promise<PublishResult> {
  const commentary = texto.trim();
  const trimmedPersonId = personId.trim();

  if (!commentary) {
    throw new Error("O texto do post nao pode estar vazio.");
  }

  if (!trimmedPersonId) {
    throw new Error("Person ID invalido para publicacao no LinkedIn.");
  }

  const body = {
    author: `urn:li:person:${trimmedPersonId}`,
    commentary,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const response = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": LINKEDIN_API_VERSION,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 201) {
    return {
      success: true,
      postId: response.headers.get("x-restli-id") ?? "N/A",
    };
  }

  const rawBody = await response.text();
  const details = parseErrorBody(rawBody);

  if (response.status === 422) {
    throw new Error(`LinkedIn rejeitou o payload do post: ${details}`);
  }

  if (response.status === 401) {
    throw new Error(`Token invalido ou expirado ao publicar no LinkedIn: ${details}`);
  }

  throw new Error(`Erro ao publicar post no LinkedIn (HTTP ${response.status}): ${details}`);
}
