import fs from "fs";
import crypto from "crypto";
import { config } from "./config.js";
import type { PostHistoryEntry, PostHistoryStore } from "./types.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isHistoryEntry(value: unknown): value is PostHistoryEntry {
  if (!isObject(value)) return false;

  return (
    typeof value.promptId === "number" &&
    typeof value.contentHash === "string" &&
    typeof value.postId === "string" &&
    typeof value.publishedAt === "string"
  );
}

function loadHistoryStore(): PostHistoryStore {
  if (!fs.existsSync(config.POST_HISTORY_FILE)) {
    return { publishedPosts: [] };
  }

  try {
    const raw = JSON.parse(fs.readFileSync(config.POST_HISTORY_FILE, "utf-8")) as unknown;

    if (!isObject(raw) || !Array.isArray(raw.publishedPosts)) {
      return { publishedPosts: [] };
    }

    return {
      publishedPosts: raw.publishedPosts.filter(isHistoryEntry),
    };
  } catch {
    return { publishedPosts: [] };
  }
}

function saveHistoryStore(store: PostHistoryStore): void {
  fs.writeFileSync(config.POST_HISTORY_FILE, JSON.stringify(store, null, 2));
}

function normalizePostText(texto: string): string {
  return texto.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
}

export function createPostContentHash(texto: string): string {
  return crypto
    .createHash("sha256")
    .update(normalizePostText(texto), "utf-8")
    .digest("hex");
}

export function verifyPostNotPublished(promptId: number, texto: string): void {
  const store = loadHistoryStore();
  const contentHash = createPostContentHash(texto);

  const duplicateByPromptId = store.publishedPosts.find((entry) => entry.promptId === promptId);

  if (duplicateByPromptId) {
    throw new Error(
      `O prompt id=${promptId} ja foi publicado em ${duplicateByPromptId.publishedAt}.`
    );
  }

  const duplicateByContent = store.publishedPosts.find(
    (entry) => entry.contentHash === contentHash
  );

  if (duplicateByContent) {
    throw new Error(
      `Esse conteudo ja foi publicado anteriormente no post ${duplicateByContent.postId} em ${duplicateByContent.publishedAt}.`
    );
  }
}

export function registerPublishedPost(
  promptId: number,
  texto: string,
  postId: string
): void {
  const store = loadHistoryStore();
  const contentHash = createPostContentHash(texto);

  const nextEntries = store.publishedPosts.filter(
    (entry) => entry.promptId !== promptId && entry.contentHash !== contentHash
  );

  nextEntries.push({
    promptId,
    contentHash,
    postId,
    publishedAt: new Date().toISOString(),
  });

  saveHistoryStore({ publishedPosts: nextEntries });
}
