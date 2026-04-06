import { schedule } from "node-cron";
import { gerarRespostaESalvar } from "../IA/index.js";
import { postarNoLinkedin } from "../Linkedin/post.js";
import { isPostAlreadyPublishedError } from "../Linkedin/history.js";

let schedulerStarted = false;

async function publicarPrimeiroPost() {
  try {
    console.log("Gerando primeiro post...");

    const prompt = await gerarRespostaESalvar({
    });

    console.log("Primeiro post gerado", prompt.id);

    const result = await postarNoLinkedin();
    console.log("Post publicado:", result);
  } catch (error) {
    if (isPostAlreadyPublishedError(error)) {
      console.log("O ultimo prompt ja foi publicado. Nenhuma nova postagem foi enviada.");
      return;
    }

    const message = error instanceof Error ? error.message : "Erro ao publicar no LinkedIn.";
    console.error("Erro:", message);
  }
}

export default function agendarPostagemLinkedin() {
  if (schedulerStarted) {
    return;
  }

  schedulerStarted = true;
  console.log("Agendador LinkedIn iniciado");

  schedule(
    "0 10 * * 1",
    async () => {
      try {
        console.log("post linkedin ativo");
        await postarNoLinkedin();
      } catch (error) {
        if (isPostAlreadyPublishedError(error)) {
          console.log("O ultimo prompt ja foi publicado. Nenhuma nova postagem foi enviada.");
          return;
        }

        const message = error instanceof Error ? error.message : "Erro ao publicar no LinkedIn.";
        console.error("Erro no agendamento do LinkedIn:", message);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );

  if (process.env.LINKEDIN_PUBLISH_ON_STARTUP === "false") {
    return;
  }

  publicarPrimeiroPost();
}
