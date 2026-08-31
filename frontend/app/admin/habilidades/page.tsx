"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Skill } from "@/types";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function AdminHabilidades() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({ name: "", level: 50, category: "Lenguajes", icon: "" });
  const [loading, setLoading] = useState(true);
  const [editingLevel, setEditingLevel] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/admin/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) api.skills.getAll().then(setSkills).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async () => {
    try {
      await api.skills.create({ ...form, order: skills.length });
      setIsCreating(false);
      setForm({ name: "", level: 50, category: "Lenguajes", icon: "" });
      api.skills.getAll().then(setSkills);
    } catch {}
  };

  const handleUpdateLevel = async (id: string, level: number) => {
    await api.skills.update(id, { level });
    setEditingLevel(null);
    api.skills.getAll().then(setSkills);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar esta habilidad?")) {
      await api.skills.delete(id);
      api.skills.getAll().then(setSkills);
    }
  };

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (authLoading || loading) {
    return <div className="flex justify-center py-20"><span className="animate-spin w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-sm text-neon-green mb-1">{"// HABILIDADES"}</p>
          <h1 className="text-3xl font-bold text-white">
            Gestionar <span className="text-neon-cyan text-glow-cyan">Habilidades</span>
          </h1>
        </div>
        <button onClick={() => setIsCreating(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nueva
        </button>
      </div>

      {isCreating && (
        <div className="glass rounded-2xl p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-sm text-neon-cyan">Nueva Habilidad</h3>
            <button onClick={() => setIsCreating(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" />
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Categoría</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-dark">
                <option value="Lenguajes">Lenguajes</option>
                <option value="Frameworks">Frameworks</option>
                <option value="Electrónica/Hardware">Electrónica/Hardware</option>
                <option value="Herramientas">Herramientas</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-1 block">Nivel: {form.level}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
                className="w-full accent-neon-cyan"
              />
            </div>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2 py-2 px-4 text-sm">
            <Save size={14} /> Crear
          </button>
        </div>
      )}

      {Object.entries(grouped).map(([category, catSkills]) => (
        <div key={category} className="mb-8">
          <h3 className="font-mono text-sm text-neon-violet mb-4">{category.toUpperCase()}</h3>
          <div className="space-y-3">
            {catSkills.map((skill) => (
              <div key={skill.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-xs font-mono text-neon-cyan">{skill.level}%</span>
                    </div>
                    {editingLevel === skill.id ? (
                      <div className="flex items-center gap-3 mt-2">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          defaultValue={skill.level}
                          onChange={(e) => handleUpdateLevel(skill.id, parseInt(e.target.value))}
                          className="flex-1 accent-neon-cyan"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-1.5 bg-dark-700 rounded-full mt-2">
                        <div className="h-full bg-neon-cyan rounded-full" style={{ width: `${skill.level}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingLevel(editingLevel === skill.id ? null : skill.id)}
                      className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-neon-cyan transition-all text-xs"
                    >
                      {editingLevel === skill.id ? "OK" : "Editar"}
                    </button>
                    <button onClick={() => handleDelete(skill.id)} className="p-2 rounded-lg hover:bg-red-400/10 text-gray-400 hover:text-red-400 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
