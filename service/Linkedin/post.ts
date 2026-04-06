import { buscarPost } from "./db.js";
import { carregarToken, autenticar } from "./auth.js";
import { publicarPost } from "./api.js";
import { registerPublishedPost, verifyPostNotPublished } from "./history.js";
import type { PostData } from "./types.js";

function montarTexto(postData: PostData): string {
  const hashtags = postData.hashtags.join(" ");
  return `${postData.post}\n\n${hashtags}`.trim();
}

export async function postarNoLinkedin() {
  const { id, postData } = await buscarPost();

  let accessToken: string;
  let personId: string;

  const token = carregarToken();

  if (token) {
    accessToken = token.access_token;
    personId = token.person_id;
  } else {
    const auth = await autenticar();
    accessToken = auth.accessToken;
    personId = auth.personId;
  }

  const texto = montarTexto(postData);
  verifyPostNotPublished(id, texto);

  const result = await publicarPost(accessToken, personId, texto);
  registerPublishedPost(id, texto, result.postId);

  console.log("Post feito")

  return result;
}
