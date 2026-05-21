// Tipos de domínio do Turistei Urubici.

export type Categoria =
  | "hospedagem" | "gastronomia" | "cafes" | "pontos-turisticos"
  | "experiencias" | "comercio" | "servicos" | "saude"
  | "eventos" | "transporte" | "info";

export type Plano = "presenca" | "destaque" | "premium";

export type CtaTipo =
  | "whatsapp"
  | "reserva"
  | "orcamento"
  | "disponibilidade"
  | "agendamento";

export type StatusContrato =
  | "ativo"
  | "pendente"
  | "vencido"
  | "suspenso"
  | "cancelado";

export interface CategoriaItem {
  slug: Categoria | string;
  nome: string;
  icon: string;
  descricao: string;
  ordem: number;
  ativo: boolean;
}

export interface Local {
  id: string;
  slug: string;
  nome: string;
  categoria: string;
  descricaoCurta: string;
  descricao: string;
  endereco: string;
  bairro?: string;
  latitude: number;
  longitude: number;
  whatsapp?: string;
  telefone?: string;
  instagram?: string;
  site?: string;
  email?: string;
  horario?: string;
  imagens: string[];
  destaque: boolean;
  ativo: boolean;
  plano: Plano;
  ordem: number;
  dificuldade?: "facil" | "moderada" | "dificil";
  valorEntrada?: string;
  melhorEpoca?: string;
  cuidados?: string;
  estrutura?: string;
}

export interface Evento {
  id: string;
  nome: string;
  descricao: string;
  data: string;
  horario?: string;
  local?: string;
  imagem?: string;
  link?: string;
  ativo: boolean;
}

export interface Banner {
  id: string;
  titulo: string;
  subtitulo?: string;
  imagem: string;
  link?: string;
  posicao: "home-hero" | "home-meio" | "explorar";
  ativo: boolean;
  ordem: number;
}

export interface PlanoItem {
  id: string;
  nome: string;
  descricao: string;
  beneficios: string[];
  valor: string;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
}

export interface FAQItem {
  id: string;
  pergunta: string;
  resposta: string;
}

export interface Config {
  nomePlataforma: string;
  whatsapp: string;
  whatsappMensagem: string;
  instagram: string;
  email: string;

  // Hero
  heroTitulo: string;
  heroSubtitulo: string;
  heroImagem: string; // url ou data:base64
  heroOverlayOpacity: number; // 0..1

  // Textos
  textoHome: string;
  textoSobre: string;

  // Footer
  footerTexto: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoOgImage: string;

  faq: FAQItem[];
}

export interface DataState {
  version: number;
  categorias: CategoriaItem[];
  locais: Local[];
  eventos: Evento[];
  banners: Banner[];
  planos: PlanoItem[];
  config: Config;
}
