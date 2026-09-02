import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const [
      totalVisits,
      totalDownloads,
      whatsappClicks,
      emailClicks,
      linkedinClicks,
      githubClicks,
      recentEvents,
      eventsByDay,
      deviceRows,
      visitDays,
    ] = await Promise.all([
      prisma.metric.count({ where: { event: "page_view" } }),
      prisma.metric.count({ where: { event: "cv_download" } }),
      prisma.metric.count({ where: { event: "whatsapp_click" } }),
      prisma.metric.count({ where: { event: "email_click" } }),
      prisma.metric.count({ where: { event: "linkedin_click" } }),
      prisma.metric.count({ where: { event: "github_click" } }),
      prisma.metric.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
      prisma.metric.groupBy({ by: ["event"], _count: { id: true } }),
      // Conteo de visitas por tipo de dispositivo (SQL directo, sin cargar todos los registros)
      prisma.$queryRaw`
        SELECT COALESCE(metadata::jsonb ->> 'deviceType', 'desconocido') AS type, COUNT(*)::int AS n
        FROM "Metric"
        WHERE event = 'page_view'
        GROUP BY 1
      ` as Promise<{ type: string; n: number }[]>,
      // Visitas por día (solo fecha, no hora)
      prisma.$queryRaw`
        SELECT to_char("createdAt", 'YYYY-MM-DD') AS date, COUNT(*)::int AS n
        FROM "Metric"
        WHERE event = 'page_view'
        GROUP BY 1
        ORDER BY 1 ASC
      ` as Promise<{ date: string; n: number }[]>,
    ]);

    const deviceVisits = { desktop: 0, "móvil/tablet": 0, tablet: 0, desconocido: 0 };
    for (const r of deviceRows) {
      const t = r.type || "desconocido";
      (deviceVisits as Record<string, number>)[t] = (deviceVisits as Record<string, number>)[t] || 0;
      (deviceVisits as Record<string, number>)[t] += r.n;
    }

    const visitsByDay = visitDays.map((d) => ({ date: d.date, count: d.n }));

    return NextResponse.json({
      totalVisits,
      totalDownloads,
      whatsappClicks,
      emailClicks,
      linkedinClicks,
      githubClicks,
      eventsByDay,
      visitsByDay,
      recentEvents,
      deviceVisits,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error al obtener métricas: ${error?.message || "desconocido"}` },
      { status: 500 }
    );
  }
}
