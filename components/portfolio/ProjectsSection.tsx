"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Project } from "@/types";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GlowCard from "@/components/animations/GlowCard";
import { ExternalLink, Github, Eye } from "lucide-react";

const categories = ["Todos", "Frontend", "Backend", "IoT/Electrónica", "Ciencia de Datos"];

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    api.projects.getAll().then(setProjects).catch(() => {});
  }, []);

  const filtered =
    filter === "Todos"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="font-mono text-sm text-neon-green mb-2">
              {"// PORTFOLIO"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Mis <span className="text-neon-cyan text-glow-cyan">Proyectos</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 ${
                  filter === cat
                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                    : "glass text-gray-400 hover:text-neon-cyan"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.1}>
              <GlowCard className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-neon-violet bg-neon-violet/10 px-2 py-1 rounded">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-1 rounded">
                        DESTACADO
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description.substring(0, 120)}...
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {JSON.parse(project.tags || "[]").map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-gray-500 bg-dark-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex items-center gap-1 text-xs text-neon-cyan hover:text-white transition-colors"
                  >
                    <Eye size={14} /> Detalles
                  </button>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-neon-cyan transition-colors"
                    >
                      <Github size={14} /> Código
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-neon-green transition-colors"
                    >
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="glass-strong rounded-2xl p-8 max-w-lg w-full animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-neon-violet bg-neon-violet/10 px-2 py-1 rounded">
                {selectedProject.category}
              </span>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {selectedProject.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {selectedProject.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {JSON.parse(selectedProject.tags || "[]").map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {selectedProject.repoUrl && (
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon flex items-center gap-2 text-xs py-2 px-4"
                >
                  <Github size={14} /> Repositorio
                </a>
              )}
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
                >
                  <ExternalLink size={14} /> Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
