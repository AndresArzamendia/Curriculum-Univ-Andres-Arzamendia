"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Certificate } from "@/types";
import { Plus, Trash2, Save, X } from "lucide-react";
import SaveToast, { ToastStatus } from "@/components/admin/SaveToast";

export default function AdminCertificados() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ title: "", issuer: "", date: "", verifyUrl: "" });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ status: ToastStatus; message?: string }>({ status: "idle" });

  const notify = (status: ToastStatus, message?: string) => {
    setToast({ status, message });
    if (status === "success" || status === "error") {
      setTimeout(() => setToast({ status: "idle" }), 4000);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) router.push("/admin/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) api.certificates.getAll().then(setCerts).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async () => {
    try {
      notify("saving");
      await api.certificates.create(form);
      setIsCreating(false);
      setForm({ title: "", issuer: "", date: "", verifyUrl: "" });
      api.certificates.getAll().then(setCerts);
      notify("success", "Certificado creado correctamente.");
    } catch (err: any) {
      notify("error", err?.message || "No se pudo crear el certificado.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este certificado?")) {
      try {
        await api.certificates.delete(id);
        api.certificates.getAll().then(setCerts);
        notify("success", "Certificado eliminado.");
      } catch (err: any) {
        notify("error", err?.message || "No se pudo eliminar el certificado.");
      }
    }
  };

  if (authLoading || loading) {
    return <div className="flex justify-center py-20"><span className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-sm text-neon-green mb-1">{"// CERTIFICADOS"}</p>
          <h1 className="text-3xl font-bold text-white">
            Gestionar <span className="text-neon-cyan text-glow-cyan">Certificados</span>
          </h1>
        </div>
        <button onClick={() => setIsCreating(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {isCreating && (
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-sm text-neon-cyan">Nuevo Certificado</h3>
            <button onClick={() => setIsCreating(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Título</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Emisor</label>
              <input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Fecha</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">URL Verificación (opcional)</label>
              <input value={form.verifyUrl} onChange={(e) => setForm({ ...form, verifyUrl: e.target.value })} className="input-dark" />
            </div>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
            <Save size={14} /> Crear
          </button>
        </div>
      )}

      <div className="space-y-3">
        {certs.map((cert) => (
          <div key={cert.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{cert.title}</h3>
              <p className="text-xs text-gray-500">{cert.issuer} · {new Date(cert.date).toLocaleDateString("es-AR")}</p>
            </div>
            <button onClick={() => handleDelete(cert.id)} className="p-2 rounded-lg hover:bg-red-400/10 text-gray-400 hover:text-red-400 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <SaveToast status={toast.status} message={toast.message} />
    </div>
  );
}
