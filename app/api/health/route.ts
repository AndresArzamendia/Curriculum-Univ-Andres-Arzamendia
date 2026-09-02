import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Endpoint de estado de la base de datos.
// Devuelve si hay conexión activa, latencia y detalles del esquema/BD.
// No requiere autenticación (solo expone estado de conectividad, no datos sensibles)
// pero solo se puede consultar en producción y desarrollo de forma controlada.

export async function GET(req: NextRequest) {
  // Verificar si la variable está configurada
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  // Prisma con timeout reducido para no bloquear
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: [],
  });

  const started = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - started;

    // Obtener estado del esquema y versión de Postgres
    let version = "desconocida";
    let tableCount = 0;
    try {
      const info = await prisma.$queryRaw<
        Array<{ version: string }>
      >`SELECT version() as version`;
      version = info[0]?.version?.split(" ").slice(0, 2).join(" ") || "desconocida";

      const tables = await prisma.$queryRaw<
        Array<{ count: number }>
      >`SELECT count(*)::int as count FROM information_schema.tables WHERE table_schema = 'public'`;
      tableCount = Number(tables[0]?.count || 0);
    } catch {
      // no crítico
    }

    await prisma.$disconnect().catch(() => {});

    return NextResponse.json({
      connected: true,
      message: "Conectado a la base de datos",
      hasDatabaseUrl,
      latencyMs: latency,
      provider: "postgresql",
      version,
      tableCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    await prisma.$disconnect().catch(() => {});
    const message = error?.message || "Error desconocido";
    return NextResponse.json(
      {
        connected: false,
        message: "No conectado a la base de datos",
        hasDatabaseUrl,
        error: message.substring(0, 300),
        timestamp: new Date().toISOString(),
      },
      { status: 200 } // devolvemos 200 para que el front pueda leer el estado
    );
  }
}