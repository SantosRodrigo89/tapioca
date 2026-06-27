# Mesio

Plataforma multi-tenant de presença digital para restaurantes. Cada estabelecimento ganha um link público (`/{slug}`), painel de gestão e landing page mobile-first com cardápio integrado.

**Slogan:** Sua presença digital começa aqui.

## O que o produto faz

| Persona | Acesso | Principais ações |
|---|---|---|
| **Admin do restaurante** | `/dashboard`, `/site`, `/menu/*`, `/settings` | Edita landing page, cardápio, aparência e dados do tenant |
| **Cliente final** | `/{slug}` | Consulta o site e cardápio, pede pelo WhatsApp |
| **Super Admin** | `/super` | Gerencia tenants, planos, convites, templates e status (`trial`, `active`, `suspended`, `cancelled`) |

## Funcionalidades

### Painel do restaurante

- **Dashboard** (`/dashboard`) — onboarding com progresso, resumo (produtos, categorias, link público) e ações rápidas (abrir site, QR Code, copiar link)
- **Presença Digital** (`/site`) — editor único da landing page com tabs: aparência, banner, sobre, diferenciais, destaques, galeria, contato, horários, SEO e QR Code
- **Cardápio** (`/menu/*`) — CRUD de categorias e produtos, drag-and-drop para reordenar, upload de fotos, destaques e preços em R$ (armazenados em centavos)
- **Horários por seção ou item** — ex.: pratos feitos 11:00–15:00; o item pode herdar o horário da categoria ou ter regra própria
- **Configurações** (`/settings`) — conta, slug, dados básicos do tenant

### Landing page pública (`/{slug}`)

- Página única com seções modulares (hero, sobre, diferenciais, destaques, cardápio, galeria, contato, mapa)
- Layout mobile-first com tema por tenant (cores customizáveis)
- Cardápio integrado com navegação por categorias, scroll spy e drawer de detalhe do produto
- Pedido via WhatsApp; itens fora do horário permanecem visíveis, mas sem CTA de pedido
- Produtos com grupos de configuração (tamanho, adicionais) e preço fixo ou "a partir de"

### Plataforma

- Autenticação Firebase com session cookie (`__session`)
- Multi-tenant com custom claims (`tenantId`, `role`)
- Super Admin com planos, feature flags, templates, convites e auditoria (sem cobrança integrada)
- Regras de segurança Firestore e Storage

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
| `/{slug}` | Público — landing page do restaurante |
| `/auth/login`, `/auth/signup`, `/auth/forgot-password` | Anônimo |
| `/dashboard` | Admin do tenant |
| `/site` | Admin do tenant — editor de presença digital |
| `/menu/categories`, `/menu/products`, `/menu/highlights` | Admin do tenant — cardápio |
| `/settings` | Admin do tenant |
| `/catalog` | Redirect legado → `/menu/products` |
| `/super`, `/super/restaurants`, `/super/invites`, … | Super Admin |
| `/api/auth/session` | API de sessão (login/logout) |

> O slug do restaurante não pode colidir com rotas reservadas (`auth`, `dashboard`, `site`, `menu`, `catalog`, `settings`, `super`, `api`, etc.).

## Começando

### Pré-requisitos

- Node.js 20+
- Projeto Firebase com Auth, Firestore e Storage habilitados

### Instalação

```bash
git clone <repo>
cd tapioca
npm install
cp .env.example .env.local
```

Preencha `.env.local` com as credenciais do Firebase (client + Admin SDK). Veja `.env.example` para a lista completa de variáveis.

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
| `npm run export:brand` | Gera PNGs, favicon e app icon a partir dos SVGs |
| `npm run sync:logo` | Copia logo horizontal para `public/logo.png` |

### Identidade visual

Documentação completa em [`src/assets/brand/BRAND-GUIDELINES.md`](src/assets/brand/BRAND-GUIDELINES.md).

Vetores em `src/assets/brand/svg/`. Para regenerar todos os PNGs:

```bash
npm run export:brand
```

### Firebase Emulator (opcional)

```bash
npx firebase emulators:start
```

Em outro terminal:

```bash
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true npm run dev
```

### Super Admin

Usuários com custom claim `role: "super_admin"` acessam `/super` após o login. A claim é definida manualmente via Firebase Admin SDK ou console — não há tela de promoção no app.

## Estrutura do projeto

```
src/
├── app/
│   ├── (admin)/          # Painel do restaurante (autenticado)
│   ├── (public)/[slug]/  # Landing page pública (SSR)
│   ├── super/            # Painel Super Admin
│   ├── auth/             # Login, cadastro, recuperação de senha
│   └── api/              # Rotas de API (sessão, tenants, super)
├── features/             # UI por domínio (landing, cardápio, presença digital, dashboard, super)
├── components/
│   ├── admin/            # Formulários e painéis
│   ├── brand/            # Logo Mesio
│   ├── public/           # Componentes da página pública
│   └── ui/               # shadcn/ui
├── layouts/              # Shell do admin e super (sidebar, header)
├── lib/
│   ├── auth/             # Sessão, roles, redirect
│   ├── brand.ts          # Constantes de marca
│   ├── catalog/          # Parse/serialize de configuração de produtos
│   ├── firebase/         # Client SDK + Admin SDK
│   ├── platform/         # Planos, features, entitlements
│   ├── pricing/          # Preço fixo vs "a partir de"
│   ├── repositories/     # Firestore (client + server)
│   ├── schemas/          # Validação Zod
│   ├── storage/          # Upload de imagens
│   └── utils/            # Preço, slug, horários, telefone
├── services/             # Lógica de domínio (site, onboarding)
├── assets/brand/         # Identidade visual (SVG fonte)
└── types/
specs/                    # Especificação do produto (SDD)
firestore.rules
storage.rules
```

## Modelo de dados (resumo)

```
slugIndex/{slug}              → tenantId

tenants/{tenantId}            → restaurante + siteConfig
  categories/{categoryId}     → seção do cardápio (+ availability opcional)
    items/{itemId}            → produto (+ availability opcional)
  gallery/{imageId}           → fotos da galeria

plans/{planId}                → planos SaaS
features/{featureId}          → catálogo de recursos
templates/{templateId}        → templates visuais
invites/{inviteId}            → convites de admin
auditLogs/{logId}             → auditoria
platform/settings             → configurações globais
```

Detalhes completos em [`specs/02-data-model.md`](specs/02-data-model.md).

## Especificação

A documentação de produto e arquitetura (SDD) está em [`specs/`](specs/):

| Arquivo | Conteúdo |
|---|---|
| `01-overview.md` | Visão geral, personas, fluxos |
| `02-data-model.md` | Firestore e campos |
| `03-auth.md` | Autenticação e claims |
| `04-admin-panel.md` | Painel do restaurante (parcialmente superseded) |
| `05-public-menu.md` | Cardápio e landing pública |
| `06-security-rules.md` | Regras Firestore/Storage |
| `07-platform-evolution.md` | **Navegação e evolução atuais** |
| `08-saas-foundation.md` | Planos, features, convites, auditoria |

## Deploy

O build espera variáveis de ambiente do Firebase no ambiente de CI/CD ou hosting. `NEXT_PUBLIC_APP_URL` deve apontar para a URL pública (usada no QR Code e links do painel).

Regras do Firebase:

```bash
npx firebase deploy --only firestore:rules,storage
```

## Licença

Projeto privado.
