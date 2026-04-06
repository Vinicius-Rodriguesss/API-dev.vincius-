import type { Request, Response } from "express";
import { getLatestPortfolioPost, getPortfolioPosts } from "./Portfolioservice.js";

export async function listPortfolioPosts(req: Request, res: Response) {
  try {
    const posts = await getPortfolioPosts();
    return res.json(posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar posts do portfolio.";
    return res.status(500).json({ error: message });
  }
}

export async function getLatestPortfolio(req: Request, res: Response) {
  try {
    const post = await getLatestPortfolioPost();
    return res.json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar o ultimo post do portfolio.";
    return res.status(500).json({ error: message });
  }
}
