import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles, TrendingUp, Smartphone, MessageCircle, MapPin, Star } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ElzaWidget } from "@/components/site/ElzaWidget";

export const Route = createFileRoute("/empresas")({
  component: Empresas,
  head: () => ({
    meta: [
      { title: "Para empresas — Turistei Urubici" },
      { name: "description", content: "Divulgue seu negócio para turistas e moradores de Urubici. Conheça nossos planos." },
      { property: "og:title", content: "Para empresas — Turistei Urubici" },
      { property: "og:description", content: "Divulgue seu negócio para turistas e moradores de Urubici." },
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

const planos = [
  {
    nome: "Presença",
    destaque: false,
    desc: "Para começar com presença digital essencial.",
    itens: ["Cadastro da empresa", "Categoria definida", "WhatsApp", "Descrição curta"],
  },
  {
    nome: "Destaque",
    destaque: true,
    desc: "O mais escolhido por quem quer ser encontrado.",
    itens: [
      "Tudo do Presença",
      "Página completa",
      "Galeria de fotos",
      "Redes sociais e site",
      "Mapa integrado",
      "Melhor posição na categoria",
    ],
  },
  {
    nome: "Premium",
    destaque: false,
    desc: "Máxima exposição para alavancar reservas.",
    itens: [
      "Tudo do Destaque",
      "Galeria ampliada",
      "Banner rotativo",
      "Destaque na página inicial",
      "Destaque em busca/categoria",
    ],
  },
];

function Empresas() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="border-b border-border bg-soft-gradient">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-16 md:py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Para empresas
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-tight">
            Divulgue seu negócio<br />no Turistei Urubici
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Apareça para turistas e moradores no momento certo — quando estão decidindo onde
            comer, dormir, passear ou comprar em Urubici.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
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

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {planos.map((p) => (
            <div
              key={p.nome}
              className={`relative flex flex-col rounded-3xl border p-7 card-hover ${
                p.destaque ? "border-primary bg-primary-gradient text-primary-foreground shadow-elegant" : "border-border bg-card"
              }`}
            >
              {p.destaque && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-semibold text-gold-foreground shadow-soft">
                  Mais escolhido
                </span>
              )}
              <h3 className={`font-display text-2xl font-semibold ${p.destaque ? "" : "text-foreground"}`}>{p.nome}</h3>
              <p className={`mt-1.5 text-sm ${p.destaque ? "opacity-90" : "text-muted-foreground"}`}>{p.desc}</p>

              <div className={`mt-5 text-3xl font-display font-semibold ${p.destaque ? "" : "text-foreground"}`}>
                Sob consulta
              </div>
              <div className={`text-xs ${p.destaque ? "opacity-80" : "text-muted-foreground"}`}>Personalizável</div>

              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {p.itens.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${p.destaque ? "text-gold" : "text-primary"}`} />
                    <span className={p.destaque ? "" : "text-foreground/85"}>{i}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/5549999990000?text=Quero+conhecer+os+planos+do+Turistei+Urubici"
                target="_blank"
                rel="noreferrer"
                className={`mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-bounce hover:scale-[1.02] ${
                  p.destaque
                    ? "bg-gold-gradient text-gold-foreground shadow-soft"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                Quero esse plano
              </a>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <ElzaWidget />
    </div>
  );
}
