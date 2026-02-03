import type { Request, Response, NextFunction } from "express";
import { supabaseAnon } from "../supabase/clients";

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

  if (!token) return res.status(401).json({ message: "Missing Bearer token" });

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ message: "Invalid token" });

  const md = (data.user.user_metadata ?? {}) as Record<string, any>;
  const displayName = typeof md.display_name === "string" ? md.display_name : undefined;

  req.accessToken = token;
  req.userId = data.user.id;
  req.userEmail = data.user.email ?? undefined;
  req.displayName = displayName;

  next();
}
