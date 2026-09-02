"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Profile } from "@/types";
import { Save, CheckCircle, Loader2 } from "lucide-react";
import SaveToast, { ToastStatus } from "@/components/admin/SaveToast";

export default function AdminPerfil() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [toast, setToast] = useState<{ status: ToastStatus; message?: string }>({ status: "idle" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/admin/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.profile.get().then(setProfile).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user]);

  const notify = (status: ToastStatus, message?: string) => {
    setToast({ status, message });
    if (status === "success" || status === "error") {
      setTimeout(() => setToast({ status: "idle" }), 4000);
    }
  };

  const handleSave = async () => {
    try {
      notify("saving");
      await api.profile.update(profile);
      notify("success", "El perfil se actualizó correctamente.");
    } catch (err: any) {
      notify("error", err?.message || "No se pudo guardar el perfil. Verifica la conexión a la base de datos.");
    }
  };

  const update = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (authLoading || loading) {
    return <div className="flex justify-center py-20"><span className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full" /></div>;
  }

  const fields = [
    { key: "name", label: "Nombre Completo", type: "text" },
    { key: "title", label: "Título Profesional", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Teléfono", type: "tel" },
    { key: "location", label: "Ubicación", type: "text" },
    { key: "linkedin", label: "LinkedIn URL", type: "url" },
    { key: "github", label: "GitHub URL", type: "url" },
    { key: "whatsapp", label: "WhatsApp (número)", type: "text" },
    { key: "photoUrl", label: "URL Foto de Perfil", type: "url" },
    { key: "cvUrl", label: "URL del CV PDF", type: "url" },
  ];

  const isSaving = toast.status === "saving";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-sm text-neon-green mb-1">{"// PERFIL"}</p>
          <h1 className="text-3xl font-bold text-white">
            Editar <span className="text-neon-cyan text-glow-cyan">Perfil</span>
          </h1>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : toast.status === "success" ? <CheckCircle size={16} /> : <Save size={16} />}
          {isSaving ? "Guardando..." : toast.status === "success" ? "Guardado!" : "Guardar Cambios"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="text-xs font-mono text-gray-500 mb-1 block">{label}</label>
            <input
              type={type}
              value={(profile as any)[key] || ""}
              onChange={(e) => update(key, e.target.value)}
              className="input-dark"
              placeholder={label}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="text-xs font-mono text-gray-500 mb-1 block">Biografía</label>
        <textarea
          value={profile.bio || ""}
          onChange={(e) => update("bio", e.target.value)}
          className="input-dark min-h-[150px] resize-y"
          placeholder="Cuéntanos sobre ti..."
        />
      </div>

      <SaveToast status={toast.status} message={toast.message} />
    </div>
  );
}
