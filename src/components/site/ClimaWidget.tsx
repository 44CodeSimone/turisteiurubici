// Widget de clima.
// Estrutura preparada para integrar com OpenWeather (ou similar) no futuro.
// Hoje usa dados mock — bastará trocar a função fetchClima.

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, CloudFog, Loader2 } from "lucide-react";

export interface ClimaInfo {
  temperatura: number;
  condicao: string;
  min: number;
  max: number;
  cidade: string;
}

const MOCK_CLIMA: ClimaInfo = {
  temperatura: 14,
  condicao: "parcialmente nublado",
  min: 8,
  max: 19,
  cidade: "Urubici, SC",
};

// Hook substituível: troque por fetch real quando houver API key.
async function fetchClima(): Promise<ClimaInfo> {
  // TODO: integrar com OpenWeather usando edge function ou API pública.
  // Exemplo: const r = await fetch(`/api/public/clima`); return await r.json();
  return new Promise((res) => setTimeout(() => res(MOCK_CLIMA), 300));
}

function iconePara(c: string) {
  const s = c.toLowerCase();
  if (s.includes("chuva")) return CloudRain;
  if (s.includes("neve")) return CloudSnow;
  if (s.includes("neblina")) return CloudFog;
  if (s.includes("nublado")) return s.includes("parcialmente") ? Cloud : CloudFog;
  return Sun;
}

interface Props {
  variant?: "hero" | "compact";
}

export function ClimaWidget({ variant = "compact" }: Props) {
  const [clima, setClima] = useState<ClimaInfo | null>(null);

  useEffect(() => {
    let alive = true;
    fetchClima().then((c) => alive && setClima(c));
    return () => {
      alive = false;
    };
  }, []);

  if (!clima) {
    if (variant === "hero") {
      return (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl text-primary-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Carregando clima…</span>
        </div>
      );
    }
    return null;
  }

  const Icon = iconePara(clima.condicao);

  if (variant === "hero") {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl text-primary-foreground shadow-glow">
        <Icon className="h-6 w-6 text-gold" />
        <div className="leading-tight">
          <div className="text-2xl font-display font-semibold">{clima.temperatura}°C</div>
          <div className="text-xs opacity-90 capitalize">{clima.condicao} · {clima.cidade}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
      <Icon className="h-4 w-4 text-secondary" />
      <span className="font-medium">{clima.temperatura}°</span>
      <span className="text-muted-foreground capitalize">{clima.condicao}</span>
    </div>
  );
}
