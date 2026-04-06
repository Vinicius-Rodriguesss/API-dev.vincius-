import cron from "node-cron";
import { gerarRespostaESalvar } from "../IA/index.js";

let scheduleStarted = false;

const Scheduling = () => {
  if (scheduleStarted) {
    return;
  }

  scheduleStarted = true;
  console.log("funcionando...");

  cron.schedule(
    "55 9 * * 1",
    async () => {
      try {
        console.log("gerando post...");

        const resposta = await gerarRespostaESalvar({
        });

        console.log("post gerado", resposta.id);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro ao gerar o post.";
        console.error("Erro no agendamento da IA:", message);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );
};

export default Scheduling;
