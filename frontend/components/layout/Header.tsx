"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Terminal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre Mí" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/certificados", label: "Certificados" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
              <Terminal size={18} className="text-white" />
            </div>
            <span className="font-mono font-bold text-neon-cyan text-glow-cyan hidden sm:inline">
              {"<AA />"}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? "text-neon-cyan bg-neon-cyan/10 text-glow-cyan"
                    : "text-gray-400 hover:text-neon-cyan hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg text-sm font-medium text-neon-violet hover:bg-neon-violet/10 transition-all"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/cv"
              className="btn-neon hidden sm:flex items-center gap-2 text-xs py-2 px-4"
              onClick={() => {
                api.metrics.track("cv_download").catch(() => {});
              }}
            >
              <Download size={14} />
              CV
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-400 hover:text-neon-cyan transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-neon-cyan/10"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "text-neon-cyan bg-neon-cyan/10"
                      : "text-gray-400 hover:text-neon-cyan hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-neon-violet hover:bg-neon-violet/10"
                >
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
