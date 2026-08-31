"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import GlowCard from "@/components/animations/GlowCard";
import { BookOpen, Cpu, Atom, Code2 } from "lucide-react";

const areas = [
  {
    icon: Code2,
    title: "Desarrollo de Software",
    description: "Aplicaciones web full-stack con tecnologías modernas.",
    color: "#00f0ff",
  },
  {
    icon: Cpu,
    title: "Electrónica & IoT",
    description: "Sistemas embebidos, Arduino, Raspberry Pi y sensores.",
    color: "#7000ff",
  },
  {
    icon: Atom,
    title: "Física Cuántica",
    description: "Exploración de principios de mecánica cuántica aplicados.",
    color: "#00ff66",
  },
  {
    icon: BookOpen,
    title: "Matemáticas",
    description: "Cálculo, álgebra lineal y modelado matemático.",
    color: "#00f0ff",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="font-mono text-sm text-neon-green mb-2">
              {"// SOBRE MÍ"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Mi <span className="text-neon-cyan text-glow-cyan">Enfoque</span> Académico
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Estudiante de Ingeniería en Informática con pasión por la
              intersección entre tecnología, ciencia y matemáticas.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, i) => (
            <ScrollReveal key={area.title} delay={i * 0.1}>
              <GlowCard className="h-full">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${area.color}15` }}
                >
                  <area.icon size={24} style={{ color: area.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {area.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {area.description}
                </p>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
