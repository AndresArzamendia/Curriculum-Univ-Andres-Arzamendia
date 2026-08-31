"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/animations/ParticleBackground";
import ProjectsSection from "@/components/portfolio/ProjectsSection";

export default function ProyectosPage() {
  return (
    <>
      <ParticleBackground />
      <Header />
      <main className="relative z-10 pt-24">
        <ProjectsSection />
      </main>
      <Footer />
    </>
  );
}
