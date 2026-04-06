import cron from "node-cron";
import { gerarResposta } from "../IA/index.js";

const Scheduling = () => {
  console.log("funcionando...");

  cron.schedule(
    "0 10 * * 1",
    async () => {
      console.log("gerando post...");

      const resposta = await gerarResposta({
        tema: "IA no desenvolvimento",
      });

      console.log(resposta);
      console.log("post enviado");
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );
};

export default Scheduling;
