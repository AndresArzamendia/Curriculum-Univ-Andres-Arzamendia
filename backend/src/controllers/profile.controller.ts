import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  photoUrl: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  whatsapp: z.string().optional(),
  cvUrl: z.string().optional(),
});

export async function getProfile(_req: Request, res: Response) {
  try {
    const profile = await prisma.profile.findFirst();
    res.json(profile);
  } catch {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const data = profileSchema.parse(req.body);
    const profile = await prisma.profile.findFirst();

    if (!profile) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
}
