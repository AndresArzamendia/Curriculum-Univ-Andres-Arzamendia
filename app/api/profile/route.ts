import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const data = await req.json();
    const profile = await prisma.profile.findFirst();

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}