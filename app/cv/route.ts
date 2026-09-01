import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();

    if (profile?.cvUrl) {
      return NextResponse.redirect(profile.cvUrl);
    }

    return new NextResponse(
      "El CV aún no está disponible. Vuelve a intentarlo más tarde.",
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch {
    return new NextResponse("Error al obtener el CV.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}