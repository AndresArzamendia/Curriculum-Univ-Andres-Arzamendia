import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Limita el pool de conexiones a 2 para respetar el límite del Session
// Pooler de Supabase (15 clientes máximos) y soportar varias instancias
// serverless de Vercel sin agotar las conexiones ("max clients reached").
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    datasources: {
      db: {
        url:
          (process.env.DATABASE_URL || "") +
          (process.env.DATABASE_URL?.includes("?") ? "&" : "?") +
          "connection_limit=2&pool_timeout=10",
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;