import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import type { Local } from "@/data/mock";
import { getCategoria } from "@/data/mock";

export function LocalCard({ local }: { local: Local }) {
  const cat = getCategoria(local.categoria);
  return (
    <Link
      to="/local/$slug"
      params={{ slug: local.slug }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={local.imagens[0]}
          alt={local.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-bounce group-hover:scale-105"
        />
        {local.destaque && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2.5 py-1 text-[11px] font-semibold text-gold-foreground shadow-soft">
            <Star className="h-3 w-3 fill-current" /> Destaque
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-foreground">
          {cat?.nome}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
          {local.nome}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{local.descricaoCurta}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{local.endereco}</span>
        </div>
      </div>
    </Link>
  );
}
