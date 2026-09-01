import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: "Error al obtener habilidades" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const data = await req.json();

    if (!data.name || typeof data.level !== "number") {
      return NextResponse.json(
        { error: "Nombre y nivel son requeridos" },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        level: Math.max(0, Math.min(100, data.level)),
        category: data.category || "Lenguajes",
        icon: data.icon || null,
        order: data.order ?? 0,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear habilidad" }, { status: 500 });
  }
}