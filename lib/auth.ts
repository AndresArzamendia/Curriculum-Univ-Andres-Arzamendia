import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";

export type AuthSession = JwtPayload | null;

export function getAuthSession(req: NextRequest): AuthSession {
  const cookieToken = req.cookies.get("token")?.value;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const token = cookieToken || bearerToken;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(req: NextRequest): AuthSession {
  const session = getAuthSession(req);
  return session;
}

export function unauthorized(message = "No autorizado, inicia sesión") {
  return NextResponse.json({ error: message }, { status: 401 });
}