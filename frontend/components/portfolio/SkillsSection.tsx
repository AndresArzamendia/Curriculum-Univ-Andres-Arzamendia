"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Skill } from "@/types";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SkillBar from "@/components/animations/SkillBar";

const categoryColors: Record<string, string> = {
  Lenguajes: "#00f0ff",
  Frameworks: "#7000ff",
  "Electrónica/Hardware": "#00ff66",
  Herramientas: "#f59e0b",
};

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    api.skills.getAll().then(setSkills).catch(() => {});
  }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="font-mono text-sm text-neon-green mb-2">
              {"// TECH STACK"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Habilidades{" "}
              <span className="text-neon-cyan text-glow-cyan">Técnicas</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(grouped).map(([category, catSkills], i) => (
            <ScrollReveal key={category} delay={i * 0.15}>
              <div className="glass rounded-2xl p-6">
                <h3
                  className="font-mono text-sm mb-6 flex items-center gap-2"
                  style={{ color: categoryColors[category] || "#00f0ff" }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: categoryColors[category] || "#00f0ff" }}
                  />
                  {category.toUpperCase()}
                </h3>
                <div className="space-y-4">
                  {catSkills
                    .sort((a, b) => a.order - b.order)
                    .map((skill) => (
                      <SkillBar
                        key={skill.id}
                        name={skill.name}
                        level={skill.level}
                        color={categoryColors[category] || "#00f0ff"}
                      />
                    ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
