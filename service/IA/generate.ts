import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { montarPrompt } from "./prompt.js";
import type { GerarRespostaParams } from "./types.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function gerarResposta({
  tipo = "linkedin",
  linguagem = "tecnica",
  formato = "json",
}: GerarRespostaParams) {
  try {
    if (!genAI) {
      throw new Error("GEMINI_API_KEY nao foi encontrada no arquivo .env.");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
      },
    });

    const prompt = await montarPrompt({
      tipo,
      linguagem,
      formato,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao gerar o conteudo.";
    console.error("Erro Gemini:", message);

    return JSON.stringify({
      error: `Falha na geracao: ${message}`,
    });
  }
}
