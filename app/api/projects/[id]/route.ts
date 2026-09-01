import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });
    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Error al obtener proyecto" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const data = await req.json();
    const project = await prisma.project.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Error al actualizar proyecto" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Proyecto eliminado" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar proyecto" }, { status: 500 });
  }
}