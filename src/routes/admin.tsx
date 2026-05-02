import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Mountain, Calendar, Image as ImageIcon, Tags, Settings,
  ArrowLeft, Menu, X, Sparkles, LogOut, ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — Turistei Urubici" }, { name: "robots", content: "noindex, nofollow" }] }),
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
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Verificando acesso…
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-gradient px-4">
        <div className="max-w-md text-center rounded-3xl border border-border bg-card p-8 shadow-elegant">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta não tem permissão para acessar o painel administrativo.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              Ir para o site
            </Link>
            <button
              onClick={() => signOut()}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <SidebarContent path={path} onSignOut={signOut} email={user.email ?? ""} />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-card border-r border-border flex flex-col animate-fade-up">
            <SidebarContent path={path} onNavigate={() => setOpen(false)} onSignOut={signOut} email={user.email ?? ""} />
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

function SidebarContent({
  path, onNavigate, onSignOut, email,
}: { path: string; onNavigate?: () => void; onSignOut: () => void; email: string }) {
  return (
    <>
      <div className="px-5 py-5 border-b border-border flex items-center justify-between">
        <div className="min-w-0">
          <div className="font-display text-base font-semibold">Turistei Admin</div>
          <div className="text-xs text-muted-foreground truncate">{email}</div>
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
      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth"
        >
          <LogOut className="h-3.5 w-3.5" /> Sair da conta
        </button>
        <Link to="/" onClick={onNavigate} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-smooth px-3 py-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
        </Link>
      </div>
    </>
  );
}
