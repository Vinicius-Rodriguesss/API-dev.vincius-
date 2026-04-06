import fs from "fs";
import path from "path";
import { NEWS_HISTORY_FILE } from "./config.js";
import type { Article, NewsHistory } from "./types.js";
import { normalizeText } from "./utils.js";

const historyFilePath = path.resolve(NEWS_HISTORY_FILE);

export function loadHistory(): NewsHistory {
  if (!fs.existsSync(historyFilePath)) {
    return {
      usedUrls: [],
      usedTitles: [],
    };
  }

  try {
    const data = JSON.parse(fs.readFileSync(historyFilePath, "utf-8")) as Partial<NewsHistory>;

    return {
      usedUrls: Array.isArray(data.usedUrls) ? data.usedUrls : [],
      usedTitles: Array.isArray(data.usedTitles) ? data.usedTitles : [],
    };
  } catch {
    return {
      usedUrls: [],
      usedTitles: [],
    };
  }
}

export function saveHistory(article: Article) {
  const history = loadHistory();
  const normalizedTitle = normalizeText(article.title);

  history.usedUrls = [
    article.url,
    ...history.usedUrls.filter((url) => url !== article.url),
  ].slice(0, 30);

  history.usedTitles = [
    normalizedTitle,
    ...history.usedTitles.filter((title) => title !== normalizedTitle),
  ].slice(0, 30);

  fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
}

export function wasAlreadyUsed(article: Article) {
  const history = loadHistory();
  const normalizedTitle = normalizeText(article.title);

  return (
    history.usedUrls.includes(article.url) ||
    history.usedTitles.includes(normalizedTitle)
  );
}
