# Mesio

Plataforma multi-tenant de presença digital para restaurantes. Cada estabelecimento ganha um link público (`/{slug}`), painel de gestão e landing page mobile-first com cardápio integrado.

**Slogan:** Sua presença digital começa aqui.

**Estado:** v1 concluída (jun/2026).

## O que o produto faz

| Persona | Acesso | Principais ações |
|---|---|---|
| **Admin do restaurante** | `/dashboard`, `/site`, `/menu/*`, `/settings` | Edita landing page, cardápio, aparência e link público |
| **Cliente final** | `/{slug}` | Consulta o site e cardápio, pede pelo WhatsApp |
| **Super Admin** | `/super/*` | Cria restaurantes, convites, planos, features, templates e gerencia status |

Onboarding de novos restaurantes é **somente por convite** (Super Admin). Cadastro público em `/auth/signup` está desabilitado.

## Funcionalidades

### Painel do restaurante

- **Dashboard** (`/dashboard`) — onboarding com progresso, resumo (produtos, categorias, link público) e ações rápidas (abrir site, QR Code, copiar link)
- **Presença Digital** (`/site`) — editor da landing page com tabs: aparência, banner, sobre, diferenciais, destaques, galeria, contato, horários, SEO e QR Code
- **Cardápio** (`/menu/*`) — CRUD de categorias e produtos, drag-and-drop, upload de fotos, destaques, configuração avançada (tamanho, adicionais, modo pizza) e preços em R$ (centavos no Firestore)
- **Horários por seção ou item** — item fora do horário fica visível, sem CTA de pedido
- **Configurações** (`/settings`) — slug, URL pública e link para o editor em `/site`

### Landing page pública (`/{slug}`)

- Seções modulares (hero, sobre, diferenciais, destaques, cardápio, galeria, contato, mapa)
- Layout mobile-first com tema por tenant e templates
- Cardápio com navegação por categorias, scroll spy e drawer de detalhe
- Pedido via WhatsApp; produtos com preço fixo ou "a partir de"
- Cache server-side com revalidação por tag

### Super Admin

- Dashboard, restaurantes, convites, planos, recursos (feature flags), templates, métricas, logs e configurações globais
- Wizard de criação de restaurante + convite de admin
- Auditoria de ações privilegiadas
- Sem cobrança integrada (status manual)

### Marketing

- Site institucional do Mesio em `/`

## Stack

- **Next.js 16** — App Router, Server Components, TypeScript
- **React 19**
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI)
- **Firebase** — Auth, Firestore, Storage (client SDK no browser; Admin SDK no servidor)
- **Zod 4** + **React Hook Form**
- **@dnd-kit** — reordenação no cardápio

## Rotas

| Rota | Quem acessa |
|---|---|
| `/` | Público — site de marketing Mesio |
| `/{slug}` | Público — landing page do restaurante |
| `/auth/login`, `/auth/forgot-password` | Anônimo |
| `/auth/signup` | Redirect → `/auth/login` |
| `/auth/invite/[token]` | Convite de onboarding |
| `/dashboard`, `/site`, `/menu/*`, `/settings` | Admin do tenant |
| `/catalog` | Redirect legado → `/menu/products` |
| `/super/*` | Super Admin |
| `/termos`, `/privacidade` | Público (stub) |

> Slug não pode colidir com rotas reservadas (`auth`, `dashboard`, `site`, `menu`, etc.).

## Limitações conhecidas (v1)

| Item | Status |
|---|---|
| Cadastro público | Desabilitado |
| Analytics / billing | Placeholder |
| FAQ / depoimentos | Sem UI admin |
| Badge de produto | Campo existe; sem formulário admin |
| Exclusão de categoria | Não remove items aninhados |
| Páginas legais | Conteúdo stub |

## Começando

### Pré-requisitos

- Node.js 20+
- Projeto Firebase com Auth, Firestore e Storage

### Instalação

```bash
git clone <repo>
cd tapioca
npm install
cp .env.example .env.local
```

Preencha `.env.local` com credenciais Firebase (client + Admin SDK). Veja `.env.example`.

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | `export:brand` + build de produção |
| `npm run start` | Serve o build |
| `npm run lint` | ESLint |
| `npm run export:brand` | Gera PNGs, favicon e app icon |
| `npm run sync:logo` | Copia logo horizontal para `public/logo.png` |

### Identidade visual

[`src/assets/brand/BRAND-GUIDELINES.md`](src/assets/brand/BRAND-GUIDELINES.md). Vetores em `src/assets/brand/svg/`.

```bash
npm run export:brand
```

### Firebase Emulator (opcional)

```bash
npx firebase emulators:start
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true npm run dev
```

### Super Admin

Claim `role: "super_admin"` definida manualmente via Admin SDK. Após login, acesso a `/super`. Seed inicial: `POST /api/super/seed`.

## Estrutura do projeto

```
src/
├── app/
│   ├── (admin)/          # Painel do restaurante
│   ├── (public)/[slug]/  # Landing pública (SSR)
│   ├── super/            # Super Admin
│   ├── auth/             # Login, convite, recuperação
│   └── api/              # Sessão, convites, super, revalidate
├── features/             # UI por domínio (landing, cardápio, site, dashboard, super, marketing)
├── components/           # admin/, public/, ui/, brand/
├── layouts/              # AdminShell, SuperShell
├── lib/                  # auth, firebase, repositories, schemas, platform, catalog, pricing
├── services/             # site, onboarding, platform/*
└── types/                # Core + platform/
specs/                    # Especificação (SDD)
firestore.rules
storage.rules
```

## Modelo de dados (resumo)

```
slugIndex/{slug}              → tenantId
tenants/{tenantId}            → restaurante + siteConfig
  categories/{categoryId}/items/{itemId}
  gallery/{imageId}
plans, features, templates, invites, auditLogs
platform/settings
```

Detalhes: [`specs/02-data-model.md`](specs/02-data-model.md).

## Especificação

| Arquivo | Conteúdo |
|---|---|
| `01-overview.md` | Visão geral, fluxos, rotas |
| `02-data-model.md` | Firestore e campos |
| `03-auth.md` | Auth, convites, sessão |
| `04-admin-panel.md` | Painel do restaurante |
| `05-public-menu.md` | Landing pública e cardápio |
| `06-security-rules.md` | Regras Firestore/Storage |
| `07-platform-evolution.md` | Navegação e roadmap v1 |
| `08-saas-foundation.md` | Super Admin e SaaS |

## Deploy

Variáveis Firebase no CI/CD. `NEXT_PUBLIC_APP_URL` para QR Code e links.

```bash
npx firebase deploy --only firestore:rules,storage
```

## Licença

Projeto privado.
