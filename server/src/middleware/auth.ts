import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../auth/jwt.js";
import type { AuthPayload } from "../auth/types.js";

function toAuthPayload(
  claims: ReturnType<typeof verifyAccessToken>,
): AuthPayload {
  if (claims.typ === "driver") {
    return { sub: claims.sub, type: "driver" };
  }
  return { sub: claims.sub, type: "user", role: claims.role };
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token ausente" });
    return;
  }
  const raw = header.slice(7).trim();
  if (!raw) {
    res.status(401).json({ error: "Token ausente" });
    return;
  }
  try {
    const claims = verifyAccessToken(raw);
    req.auth = toAuthPayload(claims);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.auth) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  if (req.auth.type !== "user" || req.auth.role !== "admin") {
    res.status(403).json({ error: "Acesso restrito a administradores" });
    return;
  }
  next();
}

export function requireUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.auth) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  if (req.auth.type !== "user") {
    res.status(403).json({ error: "Acesso restrito a passageiros" });
    return;
  }
  next();
}

export function requireDriver(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.auth) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  if (req.auth.type !== "driver") {
    res.status(403).json({ error: "Acesso restrito a motoristas" });
    return;
  }
  next();
}

export function requireAdminOrDriver(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.auth) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  if (req.auth.type === "driver") {
    next();
    return;
  }
  if (req.auth.type === "user" && req.auth.role === "admin") {
    next();
    return;
  }
  res.status(403).json({ error: "Sem permissão" });
}

export function isAdmin(auth: AuthPayload | undefined): boolean {
  return auth?.type === "user" && auth.role === "admin";
}
