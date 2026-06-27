<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mesio — guia para agentes

**Mesio** é uma plataforma multi-tenant de presença digital para restaurantes. Cada estabelecimento tem um link público `/{slug}`, painel de gestão e landing page mobile-first com cardápio integrado.

**Slogan:** Sua presença digital começa aqui.

## Personas

| Persona | Acesso | O que faz |
|---|---|---|
| Admin do restaurante | `/dashboard`, `/site`, `/menu/*`, `/settings` | Edita site, cardápio, aparência e dados do tenant |
| Cliente final | `/{slug}` | Consulta cardápio e pede via WhatsApp |
| Super Admin | `/super` | Gerencia tenants e status (`trial`, `active`, `suspended`, `cancelled`) |

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

Variáveis em `.env.local` (ver `.env.example`). Emulador Firebase: `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true npm run dev`.

## Estrutura do código

```
src/
├── app/
│   ├── (admin)/           # painel autenticado (layout verifica sessão)
│   ├── (public)/[slug]/   # landing + cardápio público (SSR)
│   ├── auth/              # login, signup, forgot-password
│   ├── super/             # painel super admin
│   └── api/               # sessão, tenants, etc.
├── features/              # UI por domínio (landing, cardapio, presenca-digital, dashboard)
├── components/
│   ├── admin/             # formulários e painéis
│   ├── public/            # componentes da página pública
│   ├── brand/             # logo Mesio
│   └── ui/                # shadcn/ui
├── layouts/               # shell do admin (sidebar, header)
├── lib/
│   ├── auth/              # sessão, roles, redirect
│   ├── firebase/          # client.ts + admin.ts
│   ├── repositories/      # Firestore (client) + server/ (Admin SDK)
│   ├── schemas/           # Zod
│   ├── catalog/           # parse/serialize de configuração de produtos
│   ├── pricing/           # preço fixo vs "a partir de"
│   ├── storage/           # upload de imagens
│   └── utils/             # preço, slug, horários, telefone
├── services/              # lógica de domínio (site, onboarding)
├── types/                 # tipos compartilhados
└── assets/brand/          # identidade visual (SVG fonte)
specs/                     # especificação do produto (SDD) — ler antes de mudanças grandes
firestore.rules
storage.rules
```

## Navegação admin (estado atual)

| Rota | Descrição |
|---|---|
| `/dashboard` | Resumo, onboarding, atalhos |
| `/site` | Editor de presença digital (tabs internas: aparência, banner, sobre, etc.) |
| `/menu/categories` | CRUD de categorias |
| `/menu/products` | CRUD de produtos |
| `/menu/highlights` | Destaques do cardápio |
| `/settings` | Conta e dados básicos do tenant |
| `/catalog` | **Legado** — redirect para `/menu/products` |

Princípio do produto: **simplicidade**. Evitar rotas e abstrações desnecessárias. Detalhes em `specs/07-platform-evolution.md`.

## Autenticação e multi-tenant

- Firebase Auth no cliente; sessão server-side via cookie `__session` (`POST/DELETE /api/auth/session`)
- Custom claims: `{ role: "tenant_admin" | "super_admin", tenantId }`
- Layout `(admin)/layout.tsx` chama `getSessionUser()` e redireciona se não autenticado
- `src/proxy.ts` existe para proteção de rotas admin (matcher configurado); o layout admin também valida sessão server-side
- Isolamento: tenant só acessa dados do próprio `tenantId`
- Super Admin sem `tenantId` é redirecionado para `/super`

## Modelo de dados (Firestore)

```
slugIndex/{slug}              → { tenantId }
tenants/{tenantId}            → restaurante + siteConfig
  categories/{categoryId}     → seção do cardápio
    items/{itemId}            → produto
  gallery/{imageId}           → fotos da galeria
```

Campos importantes do tenant: `slug` (imutável), `status`, `whatsapp`, `siteConfig` (seções, cores, conteúdo, SEO).

Detalhes completos: `specs/02-data-model.md`.

## Regras de negócio

- Preços armazenados em **centavos** (`price: number`); exibir com `formatPrice()` (`pt-BR`, BRL)
- Produtos podem ter **grupos de configuração** (tamanho, adicionais) — ver `src/lib/catalog/` e `src/lib/pricing/`
- **Disponibilidade por horário** em categorias e itens (`availability`); item fora do horário fica visível, sem CTA de pedido
- `available: false` ou categoria `active: false` → não aparece no cardápio público
- Slug não pode colidir com rotas reservadas (`auth`, `dashboard`, `menu`, `site`, etc.)
- Imagens: `image/*`, máx. 5 MB (Storage)
- Sem billing no app — mudança de status do tenant é manual (Super Admin)
- Pedidos via **WhatsApp** (`formatWhatsAppLink`), não há checkout

## Padrões de código

- **UI e copy em português (pt-BR)** — labels, mensagens, formatação de moeda e telefone
- **Server Components** por padrão nas páginas; `"use client"` só quando necessário (forms, dnd, hooks)
- **Repositórios**: `*.repository.ts` usa Firebase client (admin autenticado); `server/*.server.ts` usa Admin SDK (páginas públicas, API, layout)
- **Validação**: schemas Zod em `src/lib/schemas/`; tipos em `src/types/`
- **Formulários**: React Hook Form + `@hookform/resolvers/zod`
- **Estilo**: Tailwind + `cn()`; componentes base em `src/components/ui/`
- **Marca**: constantes em `src/lib/brand.ts`; assets em `src/assets/brand/`; guidelines em `BRAND-GUIDELINES.md`
- Não commitar `.env.local` nem credenciais do Admin SDK

## Página pública `/{slug}`

Landing page configurável por seções (`SiteSectionId`: hero, about, menu, gallery, contact, etc.). Tema por tenant via `PublicTheme`. Cardápio integrado com navegação por categorias, destaques e drawer de detalhe do produto.

Ver `specs/05-public-menu.md` e componentes em `src/features/landing/` + `src/components/public/`.

## Especificação (SDD)

Consultar `specs/` antes de implementar fluxos novos ou alterar arquitetura:

| Arquivo | Conteúdo |
|---|---|
| `01-overview.md` | Personas, fluxos, rotas |
| `02-data-model.md` | Firestore e campos |
| `03-auth.md` | Auth, claims, sessão |
| `04-admin-panel.md` | Painel (parcialmente superseded por 07) |
| `05-public-menu.md` | Cardápio público |
| `06-security-rules.md` | Regras Firestore/Storage |
| `07-platform-evolution.md` | **Navegação e evolução atuais** |

## Ao implementar mudanças

1. Ler a spec relevante e o código existente no mesmo domínio (`features/`, `repositories/`, `schemas/`)
2. Manter diff mínimo; seguir convenções já usadas no arquivo vizinho
3. Preferir estender repositórios/schemas existentes em vez de duplicar acesso ao Firestore
4. Testar fluxo admin e público quando tocar cardápio, auth ou regras de visibilidade
5. Deploy de regras Firebase: `npx firebase deploy --only firestore:rules,storage`
