import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { z } from "zod";

const skillSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  level: z.number().min(0).max(100, "Nivel entre 0 y 100"),
  category: z.string().min(1, "Categoría requerida"),
  icon: z.string().optional(),
  order: z.number().optional().default(0),
});

export async function getSkills(_req: Request, res: Response) {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    res.json(skills);
  } catch {
    res.status(500).json({ error: "Error al obtener habilidades" });
  }
}

export async function createSkill(req: Request, res: Response) {
  try {
    const data = skillSchema.parse(req.body);
    const skill = await prisma.skill.create({ data });
    res.status(201).json(skill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Error al crear habilidad" });
  }
}

export async function updateSkill(req: Request, res: Response) {
  try {
    const data = skillSchema.partial().parse(req.body);
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data,
    });
    res.json(skill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Error al actualizar habilidad" });
  }
}

export async function deleteSkill(req: Request, res: Response) {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ message: "Habilidad eliminada" });
  } catch {
    res.status(500).json({ error: "Error al eliminar habilidad" });
  }
}
