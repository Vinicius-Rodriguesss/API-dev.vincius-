export interface SavedToken {
  access_token: string;
  expires_at: number;
  person_id: string;
}

export interface PostData {
  title: string;
  data: string;
  descricao: string;
  post: string;
  hashtags: string[];
  imagem_prompt: string;
}

export interface AuthResult {
  accessToken: string;
  personId: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
}

export interface PublishResult {
  success: boolean;
  postId: string;
}

export interface PostHistoryEntry {
  promptId: number;
  contentHash: string;
  postId: string;
  publishedAt: string;
}

export interface PostHistoryStore {
  publishedPosts: PostHistoryEntry[];
}
