import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession, unauthorized } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const [totalVisits, totalDownloads, whatsappClicks, emailClicks, linkedinClicks, githubClicks, recentEvents, eventsByDay] =
      await Promise.all([
        prisma.metric.count({ where: { event: "page_view" } }),
        prisma.metric.count({ where: { event: "cv_download" } }),
        prisma.metric.count({ where: { event: "whatsapp_click" } }),
        prisma.metric.count({ where: { event: "email_click" } }),
        prisma.metric.count({ where: { event: "linkedin_click" } }),
        prisma.metric.count({ where: { event: "github_click" } }),
        prisma.metric.findMany({
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.metric.groupBy({
          by: ["event"],
          _count: { id: true },
        }),
      ]);

    const allRecent = await prisma.metric.findMany({
      where: { event: "page_view" },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { createdAt: true },
    });

    const visitsByDayMap = new Map<string, number>();
    for (const v of allRecent.reverse()) {
      const day = v.createdAt.toISOString().slice(0, 10);
      visitsByDayMap.set(day, (visitsByDayMap.get(day) || 0) + 1);
    }
    const visitsByDay = Array.from(visitsByDayMap, ([date, count]) => ({
      date,
      count,
    }));

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
    });
  } catch {
    return NextResponse.json({ error: "Error al obtener métricas" }, { status: 500 });
  }
}