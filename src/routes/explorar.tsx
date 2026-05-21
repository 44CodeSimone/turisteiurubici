import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ElzaWidget } from "@/components/site/ElzaWidget";
import { LocalCard } from "@/components/site/LocalCard";
import { useData } from "@/data/store";
import { isLocalPublico } from "@/lib/cta";

export const Route = createFileRoute("/explorar")({
  validateSearch: (s: Record<string, unknown>) => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: Explorar,
  head: () => ({
    meta: [
      { title: "Explorar — Turistei Urubici" },
      { name: "description", content: "Encontre pontos turísticos, hospedagens, gastronomia e mais em Urubici." },
    ],
  }),
});

function Explorar() {
  const data = useData();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");
  const cat = search.cat;

  const filtrados = useMemo(() => {
    return data.locais
      .filter(isLocalPublico)
      .filter((l) => (cat ? l.categoria === cat : true))
      .filter((l) =>
        q ? `${l.nome} ${l.descricaoCurta}`.toLowerCase().includes(q.toLowerCase()) : true,
      )
      .sort((a, b) => a.ordem - b.ordem);
  }, [data.locais, cat, q]);

  const categoriasAtivas = data.categorias.filter((c) => c.ativo);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="border-b border-border bg-soft-gradient">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-14">
          <h1 className="font-display text-3xl md:text-5xl font-semibold">Explorar Urubici</h1>
          <p className="mt-2 text-muted-foreground">Filtre por categoria ou busque pelo nome do local.</p>

          <div className="mt-5 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                navigate({ search: (s: any) => ({ ...s, q: e.target.value || undefined }), replace: true });
              }}
              placeholder="Buscar por nome…"
              className="w-full rounded-full border border-input bg-background pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mt-6 flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1 md:overflow-visible md:mx-0 md:px-0">
            <button
              onClick={() => navigate({ search: (s: any) => ({ ...s, cat: undefined }), replace: true })}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold border transition-bounce hover:scale-[1.03] active:scale-95 ${
                !cat
                  ? "bg-primary-gradient text-primary-foreground border-transparent shadow-elegant"
                  : "bg-card border-border hover:border-primary/60 hover:shadow-soft"
              }`}
            >
              Todos
            </button>
            {categoriasAtivas.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate({ search: (s: any) => ({ ...s, cat: c.slug }), replace: true })}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold border transition-bounce hover:scale-[1.03] active:scale-95 ${
                  cat === c.slug
                    ? "bg-primary-gradient text-primary-foreground border-transparent shadow-elegant"
                    : "bg-card border-border hover:border-primary/60 hover:shadow-soft"
                }`}
              >
                {c.nome}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl w-full px-4 md:px-6 py-10 flex-1">
        {filtrados.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">Nenhum local encontrado com esses filtros.</div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-4">{filtrados.length} resultado(s)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtrados.map((l) => (
                <LocalCard key={l.id} local={l} />
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
      <ElzaWidget />
    </div>
  );
}
