import type { NextFunction, Request, Response } from "express";

function readApiKey(req: Request) {
  const apiKeyHeader = req.header("x-api-key");

  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return "";
  }

  return authorization.slice("Bearer ".length).trim();
}

export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const serverApiKey = process.env.API_KEY;

  if (!serverApiKey) {
    return res.status(500).json({
      error: "API_KEY nao configurada no servidor.",
    });
  }

  const requestApiKey = readApiKey(req);

  if (!requestApiKey) {
    return res.status(401).json({
      error: "API key obrigatoria.",
    });
  }

  if (requestApiKey !== serverApiKey) {
    return res.status(403).json({
      error: "API key invalida.",
    });
  }

  return next();
}
