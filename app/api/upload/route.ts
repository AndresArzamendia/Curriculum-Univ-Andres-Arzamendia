import { NextRequest, NextResponse } from "next/server";
import { getAuthSession, unauthorized } from "@/lib/auth";
import { put, del } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

export const runtime = "nodejs";

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp"];
const MAX_SIZE = 10 * 1024 * 1024;

async function saveViaBlob(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const blob = await put(file.name, buffer, { access: "public" });
  return blob.url;
}

async function saveLocally(file: File): Promise<string> {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const uploadsDir = path.join(__dirname, "../../../../public/uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name).toLowerCase();
  const filename = `${randomUUID()}${ext}`;
  const fullPath = path.join(uploadsDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  return `/uploads/${filename}`;
}

export async function POST(req: NextRequest) {
  const session = getAuthSession(req);
  if (!session) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "El archivo supera el tamaño máximo de 10MB" },
        { status: 400 }
      );
    }

    const url = process.env.BLOB_READ_WRITE_TOKEN
      ? await saveViaBlob(formData)
      : await saveLocally(file);

    return NextResponse.json({ url, filename: file.name });
  } catch {
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}