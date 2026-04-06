// npx tsx service/Linkedin/index.ts

import { postarNoLinkedin } from "./post.js";

postarNoLinkedin()
  .then((res) => {
    console.log("✅ Post publicado:", res);
  })
  .catch((err) => {
    console.error("❌ Erro:", err.message);
  });