import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      accessToken?: string;
      userEmail?: string;
      displayName?: string;
    }
  }
}

export async function auth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  const token = h?.startsWith("Bearer ") ? h.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) throw new Error("Invalid token format");

    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());

    req.accessToken = token;
    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.displayName = payload.user_metadata?.display_name;

    next();
  } catch (e) {
    console.error("Auth Middleware Error:", e);
    return res.status(401).json({ message: "Invalid or malformed token" });
  }
}