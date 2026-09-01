"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Certificate } from "@/types";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GlowCard from "@/components/animations/GlowCard";
import { Award, ExternalLink, Calendar } from "lucide-react";

export default function CertificatesSection() {
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    api.certificates.getAll().then(setCerts).catch(() => {});
  }, []);

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="font-mono text-sm text-neon-green mb-2">
              {"// CERTIFICACIONES"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Certificados &{" "}
              <span className="text-neon-cyan text-glow-cyan">Logros</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, i) => (
            <ScrollReveal key={cert.id} delay={i * 0.1}>
              <GlowCard className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-violet/10 flex items-center justify-center flex-shrink-0">
                    <Award size={24} className="text-neon-violet" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">{cert.issuer}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      {new Date(cert.date).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                      })}
                    </div>
                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs text-neon-cyan hover:text-white transition-colors"
                      >
                        <ExternalLink size={12} /> Verificar
                      </a>
                    )}
                  </div>
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
