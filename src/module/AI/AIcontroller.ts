import type { Request, Response } from "express";
import { getAllResultPrompt, getLatestResultPrompt } from "./AIservice.js";

export async function listPrompts(req: Request, res: Response) {
  try {
    const prompts = await getAllResultPrompt();
    return res.json(prompts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar prompts.";
    return res.status(500).json({ error: message });
  }
}

export async function getLatestPrompt(req: Request, res: Response) {
  try {
    const prompt = await getLatestResultPrompt();
    return res.json(prompt);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar o ultimo prompt.";
    return res.status(500).json({ error: message });
  }
}
