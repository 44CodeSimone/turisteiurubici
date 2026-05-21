import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, MessageCircle, Instagram, Globe, Clock, Mountain, Calendar, ShieldAlert, Sparkles, Mail } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ElzaWidget } from "@/components/site/ElzaWidget";
import { useData } from "@/data/store";
import { getLocalPorSlug, getCategoria } from "@/data/repo";
import { googleMapsUrl, wazeUrl, whatsappUrl } from "@/lib/maps";
import { ctaWhatsappUrl, getCtaConfig, isLocalPublico } from "@/lib/cta";

export const Route = createFileRoute("/local/$slug")({
  component: Detalhes,
  loader: ({ params }) => {
    const local = getLocalPorSlug(params.slug);
    if (!local) throw notFound();
    return { local };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-semibold">Local não encontrado</h1>
          <p className="mt-2 text-muted-foreground">Esse local pode ter sido removido ou o endereço está incorreto.</p>
          <Link to="/explorar" search={{ cat: undefined, q: undefined } as any} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Voltar para Explorar
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  head: ({ loaderData }) => {
    const l = loaderData?.local;
    return {
      meta: l
        ? [
            { title: `${l.nome} — Turistei Urubici` },
            { name: "description", content: l.descricaoCurta },
            { property: "og:title", content: `${l.nome} — Turistei Urubici` },
            { property: "og:description", content: l.descricaoCurta },
            { property: "og:image", content: l.imagens[0] },
          ]
        : [],
    };
  },
});

function Detalhes() {
  const { slug } = Route.useParams();
  // Reativo: re-renderiza quando o admin altera o item.
  const data = useData();
  const local = data.locais.find((l) => l.slug === slug) ?? Route.useLoaderData().local;

  const cat = getCategoria(local.categoria);
  const isPonto = local.categoria === "pontos-turisticos";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Galeria */}
      <section className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 max-h-[480px] overflow-hidden">
          <div className="md:col-span-2 aspect-[16/10] md:aspect-auto bg-muted">
            <img src={local.imagens[0]} alt={local.nome} className="h-full w-full object-cover" />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-1">
            {[0, 1].map((i) => (
              <div key={i} className="bg-muted overflow-hidden">
                <img src={local.imagens[i + 1] ?? local.imagens[0]} alt={local.nome} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl w-full px-4 md:px-6 py-8 md:py-12 grid lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <Link to="/explorar" search={{ cat: undefined, q: undefined } as any} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-medium">{cat?.nome}</span>
            {local.destaque && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-gradient px-3 py-1 text-xs font-semibold text-gold-foreground">
                <Sparkles className="h-3 w-3" /> Destaque
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-3xl md:text-5xl font-semibold leading-tight">{local.nome}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{local.descricaoCurta}</p>

          <div className="mt-8 prose prose-sm max-w-none text-foreground/90 leading-relaxed">
            <p>{local.descricao}</p>
          </div>

          {isPonto && (
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {local.dificuldade && <InfoTile icon={Mountain} label="Dificuldade" value={local.dificuldade} />}
              {local.valorEntrada && <InfoTile icon={Calendar} label="Entrada" value={local.valorEntrada} />}
              {local.melhorEpoca && <InfoTile icon={Calendar} label="Melhor época" value={local.melhorEpoca} />}
              {local.estrutura && <InfoTile icon={Sparkles} label="Estrutura" value={local.estrutura} />}
              {local.cuidados && (
                <div className="sm:col-span-2 rounded-2xl border border-gold/40 bg-gold/10 p-4 flex gap-3">
                  <ShieldAlert className="h-5 w-5 text-gold-foreground mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-gold-foreground">Cuidados importantes</div>
                    <div className="text-sm text-foreground/85 mt-1">{local.cuidados}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </article>

        <aside className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Informações</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row icon={MapPin} text={local.endereco} />
              {local.horario && <Row icon={Clock} text={local.horario} />}
              {local.telefone && <Row icon={Phone} text={local.telefone} />}
              {local.instagram && <Row icon={Instagram} text={local.instagram} />}
              {local.email && <Row icon={Mail} text={local.email} />}
              {local.site && <Row icon={Globe} text={<a href={local.site} className="text-primary hover:underline" target="_blank" rel="noreferrer">{local.site}</a>} />}
            </dl>

            <div className="mt-5 grid gap-2">
              <a
                href={googleMapsUrl(local.latitude, local.longitude, local.nome)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-gradient px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-bounce hover:scale-[1.02] active:scale-[0.98]"
              >
                <MapPin className="h-4 w-4" /> Como chegar (Google Maps)
              </a>
              <a
                href={wazeUrl(local.latitude, local.longitude)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-medium hover:bg-accent transition-smooth"
              >
                Abrir no Waze
              </a>
              {(local.whatsapp || data.config.whatsapp) && (
                <a
                  href={whatsappUrl(local.whatsapp || data.config.whatsapp, data.config.whatsappMensagem || `Olá! Vi ${local.nome} no Turistei Urubici.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground shadow-soft transition-bounce hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <iframe
              title={`Mapa de ${local.nome}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${local.longitude - 0.02},${local.latitude - 0.02},${local.longitude + 0.02},${local.latitude + 0.02}&layer=mapnik&marker=${local.latitude},${local.longitude}`}
              className="w-full h-56 border-0"
              loading="lazy"
            />
          </div>
        </aside>
      </main>

      <Footer />
      <ElzaWidget />
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-sm font-medium mt-0.5 capitalize">{value}</div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, text }: { icon: any; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="text-foreground/85 break-words">{text}</div>
    </div>
  );
}
