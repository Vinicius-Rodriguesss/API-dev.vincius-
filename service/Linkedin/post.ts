import { buscarPost } from "./db.js";
import { carregarToken, autenticar } from "./auth.js";
import { publicarPost } from "./api.js";
import { registerPublishedPost, verifyPostNotPublished } from "./history.js";
import type { PostData } from "./types.js";

const LINKEDIN_POST_MAX_LENGTH = 3000;

function sanitizeText(text: string) {
  return text.replace(/\*\*/g, "").replace(/\r\n/g, "\n").trim();
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  const slicedText = text.slice(0, Math.max(0, maxLength - 3));
  const lastBreak = Math.max(slicedText.lastIndexOf("\n"), slicedText.lastIndexOf(" "));
  const safeText = lastBreak > 0 ? slicedText.slice(0, lastBreak) : slicedText;

  return `${safeText.trim()}...`;
}

function montarTexto(postData: PostData): string {
  const hashtags = postData.hashtags.slice(0, 4).join(" ").trim();
  const post = sanitizeText(postData.post);
  const reservedLength = hashtags ? hashtags.length + 2 : 0;
  const maxPostLength = LINKEDIN_POST_MAX_LENGTH - reservedLength;
  const limitedPost = truncateText(post, maxPostLength);

  return `${limitedPost}\n\n${hashtags}`.trim();
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
