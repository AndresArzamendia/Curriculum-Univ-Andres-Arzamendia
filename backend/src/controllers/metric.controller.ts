import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function trackEvent(req: Request, res: Response) {
  try {
    const { event, metadata } = req.body;
    const ip = req.headers["x-forwarded-for"] as string || req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    const metric = await prisma.metric.create({
      data: { event, metadata: JSON.stringify(metadata || {}), ip, userAgent },
    });

    res.status(201).json(metric);
  } catch {
    res.status(500).json({ error: "Error al registrar evento" });
  }
}

export async function getMetrics(_req: Request, res: Response) {
  try {
    const totalVisits = await prisma.metric.count({
      where: { event: "page_view" },
    });

    const totalDownloads = await prisma.metric.count({
      where: { event: "cv_download" },
    });

    const whatsappClicks = await prisma.metric.count({
      where: { event: "whatsapp_click" },
    });

    const emailClicks = await prisma.metric.count({
      where: { event: "email_click" },
    });

    const linkedinClicks = await prisma.metric.count({
      where: { event: "linkedin_click" },
    });

    const githubClicks = await prisma.metric.count({
      where: { event: "github_click" },
    });

    const recentEvents = await prisma.metric.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const eventsByDay = await prisma.metric.groupBy({
      by: ["event"],
      _count: { id: true },
    });

    const visitsByDay = await prisma.$queryRaw`
      SELECT date(createdAt) as date, COUNT(*) as count
      FROM Metric
      WHERE event = 'page_view'
      GROUP BY date(createdAt)
      ORDER BY date DESC
      LIMIT 30
    `;

    res.json({
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
    res.status(500).json({ error: "Error al obtener métricas" });
  }
}
