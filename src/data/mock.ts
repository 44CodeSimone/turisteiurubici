// Dados mockados estruturados como se viessem do backend.
// Estrutura preparada para futura migração para Supabase.

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

export interface CategoriaInfo {
  slug: Categoria;
  nome: string;
  icon: string;
  descricao: string;
}

export const categorias: CategoriaInfo[] = [
  { slug: "pontos-turisticos", nome: "Pontos Turísticos", icon: "Mountain", descricao: "Cachoeiras, mirantes e trilhas" },
  { slug: "hospedagem", nome: "Hospedagem", icon: "BedDouble", descricao: "Pousadas, chalés e hotéis" },
  { slug: "gastronomia", nome: "Gastronomia", icon: "UtensilsCrossed", descricao: "Restaurantes e sabores locais" },
  { slug: "cafes", nome: "Cafés", icon: "Coffee", descricao: "Cafés coloniais e cafeterias" },
  { slug: "experiencias", nome: "Experiências", icon: "Sparkles", descricao: "Passeios e vivências únicas" },
  { slug: "comercio", nome: "Comércio Local", icon: "ShoppingBag", descricao: "Lojas e produtos da região" },
  { slug: "servicos", nome: "Serviços", icon: "Wrench", descricao: "Serviços úteis na cidade" },
  { slug: "saude", nome: "Saúde e Bem-estar", icon: "HeartPulse", descricao: "Cuidados e bem-estar" },
  { slug: "eventos", nome: "Eventos", icon: "CalendarDays", descricao: "Festivais e agenda cultural" },
  { slug: "transporte", nome: "Transporte", icon: "Car", descricao: "Como se locomover" },
  { slug: "info", nome: "Informações Úteis", icon: "Info", descricao: "Dicas e contatos importantes" },
];

export type Plano = "presenca" | "destaque" | "premium";

