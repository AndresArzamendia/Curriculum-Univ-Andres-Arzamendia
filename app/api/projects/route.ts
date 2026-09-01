import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Error al obtener proyectos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const data = await req.json();

    if (!data.title || !data.description || !data.category) {
      return NextResponse.json(
        { error: "Título, descripción y categoría son requeridos" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrls: data.imageUrls ?? "[]",
        tags: data.tags ?? "[]",
        repoUrl: data.repoUrl || null,
        demoUrl: data.demoUrl || null,
        category: data.category,
        featured: data.featured ?? false,
        order: data.order ?? 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear proyecto" }, { status: 500 });
  }
}