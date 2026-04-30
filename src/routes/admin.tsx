import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Mountain, Calendar, Image as ImageIcon, Tags, Settings, ArrowLeft } from "lucide-react";

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
  { to: "/admin/config", label: "Configurações", icon: Settings },
];

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="px-5 py-5 border-b border-border">
          <div className="font-display text-base font-semibold">Turistei Admin</div>
          <div className="text-xs text-muted-foreground">Painel de controle</div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-smooth ${
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
          <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="font-display font-semibold">Turistei Admin</div>
          <Link to="/" className="text-sm text-primary">Site</Link>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
