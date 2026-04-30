// Seletores e mutators por entidade. API estável para páginas e admin.
import { getState, setState, genId, slugify } from "./store";
import type { Local, CategoriaItem, Evento, Banner, PlanoItem, Config } from "./types";

// ===== Categorias =====
export const listCategorias = () =>
  [...getState().categorias].sort((a, b) => a.ordem - b.ordem);

export const listCategoriasAtivas = () =>
  listCategorias().filter((c) => c.ativo);

export const getCategoria = (slug: string) =>
  getState().categorias.find((c) => c.slug === slug);

export function upsertCategoria(c: Partial<CategoriaItem> & { slug: string; nome: string }) {
  setState((s) => {
    const exists = s.categorias.find((x) => x.slug === c.slug);
    const norm: CategoriaItem = {
      slug: c.slug,
      nome: c.nome,
      icon: c.icon ?? "MapPin",
      descricao: c.descricao ?? "",
      ordem: c.ordem ?? (exists?.ordem ?? s.categorias.length + 1),
      ativo: c.ativo ?? true,
    };
    return {
      ...s,
      categorias: exists
        ? s.categorias.map((x) => (x.slug === c.slug ? norm : x))
        : [...s.categorias, norm],
    };
  });
}

export function removeCategoria(slug: string) {
  setState((s) => ({ ...s, categorias: s.categorias.filter((c) => c.slug !== slug) }));
}

// ===== Locais =====
export const listLocais = () =>
  [...getState().locais].sort((a, b) => a.ordem - b.ordem);

export const listLocaisAtivos = () => listLocais().filter((l) => l.ativo);

export const listLocaisDestaque = () =>
  listLocaisAtivos().filter((l) => l.destaque);

export const listLocaisPorCategoria = (cat: string) =>
  listLocaisAtivos().filter((l) => l.categoria === cat);

export const getLocalPorSlug = (slug: string) =>
  getState().locais.find((l) => l.slug === slug);

export function newEmptyLocal(): Local {
  return {
    id: genId("loc"),
    slug: "",
    nome: "",
    categoria: "comercio",
    descricaoCurta: "",
    descricao: "",
    endereco: "",
    bairro: "",
    latitude: -28.0145,
    longitude: -49.5892,
    whatsapp: "",
    telefone: "",
    instagram: "",
    site: "",
    email: "",
    horario: "",
    imagens: [],
    destaque: false,
    ativo: true,
    plano: "presenca",
    ordem: getState().locais.length + 1,
  };
}

export function upsertLocal(l: Local) {
  setState((s) => {
    const slug = l.slug?.trim() || slugify(l.nome);
    const final = { ...l, slug };
    const exists = s.locais.find((x) => x.id === l.id);
    return {
      ...s,
      locais: exists
        ? s.locais.map((x) => (x.id === l.id ? final : x))
        : [...s.locais, final],
    };
  });
}

export function removeLocal(id: string) {
  setState((s) => ({ ...s, locais: s.locais.filter((l) => l.id !== id) }));
}

export function toggleLocalAtivo(id: string) {
  setState((s) => ({
    ...s,
    locais: s.locais.map((l) => (l.id === id ? { ...l, ativo: !l.ativo } : l)),
  }));
}

export function toggleLocalDestaque(id: string) {
  setState((s) => ({
    ...s,
    locais: s.locais.map((l) => (l.id === id ? { ...l, destaque: !l.destaque } : l)),
  }));
}

// ===== Eventos =====
export const listEventos = () =>
  [...getState().eventos].sort((a, b) => a.data.localeCompare(b.data));

export const listEventosAtivos = () => listEventos().filter((e) => e.ativo);

export function newEmptyEvento(): Evento {
  return {
    id: genId("ev"),
    nome: "",
    descricao: "",
    data: new Date().toISOString().slice(0, 10),
    horario: "",
    local: "",
    imagem: "",
    link: "",
    ativo: true,
  };
}

export function upsertEvento(e: Evento) {
  setState((s) => {
    const exists = s.eventos.find((x) => x.id === e.id);
    return {
      ...s,
      eventos: exists ? s.eventos.map((x) => (x.id === e.id ? e : x)) : [...s.eventos, e],
    };
  });
}

export function removeEvento(id: string) {
  setState((s) => ({ ...s, eventos: s.eventos.filter((e) => e.id !== id) }));
}

// ===== Banners =====
export const listBanners = () => [...getState().banners].sort((a, b) => a.ordem - b.ordem);

export function newEmptyBanner(): Banner {
  return {
    id: genId("bn"),
    titulo: "",
    subtitulo: "",
    imagem: "",
    link: "",
    posicao: "home-meio",
    ativo: true,
    ordem: getState().banners.length + 1,
  };
}

export function upsertBanner(b: Banner) {
  setState((s) => {
    const exists = s.banners.find((x) => x.id === b.id);
    return {
      ...s,
      banners: exists ? s.banners.map((x) => (x.id === b.id ? b : x)) : [...s.banners, b],
    };
  });
}

export function removeBanner(id: string) {
  setState((s) => ({ ...s, banners: s.banners.filter((b) => b.id !== id) }));
}

// ===== Planos =====
export const listPlanos = () => [...getState().planos].sort((a, b) => a.ordem - b.ordem);

export function newEmptyPlano(): PlanoItem {
  return {
    id: genId("pl"),
    nome: "",
    descricao: "",
    beneficios: [],
    valor: "Sob consulta",
    destaque: false,
    ativo: true,
    ordem: getState().planos.length + 1,
  };
}

export function upsertPlano(p: PlanoItem) {
  setState((s) => {
    const exists = s.planos.find((x) => x.id === p.id);
    return {
      ...s,
      planos: exists ? s.planos.map((x) => (x.id === p.id ? p : x)) : [...s.planos, p],
    };
  });
}

export function removePlano(id: string) {
  setState((s) => ({ ...s, planos: s.planos.filter((p) => p.id !== id) }));
}

// ===== Config =====
export const getConfig = (): Config => getState().config;

export function updateConfig(patch: Partial<Config>) {
  setState((s) => ({ ...s, config: { ...s.config, ...patch } }));
}
