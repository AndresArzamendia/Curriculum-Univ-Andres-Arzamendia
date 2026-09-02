import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    // Una sola consulta de conteo (evita abrir múltiples conexiones al pooler)
    const counts = await prisma.$queryRaw`
      SELECT
        COUNT(*) FILTER (WHERE event = 'page_view')::int AS totalVisits,
        COUNT(*) FILTER (WHERE event = 'cv_download')::int AS totalDownloads,
        COUNT(*) FILTER (WHERE event = 'whatsapp_click')::int AS whatsappClicks,
        COUNT(*) FILTER (WHERE event = 'email_click')::int AS emailClicks,
        COUNT(*) FILTER (WHERE event = 'linkedin_click')::int AS linkedinClicks,
        COUNT(*) FILTER (WHERE event = 'github_click')::int AS githubClicks
      FROM "Metric"
    ` as { totalVisits: number; totalDownloads: number; whatsappClicks: number; emailClicks: number; linkedinClicks: number; githubClicks: number }[];

    const c = counts[0];

    // Conteo por dispositivo (agrupado)
    const deviceRows = await prisma.$queryRaw`
      SELECT COALESCE(metadata::jsonb ->> 'deviceType', 'desconocido') AS type, COUNT(*)::int AS n
      FROM "Metric"
      WHERE event = 'page_view'
      GROUP BY 1
    ` as { type: string; n: number }[];

    // Conteo por evento (agrupado)
    const eventsByDay = await prisma.$queryRaw`
      SELECT event, COUNT(*)::int AS id
      FROM "Metric"
      GROUP BY event
    ` as { event: string; id: number }[];

    // Visitas por día (solo fecha)
    const visitDays = await prisma.$queryRaw`
      SELECT to_char("createdAt", 'YYYY-MM-DD') AS date, COUNT(*)::int AS n
      FROM "Metric"
      WHERE event = 'page_view'
      GROUP BY 1
      ORDER BY 1 ASC
    ` as { date: string; n: number }[];

    // Actividad reciente
    const recentEvents = await prisma.metric.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
    });

    const deviceVisits = { desktop: 0, "móvil/tablet": 0, tablet: 0, desconocido: 0 };
    for (const r of deviceRows) {
      const t = r.type || "desconocido";
      (deviceVisits as Record<string, number>)[t] =
        ((deviceVisits as Record<string, number>)[t] || 0) + r.n;
    }

    return NextResponse.json({
      totalVisits: c.totalVisits,
      totalDownloads: c.totalDownloads,
      whatsappClicks: c.whatsappClicks,
      emailClicks: c.emailClicks,
      linkedinClicks: c.linkedinClicks,
      githubClicks: c.githubClicks,
      eventsByDay: eventsByDay.map((e) => ({ event: e.event, _count: { id: e.id } })),
      visitsByDay: visitDays.map((d) => ({ date: d.date, count: d.n })),
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
