import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Andres Arzamendia | Portafolio Profesional",
  description:
    "Portfolio y CV de Andres Arzamendia - Estudiante de Ingeniería en Informática, Desarrollador Full-Stack y Entusiasta de Electrónica.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-dark-900 text-gray-200 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
