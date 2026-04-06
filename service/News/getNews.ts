import "dotenv/config";
import { domains, query } from "./config.js";
import { pickArticle } from "./filter.js";
import { saveHistory } from "./history.js";
import type { Article, Result } from "./types.js";

const getNews = async (): Promise<Result | null> => {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.error("NEWS_API_KEY nao encontrada no .env");
    return null;
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&domains=${encodeURIComponent(
    domains
  )}&searchIn=title,description&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const articles: Article[] = data.articles ?? [];

    const article = pickArticle(articles);

    if (!article) {
      return null;
    }

    saveHistory(article);

    return {
      title: article.title,
      description: article.description,
      url: article.url,
    };
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

export default getNews;
