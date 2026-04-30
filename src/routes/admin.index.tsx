import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Mountain, Tags, Star, Calendar, Image as ImageIcon, Sparkles, RotateCcw } from "lucide-react";
import { useData, resetData } from "@/data/store";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const data = useData();
  const total = data.locais.length;
  const ativos = data.locais.filter((l) => l.ativo).length;
  const destaques = data.locais.filter((l) => l.destaque).length;
  const pontos = data.locais.filter((l) => l.categoria === "pontos-turisticos").length;
  const eventos = data.eventos.filter((e) => e.ativo).length;
  const banners = data.banners.filter((b) => b.ativo).length;

  const stats = [
    { label: "Empresas & Locais", value: total, icon: Building2, color: "bg-primary" },
    { label: "Ativos", value: ativos, icon: Sparkles, color: "bg-secondary" },
    { label: "Pontos turísticos", value: pontos, icon: Mountain, color: "bg-primary" },
    { label: "Categorias", value: data.categorias.length, icon: Tags, color: "bg-secondary" },
    { label: "Em destaque", value: destaques, icon: Star, color: "bg-gold" },
    { label: "Eventos ativos", value: eventos, icon: Calendar, color: "bg-primary" },
    { label: "Banners ativos", value: banners, icon: ImageIcon, color: "bg-secondary" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Visão geral da plataforma Turistei Urubici.</p>
        </div>
        <button
          onClick={() => {
            if (confirm("Restaurar dados iniciais? Suas alterações locais serão perdidas.")) resetData();
          }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-smooth"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Restaurar dados iniciais
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 md:p-5 card-hover">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color} text-primary-foreground`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 md:mt-4 text-2xl md:text-3xl font-display font-semibold">{s.value}</div>
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
          {data.locais.slice(0, 5).map((l) => (
            <div key={l.id} className="flex items-center gap-3 py-3">
              <img src={l.imagens[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-muted" />
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
