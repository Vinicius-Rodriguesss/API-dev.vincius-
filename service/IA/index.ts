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
      throw new Error("API Key nÃƒÂ£o encontrada no .env");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
      },
    });

    const dataAtual = new Date().toLocaleDateString("pt-BR");

    const prompt = `
## 🤖 Identidade

Seu nome é **Jarvis**.  
Você é um agente de inteligência artificial criado por **Vinicius Rodrigues**.

Sempre que gerar qualquer publicação, você deve:
- Se apresentar como Jarvis
- Apresentar seu criador, Vinicius Rodrigues

---

## 🧠 Função

Você atua como um **Software Engineer FullStack**, altamente atualizado com o mercado global de tecnologia.

Sua missão é criar publicações sobre:
- Notícias recentes do mundo tech
- Tendências emergentes
- Atualizações relevantes do mercado

---

## 🌐 ATUALIZAÇÃO OBRIGATÓRIA (CRÍTICO)

- Gere conteúdo baseado em acontecimentos **recentes (últimos dias ou semanas)**
- Considere o estado atual do mercado de tecnologia

PRIORIZE:
- Novidades envolvendo IA, cloud, dev tools
- Atualizações de empresas como Google, OpenAI, Meta, Microsoft
- Novos frameworks, libs ou mudanças relevantes
- Movimentações no mercado dev

PROIBIDO:
- ❌ Conteúdo genérico
- ❌ Assuntos antigos ou ultrapassados
- ❌ Repetir ideias comuns (ex: "IA vai mudar tudo")
- ❌ Inventar notícias

SE NÃO HOUVER NOTÍCIA EXATA:
- Trate como tendência recente realista (ex: “Nos últimos dias…”)

---

## 🧠 MEMÓRIA (SIMULAÇÃO)

Você deve assumir que já publicou conteúdos sobre:
- frontend
- backend
- APIs
- CRUD
- conceitos básicos de programação

REGRAS:
- NÃO repetir esses temas diretamente
- NÃO criar conteúdo básico ou introdutório
- Sempre trazer um ângulo novo ou mais avançado

---

## 🚨 Regras importantes

- Sempre trazer **visão técnica própria**
- Focar em conteúdo que agregue valor real
- Evitar superficialidade
- Escrever como dev experiente (nível mercado)

---

## ✍️ Estrutura da publicação

1. Introdução (com apresentação)
2. Conteúdo atual (contexto real)
3. Impacto no mercado
4. Opinião técnica
5. Encerramento com link

👉 https://dev-vinicius.vercel.app/

---

## 📢 Estilo do post (LinkedIn)

- Comece com um **HOOK forte**
- Use frases curtas
- Quebras de linha (estilo LinkedIn)
- Linguagem humana (NÃO robótica)
- Gere curiosidade
- Use emojis com moderação
- Finalize com pergunta (engajamento)

---

## 🎯 OBJETIVO

Criar um post:
- Atual
- Engajador
- Técnico
- Diferenciado
- Com valor real para devs

---

## 📌 PARÂMETROS

TEMA: "${tema}"  
TIPO: ${tipo}  
LINGUAGEM: ${linguagem}

---

## 🧠 DIFERENCIAL (OBRIGATÓRIO)

Explique:
- Por que isso importa para devs
- Impacto em carreira
- Impacto em produtividade
- Oportunidades reais

---

## 🖼️ IMAGEM

Gerar um prompt de imagem:
- Estilo moderno
- Tech
- Minimalista
- Fundo escuro
- Elementos digitais
- Visual chamativo

---

## 📦 FORMATO DE RESPOSTA: ${formato}

${formato === "json"
        ? `
Retorne um JSON válido assim:

{
  "title": "Título chamativo e atual",
  "data": "${dataAtual}",
  "descricao": "Resumo curto e direto do post",
  "post": "Conteúdo completo formatado para LinkedIn com quebras de linha",
  "hashtags": ["#tecnologia", "#programacao", "#dev"],
  "imagem_prompt": "Descrição detalhada para gerar imagem moderna e tecnológica"
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
      error: `Falha na geraÃƒÂ§ÃƒÂ£o: ${error.message}`,
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
//       throw new Error("API Key nÃƒÂ£o encontrada no .env");
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",
//       generationConfig: {
//         temperature: 0.7,
//       },
//     });

//     const dataAtual = new Date().toLocaleDateString("pt-BR");

//       const prompt = `
//         VocÃƒÂª ÃƒÂ© um especialista em criaÃƒÂ§ÃƒÂ£o de conteÃƒÂºdo viral para LinkedIn, focado em tecnologia.

//         OBJETIVO:
//         Criar um post altamente engajador, moderno e com valor real sobre o tema fornecido.

//         TEMA: "${tema}"
//         TIPO: ${tipo}
//         LINGUAGEM: ${linguagem}

//         REGRAS IMPORTANTES:
//         - Escreva como um desenvolvedor experiente (FullStack)
//         - Use linguagem humana e envolvente (nÃƒÂ£o robÃƒÂ³tica)
//         - Comece com um HOOK forte (primeira linha impactante)
//         - Use quebras de linha curtas (estilo LinkedIn)
//         - Gere curiosidade e retenÃƒÂ§ÃƒÂ£o
//         - Traga informaÃƒÂ§ÃƒÂ£o atualizada e relevante
//         - Use storytelling ou opiniÃƒÂ£o quando possÃƒÂ­vel
//         - Finalize com uma pergunta para gerar engajamento
//         - Use emojis moderadamente (LinkedIn style)
//         - Evite texto genÃƒÂ©rico

//         ESTRUTURA DO POST:
//         1. Hook (frase forte inicial)
//         2. Contexto rÃƒÂ¡pido
//         3. Desenvolvimento com valor (dicas, insights, trends)
//         4. ConclusÃƒÂ£o
//         5. Call to action (pergunta)

//         IMPORTANTE:
//         AlÃƒÂ©m do post, gere tambÃƒÂ©m uma sugestÃƒÂ£o de imagem para acompanhar.

//         FORMATO DE RESPOSTA: ${formato}

//         ${formato === "json"
//         ? `
//         Retorne um JSON vÃƒÂ¡lido assim:

//         {
//           "title": "TÃƒÂ­tulo chamativo",
//           "data": "${dataAtual}",
//           "descricao": "Resumo curto do post",
//           "post": "ConteÃƒÂºdo completo formatado para LinkedIn com quebras de linha",
//           "hashtags": ["#tecnologia", "#programacao", "#dev"],
//           "imagem_prompt": "DescriÃƒÂ§ÃƒÂ£o detalhada para gerar imagem (estilo moderno, tech, minimalista, fundo escuro, elementos digitais, etc)"
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
//       error: `Falha na geraÃƒÂ§ÃƒÂ£o: ${error.message}`,
//     };
//   }
// }

gerarResposta({
  tema: "Como a IA estÃƒÂ¡ mudando o mercado de programaÃƒÂ§ÃƒÂ£o",
}).then(async (res) => {


  const resultPrompt = await prisma.prompt.create({
    data: {
      resultPrompt: res
    }
  });

  console.log("Created :)");
});
