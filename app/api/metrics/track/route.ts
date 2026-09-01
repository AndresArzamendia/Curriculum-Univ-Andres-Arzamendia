import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body?.event;

    if (!event) {
      return NextResponse.json(
        { error: "El evento es requerido" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const metric = await prisma.metric.create({
      data: {
        event,
        metadata: JSON.stringify(body?.metadata || {}),
        ip,
        userAgent,
      },
    });

    return NextResponse.json(metric, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al registrar evento" }, { status: 500 });
  }
}