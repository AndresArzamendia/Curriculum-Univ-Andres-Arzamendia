"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Project } from "@/types";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";

const defaultProject = {
  title: "",
  description: "",
  tags: "[]",
  repoUrl: "",
  demoUrl: "",
  category: "Frontend",
  featured: false,
  order: 0,
};

export default function AdminProyectos() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<any>(defaultProject);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/admin/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadProjects();
  }, [user]);

  const loadProjects = () => {
    api.projects.getAll().then(setProjects).catch(() => {}).finally(() => setLoading(false));
  };

  const handleSave = async () => {
    try {
      const data = {
        ...form,
        tags: typeof form.tags === "string" && form.tags.startsWith("[")
          ? form.tags
          : JSON.stringify(form.tags.split(",").map((t: string) => t.trim()).filter(Boolean)),
      };

      if (editing) {
        await api.projects.update(editing.id, data);
      } else {
        await api.projects.create(data);
      }
      setEditing(null);
      setIsCreating(false);
      setForm(defaultProject);
      loadProjects();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar este proyecto?")) {
      await api.projects.delete(id);
      loadProjects();
    }
  };

  const startEdit = (project: Project) => {
    setEditing(project);
    setForm({
      ...project,
      tags: project.tags,
    });
    setIsCreating(false);
  };

  if (authLoading || loading) {
    return <div className="flex justify-center py-20"><span className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-sm text-neon-green mb-1">{"// PROYECTOS"}</p>
          <h1 className="text-3xl font-bold text-white">
            Gestionar <span className="text-neon-cyan text-glow-cyan">Proyectos</span>
          </h1>
        </div>
        <button
          onClick={() => { setIsCreating(true); setEditing(null); setForm(defaultProject); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Nuevo Proyecto
        </button>
      </div>

      {(isCreating || editing) && (
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-sm text-neon-cyan">
              {editing ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h3>
            <button onClick={() => { setEditing(null); setIsCreating(false); }} className="text-gray-500 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Título</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Categoría</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-dark">
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="IoT/Electrónica">IoT/Electrónica</option>
                <option value="Ciencia de Datos">Ciencia de Datos</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Tags (separados por coma)</label>
              <input
                value={(() => { try { return JSON.parse(form.tags || "[]").join(", "); } catch { return form.tags; } })()}
                onChange={(e) => setForm({ ...form, tags: JSON.stringify(e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean)) })}
                className="input-dark"
                placeholder="React, Node.js, TypeScript"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">GitHub URL</label>
              <input value={form.repoUrl || ""} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Demo URL</label>
              <input value={form.demoUrl || ""} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} className="input-dark" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 accent-neon-cyan"
                />
                <span className="text-sm text-gray-300">Destacado</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-mono text-gray-500 mb-1 block">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-dark min-h-[100px] resize-y"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
              <Save size={14} /> Guardar
            </button>
            <button onClick={() => { setEditing(null); setIsCreating(false); }} className="btn-neon py-2 px-4 text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="glass rounded-xl p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-medium">{project.title}</h3>
                <span className="text-xs font-mono text-neon-violet bg-neon-violet/10 px-2 py-0.5 rounded">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="text-xs font-mono text-neon-green bg-neon-green/10 px-2 py-0.5 rounded">
                    ★
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{project.description.substring(0, 100)}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => startEdit(project)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-neon-cyan transition-all">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg hover:bg-red-400/10 text-gray-400 hover:text-red-400 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
