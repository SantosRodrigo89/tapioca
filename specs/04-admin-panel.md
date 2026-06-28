# Spec 04 — Painel Admin

> **Estado:** v1 concluída. Navegação e rotas atuais estão em `07-platform-evolution.md`. Este documento descreve a implementação real do painel.

## Estrutura de Rotas

Todas as rotas admin ficam no route group `(admin)/` em `src/app/(admin)/`. O layout verifica sessão server-side, bloqueia tenants suspensos/cancelados e envolve `EntitlementsProvider`.

```
src/app/
├── (admin)/
│   ├── layout.tsx              # Sessão, blocked redirect, AdminShell
│   ├── dashboard/page.tsx      # Centro de comando
│   ├── site/page.tsx           # Editor de presença digital
│   ├── menu/
│   │   ├── layout.tsx          # Tabs internas (Categorias / Produtos / Destaques)
│   │   ├── page.tsx            # Redirect → /menu/products
│   │   ├── categories/page.tsx
│   │   ├── products/page.tsx
│   │   └── highlights/page.tsx
│   ├── catalog/page.tsx        # Redirect legado → /menu/products
│   └── settings/page.tsx       # Slug e URL pública
├── auth/
│   ├── login/
│   ├── signup/                 # Redirect → /auth/login
│   ├── forgot-password/
│   ├── invite/[token]/
│   └── account-blocked/
└── (public)/[slug]/page.tsx
```

## Layout Admin — `(admin)/layout.tsx`

- Server Component
- `getSessionUser()` — redirect para `/auth/login` se ausente
- Tenant `suspended` ou `cancelled` → redirect `/auth/account-blocked`
- `EntitlementsProvider` — feature flags por plano/tenant
- `AdminShell` (sidebar + header) em `src/layouts/`
- Touch de `lastAccessAt` a cada 15 min

**Sidebar (4 pilares):**

| Item | Rota |
|---|---|
| Dashboard | `/dashboard` |
| Presença Digital | `/site` |
| Cardápio | `/menu/categories`, `/menu/products`, `/menu/highlights` |
| Configurações | `/settings` |

Itens condicionais por entitlements. Link externo para `/{slug}`.

## Dashboard — `/dashboard`

Três blocos (`src/features/dashboard/`):

1. **Continue configurando** — cards de onboarding com progresso
2. **Resumo** — contagem de produtos, categorias, link público
3. **Ações rápidas** — abrir site, QR Code, copiar link

## Presença Digital — `/site`

Editor único com tabs internas (`src/features/presenca-digital/site-editor.tsx`):

| Tab | Conteúdo |
|---|---|
| Aparência | Logo, nome, cores, template |
| Banner | Imagem, título, subtítulo, CTA |
| Sobre | Título, descrição, imagem |
| Diferenciais | Cards (ícone, título, descrição) |
| Destaques | Seleção de produtos em destaque |
| Galeria | Upload, ordem, legenda |
| Contato | WhatsApp, telefone, redes, email, endereço |
| Horários | Dias, aberto/fechado |
| SEO | Title, description, OG, keywords |
| QR Code | Geração e download |

Persistência: `tenant.repository` (`updateSiteConfig`) + `gallery.repository`.

## Cardápio — `/menu/*`

Implementado em `src/features/cardapio/`:

### Categorias (`/menu/categories`)

- Lista com drag-and-drop para reordenar
- Dialog de criar/editar (`category-dialogs.tsx`)
- Campos: `name`, `active`, `availability` (horários opcionais)
- Exclusão com confirmação

### Produtos (`/menu/products`)

- Lista agrupada por categoria, DnD dentro da categoria
- Dialog de criar/editar (`product-dialogs.tsx`)
- Formulário em `src/components/admin/menu-item-form.tsx`
- Campos: nome, descrição, preço (R$ → centavos), imagem, `available`, `availability`
- Configuração avançada: grupos de opções, modo pizza, editor avançado

### Destaques (`/menu/highlights`)

- Seleção e ordem de produtos em destaque (`highlights-settings.tsx`)
- Persiste em `siteConfig.featured` / `highlightItemIds`

## Configurações — `/settings`

Escopo mínimo (v1):

- Slug (read-only)
- URL pública com botão copiar
- Link para editar presença digital em `/site`

Edição de nome, logo, WhatsApp, endereço etc. fica em `/site` (tabs Contato, Aparência, etc.).

## Auth Pages

### Login — `/auth/login`

- Email + senha → `signInWithEmailAndPassword` → `POST /api/auth/session`
- Links para forgot-password; signup redireciona para login
- Param `?redirect=` preservado

### Signup — `/auth/signup`

Redirect permanente para `/auth/login`. Cadastro público desabilitado.

### Convite — `/auth/invite/[token]`

- Preview via `GET /api/invites/[token]`
- Aceite via `POST /api/invites/[token]/accept`
- Cria usuário ou associa sessão existente; seta claims e `ownerUid`

### Forgot Password — `/auth/forgot-password`

- `sendPasswordResetEmail` via client SDK

### Conta bloqueada — `/auth/account-blocked`

- Exibida quando tenant está `suspended` ou `cancelled`

## Componentes

```
src/features/
├── cardapio/           # Painéis de categorias, produtos, destaques
├── presenca-digital/   # Tabs do editor /site
├── dashboard/          # Onboarding, resumo, ações rápidas
└── auth/               # Invite accept client

src/components/admin/
├── menu-item-form.tsx
├── category-form.tsx
├── product-configuration-section.tsx
├── advanced-configuration-editor.tsx
├── pizza-mode-editor.tsx
├── highlights-settings.tsx
├── menu-qr-code.tsx
├── image-upload.tsx
└── availability-schedule-fields.tsx

src/layouts/
├── admin-shell.tsx
└── admin-sidebar.tsx
```

## Estados e Feedback

- Skeleton loading em listas e landing pública
- Toast para ações CRUD
- Formulários desabilitados durante submit
- Confirmação modal para exclusões
- Entitlements ocultam tabs/módulos indisponíveis no plano
