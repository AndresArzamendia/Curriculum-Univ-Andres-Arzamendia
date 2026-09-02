"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Metrics } from "@/types";
import { motion } from "framer-motion";
import {
  Eye,
  Download,
  MessageCircle,
  Mail,
  Linkedin,
  Github,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#00f0ff", "#7000ff", "#00ff66", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  const loadMetrics = () => {
    if (!user) return;
    api.metrics
      .get()
      .then((data) => {
        setMetrics(data);
        setError(null);
      })
      .catch((e: any) => {
        setError(e?.message || "No se pudieron cargar las métricas");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMetrics();
    // Refrescar métricas automáticamente cada 15 segundos
    const interval = setInterval(loadMetrics, 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-400 font-mono text-sm text-center">{error}</p>
        <button onClick={() => { setLoading(true); setError(null); loadMetrics(); }} className="btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  const statCards = [
    { label: "Visitas Totales", value: metrics.totalVisits, icon: Eye, color: "#00f0ff" },
    { label: "Descargas CV", value: metrics.totalDownloads, icon: Download, color: "#00ff66" },
    { label: "Clicks WhatsApp", value: metrics.whatsappClicks, icon: MessageCircle, color: "#00ff66" },
    { label: "Clicks Email", value: metrics.emailClicks, icon: Mail, color: "#7000ff" },
    { label: "Clicks LinkedIn", value: metrics.linkedinClicks, icon: Linkedin, color: "#0077ff" },
    { label: "Clicks GitHub", value: metrics.githubClicks, icon: Github, color: "#ffffff" },
  ];

  const eventPieData = metrics.eventsByDay.map((e) => ({
    name: e.event,
    value: e._count.id,
  }));

  const deviceData = [
    { name: "Escritorio", value: metrics.deviceVisits?.desktop || 0, color: "#00f0ff" },
    { name: "Móvil/Tablet", value: metrics.deviceVisits?.["móvil/tablet"] || 0, color: "#7000ff" },
    { name: "Tablet", value: metrics.deviceVisits?.tablet || 0, color: "#00ff66" },
    { name: "Desconocido", value: metrics.deviceVisits?.desconocido || 0, color: "#f59e0b" },
  ];
  const totalDevice = deviceData.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-sm text-neon-green mb-1">
          {"// DASHBOARD"}
        </p>
        <h1 className="text-3xl font-bold text-white">
          Métricas &{" "}
          <span className="text-neon-cyan text-glow-cyan">Analíticas</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-mono">{label}</span>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-3xl font-bold" style={{ color }}>
              {value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Visitas por dispositivo */}
      <div className="glass rounded-xl p-6 mb-8">
        <h3 className="font-mono text-sm text-neon-cyan mb-4 flex items-center gap-2">
          <Activity size={16} /> Visitas por Dispositivo
        </h3>
        {totalDevice > 0 ? (
          <div className="space-y-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-dark-700">
              {deviceData.map((d) => (
                <div
                  key={d.name}
                  style={{
                    width: `${(d.value / totalDevice) * 100}%`,
                    backgroundColor: d.color,
                  }}
                  title={`${d.name}: ${d.value}`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {deviceData.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-2 rounded-lg bg-dark-700/50 px-3 py-2">
                  <span className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-mono text-xs text-white font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">Aún no hay visitas registradas</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-xl p-6">
          <h3 className="font-mono text-sm text-neon-cyan mb-4 flex items-center gap-2">
            <TrendingUp size={16} /> Eventos por Tipo
          </h3>
          {eventPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={eventPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {eventPieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1a1a22",
                    border: "1px solid rgba(0,240,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Sin datos aún</p>
          )}
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="font-mono text-sm text-neon-cyan mb-4 flex items-center gap-2">
            <Activity size={16} /> Visitas por Día
          </h3>
          {metrics.visitsByDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.visitsByDay.slice(0, 14).reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a22" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("es", { day: "2-digit", month: "short" })}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a22",
                    border: "1px solid rgba(0,240,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#00f0ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Sin datos aún</p>
          )}
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="font-mono text-sm text-neon-cyan mb-4">
          {"// ACTIVIDAD RECIENTE"}
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {metrics.recentEvents.length > 0 ? (
            metrics.recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                <span className="font-mono text-xs text-neon-green">{event.event}</span>
                <span className="text-xs text-gray-500 truncate flex-1">
                  {event.metadata ? JSON.parse(event.metadata).message || JSON.stringify(JSON.parse(event.metadata)).substring(0, 80) : ""}
                </span>
                <span className="text-xs text-gray-600 font-mono">
                  {new Date(event.createdAt).toLocaleTimeString("es-AR")}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">Sin actividad aún</p>
          )}
        </div>
      </div>
    </div>
  );
}
