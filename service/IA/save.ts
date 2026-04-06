import { salvarPromptGerado } from "../Prompt/index.js";

export async function salvarRespostaGerada(resultPrompt: string) {
  const prompt = await salvarPromptGerado(resultPrompt);

  console.log("Created :)");

  return prompt;
}
