"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTypingEffect } from "@/hooks/useAnimations";
import { api } from "@/lib/api";
import { Profile } from "@/types";
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

const titles = [
  "Estudiante de Ingeniería en Informática",
  "Desarrollador Full-Stack",
  "Entusiasta de Electrónica",
  "Amante de la Física Cuántica",
];

export default function HeroSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const typedText = useTypingEffect(titles, 80, 40, 2000);

  useEffect(() => {
    api.profile.get().then(setProfile).catch(() => {});
  }, []);

  const trackClick = (event: string) => {
    api.metrics.track(event).catch(() => {});
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative pcb-pattern pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="font-mono text-sm text-neon-green mb-4 text-glow-green">
              {"// Bienvenido a mi portafolio"}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Hola, soy{" "}
              <span className="text-neon-cyan text-glow-cyan">
                {profile?.name || "Andres Arzamendia"}
              </span>
            </h1>

            <div className="h-10 mb-8">
              <span className="font-mono text-lg sm:text-xl text-gray-400">
                {typedText}
              </span>
              <span className="animate-blink text-neon-cyan">|</span>
            </div>

            <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
              {profile?.bio
                ? profile.bio.substring(0, 150) + "..."
                : "Construyendo soluciones tecnológicas innovadoras que combinan hardware y software."}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="/proyectos" className="btn-primary flex items-center gap-2">
                <ExternalLink size={16} />
                Ver Proyectos
              </a>
              <a href="/contacto" className="btn-neon flex items-center gap-2">
                <Mail size={16} />
                Contactar
              </a>
            </div>

            <div className="flex gap-4">
              {[
                {
                  icon: Github,
                  href: profile?.github || "https://github.com",
                  label: "GitHub",
                  event: "github_click",
                },
                {
                  icon: Linkedin,
                  href: profile?.linkedin || "https://linkedin.com",
                  label: "LinkedIn",
                  event: "linkedin_click",
                },
                {
                  icon: Mail,
                  href: `mailto:${profile?.email || "andres@email.com"}`,
                  label: "Email",
                  event: "email_click",
                },
                {
                  icon: MessageCircle,
                  href: `https://wa.me/${profile?.whatsapp || ""}`,
                  label: "WhatsApp",
                  event: "whatsapp_click",
                },
              ].map(({ icon: Icon, href, label, event }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(event)}
                  className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:glow-cyan transition-all duration-300"
                  title={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-3xl glass-strong p-1 animate-float">
                <div className="w-full h-full rounded-3xl bg-dark-700 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                  <div className="absolute inset-0 circuit-lines" />
                  <div className="text-6xl font-mono font-bold text-neon-cyan text-glow-cyan mb-4">
                    {"{ }"}
                  </div>
                  <div className="text-center z-10">
                    <p className="font-mono text-neon-green text-sm mb-2">
                      {"console.log("}
                    </p>
                    <p className="font-mono text-white text-lg font-bold mb-2">
                      &quot;Andres Arzamendia&quot;
                    </p>
                    <p className="font-mono text-neon-green text-sm">{");"}</p>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="terminal-bar text-xs">
                      <span className="text-neon-green">{"$ "}</span>
                      <span className="text-gray-400">node --version</span>
                      <br />
                      <span className="text-neon-cyan">v20.x.x</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl glass flex items-center justify-center glow-violet">
                <span className="font-mono text-xs text-neon-violet text-center leading-tight">
                  C++<br />Python
                </span>
              </div>

              <div className="absolute -bottom-4 -left-4 w-24 h-16 rounded-xl glass flex items-center justify-center glow-green">
                <span className="font-mono text-xs text-neon-green text-center">
                  IoT / HW
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={24} className="text-neon-cyan/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