export interface Local {
  id: string;
  slug: string;
  nome: string;
  categoria: Categoria;
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
  horario?: string;
  imagens: string[];
  destaque: boolean;
  ativo: boolean;
  plano: Plano;
  // Específico de pontos turísticos
  dificuldade?: "facil" | "moderada" | "dificil";
  valorEntrada?: string;
  melhorEpoca?: string;
  cuidados?: string;
  estrutura?: string;
}

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1200&q=80`;

export const locais: Local[] = [
  {
    id: "1",
    slug: "morro-da-igreja",
    nome: "Morro da Igreja",
    categoria: "pontos-turisticos",
    descricaoCurta: "Um dos pontos mais altos do sul do Brasil, com vista deslumbrante.",
    descricao:
      "O Morro da Igreja fica a 1.822 metros de altitude e abriga a famosa Pedra Furada, símbolo de Urubici. Vista privilegiada da Serra Catarinense, especialmente ao amanhecer e ao pôr do sol.",
    endereco: "Parque Nacional de São Joaquim, Urubici - SC",
    latitude: -28.1247,
    longitude: -49.4953,
    horario: "Diariamente, 8h às 17h",
    imagens: [img("photo-1469474968028-56623f02e42e"), img("photo-1506905925346-21bda4d32df4")],
    destaque: true,
    ativo: true,
    plano: "premium",
    dificuldade: "facil",
    valorEntrada: "Gratuito",
    melhorEpoca: "Inverno (junho a agosto) e amanheceres no inverno",
    cuidados: "Leve agasalhos, respeite a sinalização e não se aproxime das bordas.",
    estrutura: "Estacionamento, mirante e trilha curta sinalizada.",
  },
  {
    id: "2",
    slug: "cascata-vu-ventura",
    nome: "Cascata Véu de Noiva",
    categoria: "pontos-turisticos",
    descricaoCurta: "Cachoeira encantadora cercada de mata atlântica.",
    descricao:
      "Queda d'água de aproximadamente 70 metros formada pelo Rio dos Bugres. Acesso por trilha leve em meio à mata nativa, ideal para famílias.",
    endereco: "Estrada Geral do Rio dos Bugres, Urubici - SC",
    latitude: -28.0192,
    longitude: -49.5897,
    horario: "Diariamente, 8h às 18h",
    imagens: [img("photo-1432405972618-c60b0225b8f9")],
    destaque: true,
    ativo: true,
    plano: "destaque",
    dificuldade: "facil",
    valorEntrada: "Sob consulta",
    melhorEpoca: "Primavera e verão",
    cuidados: "Calçado fechado e antiderrapante.",
    estrutura: "Estacionamento, banheiros e área de descanso.",
  },
  {
    id: "3",
    slug: "pousada-serra-encantada",
    nome: "Pousada Serra Encantada",
    categoria: "hospedagem",
    descricaoCurta: "Chalés aconchegantes com vista para a serra.",
    descricao:
      "Pousada com chalés equipados, lareira, café da manhã colonial e hidromassagem. Ambiente perfeito para casais e famílias.",
    endereco: "Rod. SC-114, km 12, Urubici - SC",
    latitude: -28.0150,
    longitude: -49.5920,
    whatsapp: "5549999990001",
    instagram: "@serraencantada",
    horario: "Check-in 14h • Check-out 12h",
    imagens: [img("photo-1551882547-ff40c63fe5fa"), img("photo-1564501049412-61c2a3083791")],
    destaque: true,
    ativo: true,
    plano: "premium",
  },
  {
    id: "4",
    slug: "restaurante-sabores-da-serra",
    nome: "Restaurante Sabores da Serra",
    categoria: "gastronomia",
    descricaoCurta: "Culinária serrana autêntica em ambiente rústico.",
    descricao:
      "Especializado em truta, galeto e pratos típicos da Serra Catarinense. Vista panorâmica e atendimento familiar.",
    endereco: "Av. Adolfo Konder, 320, Centro, Urubici - SC",
    latitude: -28.0145,
    longitude: -49.5892,
    whatsapp: "5549999990002",
    horario: "Ter–Dom, 11h30 às 22h",
    imagens: [img("photo-1414235077428-338989a2e8c0")],
    destaque: true,
    ativo: true,
    plano: "destaque",
  },
  {
    id: "5",
    slug: "cafe-colonial-do-vale",
    nome: "Café Colonial do Vale",
    categoria: "cafes",
    descricaoCurta: "Café colonial completo com produtos artesanais.",
    descricao:
      "Mais de 50 itens entre pães, doces, queijos, geleias e cucas. Ambiente acolhedor com vista para o vale.",
    endereco: "Estrada Geral do Vale, s/n, Urubici - SC",
    latitude: -28.0210,
    longitude: -49.6020,
    whatsapp: "5549999990003",
    horario: "Sex–Dom, 14h às 19h",
    imagens: [img("photo-1559925393-8be0ec4767c8")],
    destaque: false,
    ativo: true,
    plano: "destaque",
  },
  {
    id: "6",
    slug: "passeio-quadriciclo-serra",
    nome: "Passeio de Quadriciclo na Serra",
    categoria: "experiencias",
    descricaoCurta: "Aventura guiada por trilhas e mirantes exclusivos.",
    descricao:
      "Roteiros de 1h a 4h conduzidos por guias locais experientes. Equipamentos de segurança inclusos.",
    endereco: "Saída: Centro de Urubici - SC",
    latitude: -28.0152,
    longitude: -49.5898,
    whatsapp: "5549999990004",
    horario: "Diariamente sob agendamento",
    imagens: [img("photo-1533873984035-25970ab07461")],
    destaque: true,
    ativo: true,
    plano: "premium",
  },
  {
    id: "7",
    slug: "lavanda-de-urubici",
    nome: "Campo de Lavanda",
    categoria: "pontos-turisticos",
    descricaoCurta: "Campos floridos perfumados e paisagem encantadora.",
    descricao:
      "Visite os campos de lavanda em flor, conheça o processo de destilação e adquira produtos artesanais.",
    endereco: "Estrada Geral, Urubici - SC",
    latitude: -28.0500,
    longitude: -49.5500,
    horario: "Setembro a fevereiro, 9h às 17h",
    imagens: [img("photo-1499002238440-d264edd596ec")],
    destaque: false,
    ativo: true,
    plano: "destaque",
    dificuldade: "facil",
    valorEntrada: "Sob consulta",
    melhorEpoca: "Floração: novembro a janeiro",
    cuidados: "Respeite as trilhas e não colha as flores.",
    estrutura: "Loja, café e estacionamento.",
  },
  {
    id: "8",
    slug: "festival-inverno-urubici",
    nome: "Festival de Inverno",
    categoria: "eventos",
    descricaoCurta: "Música, gastronomia e cultura no auge do inverno.",
    descricao:
      "Programação cultural com shows, apresentações e feira gastronômica no centro da cidade.",
    endereco: "Praça Central, Urubici - SC",
    latitude: -28.0148,
    longitude: -49.5895,
    horario: "Julho — confira programação anual",
    imagens: [img("photo-1492684223066-81342ee5ff30")],
    destaque: true,
    ativo: true,
    plano: "destaque",
  },
];

export const getLocaisDestaque = () => locais.filter((l) => l.destaque && l.ativo);
export const getLocaisPorCategoria = (cat: Categoria) =>
  locais.filter((l) => l.categoria === cat && l.ativo);
export const getLocalPorSlug = (slug: string) => locais.find((l) => l.slug === slug);
export const getCategoria = (slug: Categoria) =>
  categorias.find((c) => c.slug === slug);
