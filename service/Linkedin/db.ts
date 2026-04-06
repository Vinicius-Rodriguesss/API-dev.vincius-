import { prisma } from "../../lib/prisma.js";
import type { PostData } from "./types.js";

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

export async function buscarPost(id?: number): Promise<{ id: number; postData: PostData }> {
  const prompts = await prisma.prompt.findMany();



  if (prompts.length === 0) {
    throw new Error("Nenhum prompt encontrado no banco de dados.");
  }

  const item =
    id === undefined ? prompts[prompts.length - 1] : prompts.find((prompt) => prompt.id === id);

  if (!item) {
    throw new Error(`Post com id=${id} nao encontrado.`);
  }

  if (typeof item.resultPrompt !== "string" || !item.resultPrompt.trim()) {
    throw new Error(`O campo resultPrompt do post id=${item.id} esta vazio.`);
  }

  const cleaned = item.resultPrompt
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Falha ao interpretar o JSON do post id=${item.id}.`);
  }

  if (!isPostData(parsed)) {
    throw new Error(`O post id=${item.id} nao possui o formato esperado.`);
  }

  return { id: item.id, postData: parsed };
}



