import { createFileRoute } from "@tanstack/react-router";
import { categorias } from "@/data/mock";

export const Route = createFileRoute("/admin/categorias")({
  component: AdminCategorias,
});

function AdminCategorias() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Categorias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categorias.map((c) => (
          <div key={c.slug} className="rounded-2xl border border-border bg-card p-5">
            <div className="font-medium">{c.nome}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{c.descricao}</div>
            <div className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">slug: {c.slug}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
