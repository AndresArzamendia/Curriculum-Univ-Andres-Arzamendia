"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Terminal, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 pcb-pattern opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center mb-4 glow-cyan">
              <Terminal size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Panel de Admin</h1>
            <p className="text-sm text-gray-400 mt-2 font-mono">
              {"// Autenticación requerida"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark pl-11"
                  placeholder="admin@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pl-11"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6 font-mono">
            Credenciales por defecto: admin@arzamendia.dev / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}
