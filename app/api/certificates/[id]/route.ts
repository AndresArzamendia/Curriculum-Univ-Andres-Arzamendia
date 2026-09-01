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
    if (data.date) data.date = new Date(data.date);

    const cert = await prisma.certificate.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(cert);
  } catch {
    return NextResponse.json({ error: "Error al actualizar certificado" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    await prisma.certificate.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Certificado eliminado" });
  } catch {
    return NextResponse.json({ error: "Error al eliminar certificado" }, { status: 500 });
  }
}