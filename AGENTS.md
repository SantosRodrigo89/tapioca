<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mesio — guia para agentes

**Mesio** é uma plataforma multi-tenant de presença digital para restaurantes. Cada estabelecimento tem um link público `/{slug}`, painel de gestão e landing page mobile-first com cardápio integrado.

**Slogan:** Sua presença digital começa aqui.

**Estado:** v1 concluída (jun/2026). Onboarding **somente por convite** (Super Admin).

## Personas

| Persona | Acesso | O que faz |
|---|---|---|
| Admin do restaurante | `/dashboard`, `/site`, `/menu/*`, `/settings` | Edita site, cardápio, aparência e link público |
| Cliente final | `/{slug}` | Consulta cardápio e pede via WhatsApp |
| Super Admin | `/super/*` | Cria tenants, convites, planos, features, templates, status |

## Stack

- **Next.js 16** — App Router, Server Components, TypeScript
- **React 19**
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI)
- **Firebase** — Auth, Firestore, Storage (client SDK no browser; Admin SDK no servidor)
- **Zod 4** + **React Hook Form** — validação de formulários
- **@dnd-kit** — reordenação de categorias/produtos
- Alias de import: `@/*` → `src/*`

## Comandos

```bash
npm run dev          # desenvolvimento
npm run build        # export:brand + build de produção
npm run lint         # ESLint
npm run export:brand # gera PNGs/favicon a partir dos SVGs de marca
```

Variáveis em `.env.local` (ver `.env.example`). Emulador: `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true npm run dev`.

## Estrutura do código

```
src/
├── app/
│   ├── (admin)/           # painel autenticado (layout verifica sessão)
│   ├── (public)/[slug]/   # landing + cardápio público (SSR)
│   ├── auth/              # login, convite, forgot-password, account-blocked
│   ├── super/             # painel super admin (9 módulos)
│   ├── page.tsx           # marketing Mesio (/)
│   └── api/               # sessão, convites, super, revalidate
├── features/              # landing, cardapio, presenca-digital, dashboard, super, marketing
├── components/
│   ├── admin/             # formulários e painéis (legado ativo)
│   ├── public/            # cardápio, drawer, tema
│   ├── brand/             # logo Mesio
│   └── ui/                # shadcn/ui
├── layouts/               # AdminShell, SuperShell
├── lib/
│   ├── auth/              # sessão, roles, redirect
│   ├── firebase/          # client.ts + admin.ts
│   ├── platform/          # planos, features, entitlements
│   ├── repositories/      # Firestore (client) + server/ (Admin SDK)
│   ├── schemas/           # Zod
│   ├── catalog/           # parse/serialize de configuração de produtos
│   ├── pricing/           # preço fixo vs "a partir de"
│   ├── storage/           # upload de imagens
│   └── utils/             # preço, slug, horários, telefone
├── services/              # site, onboarding, platform/*
├── types/                 # core + platform/
└── assets/brand/          # identidade visual (SVG fonte)
specs/                     # SDD — ler antes de mudanças grandes
firestore.rules
storage.rules
```

## Navegação admin (4 pilares)

| Rota | Descrição |
|---|---|
| `/dashboard` | Onboarding, resumo, atalhos |
| `/site` | Editor de presença digital (10 tabs) |
| `/menu/categories` | CRUD de categorias |
| `/menu/complements` | Catálogo global de complementos |
| `/menu/products` | CRUD de produtos |
| `/menu/highlights` | Destaques do cardápio |
| `/settings` | Slug, URL pública, link para `/site` |
| `/catalog` | **Legado** — redirect → `/menu/products` |

Super Admin: `/super`, `/super/restaurants`, `/super/invites`, `/super/plans`, `/super/features`, `/super/templates`, `/super/metrics`, `/super/logs`, `/super/settings`.

Princípio: **simplicidade**. Detalhes em `specs/07-platform-evolution.md`.

## Autenticação e multi-tenant

