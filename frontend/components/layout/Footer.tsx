"use client";

import { Terminal, Github, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-neon-cyan/10 bg-dark-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
                <Terminal size={18} className="text-white" />
              </div>
              <span className="font-mono font-bold text-neon-cyan">{"<AA />"}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Portfolio profesional de Andres Arzamendia - Estudiante de
              Ingeniería en Informática.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-sm text-neon-cyan mb-4">// NAVEGACIÓN</h3>
            <div className="space-y-2">
              {["Inicio", "Sobre Mí", "Proyectos", "Certificados", "Contacto"].map(
                (item) => (
                  <p key={item} className="text-gray-500 text-sm hover:text-neon-cyan transition-colors cursor-pointer">
                    {">"} {item}
                  </p>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-sm text-neon-cyan mb-4">// CONECTEMOS</h3>
            <div className="flex gap-4">
              {[
                { icon: Github, href: "https://github.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
                { icon: Mail, href: "mailto:andres@email.com" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:glow-cyan transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider mt-8 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs font-mono">
            {"/* © 2024 Andres Arzamendia */"}
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1">
            Built with <Heart size={12} className="text-neon-violet" /> and lots of ☕
          </p>
        </div>
      </div>
    </footer>
  );
}
