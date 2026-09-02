"use client";

import { useEffect, useState } from "react";
import { Database, RefreshCcw, CheckCircle2, XCircle, Wifi, WifiOff } from "lucide-react";

interface DbHealth {
  connected: boolean;
  hasDatabaseUrl: boolean;
  latencyMs?: number;
  provider?: string;
  version?: string;
  tableCount?: number;
  error?: string;
}

export default function DbStatusIndicator() {
  const [status, setStatus] = useState<DbHealth | null>(null);
  const [checking, setChecking] = useState(true);
  const [hover, setHover] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({ connected: false, hasDatabaseUrl: false, error: "No se pudo contactar el servidor" });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={checkHealth}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all duration-300 border ${
          checking
            ? "border-yellow-400/30 text-yellow-400 bg-yellow-400/5"
            : status?.connected
            ? "border-green-400/30 text-green-400 bg-green-400/5 hover:bg-green-400/10"
            : "border-red-400/30 text-red-400 bg-red-400/5 hover:bg-red-400/10"
        }`}
      >
        <Database size={14} className="shrink-0" />
        <span className="flex-1 text-left truncate">
          {checking
            ? "Verificando conexión..."
            : status?.connected
            ? "Conectado a la BD"
            : "BD no conectada"}
        </span>
        {checking ? (
          <RefreshCcw size={12} className="animate-spin shrink-0" />
        ) : status?.connected ? (
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
        )}
      </button>

      {/* Tooltip / panel de estado al hacer hover */}
      {hover && status && (
        <div className="absolute left-full ml-3 top-0 w-72 glass-strong rounded-xl p-4 z-50 text-left shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-gray-400">Estado de la BD</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                status.connected
                  ? "bg-green-400/10 text-green-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {status.connected ? "OPERATIVA" : "CAÍDA"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 flex items-center gap-1.5">
                {status.connected ? <Wifi size={12} /> : <WifiOff size={12} />} Conexión
              </span>
              <span className="font-mono text-gray-300">
                {status.connected ? "Activa" : "Inactiva"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Latencia</span>
              <span className="font-mono text-gray-300">
                {status.latencyMs !== undefined ? `${status.latencyMs} ms` : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Motor</span>
              <span className="font-mono text-gray-300">{status.provider || "—"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Versión</span>
              <span className="font-mono text-gray-300">{status.version || "—"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Tablas</span>
              <span className="font-mono text-gray-300">{status.tableCount ?? "—"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">DATABASE_URL</span>
              <span
                className={`font-mono ${
                  status.hasDatabaseUrl ? "text-green-400" : "text-red-400"
                }`}
              >
                {status.hasDatabaseUrl ? "Configurada" : "Falta"}
              </span>
            </div>

            {!status.connected && status.error && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-[10px] text-red-400/80 break-words leading-relaxed">
                  {status.error}
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                checkHealth();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-mono py-1.5 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-all"
            >
              <RefreshCcw size={11} /> Re-verificar
            </button>
            {status.connected && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-green-400">
                <CheckCircle2 size={11} /> OK
              </span>
            )}
            {!status.connected && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-red-400">
                <XCircle size={11} /> Error
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}