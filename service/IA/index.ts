import { gerarResposta } from "./generate.js";
import { salvarRespostaGerada } from "./save.js";
import type { GerarRespostaParams } from "./types.js";

export async function gerarRespostaESalvar(params: GerarRespostaParams) {
  const resultPrompt = await gerarResposta(params);
  return salvarRespostaGerada(resultPrompt);
}

export { gerarResposta, salvarRespostaGerada };
export type { GerarRespostaParams };
