// TUIUIUMOB/server/src/auth/jwt.ts

import jwt from "jsonwebtoken";
import type { UserRole } from "./types.js";

type JwtUserClaims = { sub: string; typ: "user"; role: UserRole };
type JwtDriverClaims = { sub: string; typ: "driver" };

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is required in production");
    }
    console.warn(
      "⚠️  JWT_SECRET is not set; using insecure development default.",
    );
    return "dev-insecure-jwt-secret-change-me";
  }
  return s;
}

export function signUserToken(userId: string, role: UserRole): string {
  const payload: JwtUserClaims = { sub: userId, typ: "user", role };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function signDriverToken(driverId: string): string {
  const payload: JwtDriverClaims = { sub: driverId, typ: "driver" };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAccessToken(
  token: string,
): JwtUserClaims | JwtDriverClaims {
  return jwt.verify(token, getJwtSecret()) as JwtUserClaims | JwtDriverClaims;
}
