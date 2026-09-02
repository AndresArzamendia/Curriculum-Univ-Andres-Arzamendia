"use client";

import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export type ToastStatus = "idle" | "saving" | "success" | "error";

interface SaveToastProps {
  status: ToastStatus;
  message?: string;
}

export default function SaveToast({ status, message }: SaveToastProps) {
  if (status === "idle") return null;

  const isSuccess = status === "success";
  const isError = status === "error";
  const isSaving = status === "saving";

  return (
    <div className="fixed bottom-6 right-6 z-[100] pointer-events-none animate-fade-in-up">
      <div
        className={`
          flex items-center gap-3 rounded-xl px-5 py-4 shadow-2xl shadow-black/50
          border backdrop-blur-xl
          ${isSuccess
            ? "bg-green-500/15 border-green-400/40 text-green-300"
            : isError
            ? "bg-red-500/15 border-red-400/40 text-red-300"
            : "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan"}
        `}
      >
        {isSaving ? (
          <Loader2 size={20} className="animate-spin shrink-0" />
        ) : isSuccess ? (
          <CheckCircle2 size={20} className="shrink-0" />
        ) : (
          <XCircle size={20} className="shrink-0" />
        )}

        <div>
          {isSaving ? (
            <>
              <p className="text-sm font-semibold">Guardando cambios...</p>
              <p className="text-xs opacity-70">Sincronizando con la base de datos</p>
            </>
          ) : isSuccess ? (
            <>
              <p className="text-sm font-semibold">¡Cambios guardados con éxito!</p>
              <p className="text-xs opacity-70">{message || "Los datos se sincronizaron correctamente."}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold">Error al guardar</p>
              <p className="text-xs opacity-80 max-w-xs break-words">
                {message || "No se pudieron guardar los cambios. Intenta de nuevo."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}