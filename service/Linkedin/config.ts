import path from "path";
import "dotenv/config";

export const config = {
  CLIENT_ID: process.env.LINKEDIN_CLIENT_ID!,
  CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET!,
  REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI!,
  TOKEN_FILE: path.resolve("linkedin-token.json"),
  POST_HISTORY_FILE: path.resolve("linkedin-post-history.json"),
};
