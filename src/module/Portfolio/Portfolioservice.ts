import { listarPrompts, parseResultPrompt } from "../../../service/Prompt/index.js";

function montarPortfolioPost(id: number, resultPrompt: string) {
  const postData = parseResultPrompt(resultPrompt);

  return {
    id,
    ...postData,
    content: `${postData.post}\n\n${postData.hashtags.join(" ")}`.trim(),
  };
}

export async function getPortfolioPosts() {
  const prompts = await listarPrompts();

  return prompts.flatMap((prompt) => {
    try {
      return [montarPortfolioPost(prompt.id, prompt.resultPrompt)];
    } catch {
      return [];
    }
  });
}

export async function getLatestPortfolioPost() {
  const prompts = await listarPrompts();
  const latestPost = prompts.find((prompt) => {
    try {
      parseResultPrompt(prompt.resultPrompt);
      return true;
    } catch {
      return false;
    }
  });

  if (!latestPost) {
    throw new Error("Nenhum post valido encontrado para o portfolio.");
  }

  const postData = parseResultPrompt(latestPost.resultPrompt);

  return {
    id: latestPost.id,
    ...postData,
    content: `${postData.post}\n\n${postData.hashtags.join(" ")}`.trim(),
  };
}
