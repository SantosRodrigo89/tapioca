# Spec 01 — Visão Geral do Produto

> **Estado:** v1 concluída (jun/2026). Onboarding é **somente por convite** (Super Admin). Ver também `07-platform-evolution.md` e `08-saas-foundation.md`.

## Produto

**Mesio** é uma plataforma multi-tenant de presença digital para restaurantes — site, cardápio e gestão online em um único link público `/{slug}`.

**Slogan:** Sua presença digital começa aqui.

## Personas

| Persona | Descrição |
|---|---|
| **Admin Tenant** | Proprietário ou gerente do estabelecimento. Faz login, edita a landing page, gerencia cardápio e configurações básicas. |
| **Cliente Final** | Consumidor. Acessa `/{slug}` sem login — consulta o site, cardápio e pede via WhatsApp. |
| **Super Admin** | Operador da plataforma Mesio. Cria restaurantes, envia convites, gerencia planos, features, templates, status e auditoria. |

## Fluxos Principais

### Fluxo 1 — Onboarding de Tenant (convite)

1. Super Admin cria restaurante em `/super/restaurants/new` (wizard)
2. Sistema cria `tenants/{tenantId}` com `ownerUid` vazio, `slugIndex/{slug}` e convite em `invites/{inviteId}`
3. Admin recebe link `/auth/invite/[token]`
4. Admin aceita convite: cria conta Firebase (ou usa sessão existente), sistema seta claims `{ role: "tenant_admin", tenantId }` e preenche `ownerUid`
5. Admin é redirecionado para `/dashboard`

> Cadastro público em `/auth/signup` está **desabilitado** — redireciona para `/auth/login`. `POST /api/tenants` retorna `403 SIGNUP_DISABLED`.

### Fluxo 2 — Login de Admin

1. Admin acessa `/auth/login`
2. Preenche email e senha → Firebase Auth retorna ID token
3. Cliente chama `POST /api/auth/session` → cookie `__session`
4. Se tenant `suspended` ou `cancelled`: redirect para `/auth/account-blocked`
5. Caso contrário: redirect para `/dashboard`

### Fluxo 3 — Gestão do Cardápio

1. Admin acessa `/menu/categories`, `/menu/products` ou `/menu/highlights`
2. CRUD de categorias e produtos via painéis com dialogs (sem rotas `/edit` separadas)
3. Reordenação por drag-and-drop (`@dnd-kit`)
4. Upload de imagens (Firebase Storage)
5. Produtos com grupos de configuração (tamanho, adicionais, modo pizza)

### Fluxo 4 — Presença Digital

1. Admin acessa `/site`
2. Edita landing page em tabs: aparência, banner, sobre, diferenciais, destaques, galeria, contato, horários, SEO, QR Code
3. Alterações persistem em `tenants/{tenantId}.siteConfig` e subcollection `gallery/`

### Fluxo 5 — Landing Pública

1. Cliente acessa `/{slug}` (ex: `mesio.app/burger-house`)
2. Servidor resolve slug via Admin SDK (`slugIndex` → `tenantId`)
3. Carrega tenant, categorias, produtos, galeria e entitlements
4. Renderiza landing modular (hero, sobre, cardápio, galeria, contato, etc.)
5. Pedido via WhatsApp; itens fora do horário ficam visíveis sem CTA de pedido

### Fluxo 6 — Logout

1. Admin clica em "Sair"
2. `DELETE /api/auth/session` + `signOut()` no cliente
3. Redirect para `/auth/login`

## Status do Tenant

| Status | Descrição |
|---|---|
| `trial` | Período de avaliação; acesso completo ao painel |
| `active` | Conta ativa |
| `suspended` | Admin bloqueado (`/auth/account-blocked`); site público indisponível |
| `cancelled` | Conta encerrada; mesmo comportamento de bloqueio |

> Billing e pagamento são externos. Mudança de status via Super Admin (`PATCH /api/super/tenants/[tenantId]/status`).

## Rotas da Aplicação

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Site de marketing do Mesio |
| `/{slug}` | Público | Landing page do restaurante |
| `/auth/login` | Anônimo | Login do admin |
| `/auth/signup` | Anônimo | Redirect → `/auth/login` |
| `/auth/forgot-password` | Anônimo | Recuperação de senha |
| `/auth/invite/[token]` | Anônimo/autenticado | Aceite de convite |
| `/auth/account-blocked` | Autenticado | Conta suspensa ou cancelada |
| `/dashboard` | Admin autenticado | Centro de comando |
| `/site` | Admin autenticado | Editor de presença digital |
| `/menu/categories` | Admin autenticado | Categorias do cardápio |
| `/menu/products` | Admin autenticado | Produtos do cardápio |
| `/menu/highlights` | Admin autenticado | Destaques do cardápio |
| `/settings` | Admin autenticado | Slug, URL pública, link para `/site` |
| `/catalog` | Admin autenticado | Redirect legado → `/menu/products` |
| `/super/*` | Super Admin | Operações da plataforma (9 módulos) |
| `/termos`, `/privacidade` | Público | Páginas legais (stub) |

## Restrições e Regras de Negócio

- Isolamento por `tenantId` — admin só edita dados do próprio tenant
- Slug imutável após criação
- Items com `available: false` ou categoria `active: false` não aparecem no cardápio público
- Items fora do horário de `availability` permanecem visíveis, mas sem CTA de pedido
- Preços em centavos; exibição com `formatPrice()` (pt-BR)
- Imagens: `image/*`, máx. 5 MB
- Sem billing, analytics real ou checkout no app (v1)
- Dados públicos servidos apenas via Admin SDK no servidor — client SDK não lê cardápio

## Limitações conhecidas (v1)

| Item | Status |
|---|---|
| Cadastro público | Desabilitado — convite via Super Admin |
| Analytics / page views | Placeholder na UI |
| Billing / cobrança | Manual; preços de plano são placeholder |
| FAQ / Depoimentos | Tipos existem; sem UI admin |
| Badge de produto | Campo no schema; sem campo no formulário admin |
| Exclusão de categoria | UI avisa cascade; repositório não remove items aninhados |
| Alterar senha / excluir conta | Não implementado em `/settings` |
| Reordenação DnD de seções | Futuro |
| Páginas legais | Conteúdo stub |
