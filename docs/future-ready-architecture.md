# Turistei Urubici — Arquitetura Preparada para o Futuro

> Documento de referência arquitetural. Não altera código, rotas, banco de dados ou lógica de negócio.
> Última revisão: junho de 2026.

---

## 1. Contexto e fases do produto

### Fase atual — Portal de Turismo + Diretório de Negócios + Planos de Visibilidade Paga

O projeto em produção é um portal de turismo para Urubici (SC) construído com:

- **Frontend & rotas:** TanStack Start (React 19 + TanStack Router), Tailwind CSS v4, Radix UI / shadcn.
- **Backend serverless:** Supabase (Auth, Postgres, Edge Functions).
- **IA:** Elza — assistente turística via Supabase Edge Function `elza-chat`.
- **Admin:** painel interno (`/admin/*`) com gestão de locais, planos, banners, eventos, categorias e config.
- **Deploy:** Cloudflare (Vite plugin + Nitro).

O modelo de negócio atual é **visibilidade paga**: empresas locais pagam por um plano (`presenca | destaque | premium`) e ganham presença no portal, posicionamento e um botão CTA configurável (WhatsApp, reserva, orçamento etc.).

Não há transações financeiras, reservas ou marketplace nesta fase.

### Fase futura — Marketplace de Turismo

Em algum momento futuro, o portal pode evoluir para um marketplace onde o próprio portal intermediará reservas, pagamentos e comissões entre turistas e anunciantes.

**Regra inviolável:** nenhuma implementação de marketplace deve começar sem aprovação explícita. Este documento é um guia de preparação, não uma ordem de execução.

---

## 2. O que existe hoje (inventário técnico)

### 2.1 Tipos de domínio (`src/data/types.ts`)

| Entidade | Campos relevantes para o futuro |
|---|---|
| `Local` | `plano`, `statusContrato`, `validadeContrato`, `ctaTipo`, `ctaMensagem`, `whatsapp` |
| `PlanoItem` | `nome`, `valor`, `beneficios`, `destaque`, `ativo` |
| `Config` | `whatsapp`, `email`, contatos e textos da plataforma |
| `Evento` | entidade independente, sem vínculo de ownership ainda |
| `Banner` | entidade independente, sem pagamento vinculado |

### 2.2 Rotas públicas

| Rota | Função |
|---|---|
| `/` | Home — destaques, categorias, strip gastronomia/hospedagem, eventos, CTA para empresas |
| `/explorar` | Busca + filtro por categoria |
| `/local/$slug` | Página individual do local com galeria, mapa e CTA |
| `/empresas` | Landing page de vendas — benefícios + planos comerciais |
| `/privacidade`, `/termos` | Páginas legais |
| `/login` | Autenticação admin |

### 2.3 Rotas admin (`/admin/*`)

`/admin/`, `/admin/empresas`, `/admin/pontos`, `/admin/banners`, `/admin/categorias`, `/admin/eventos`, `/admin/planos`, `/admin/config`

### 2.4 Supabase — schema atual

Tabelas: `profiles`, `user_roles`
Enum: `app_role` → `admin | empresa | user`
Função: `has_role(user_id, role)`
Edge Function: `elza-chat`

O role `empresa` já existe no enum mas não tem RLS ou painel próprio ainda.

### 2.5 Estado e persistência

- Dados de locais: `repo.ts` + `store.ts` (Zustand-like, hidrando do localStorage / Supabase).
- Demais entidades (eventos, banners, planos, config): localStorage por enquanto.
- Migração para Supabase dos locais: planejada na Fase 1 do plano Lovable.

---

## 3. O que deve ser preservado agora

Estes elementos são a fundação. Nada deve ser removido ou refatorado sem necessidade técnica explícita.

- Todos os tipos em `src/data/types.ts`, especialmente `Plano`, `StatusContrato`, `CtaTipo`.
- A função `isLocalPublico()` em `src/lib/cta.ts` — regra central de visibilidade.
- O campo `plano` no tipo `Local` — é a bridge entre o portal atual e o futuro billing.
- O role `empresa` no enum `app_role` do Supabase — base para o painel do anunciante.
- O campo `whatsapp` e a lógica de `ctaWhatsappUrl()` — CTA atual que não será substituído, apenas complementado.
- A estrutura de rotas atual — nenhuma rota deve ser alterada ou renomeada para acomodar marketplace.
- A ElzaWidget e a Edge Function `elza-chat` — componente estratégico de diferenciação.
- O campo `validadeContrato` / `statusContrato` — base para futura automação de renovação.
- O `profiles` e `user_roles` no Supabase — base para ownership e painel do anunciante.

