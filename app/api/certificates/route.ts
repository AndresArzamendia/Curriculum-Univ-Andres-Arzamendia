import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

export async function GET() {
  try {
    const certs = await prisma.certificate.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json(certs);
  } catch {
    return NextResponse.json({ error: "Error al obtener certificados" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const data = await req.json();

    if (!data.title || !data.issuer || !data.date) {
      return NextResponse.json(
        { error: "Título, emisor y fecha son requeridos" },
        { status: 400 }
      );
    }

    const cert = await prisma.certificate.create({
      data: {
        title: data.title,
        issuer: data.issuer,
        date: new Date(data.date),
        imageUrl: data.imageUrl || null,
        verifyUrl: data.verifyUrl || null,
      },
    });

    return NextResponse.json(cert, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear certificado" }, { status: 500 });
  }
}