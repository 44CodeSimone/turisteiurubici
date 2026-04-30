import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Cloud, MapPin, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ClimaWidget } from "@/components/site/ClimaWidget";
import { ElzaWidget } from "@/components/site/ElzaWidget";
import { LocalCard } from "@/components/site/LocalCard";
import { categorias, getLocaisDestaque, getLocaisPorCategoria } from "@/data/mock";
import heroImg from "@/assets/hero-urubici.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const destaques = getLocaisDestaque().slice(0, 6);
  const gastronomia = getLocaisPorCategoria("gastronomia").slice(0, 3);
  const hospedagem = getLocaisPorCategoria("hospedagem").slice(0, 3);
  const eventos = getLocaisPorCategoria("eventos");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Vista da Serra Catarinense em Urubici ao amanhecer"
          width={1920}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-36 text-primary-foreground">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3.5 py-1.5 text-xs font-medium border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Serra Catarinense • Brasil
            </span>
            <h1 className="mt-5 font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05]">
              Descubra Urubici<br />em um só lugar
            </h1>
            <p className="mt-5 text-base md:text-lg max-w-xl opacity-95 leading-relaxed">
              O Turistei Urubici reúne pontos turísticos, hospedagens, gastronomia, eventos e
              experiências locais — conectando turistas, moradores e negócios.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/explorar"
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3.5 text-sm font-semibold text-gold-foreground shadow-elegant transition-bounce hover:scale-105 active:scale-95"
              >
                Explorar a cidade <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/empresas"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-white/20"
              >
                Divulgar meu negócio
              </Link>
            </div>
            <div className="mt-8">
              <ClimaWidget variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Explore por categoria</h2>
            <p className="mt-2 text-muted-foreground">Tudo o que Urubici tem a oferecer, organizado para você.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categorias.map((c) => {
            const Icon = (Icons as any)[c.icon] ?? Icons.MapPin;
            return (
              <Link
                key={c.slug}
                to="/explorar"
                search={{ cat: c.slug } as any}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 md:p-5 text-center card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary transition-bounce group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium leading-tight">{c.nome}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold flex items-center gap-2">
              <Star className="h-7 w-7 text-gold fill-gold" /> Em destaque
            </h2>
            <p className="mt-2 text-muted-foreground">Os lugares mais procurados de Urubici neste momento.</p>
          </div>
          <Link to="/explorar" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-smooth">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destaques.map((l) => (
            <LocalCard key={l.id} local={l} />
          ))}
        </div>
      </section>

      {/* Gastronomia */}
      <SectionStrip
        titulo="Sabores da Serra"
        subtitulo="Restaurantes, cafés e culinária local."
        locais={gastronomia}
      />

      {/* Hospedagem */}
      <SectionStrip
        titulo="Onde se hospedar"
        subtitulo="Pousadas e chalés acolhedores."
        locais={hospedagem}
      />

      {/* Eventos */}
      {eventos.length > 0 && (
        <SectionStrip titulo="Agenda e eventos" subtitulo="O que está acontecendo em Urubici." locais={eventos} />
      )}

      {/* CTA empresas */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary-gradient p-8 md:p-14 text-primary-foreground shadow-elegant">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Para empresas
            </span>
            <h3 className="mt-4 font-display text-3xl md:text-4xl font-semibold">
              Divulgue seu negócio no Turistei Urubici
            </h3>
            <p className="mt-3 opacity-90 leading-relaxed">
              Apareça para turistas e moradores no momento certo. Tenha página própria, contato
              direto pelo WhatsApp e destaque por categoria.
            </p>
            <Link
              to="/empresas"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-gold-foreground shadow-soft transition-bounce hover:scale-105"
            >
              Conhecer planos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ rápido */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10 md:py-16">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center">Perguntas frequentes</h2>
        <div className="mt-8 space-y-3">
          {[
            { q: "Qual é a melhor época para visitar Urubici?", a: "O inverno (junho a agosto) é o mais procurado pelo frio intenso e neve ocasional. Primavera e verão também são ótimos pelas cachoeiras cheias e lavandas em flor." },
            { q: "Como me locomovo entre os pontos turísticos?", a: "A maioria dos atrativos exige carro próprio ou contratação de transfer/turismo receptivo. Algumas estradas são de chão." },
            { q: "Como cadastro meu negócio?", a: "Acesse a página 'Para empresas' e escolha o plano ideal. Em seguida nossa equipe entra em contato." },
          ].map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card p-5 transition-smooth open:shadow-soft">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium">
                {f.q}
                <span className="text-primary transition-bounce group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
      <ElzaWidget />
    </div>
  );
}

function SectionStrip({ titulo, subtitulo, locais }: { titulo: string; subtitulo: string; locais: any[] }) {
  if (!locais.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
      <div className="mb-6">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">{titulo}</h2>
        <p className="mt-1 text-muted-foreground text-sm">{subtitulo}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {locais.map((l) => (
          <LocalCard key={l.id} local={l} />
        ))}
      </div>
    </section>
  );
}
