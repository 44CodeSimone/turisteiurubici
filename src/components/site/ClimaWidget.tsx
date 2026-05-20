// Widget de clima — fallback elegante quando não há API.
import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSnow, CloudFog } from "lucide-react";

export interface ClimaInfo {
  temperatura: number;
  condicao: string;
  cidade: string;
}

// Estimativa típica de Urubici (média anual ~14°C). Substitua por API quando disponível.
const FALLBACK: ClimaInfo = {
  temperatura: 14,
  condicao: "tempo serrano",
  cidade: "Urubici, SC",
};

async function fetchClima(): Promise<ClimaInfo | null> {
  try {
    const r = await fetch("/api/public/clima");
    if (!r.ok) return null;
    const j = await r.json();
    if (j?.error) return null;
    return { temperatura: j.temperatura, condicao: j.condicao, cidade: j.cidade };
  } catch {
    return null;
  }
}

function iconePara(c: string) {
  const s = c.toLowerCase();
  if (s.includes("chuva")) return CloudRain;
  if (s.includes("neve")) return CloudSnow;
  if (s.includes("neblina") || s.includes("serrano")) return CloudFog;
  if (s.includes("nublado")) return Cloud;
  return Sun;
}

interface Props {
  variant?: "hero" | "compact";
}

export function ClimaWidget({ variant = "compact" }: Props) {
  const [clima, setClima] = useState<ClimaInfo>(FALLBACK);

  useEffect(() => {
    let alive = true;
    fetchClima().then((c) => {
      if (alive && c) setClima(c);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

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
