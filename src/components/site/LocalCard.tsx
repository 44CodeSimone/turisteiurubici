import { Link } from "@tanstack/react-router";
import { MapPin, Star, Crown } from "lucide-react";
import type { Local } from "@/data/mock";
import { getCategoria } from "@/data/mock";

export function LocalCard({ local }: { local: Local }) {
  const cat = getCategoria(local.categoria);
  const isPremium = local.plano === "premium";

  return (
    <Link
      to="/local/$slug"
      params={{ slug: local.slug }}
      className="group relative block overflow-hidden rounded-3xl border border-border/70 bg-card hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={local.imagens[0]}
          alt={local.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-110 group-hover:brightness-105"
        />
        {/* Gradient overlay at bottom for legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-foreground shadow-soft">
              <Crown className="h-3 w-3 fill-current" /> Premium
            </span>
          )}
          {local.destaque && !isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold-foreground shadow-soft">
              <Star className="h-3 w-3 fill-current" /> Destaque
            </span>
          )}
        </div>

        {/* Top-right category */}
        <span className="absolute right-3 top-3 rounded-full glass px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm">
          {cat?.nome}
        </span>

        {/* Title overlaid for hero feel */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-lg md:text-xl font-semibold text-white drop-shadow-md leading-tight">
            {local.nome}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-white/85">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{local.endereco}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {local.descricaoCurta}
        </p>
        <div className="mt-3 inline-flex items-center text-xs font-semibold text-primary opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          Ver detalhes →
        </div>
      </div>
    </Link>
  );
}
