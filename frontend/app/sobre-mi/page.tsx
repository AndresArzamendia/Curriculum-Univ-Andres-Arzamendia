"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ParticleBackground from "@/components/animations/ParticleBackground";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AboutSection from "@/components/portfolio/AboutSection";
import SkillsSection from "@/components/portfolio/SkillsSection";

export default function SobreMiPage() {
  return (
    <>
      <ParticleBackground />
      <Header />
      <main className="relative z-10 pt-24">
        <section className="py-16 max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <p className="font-mono text-sm text-neon-green mb-2">
              {"// SOBRE MÍ"}
            </p>
            <h1 className="text-4xl font-bold text-white mb-6">
              Mi <span className="text-neon-cyan text-glow-cyan">Historia</span>
            </h1>
            <div className="glass rounded-2xl p-8 space-y-4 text-gray-300 leading-relaxed">
              <p>
                Soy estudiante de Ingeniería en Informática con una profunda
                pasión por la tecnología y la ciencia. Mi enfoque combina el
                desarrollo de software con el hardware, explorando cómo la
                electrónica y la programación pueden unirse para crear soluciones
                innovadoras.
              </p>
              <p>
                A lo largo de mi formación académica, he desarrollado
                competencias en desarrollo web full-stack, sistemas embebidos con
                Arduino y Raspberry Pi, y análisis de datos. Mi interés por la
                física cuántica y las matemáticas alimenta mi curiosidad por
                comprender y aplicar conceptos avanzados en proyectos reales.
              </p>
              <p>
                Mi objetivo es contribuir al avance tecnológico desarrollando
                soluciones que bridgen el gap entre el mundo digital y el
                físico, aplicando ingeniería, creatividad y pensamiento
                analítico.
              </p>
            </div>
          </ScrollReveal>
        </section>
        <AboutSection />
        <SkillsSection />
      </main>
      <Footer />
    </>
  );
}
