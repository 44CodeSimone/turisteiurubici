## Escopo desta rodada (Fase 1)

Manter tudo que funciona hoje. Adicionar 3 capacidades, sem criar contas de anunciante (fica para Fase 2).

### 1. Campos novos no `Local`

- **CTA configurável por local**
  - `ctaTipo`: `whatsapp | reserva | orcamento | disponibilidade | agendamento`
  - `ctaTexto` (texto do botão)
  - `ctaMensagem` (mensagem automática do WhatsApp)
  - `whatsapp` (já existe — reaproveitado)
- **Status de contrato**
  - `statusContrato`: `ativo | pendente | vencido | suspenso | cancelado`
  - `validadeContrato` (data ISO)
  - Cálculo automático: se `validadeContrato < hoje` e status era `ativo`, vira `vencido` em tempo de leitura.

Editáveis no `LocalForm` (admin). Anunciante logado virá na Fase 2.

### 2. Trava "offline"

Função `isLocalPublico(local)` central:
- `ativo === true` E
- `statusContrato ∈ { ativo, pendente }` (vencido/suspenso/cancelado = offline)

Aplicada em todas as listagens públicas: Home, Explorar, Empresas, destaques, busca, página `/local/$slug` (mostra 404 se offline). Admin continua vendo tudo no `/admin` com badge de status.

A página NÃO é apagada. Volta ao ar assim que admin reativa.

### 3. CTA no card e na página do local

- `LocalCard` e `local.$slug` leem `ctaTipo/ctaTexto/ctaMensagem` para montar o botão.
- WhatsApp: `https://wa.me/{whatsapp}?text={encodeURIComponent(ctaMensagem)}`.
- Demais CTAs também abrem WhatsApp por padrão, com mensagem pré-preenchida específica ("Quero reservar…", "Quero um orçamento…", etc.) — sem dependência externa.
- Plano Premium mantém vídeo + galeria ampliada + destaque visual já existentes; ganha o botão CTA configurável no topo.

### 4. Migração para Cloud (Locais)

Tabela `public.locais` espelhando o tipo `Local` (jsonb para `imagens`, colunas para campos novos). RLS:
- `SELECT` público apenas em locais publicáveis (ativo + status ativo/pendente).
- `SELECT/INSERT/UPDATE/DELETE` para `admin` (usando `has_role(auth.uid(),'admin')`).

Camada `src/data/repo.ts` reescrita para ler/escrever no Supabase. `useData()` carrega da nuvem e mantém um cache em memória; localStorage vira só fallback de SSR. Migração one-shot: na primeira carga, se a tabela estiver vazia e existir `turistei:data:v1` no localStorage, faz `upsert` em lote.

Eventos/banners/planos/categorias/config: **ficam no localStorage nesta fase** (não foram pedidos). Migro depois em outra rodada para não inchar este PR.

### 5. Painel admin

- `LocalForm` ganha bloco "Contato rápido (CTA)" e bloco "Contrato".
- `LocaisManager` mostra coluna Status com badge colorido e ação "Reativar/Suspender/Cancelar".
- Botão "Recalcular status vencidos" (roda `isVencido` e marca).

### 6. O que NÃO entra nesta rodada
- Login/painel do anunciante, ownership por user_id, RLS por dono.
- Migração de eventos/banners/config para Cloud.
- Cobrança / pagamento / renovação automática.

### Arquivos tocados
- `src/data/types.ts` (campos novos)
- `src/data/repo.ts` (Cloud) + `src/data/store.ts` (hidratação)
- `src/components/admin/LocalForm.tsx` (blocos CTA + Contrato)
- `src/components/admin/LocaisManager.tsx` (coluna status + ações)
- `src/components/site/LocalCard.tsx` (CTA dinâmico)
- `src/routes/index.tsx`, `explorar.tsx`, `empresas.tsx`, `local.$slug.tsx` (filtro `isLocalPublico`)
- `src/lib/cta.ts` (helper novo — monta link/mensagem por tipo)
- `supabase/migrations/...` (tabela `locais` + RLS + índices)

### Validação
- Criar local com `validadeContrato` no passado → some das páginas públicas, continua no admin.
- Reativar via admin → reaparece, com fotos e textos preservados.
- Botão CTA "Reservar agora" abre WhatsApp com mensagem "Olá! Quero reservar em {nome}…".
- Build ok, `/admin` ok, `/` ok, Elza ok, clima ok.

Confirma para eu rodar?