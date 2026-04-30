import { Cloud, CloudRain, Sun, CloudSnow, CloudFog } from "lucide-react";

// Mock estruturado — pronto para substituição por API real (OpenWeather etc.)
const mockClima = {
  temperatura: 14,
  condicao: "parcialmente nublado" as const,
  min: 8,
  max: 19,
  cidade: "Urubici, SC",
};

function iconePara(c: string) {
  if (c.includes("chuva")) return CloudRain;
  if (c.includes("neve")) return CloudSnow;
  if (c.includes("neblina") || c.includes("nublado")) return c.includes("parcialmente") ? Cloud : CloudFog;
  return Sun;
}

interface Props {
  variant?: "hero" | "compact";
}

export function ClimaWidget({ variant = "compact" }: Props) {
  const Icon = iconePara(mockClima.condicao);

  if (variant === "hero") {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl text-primary-foreground shadow-glow">
        <Icon className="h-6 w-6 text-gold" />
        <div className="leading-tight">
          <div className="text-2xl font-display font-semibold">{mockClima.temperatura}°C</div>
          <div className="text-xs opacity-90 capitalize">{mockClima.condicao} · {mockClima.cidade}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
      <Icon className="h-4 w-4 text-secondary" />
      <span className="font-medium">{mockClima.temperatura}°</span>
      <span className="text-muted-foreground capitalize">{mockClima.condicao}</span>
    </div>
  );
}
