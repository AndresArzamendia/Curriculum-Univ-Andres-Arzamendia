import { NextResponse } from "next/server";
import { API_BASE_URL, BACKEND_ORIGIN } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      cache: "no-store",
    });
    const profile = await res.json();

    if (profile?.cvUrl) {
      return NextResponse.redirect(`${BACKEND_ORIGIN}${profile.cvUrl}`);
    }

    return new NextResponse(
      "El CV aún no está disponible. Vuelve a intentarlo más tarde.",
      { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch {
    return new NextResponse("Error al obtener el CV.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}