"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Profile } from "@/types";
import { Save, CheckCircle } from "lucide-react";

export default function AdminPerfil() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/admin/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.profile.get().then(setProfile).catch(() => {}).finally(() => setLoading(false));
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await api.profile.update(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-sm text-neon-green mb-1">{"// PERFIL"}</p>
          <h1 className="text-3xl font-bold text-white">
            Editar <span className="text-neon-cyan text-glow-cyan">Perfil</span>
          </h1>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? "Guardado!" : "Guardar Cambios"}
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
    </div>
  );
}
