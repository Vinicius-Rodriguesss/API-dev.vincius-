// cd service/IA/index.ts 
// npx tsx service/IA/index.ts 
import { prisma } from "../../lib/prisma.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
  console.log("Gerando o post....")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type GerarRespostaParams = {
  tema: string;
  tipo?: "blog" | "linkedin" | "resumo" | "tutorial";
  linguagem?: "formal" | "casual" | "tecnica";
  formato?: "json" | "texto";
};

export async function gerarResposta({
  tema,
  tipo = "linkedin",
  linguagem = "tecnica",
  formato = "json",
}: GerarRespostaParams) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API Key não encontrada no .env");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
      },
    });

    const dataAtual = new Date().toLocaleDateString("pt-BR");

    const prompt = `
        Você é um especialista em criação de conteúdo viral para LinkedIn, focado em tecnologia.

        OBJETIVO:
        Criar um post altamente engajador, moderno e com valor real sobre o tema fornecido.

        TEMA: "${tema}"
        TIPO: ${tipo}
        LINGUAGEM: ${linguagem}

        REGRAS IMPORTANTES:
        - Escreva como um desenvolvedor experiente (FullStack)
        - Use linguagem humana e envolvente (não robótica)
        - Comece com um HOOK forte (primeira linha impactante)
        - Use quebras de linha curtas (estilo LinkedIn)
        - Gere curiosidade e retenção
        - Traga informação atualizada e relevante
        - Use storytelling ou opinião quando possível
        - Finalize com uma pergunta para gerar engajamento
        - Use emojis moderadamente (LinkedIn style)
        - Evite texto genérico

        ESTRUTURA DO POST:
        1. Hook (frase forte inicial)
        2. Contexto rápido
        3. Desenvolvimento com valor (dicas, insights, trends)
        4. Conclusão
        5. Call to action (pergunta)

        IMPORTANTE:
        Além do post, gere também uma sugestão de imagem para acompanhar.

        FORMATO DE RESPOSTA: ${formato}

        ${formato === "json"
        ? `
        Retorne um JSON válido assim:

        {
          "title": "Título chamativo",
          "data": "${dataAtual}",
          "descricao": "Resumo curto do post",
          "post": "Conteúdo completo formatado para LinkedIn com quebras de linha",
          "hashtags": ["#tecnologia", "#programacao", "#dev"],
          "imagem_prompt": "Descrição detalhada para gerar imagem (estilo moderno, tech, minimalista, fundo escuro, elementos digitais, etc)"
        }
        `
        : `
        Retorne apenas o texto do post.
        `
      }
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error: any) {
    console.error("Erro Gemini:", error.message);

    return JSON.stringify({
      error: `Falha na geração: ${error.message}`,
    });
  }
}

// export async function gerarResposta({
//   tema,
//   tipo = "linkedin",
//   linguagem = "tecnica",
//   formato = "json",
// }: GerarRespostaParams) {
//   try {
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error("API Key não encontrada no .env");
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",
//       generationConfig: {
//         temperature: 0.7,
//       },
//     });

//     const dataAtual = new Date().toLocaleDateString("pt-BR");

//       const prompt = `
//         Você é um especialista em criação de conteúdo viral para LinkedIn, focado em tecnologia.

//         OBJETIVO:
//         Criar um post altamente engajador, moderno e com valor real sobre o tema fornecido.

//         TEMA: "${tema}"
//         TIPO: ${tipo}
//         LINGUAGEM: ${linguagem}

//         REGRAS IMPORTANTES:
//         - Escreva como um desenvolvedor experiente (FullStack)
//         - Use linguagem humana e envolvente (não robótica)
//         - Comece com um HOOK forte (primeira linha impactante)
//         - Use quebras de linha curtas (estilo LinkedIn)
//         - Gere curiosidade e retenção
//         - Traga informação atualizada e relevante
//         - Use storytelling ou opinião quando possível
//         - Finalize com uma pergunta para gerar engajamento
//         - Use emojis moderadamente (LinkedIn style)
//         - Evite texto genérico

//         ESTRUTURA DO POST:
//         1. Hook (frase forte inicial)
//         2. Contexto rápido
//         3. Desenvolvimento com valor (dicas, insights, trends)
//         4. Conclusão
//         5. Call to action (pergunta)

//         IMPORTANTE:
//         Além do post, gere também uma sugestão de imagem para acompanhar.

//         FORMATO DE RESPOSTA: ${formato}

//         ${formato === "json"
//         ? `
//         Retorne um JSON válido assim:

//         {
//           "title": "Título chamativo",
//           "data": "${dataAtual}",
//           "descricao": "Resumo curto do post",
//           "post": "Conteúdo completo formatado para LinkedIn com quebras de linha",
//           "hashtags": ["#tecnologia", "#programacao", "#dev"],
//           "imagem_prompt": "Descrição detalhada para gerar imagem (estilo moderno, tech, minimalista, fundo escuro, elementos digitais, etc)"
//         }
//         `
//         : `
//         Retorne apenas o texto do post.
//         `
//       }
//         `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     const raw = response.text();

//     const clean = raw
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     const parsed = JSON.parse(clean);

//     return parsed;

//   } catch (error: any) {
//     console.error("Erro Gemini:", error.message);

//     return {
//       error: `Falha na geração: ${error.message}`,
//     };
//   }
// }

gerarResposta({
  tema: "Como a IA está mudando o mercado de programação",
}).then(async (res) => {


  const resultPrompt = await prisma.prompt.create({
    data: {
      resultPrompt: res
    }
  });

  console.log("Created :)");
});