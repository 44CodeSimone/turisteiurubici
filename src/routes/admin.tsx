import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Mountain,
  Calendar,
  Image as ImageIcon,
  Tags,
  Settings,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — Turistei Urubici" }, { name: "robots", content: "noindex" }] }),
});

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/empresas", label: "Empresas & Locais", icon: Building2 },
  { to: "/admin/pontos", label: "Pontos turísticos", icon: Mountain },
  { to: "/admin/categorias", label: "Categorias", icon: Tags },
  { to: "/admin/eventos", label: "Eventos", icon: Calendar },
  { to: "/admin/banners", label: "Banners", icon: ImageIcon },
  { to: "/admin/planos", label: "Planos", icon: Sparkles },
  { to: "/admin/config", label: "Configurações", icon: Settings },
];

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <SidebarContent path={path} />
      </aside>

      {/* Sidebar mobile (drawer) */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-card border-r border-border flex flex-col animate-fade-up">
            <SidebarContent path={path} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-3 py-3">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent transition-smooth"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="font-display font-semibold">Turistei Admin</div>
          <Link to="/" className="text-sm text-primary px-3 py-2">Site</Link>
        </header>
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="px-5 py-5 border-b border-border flex items-center justify-between">
        <div>
          <div className="font-display text-base font-semibold">Turistei Admin</div>
          <div className="text-xs text-muted-foreground">Painel de controle</div>
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((n) => {
          const active = n.exact ? path === n.to : path.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth ${
                active ? "bg-primary text-primary-foreground shadow-soft" : "hover:bg-accent text-foreground/80"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
        </Link>
      </div>
    </>
  );
}
