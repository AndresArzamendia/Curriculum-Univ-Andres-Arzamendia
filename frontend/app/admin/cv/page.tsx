"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Upload, FileText, Trash2 } from "lucide-react";

export default function AdminCV() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/admin/login");
  }, [user, authLoading, router]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = document.cookie.match(/token=([^;]+)/)?.[1];

      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir archivo");

      const data = await res.json();
      setCvUrl(data.url);

      await fetch("http://localhost:4000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cvUrl: data.url }),
      });
    } catch {
      setError("Error al subir el archivo. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return <div className="flex justify-center py-20"><span className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-mono text-sm text-neon-green mb-1">{"// CURRICULUM VITAE"}</p>
        <h1 className="text-3xl font-bold text-white">
          Gestionar <span className="text-neon-cyan text-glow-cyan">CV</span>
        </h1>
      </div>

      <div className="glass rounded-2xl p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-neon-cyan/10 flex items-center justify-center mb-6">
            <FileText size={40} className="text-neon-cyan" />
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">Curriculum Vitae</h3>
          <p className="text-sm text-gray-400 mb-6">
            Sube tu CV en formato PDF. Los visitantes podrán descargarlo desde el portafolio.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload size={16} />
                {cvUrl ? "Reemplazar CV" : "Subir CV"}
              </>
            )}
          </button>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          {cvUrl && (
            <div className="mt-6 p-4 glass rounded-xl inline-flex items-center gap-3">
              <FileText size={16} className="text-neon-green" />
              <a
                href={`http://localhost:4000${cvUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neon-cyan hover:text-white transition-colors"
              >
                Ver CV actual
              </a>
            </div>
          )}

          <div className="mt-8 p-4 bg-dark-700/50 rounded-xl text-left">
            <h4 className="font-mono text-xs text-neon-green mb-2">Recomendaciones:</h4>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>{">"} Formato PDF (máximo 10MB)</li>
              <li>{">"} Incluye nombre en el archivo (ej: CV_Andres_Arzamendia.pdf)</li>
              <li>{">"} Actualiza regularmente tu CV con nuevos logros</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
