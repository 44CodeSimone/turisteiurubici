// Tipos de domínio do Turistei Urubici.
// Estrutura preparada para futura migração para Supabase (mesmas chaves).

export type Categoria =
  | "hospedagem"
  | "gastronomia"
  | "cafes"
  | "pontos-turisticos"
  | "experiencias"
  | "comercio"
  | "servicos"
  | "saude"
  | "eventos"
  | "transporte"
  | "info";

export type Plano = "presenca" | "destaque" | "premium";

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
  // Pontos turísticos
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
  data: string; // ISO yyyy-mm-dd
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
  instagram: string;
  email: string;
  textoHome: string;
  textoSobre: string;
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
