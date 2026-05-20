import { createFileRoute } from "@tanstack/react-router";

// Coordenadas de Urubici, SC
const LAT = -28.0153;
const LON = -49.5925;

let cache: { at: number; data: any } | null = null;
const TTL_MS = 10 * 60 * 1000; // 10 minutos

function traduzir(main: string, desc: string): string {
  const m = main.toLowerCase();
  if (m.includes("rain") || m.includes("drizzle")) return "chuva";
  if (m.includes("snow")) return "neve";
  if (m.includes("cloud")) return "nublado";
  if (m.includes("clear")) return "céu limpo";
  if (m.includes("mist") || m.includes("fog") || m.includes("haze")) return "neblina";
  if (m.includes("thunder")) return "tempestade";
  return desc || "tempo serrano";
}

export const Route = createFileRoute("/api/public/clima")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        if (cache && now - cache.at < TTL_MS) {
          return Response.json(cache.data, {
            headers: { "Cache-Control": "public, max-age=600" },
          });
        }
        const key = process.env.OPENWEATHER_API_KEY;
        if (!key) {
          return Response.json({ error: "missing_key" }, { status: 500 });
        }
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&lang=pt_br&appid=${key}`;
          const r = await fetch(url);
          if (!r.ok) {
            return Response.json({ error: "upstream", status: r.status }, { status: 502 });
          }
          const j: any = await r.json();
          const data = {
            temperatura: Math.round(j.main?.temp ?? 14),
            condicao: traduzir(j.weather?.[0]?.main ?? "", j.weather?.[0]?.description ?? ""),
            cidade: "Urubici, SC",
            atualizadoEm: new Date().toISOString(),
          };
          cache = { at: now, data };
          return Response.json(data, {
            headers: { "Cache-Control": "public, max-age=600" },
          });
        } catch (e) {
          return Response.json({ error: "fetch_failed" }, { status: 502 });
        }
      },
    },
  },
});
