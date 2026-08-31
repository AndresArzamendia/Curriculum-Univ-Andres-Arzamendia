import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Título requerido"),
  description: z.string().min(1, "Descripción requerida"),
  imageUrls: z.string().optional().default("[]"),
  tags: z.string().optional().default("[]"),
  repoUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1, "Categoría requerida"),
  featured: z.boolean().optional().default(false),
  order: z.number().optional().default(0),
});

export async function getProjects(_req: Request, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    res.json(projects);
  } catch {
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
}

export async function getProject(req: Request, res: Response) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json(project);
  } catch {
    res.status(500).json({ error: "Error al obtener proyecto" });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const data = projectSchema.parse(req.body);
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Error al crear proyecto" });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const data = projectSchema.partial().parse(req.body);
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });
    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Error al actualizar proyecto" });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: "Proyecto eliminado" });
  } catch {
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
}
