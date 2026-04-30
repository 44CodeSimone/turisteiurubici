import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Mountain, Tags, Star, Calendar, Image as ImageIcon, Sparkles } from "lucide-react";
import { categorias, locais } from "@/data/mock";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const total = locais.length;
  const ativos = locais.filter((l) => l.ativo).length;
  const destaques = locais.filter((l) => l.destaque).length;
  const pontos = locais.filter((l) => l.categoria === "pontos-turisticos").length;
  const eventos = locais.filter((l) => l.categoria === "eventos").length;

  const stats = [
    { label: "Empresas & Locais", value: total, icon: Building2, color: "bg-primary" },
    { label: "Ativos", value: ativos, icon: Sparkles, color: "bg-secondary" },
    { label: "Pontos turísticos", value: pontos, icon: Mountain, color: "bg-primary" },
    { label: "Categorias", value: categorias.length, icon: Tags, color: "bg-secondary" },
    { label: "Em destaque", value: destaques, icon: Star, color: "bg-gold" },
    { label: "Eventos", value: eventos, icon: Calendar, color: "bg-primary" },
    { label: "Banners ativos", value: 3, icon: ImageIcon, color: "bg-secondary" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral da plataforma Turistei Urubici.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 card-hover">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color} text-primary-foreground`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-4 text-3xl font-display font-semibold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Últimos cadastros</h2>
          <Link to="/admin/empresas" className="text-sm text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {locais.slice(0, 5).map((l) => (
            <div key={l.id} className="flex items-center gap-3 py-3">
              <img src={l.imagens[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{l.nome}</div>
                <div className="text-xs text-muted-foreground capitalize">{l.categoria.replace("-", " ")}</div>
              </div>
              <span className={`text-xs rounded-full px-2 py-0.5 ${l.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {l.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
