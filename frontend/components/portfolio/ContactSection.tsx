"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import ScrollReveal from "@/components/animations/ScrollReveal";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Linkedin,
  Github,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(3, "Asunto muy corto"),
  message: z.string().min(10, "Mensaje muy corto (mínimo 10 caracteres)"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      await api.metrics.track("contact_form_submit", data);
      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className="py-24 relative" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="font-mono text-sm text-neon-green mb-2">
              {"// CONTACTO"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Hablemos{" "}
              <span className="text-neon-cyan text-glow-cyan">Juntos</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              ¿Tienes un proyecto en mente o quieres colaborar? No dudes en
              contactarme.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <ScrollReveal className="lg:col-span-2">
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "andres@email.com", href: "mailto:andres@email.com" },
                { icon: Phone, label: "Teléfono", value: "+54 9 11 0000-0000", href: "tel:+5491100000000" },
                { icon: MapPin, label: "Ubicación", value: "Buenos Aires, Argentina", href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                    <Icon size={20} className="text-neon-cyan" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm text-white hover:text-neon-cyan transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-white">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                {[
                  { icon: MessageCircle, href: "https://wa.me/", label: "WhatsApp", color: "#00ff66" },
                  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "#0077ff" },
                  { icon: Github, href: "https://github.com", label: "GitHub", color: "#ffffff" },
                ].map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl glass flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                    style={{ ["--hover-color" as any]: color }}
                    title={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-gray-500 mb-1 block">Nombre</label>
                  <input
                    {...register("name")}
                    className="input-dark"
                    placeholder="Tu nombre"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-mono text-gray-500 mb-1 block">Email</label>
                  <input
                    {...register("email")}
                    className="input-dark"
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 mb-1 block">Asunto</label>
                <input
                  {...register("subject")}
                  className="input-dark"
                  placeholder="¿En qué puedo ayudarte?"
                />
                {errors.subject && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 mb-1 block">Mensaje</label>
                <textarea
                  {...register("message")}
                  className="input-dark min-h-[120px] resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Send size={16} /> Enviar Mensaje
                  </>
                )}
              </button>

              {status === "success" && (
                <p className="text-neon-green text-sm flex items-center gap-2 justify-center">
                  <CheckCircle size={16} /> Mensaje enviado correctamente
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm flex items-center gap-2 justify-center">
                  <AlertCircle size={16} /> Error al enviar. Intenta de nuevo.
                </p>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
