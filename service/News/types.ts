export type Article = {
  title: string;
  description: string;
  url: string;
};

export type Result = {
  title: string | undefined;
  description: string;
  url: string;
};

export type NewsHistory = {
  usedUrls: string[];
  usedTitles: string[];
};