- Firebase Auth no cliente; sessão via cookie `__session` (`POST/DELETE /api/auth/session`)
- Custom claims: `{ role: "tenant_admin" | "super_admin", tenantId }`
- Onboarding: Super Admin cria tenant + convite → admin aceita em `/auth/invite/[token]`
- `/auth/signup` redireciona para login; `POST /api/tenants` retorna 403
- Layout `(admin)/layout.tsx` valida sessão; tenant suspenso → `/auth/account-blocked`
- `src/proxy.ts` — cookie gate + rate limiting em auth/invite
- Isolamento: tenant só acessa dados do próprio `tenantId`
- Super Admin sem `tenantId` → `/super`
- Dados públicos servidos **apenas via Admin SDK** (rules negam leitura client-side)

## Modelo de dados (Firestore)

```
slugIndex/{slug}              → { tenantId }
tenants/{tenantId}            → restaurante + siteConfig + campos SaaS
  categories/{categoryId}/items/{itemId}
  gallery/{imageId}
plans, features, templates, invites, auditLogs
platform/settings
```

Campos importantes: `slug` (imutável), `status`, `whatsapp`, `siteConfig`, `planId`, `featureOverrides`.

Detalhes: `specs/02-data-model.md`.

## Regras de negócio

- Preços em **centavos**; exibir com `formatPrice()` (pt-BR, BRL)
- **Grupos de configuração** em produtos — `src/lib/catalog/`, `src/lib/pricing/`
- **Disponibilidade por horário** (`availability`); fora do horário = visível, sem CTA
- `available: false` ou categoria `active: false` → oculto no cardápio público
- Slug não colide com rotas reservadas (`auth`, `dashboard`, `site`, `menu`, etc.)
- Imagens: `image/*`, máx. 5 MB
- Sem billing — status manual via Super Admin
- Pedidos via **WhatsApp**; sem checkout
- Entitlements: `resolveFeature()` — global → plano → override tenant

## Limitações v1 (não implementar sem pedido explícito)

- Cadastro público, analytics real, billing, carrinho/checkout
- FAQ/depoimentos na UI admin; badge de produto no formulário
- Cascade na exclusão de categorias (bug conhecido)
- DnD de ordem de seções na landing

## Padrões de código

- **UI e copy em pt-BR**
- **Server Components** por padrão; `"use client"` só quando necessário
- **Repositórios**: `*.repository.ts` (client SDK autenticado); `server/*.server.ts` (Admin SDK)
- **Validação**: Zod em `src/lib/schemas/`; tipos em `src/types/`
- **Formulários**: React Hook Form + `@hookform/resolvers/zod`
- **Estilo**: Tailwind + `cn()`; base em `src/components/ui/`
- **Marca**: `src/lib/brand.ts`, `src/assets/brand/`, `BRAND-GUIDELINES.md`
- Não commitar `.env.local` nem credenciais Admin SDK

## Página pública `/{slug}`

Landing modular (`SiteSectionId`: hero, about, menu, gallery, contact, etc.). Tema via `PublicTheme`. Cardápio com drawer de produto. Componentes: `src/features/landing/` + `src/components/public/`.

Ver `specs/05-public-menu.md`.

## Especificação (SDD)

| Arquivo | Conteúdo |
|---|---|
| `01-overview.md` | Personas, fluxos, rotas |
| `02-data-model.md` | Firestore e campos |
| `03-auth.md` | Auth, convites, sessão |
| `04-admin-panel.md` | Painel do restaurante |
| `05-public-menu.md` | Landing pública |
| `06-security-rules.md` | Regras Firestore/Storage |
| `07-platform-evolution.md` | **Navegação e roadmap v1** |
| `08-saas-foundation.md` | Super Admin e SaaS |

## Ao implementar mudanças

1. Ler spec relevante e código no mesmo domínio (`features/`, `repositories/`, `schemas/`)
2. Diff mínimo; seguir convenções do arquivo vizinho
3. Estender repositórios/schemas existentes
4. Testar fluxo admin e público ao tocar cardápio, auth ou visibilidade
5. Deploy regras: `npx firebase deploy --only firestore:rules,storage`
