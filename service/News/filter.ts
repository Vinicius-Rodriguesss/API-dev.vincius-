import { keywords } from "./config.js";
import { wasAlreadyUsed } from "./history.js";
import type { Article } from "./types.js";
import { normalizeText } from "./utils.js";

export function isRelevantArticle(article: Article) {
  const text = normalizeText(`${article.title} ${article.description}`);
  return keywords.some((keyword) => text.includes(keyword));
}

export function pickArticle(articles: Article[]) {
  return (
    articles.find((article) => {
      return (
        article.title &&
        article.description &&
        article.url &&
        isRelevantArticle(article) &&
        !wasAlreadyUsed(article)
      );
    }) ?? null
  );
}
