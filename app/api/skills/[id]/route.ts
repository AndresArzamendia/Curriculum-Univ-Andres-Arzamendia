import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

interface Params {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const data = await req.json();
    if (typeof data.level === "number") {
      data.level = Math.max(0, Math.min(100, data.level));
    }

    const skill = await prisma.skill.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: "Error al actualizar habilidad" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    await prisma.skill.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Habilidad eliminada" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar habilidad" }, { status: 500 });
  }
}