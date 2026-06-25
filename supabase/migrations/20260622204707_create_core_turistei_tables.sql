-- Core Turistei data tables: categorias, locais, eventos

CREATE TABLE public.categorias (
  slug TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'MapPin',
  descricao TEXT NOT NULL DEFAULT '',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.locais (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL REFERENCES public.categorias(slug) ON UPDATE CASCADE,
  descricao_curta TEXT NOT NULL DEFAULT '',
  descricao TEXT NOT NULL DEFAULT '',
  endereco TEXT NOT NULL DEFAULT '',
  bairro TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  whatsapp TEXT,
  telefone TEXT,
  instagram TEXT,
  site TEXT,
  email TEXT,
  horario TEXT,
  imagens TEXT[] NOT NULL DEFAULT '{}',
  destaque BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,
  plano TEXT NOT NULL DEFAULT 'presenca',
  ordem INTEGER NOT NULL DEFAULT 0,
  dificuldade TEXT,
  valor_entrada TEXT,
  melhor_epoca TEXT,
  cuidados TEXT,
  estrutura TEXT,
  cta_tipo TEXT,
  cta_texto TEXT,
  cta_mensagem TEXT,
  status_contrato TEXT,
  validade_contrato DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT locais_plano_check
    CHECK (plano IN ('presenca', 'destaque', 'premium')),

  CONSTRAINT locais_dificuldade_check
    CHECK (dificuldade IS NULL OR dificuldade IN ('facil', 'moderada', 'dificil')),

  CONSTRAINT locais_cta_tipo_check
    CHECK (cta_tipo IS NULL OR cta_tipo IN ('whatsapp', 'reserva', 'orcamento', 'disponibilidade', 'agendamento')),

  CONSTRAINT locais_status_contrato_check
    CHECK (status_contrato IS NULL OR status_contrato IN ('ativo', 'pendente', 'vencido', 'suspenso', 'cancelado'))
);

CREATE TABLE public.eventos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  data DATE NOT NULL,
  horario TEXT,
  local TEXT,
  imagem TEXT,
  link TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categorias_ativo_ordem ON public.categorias (ativo, ordem);
CREATE INDEX idx_locais_ativo_ordem ON public.locais (ativo, ordem);
CREATE INDEX idx_locais_categoria_ativo ON public.locais (categoria, ativo);
CREATE INDEX idx_locais_destaque_ativo ON public.locais (destaque, ativo);
CREATE INDEX idx_eventos_ativo_data ON public.eventos (ativo, data);

CREATE TRIGGER update_categorias_updated_at
BEFORE UPDATE ON public.categorias
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_locais_updated_at
BEFORE UPDATE ON public.locais
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at
BEFORE UPDATE ON public.eventos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categorias"
ON public.categorias FOR SELECT
TO anon, authenticated
USING (ativo = true);

CREATE POLICY "Admins can manage categorias"
ON public.categorias FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active locais"
ON public.locais FOR SELECT
TO anon, authenticated
USING (ativo = true);

CREATE POLICY "Admins can manage locais"
ON public.locais FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active eventos"
ON public.eventos FOR SELECT
TO anon, authenticated
USING (ativo = true);

CREATE POLICY "Admins can manage eventos"
ON public.eventos FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
