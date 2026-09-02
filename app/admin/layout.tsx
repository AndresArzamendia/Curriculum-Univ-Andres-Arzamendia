"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Award,
  BarChart3,
  FileText,
  LogOut,
  Terminal,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "Métricas", icon: BarChart3 },
  { href: "/admin/perfil", label: "Perfil", icon: User },
  { href: "/admin/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/admin/certificados", label: "Certificados", icon: Award },
  { href: "/admin/habilidades", label: "Habilidades", icon: LayoutDashboard },
  { href: "/admin/cv", label: "CV", icon: FileText },
];

function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-dark-800 border-r border-neon-cyan/10 flex flex-col fixed h-full z-40">
      <div className="p-6 border-b border-neon-cyan/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-violet flex items-center justify-center">
            <Terminal size={18} className="text-white" />
          </div>
          <div>
            <p className="font-mono text-sm font-bold text-neon-cyan">{"<AA />"}</p>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neon-cyan/10">
        <div className="glass rounded-lg p-3 mb-3">
          <p className="text-xs text-gray-500">Conectado como</p>
          <p className="text-sm text-white font-medium truncate">{user?.name || user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-900">
        {!isLogin && <Sidebar />}
        <main className={isLogin ? "min-h-screen" : "ml-64 p-8"}>
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
