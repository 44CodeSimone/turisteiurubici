import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Pencil, Star } from "lucide-react";
import { useState } from "react";
import { locais, getCategoria } from "@/data/mock";

export const Route = createFileRoute("/admin/empresas")({
  component: AdminEmpresas,
});

function AdminEmpresas() {
  const [q, setQ] = useState("");
  const list = locais.filter((l) => l.nome.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Empresas & Locais</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie todos os cadastros da plataforma.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-bounce hover:scale-[1.02]">
          <Plus className="h-4 w-4" /> Novo cadastro
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar…"
          className="w-full rounded-full border border-input bg-background pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Categoria</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Plano</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((l) => (
              <tr key={l.id} className="hover:bg-accent/40 transition-smooth">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={l.imagens[0]} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <div className="font-medium flex items-center gap-1.5">
                      {l.nome}
                      {l.destaque && <Star className="h-3.5 w-3.5 text-gold fill-gold" />}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{getCategoria(l.categoria)?.nome}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium capitalize">{l.plano}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.ativo ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {l.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent transition-smooth">
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
