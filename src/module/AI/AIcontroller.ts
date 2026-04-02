import type { Request, Response } from "express"
import getAllResultPrompt from "./AIservice.js"

export async function listPrompts(req: Request, res: Response) {
  const prompts = await getAllResultPrompt()
  return res.json(prompts)
}