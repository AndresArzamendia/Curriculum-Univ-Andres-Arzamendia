"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

// Registra cada visita de página (page_view). Funciona en cualquier dispositivo
// (móvil, tableta, escritorio) porque usa fetch estándar del navegador.
// Evita registrar vistas duplicadas en React StrictMode y en la misma URL.
export default function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // No trackear dentro del panel de administración
    if (pathname.startsWith("/admin")) return;

    // Evitar duplicados si la ruta no cambió (p.ej. vuelta a la misma)
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    let cancelled = false;

    // Detectar tipo de dispositivo para incluirlo en la métrica
    const ua = window.navigator.userAgent || "";
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const deviceType = isMobile
      ? "móvil/tablet"
      : /iPad|Tablet/i.test(ua)
      ? "tablet"
      : "desktop";

    fetch("/api/metrics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "page_view",
        metadata: {
          path: pathname,
          deviceType,
          screen: `${window.innerWidth}x${window.innerHeight}`,
          referrer: document.referrer || "",
        },
      }),
    }).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}