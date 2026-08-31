import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { z } from "zod";

const certSchema = z.object({
  title: z.string().min(1, "Título requerido"),
  issuer: z.string().min(1, "Emisor requerido"),
  date: z.string().transform((s) => new Date(s)),
  imageUrl: z.string().optional(),
  verifyUrl: z.string().url().optional().or(z.literal("")),
});

export async function getCertificates(_req: Request, res: Response) {
  try {
    const certs = await prisma.certificate.findMany({ orderBy: { date: "desc" } });
    res.json(certs);
  } catch {
    res.status(500).json({ error: "Error al obtener certificados" });
  }
}

export async function createCertificate(req: Request, res: Response) {
  try {
    const data = certSchema.parse(req.body);
    const cert = await prisma.certificate.create({ data });
    res.status(201).json(cert);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Error al crear certificado" });
  }
}

export async function updateCertificate(req: Request, res: Response) {
  try {
    const data = certSchema.partial().parse(req.body);
    if (data.date && typeof data.date === "string") {
      (data as any).date = new Date(data.date);
    }
    const cert = await prisma.certificate.update({
      where: { id: req.params.id },
      data,
    });
    res.json(cert);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Error al actualizar certificado" });
  }
}

export async function deleteCertificate(req: Request, res: Response) {
  try {
    await prisma.certificate.delete({ where: { id: req.params.id } });
    res.json({ message: "Certificado eliminado" });
  } catch {
    res.status(500).json({ error: "Error al eliminar certificado" });
  }
}
