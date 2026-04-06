import { buscarPrompt, listarPrompts } from "../../../service/Prompt/index.js";

export async function getAllResultPrompt() {
  return listarPrompts();
}

export async function getLatestResultPrompt() {
  return buscarPrompt();
}
