import { schedule } from "node-cron";
import { postarNoLinkedin } from "../Linkedin/post.js";

export default function agendarPostagemLinkedin() {
  console.log("Agendador LinkedIn iniciado");

  schedule("0 10 * * 1", async () => {
    console.log("post linkedin ativo");
    await postarNoLinkedin();
  }, {
    timezone: "America/Sao_Paulo"
  });

  postarNoLinkedin()
    .then((res) => {
      console.log("✅ Post publicado:", res);
    })
    .catch((err) => {
      console.error("❌ Erro:", err.message);
    });


}

// Teste temporário ↓
agendarPostagemLinkedin();

// npx tsx service/LinkedinScheduler/index.ts