import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import * as Icons from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ClimaWidget } from "@/components/site/ClimaWidget";
import { ElzaWidget } from "@/components/site/ElzaWidget";
import { LocalCard } from "@/components/site/LocalCard";
import { useData } from "@/data/store";
import { isLocalPublico } from "@/lib/cta";
import heroImg from "@/assets/hero-urubici.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const data = useData();
  const ativos = data.locais.filter((l) => l.ativo).sort((a, b) => a.ordem - b.ordem);
  const destaques = ativos.filter((l) => l.destaque).slice(0, 6);
  const gastronomia = ativos.filter((l) => l.categoria === "gastronomia").slice(0, 3);
  const hospedagem = ativos.filter((l) => l.categoria === "hospedagem").slice(0, 3);
  const eventosAtivos = data.eventos.filter((e) => e.ativo);
  const bannerMeio = data.banners.find((b) => b.ativo && b.posicao === "home-meio");
  const categoriasAtivas = data.categorias.filter((c) => c.ativo);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={data.config.heroImagem || heroImg}
          alt="Vista da Serra Catarinense em Urubici ao amanhecer"
          width={1920}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover scale-105 animate-fade-in"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklab, var(--primary) ${Math.round((data.config.heroOverlayOpacity ?? 0.55) * 100)}%, transparent), color-mix(in oklab, var(--secondary) ${Math.round((data.config.heroOverlayOpacity ?? 0.55) * 70)}%, transparent))`,
          }}
        />
        {/* Scrim para profundidade na parte inferior */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 via-black/15 to-transparent" />
        {/* Vinheta sutil */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.35)_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-40 lg:py-44 text-primary-foreground">
          <div className="max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-medium tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" />
              Serra Catarinense • Brasil
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.02] tracking-tight drop-shadow-md">
              {data.config.heroTitulo || "Descubra Urubici em um só lugar"}
            </h1>
            <p className="mt-6 text-base md:text-xl max-w-2xl opacity-95 leading-relaxed font-light">
              {data.config.heroSubtitulo || data.config.textoHome}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/explorar"
                search={{ cat: undefined, q: undefined } as any}
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-4 text-sm font-semibold text-gold-foreground shadow-elegant transition-bounce hover:scale-105 hover:shadow-glow active:scale-95"
              >
                Explorar a cidade <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/empresas"
                className="inline-flex items-center gap-2 rounded-full glass-dark px-7 py-4 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-white/20"
              >
                Divulgar meu negócio
              </Link>
            </div>
            <div className="mt-10">
              <ClimaWidget variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-14 md:py-20">
        <div className="mb-8 md:mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Explore por categoria</h2>
          <p className="mt-2 text-muted-foreground">Tudo o que Urubici tem a oferecer, organizado para você.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categoriasAtivas.map((c, i) => {
            const Icon = (Icons as any)[c.icon] ?? Icons.MapPin;
            return (
              <Link
                key={c.slug}
                to="/explorar"
                search={{ cat: c.slug } as any}
                style={{ animationDelay: `${i * 40}ms` }}
                className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border/70 bg-card p-5 md:p-6 text-center hover-lift active:scale-[0.98] animate-scale-in overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary-gradient opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary transition-bounce group-hover:bg-primary-gradient group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="relative text-sm font-semibold leading-tight">{c.nome}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold flex items-center gap-2">
                <Star className="h-7 w-7 text-gold fill-gold" /> Em destaque
              </h2>
              <p className="mt-2 text-muted-foreground">Os lugares mais procurados de Urubici neste momento.</p>
            </div>
            <Link to="/explorar" search={{ cat: undefined, q: undefined } as any} className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-smooth">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {destaques.map((l) => (
              <LocalCard key={l.id} local={l} />
            ))}
          </div>
        </section>
      )}

      {/* Banner do meio */}
      {bannerMeio && (
        <section className="mx-auto max-w-7xl px-4 md:px-6 py-6">
          <a
            href={bannerMeio.link ?? "#"}
            className="block relative overflow-hidden rounded-3xl shadow-elegant aspect-[21/9] sm:aspect-[3/1]"
          >
            <img src={bannerMeio.imagem} alt={bannerMeio.titulo} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-10 text-primary-foreground max-w-xl">
              <h3 className="font-display text-2xl md:text-4xl font-semibold">{bannerMeio.titulo}</h3>
              {bannerMeio.subtitulo && <p className="mt-2 opacity-90">{bannerMeio.subtitulo}</p>}
            </div>
          </a>
        </section>
      )}

      <SectionStrip titulo="Sabores da Serra" subtitulo="Restaurantes, cafés e culinária local." locais={gastronomia} />
      <SectionStrip titulo="Onde se hospedar" subtitulo="Pousadas e chalés acolhedores." locais={hospedagem} />

      {/* Eventos */}
      {eventosAtivos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
          <div className="mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-semibold">Agenda e eventos</h2>
            <p className="mt-1 text-muted-foreground text-sm">O que está acontecendo em Urubici.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eventosAtivos.map((e) => (
              <article key={e.id} className="rounded-2xl border border-border bg-card overflow-hidden card-hover">
                {e.imagem && <img src={e.imagem} alt={e.nome} className="aspect-[16/9] w-full object-cover bg-muted" />}
                <div className="p-4">
                  <div className="text-xs text-muted-foreground">
                    {new Date(e.data + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                    {e.horario && ` • ${e.horario}`}
                  </div>
                  <h3 className="font-display text-lg font-semibold mt-1">{e.nome}</h3>
                  {e.local && <div className="text-xs text-muted-foreground mt-0.5">{e.local}</div>}
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{e.descricao}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
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
              Apareça para turistas e moradores no momento certo. Tenha página própria, contato direto pelo WhatsApp e destaque por categoria.
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

      {/* FAQ dinâmico */}
      {data.config.faq.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 md:px-6 py-10 md:py-16">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-center">Perguntas frequentes</h2>
          <div className="mt-8 space-y-3">
            {data.config.faq.map((f) => (
              <details key={f.id} className="group rounded-2xl border border-border bg-card p-5 transition-smooth open:shadow-soft">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium">
                  {f.pergunta}
                  <span className="text-primary transition-bounce group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.resposta}</p>
              </details>
            ))}
          </div>
        </section>
      )}

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
