import { Link } from "@tanstack/react-router";
import { MapPin, Star, Crown, MessageCircle } from "lucide-react";
import type { Local } from "@/data/types";
import { getCategoria } from "@/data/repo";
import { ctaWhatsappUrl, getCtaConfig } from "@/lib/cta";

export function LocalCard({ local }: { local: Local }) {
  const cat = getCategoria(local.categoria);
  const isPremium = local.plano === "premium";
  const ctaUrl = ctaWhatsappUrl(local);
  const { texto: ctaTexto } = getCtaConfig(local);

  return (
    <div className="group relative block overflow-hidden rounded-3xl border border-border/70 bg-card hover-lift">
      <Link
        to="/local/$slug"
        params={{ slug: local.slug }}
        className="block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={local.imagens[0]}
            alt={local.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-110 group-hover:brightness-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

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

          <span className="absolute right-3 top-3 rounded-full glass px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm">
            {cat?.nome}
          </span>

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

        <div className="p-4 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {local.descricaoCurta}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4 flex items-center justify-between gap-2">
        <Link
          to="/local/$slug"
          params={{ slug: local.slug }}
          className="text-xs font-semibold text-primary hover:gap-2 transition-all"
        >
          Ver detalhes →
        </Link>
        {ctaUrl && (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-[11px] font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth"
          >
            <MessageCircle className="h-3 w-3" /> {ctaTexto}
          </a>
        )}
      </div>
    </div>
  );
}