---

## 4. O que deve ser preparado agora (sem implementar)

Estas são decisões de design que devem guiar cada nova linha de código, mas não requerem implementação antecipada.

### 4.1 Ownership de anunciante

O campo `user_id` (owner) já está previsto como passo seguinte no plano Lovable. Quando adicionado à tabela `locais`, deve ser uma coluna nullable — sem obrigatoriedade retroativa — e coberta por RLS que permita ao próprio anunciante editar apenas seus locais.

Preparação: a coluna deve ser adicionada sem `NOT NULL` e sem quebrar nenhum fluxo admin existente.

### 4.2 Painel do anunciante

As rotas `/meu-negocio/*` ou similar (a definir) devem ser criadas como novas rotas, sem alterar `/admin/*`. O admin sempre vê tudo; o anunciante vê apenas o próprio local.

Preparação: o role `empresa` já existe. A criação de conta de anunciante é o próximo passo natural após o painel admin estar estável.

### 4.3 Billing e renovação

O `PlanoItem` já tem `valor` como string livre ("Sob consulta"). Quando billing for implementado, este campo deve ganhar um equivalente numérico (`valorCentavos: number`) sem remover o `valor` textual (usado na UI de vendas).

Preparação: nunca usar `valor` para cálculos. Qualquer lógica futura de cobrança deve usar uma coluna separada.

### 4.4 Stripe / gateway

Quando pagamentos forem implementados, devem ser uma Edge Function separada (`stripe-webhook`, `create-checkout`) sem tocar nas funções existentes (`elza-chat`).

Preparação: manter a Edge Function `elza-chat` isolada e sem acoplamento a billing.

### 4.5 Slugs canônicos

Os slugs de `/local/$slug` são URLs públicas e podem ser indexadas pelo Google. Nunca altere um slug de local já publicado sem redirect. O campo `slug` deve ser tratado como imutável após a primeira publicação.

---

## 5. O que deve ser adiado

Estes itens têm valor estratégico mas não devem ser iniciados até aprovação explícita.

| Item | Motivo do adiamento |
|---|---|
| Sistema de reservas (booking engine) | Requer gateway, calendário de disponibilidade, notificações — escopo independente |
| Pagamentos de turista para anunciante | Requer KYC, integração Stripe Connect ou similar, compliance fiscal |
| Comissões e repasses (payouts) | Depende de pagamentos estar funcional e auditado |
| Avaliações e reviews | Requer autenticação de turista, moderação, potencial legal |
| Sistema de mensagens entre turista e anunciante | Requer infraestrutura de real-time e moderação |
| Multi-destino (outros municípios) | Requer refatoração do domínio de dados para incluir `cidade/região` |
| App nativo (iOS/Android) | O PWA atual é suficiente para validação de mercado |

---

## 6. O que não deve ser removido

Mesmo que pareça desnecessário agora, estes elementos têm papel no roadmap futuro e não devem ser deletados.

- `app_role: "empresa"` no enum do Supabase — base do painel do anunciante.
- `Local.plano` — campo que conecta o local ao modelo de monetização.
- `Local.statusContrato` / `Local.validadeContrato` — infraestrutura para renovação e inadimplência.
- `Local.ctaTipo` / `Local.ctaMensagem` — quando houver reservas nativas, o CTA evolui para integrar o booking, não substituir o WhatsApp.
- A rota `/empresas` e os `PlanoItem` — landing page de vendas ativa; base para futura gestão de assinaturas.
- A função `has_role()` no Supabase — será usada em toda RLS futura.
- O componente `ElzaWidget` — futuramente pode auxiliar no processo de reserva (ex.: "Elza, reservar para amanhã").

---

## 7. O que pode ser importado do projeto Turistei legado

O projeto legado (backend antigo) contém lógica de negócio útil como referência conceitual. O que pode ser aproveitado como inspiração — não como código para copiar diretamente:

| Conceito legado | Como aproveitar no futuro |
|---|---|
| Modelo de orders/reservas | Base para o schema da tabela `reservas` no Supabase |
| Regras de comissão por plano | Referência para a tabela `commission_rules` |
| Lógica de payout | Referência para a integração com Stripe Connect ou PIX automático |
| Modelo de ownership (anunciante ↔ local) | Referência para RLS de `locais` por `user_id` |
| Fluxo de aprovação de cadastro | Referência para o workflow admin de onboarding de anunciantes |
| Regras de visibilidade por plano | Já parcialmente implementadas em `isLocalPublico()` — expandir, não reescrever |

---

## 8. O que deve ser descartado do backend legado

Estes elementos do projeto antigo não têm lugar na arquitetura atual e não devem ser portados.

