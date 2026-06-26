# Mesio

Plataforma moderna para restaurantes. Cada estabelecimento ganha um link público (`/{slug}`), painel de gestão e presença digital otimizada para mobile.

**Slogan:** Sua presença digital começa aqui.

## O que o produto faz

| Persona | Acesso | Principais ações |
|---|---|---|
| **Admin do restaurante** | `/dashboard`, `/catalog`, `/settings` | Cadastra categorias e itens, personaliza aparência, define horários e destaques |
| **Cliente final** | `/{slug}` | Consulta o cardápio e pede pelo WhatsApp |
| **Super Admin** | `/super` | Lista tenants e altera status (`trial`, `active`, `suspended`, `cancelled`) |

## Funcionalidades

### Painel do restaurante

- **Cardápio** — CRUD de categorias e itens, drag-and-drop para reordenar, upload de fotos, preços em R$ (armazenados em centavos)
- **Horários por seção ou item** — ex.: pratos feitos 11:00–15:00, pizzas após 18:00; o item pode herdar o horário da categoria ou ter regra própria
- **Configurações** — logo, banner, cores do tema, horário de funcionamento, destaques da casa (até 6 itens), link público e QR Code

### Cardápio público

- Layout mobile-first com banner, logo, badge aberto/fechado e CTA para WhatsApp
- Navegação por categorias com scroll spy
- Carrossel de destaques e listagem de itens com preço e pedido via WhatsApp
- Itens fora do horário permanecem visíveis, mas sem botão de pedido
- Temas por tenant (cores customizáveis)

### Plataforma

- Autenticação Firebase com session cookie (`__session`)
- Multi-tenant com custom claims (`tenantId`, `role`)
- Regras de segurança Firestore e Storage

## Stack

- **Next.js 16** — App Router, Server Components, TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI)
- **Firebase** — Auth, Firestore, Storage
- **Zod** + **React Hook Form**
- **@dnd-kit** — reordenação no catálogo

## Rotas

| Rota | Quem acessa |
|---|---|
| `/{slug}` | Público — cardápio do restaurante |
| `/auth/login`, `/auth/signup`, `/auth/forgot-password` | Anônimo |
| `/dashboard` | Admin do tenant |
| `/catalog` | Admin do tenant |
| `/settings` | Admin do tenant |
| `/super` | Super Admin |
| `/api/auth/session` | API de sessão (login/logout) |

> O slug do restaurante não pode colidir com rotas reservadas (`auth`, `dashboard`, `catalog`, etc.).

## Começando

### Pré-requisitos

- Node.js 20+
- Projeto Firebase com Auth, Firestore e Storage habilitados

### Instalação

```bash
git clone <repo>
cd mesio
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
| `npm run build` | Build de produção (sincroniza logo se disponível) |
| `npm run start` | Serve o build |
| `npm run lint` | ESLint |
| `npm run sync:logo` | Copia `src/assets/brand/logo.png` → `public/logo.png` (quando o asset existir) |

### Logo

O wordmark temporário "Mesio" é renderizado em texto até o logo final estar disponível. A fonte do logo será `src/assets/brand/logo.png`. Após adicionar o arquivo:

```bash
npm run sync:logo
```

Atualize também `src/components/brand/logo.tsx` e `src/app/icon.tsx` para usar o asset final.

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
│   ├── (public)/[slug]/  # Cardápio público
│   ├── super/            # Painel Super Admin
│   ├── auth/             # Login, cadastro, recuperação de senha
│   └── api/              # Rotas de API (sessão, tenants)
├── assets/brand/         # Logo (fonte)
├── components/
│   ├── admin/            # Formulários, catálogo, configurações
│   ├── brand/            # Componente de logo
│   ├── public/           # Hero, categorias, destaques, cards
│   └── ui/               # shadcn/ui
├── lib/
│   ├── brand.ts            # Constantes de marca (Mesio)
│   ├── firebase/         # Client SDK + Admin SDK
│   ├── repositories/     # Acesso ao Firestore (client + server)
│   ├── schemas/          # Validação Zod
│   ├── storage/          # Upload de imagens
│   └── utils/            # Preço, slug, horários, disponibilidade
├── hooks/
└── types/
specs/                    # Especificação do produto (SDD)
firestore.rules
storage.rules
```

## Modelo de dados (resumo)

```
slugIndex/{slug}              → tenantId

tenants/{tenantId}            → restaurante (nome, slug, tema, banner, horários…)
  categories/{categoryId}     → seção do cardápio (+ availability opcional)
    items/{itemId}            → produto (+ availability opcional)
```

Detalhes completos em [`specs/02-data-model.md`](specs/02-data-model.md).

## Especificação

A documentação de produto e arquitetura (SDD) está em [`specs/`](specs/):

| Arquivo | Conteúdo |
|---|---|
| `01-overview.md` | Visão geral, personas, fluxos |
| `02-data-model.md` | Firestore e campos |
| `03-auth.md` | Autenticação e claims |
| `04-admin-panel.md` | Painel do restaurante |
| `05-public-menu.md` | Cardápio público |
| `06-security-rules.md` | Regras Firestore/Storage |

## Deploy

O build espera variáveis de ambiente do Firebase no ambiente de CI/CD ou hosting. `NEXT_PUBLIC_APP_URL` deve apontar para a URL pública (usada no QR Code e links do painel).

Regras do Firebase:

```bash
npx firebase deploy --only firestore:rules,storage
```

## Licença

Projeto privado.
