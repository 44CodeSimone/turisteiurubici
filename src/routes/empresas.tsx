import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles, TrendingUp, Smartphone, MessageCircle, MapPin, Star } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ElzaWidget } from "@/components/site/ElzaWidget";
import { useData } from "@/data/store";
import { whatsappUrl } from "@/lib/maps";

export const Route = createFileRoute("/empresas")({
  component: Empresas,
  head: () => ({
    meta: [
      { title: "Para empresas — Turistei Urubici" },
      { name: "description", content: "Divulgue seu negócio para turistas e moradores de Urubici. Conheça nossos planos." },
    ],
  }),
});

const beneficios = [
  { icon: TrendingUp, title: "Mais visibilidade", desc: "Apareça para quem está planejando ou já em Urubici." },
  { icon: Smartphone, title: "Presença digital profissional", desc: "Página própria, fotos, contatos e mapa." },
  { icon: MessageCircle, title: "Contato direto pelo WhatsApp", desc: "Reduza barreiras e fale com o cliente na hora." },
  { icon: Star, title: "Destaque por categoria", desc: "Posições privilegiadas em buscas e listas." },
  { icon: MapPin, title: "Como chegar integrado", desc: "Google Maps e Waze em um clique." },
  { icon: Sparkles, title: "Pronto para evolução", desc: "Reservas, vendas e marketplace no futuro." },
];

function Empresas() {
  const data = useData();
  const planos = data.planos.filter((p) => p.ativo).sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="border-b border-border bg-soft-gradient">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-14 md:py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Para empresas
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-tight">
            Divulgue seu negócio<br />no Turistei Urubici
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Apareça para turistas e moradores no momento certo — quando estão decidindo onde comer, dormir, passear ou comprar em Urubici.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-14 md:py-20">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center">Benefícios para o seu negócio</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beneficios.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border bg-card p-6 card-hover">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-gradient text-primary-foreground">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center">Planos comerciais</h2>
        <p className="mt-2 text-center text-muted-foreground">Escolha o plano que melhor se adapta ao seu momento.</p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 lg:gap-6 items-stretch">
          {planos.map((p, idx) => {
            const isPremium = p.destaque || /premium/i.test(p.nome);
            return (
              <div
                key={p.id}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`group relative flex flex-col rounded-3xl p-7 md:p-8 transition-all duration-500 animate-scale-in ${
                  p.destaque
                    ? "bg-primary-gradient text-primary-foreground shadow-elegant md:scale-[1.04] md:-my-2 ring-1 ring-gold/40 hover:shadow-glow"
                    : "border border-border/80 bg-card hover-lift"
                }`}
              >
                {p.destaque && (
                  <>
                    <div className="absolute -inset-px rounded-3xl bg-gold/20 blur-2xl opacity-30 -z-10" />
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold-gradient px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-foreground shadow-elegant">
                      ★ Mais escolhido
                    </span>
                  </>
                )}

                <h3 className={`font-display text-2xl font-semibold ${p.destaque ? "" : "text-foreground"}`}>{p.nome}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${p.destaque ? "opacity-90" : "text-muted-foreground"}`}>{p.descricao}</p>

                <div className={`mt-6 flex items-baseline gap-1.5 ${p.destaque ? "" : "text-foreground"}`}>
                  <span className="text-4xl font-display font-bold tracking-tight">{p.valor}</span>
                </div>
                <div className={`text-xs ${p.destaque ? "opacity-80" : "text-muted-foreground"}`}>Personalizável</div>

                <div className={`my-6 h-px ${p.destaque ? "bg-white/20" : "bg-border"}`} />

                <ul className="space-y-3 text-sm flex-1">
                  {p.beneficios.map((i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${p.destaque ? "bg-gold/30 text-gold" : "bg-primary/10 text-primary"}`}>
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className={p.destaque ? "" : "text-foreground/85"}>{i}</span>
                    </li>
                  ))}
                  {isPremium && (
                    <li className="flex items-start gap-2.5">
                      <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${p.destaque ? "bg-gold/30 text-gold" : "bg-primary/10 text-primary"}`}>
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className={p.destaque ? "" : "text-foreground/85"}>
                        <strong>Vídeo curto</strong> (até 45s) no perfil
                      </span>
                    </li>
                  )}
                </ul>

                <a
                  href={whatsappUrl(data.config.whatsapp, `Quero conhecer o plano ${p.nome} do Turistei Urubici`)}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition-bounce hover:scale-[1.03] active:scale-[0.97] ${
                    p.destaque
                      ? "bg-gold-gradient text-gold-foreground shadow-elegant"
                      : "bg-foreground text-background hover:bg-primary"
                  }`}
                >
                  Quero esse plano
                </a>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
      <ElzaWidget />
    </div>
  );
}