- Qualquer ORM ou framework de backend que não seja Supabase / Edge Functions.
- Lógica de autenticação customizada — usar Supabase Auth exclusivamente.
- Modelos de dados com estrutura relacional pesada (ex.: tabelas de sessão, tokens próprios) — o Supabase já provê isso.
- Rotas de API REST próprias que dupliquem o que a PostgREST do Supabase já entrega.
- Qualquer lógica de envio de e-mail fora de Supabase Edge Functions ou um provider dedicado (ex.: Resend).
- Schemas de banco com campos que não mapeiam para os tipos em `src/data/types.ts` — o fonte da verdade de tipos é o frontend.

---

## 9. Roadmap seguro por fases

### Fase 1 — Portal estável (em andamento)

- [ ] Migrar tabela `locais` para Supabase (planejado no plano Lovable).
- [ ] CTA configurável por local — WhatsApp com mensagem pré-preenchida.
- [ ] Status de contrato (ativo/pendente/vencido/suspenso/cancelado) + trava offline.
- [ ] Admin com coluna de status e ações de reativação.
- **Output:** portal funcional, dados na nuvem, modelo de visibilidade paga operacional.

### Fase 2 — Painel do anunciante

- [ ] Criação de conta para anunciantes (role `empresa`).
- [ ] Painel `/meu-negocio` com edição do próprio local.
- [ ] RLS para anunciante ver/editar apenas seus locais.
- [ ] Notificação de vencimento de contrato (Edge Function + e-mail).
- **Output:** anunciantes autônomos, menos trabalho manual no admin.

### Fase 3 — Billing e renovação

- [ ] Integração com gateway de pagamento (Stripe ou similar).
- [ ] Checkout de plano com confirmação automática de `statusContrato`.
- [ ] Renovação automática e notificação de inadimplência.
- **Output:** receita automatizada, sem intervenção manual por contrato.

### Fase 4 — Marketplace (somente após aprovação explícita)

- [ ] Sistema de reservas com calendário de disponibilidade por local.
- [ ] Pagamento de turista (checkout Stripe).
- [ ] Comissão da plataforma + repasse automático ao anunciante (Stripe Connect ou PIX).
- [ ] Histórico de reservas para anunciante e turista.
- [ ] Elza integrada ao booking ("quero reservar para amanhã").
- **Output:** marketplace de turismo completo.

---

## 10. Princípios arquiteturais

1. **Aditividade, não substituição.** Novas features são adicionadas como novas rotas, novas tabelas, novas Edge Functions. O que funciona não é tocado.

2. **Supabase como única fonte de verdade de backend.** Sem servidores próprios, sem ORMs externos, sem APIs REST paralelas.

3. **Tipos TypeScript como contrato.** `src/data/types.ts` é o schema de fato. Qualquer nova tabela no Supabase deve ter um tipo TypeScript correspondente.

4. **RLS para tudo que é dado de anunciante.** Nunca confiar no frontend para filtrar dados sensíveis de billing ou ownership.

5. **Elza é produto, não feature.** O widget de IA é diferenciador competitivo. Qualquer evolução deve ampliar suas capacidades (ex.: integrar com booking), não reduzi-las.

6. **SEO é infraestrutura.** Slugs são imutáveis após publicação. Meta tags existem em todas as rotas públicas. PWA e sitemap são mantidos.

7. **Sem marketplace sem aprovação.** Esta regra existe para proteger o produto atual: um portal de turismo bem executado vale mais que um marketplace mal implementado.

---

## 11. Diagrama conceitual de fases

```
[Fase 1 — Agora]
  Portal público (/, /explorar, /local/$slug, /empresas)
  Admin interno (/admin/*)
  Elza (IA turística)
  Supabase: Auth + locais + profiles + user_roles

        ↓ Fase 2

[Fase 2 — Painel do anunciante]
  + /meu-negocio/* (rotas novas, não tocam /admin)
  + Supabase: RLS por user_id em locais
  + Notificações de vencimento

        ↓ Fase 3

[Fase 3 — Billing]
  + Checkout de plano (Stripe / gateway)
  + Supabase: tabela subscriptions / invoices
  + Renovação automática

        ↓ Fase 4 (somente com aprovação)

[Fase 4 — Marketplace]
  + /reservar/$slug (nova rota)
  + Supabase: tabelas reservas, pagamentos, comissoes, payouts
  + Stripe Connect para repasse
  + Elza com contexto de booking
```

---

*Este documento deve ser revisado antes de iniciar cada nova fase. Nenhuma implementação de Fase 4 deve começar sem revisão e aprovação explícita do produto.*
