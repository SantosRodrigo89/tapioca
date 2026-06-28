# Spec 07 — Evolução da Plataforma Mesio

> **Estado:** v1 concluída (jun/2026). Roadmap de implementação (etapas 0–6) entregue. Etapa 7 (polish) em progresso incremental.

## Posicionamento

**Mesio — Plataforma de Presença Digital para Restaurantes**

O Mesio não vende um cardápio digital. Vende a presença digital completa do restaurante. O cardápio é apenas um dos recursos.

Objetivo: permitir que qualquer restaurante tenha uma presença digital profissional em poucos minutos.

## Princípio orientador

Sempre priorizar **simplicidade**. Evitar excesso de abstrações, múltiplas rotas desnecessárias e código antecipando funcionalidades distantes.

## Navegação admin (4 pilares)

| Item | Rota | Descrição |
|------|------|-----------|
| Dashboard | `/dashboard` | Centro de comando — onboarding, resumo, ações rápidas |
| Presença Digital | `/site` | Editor único da landing page (tabs internas) |
| Cardápio | `/menu/*` | Módulo secundário: categorias, produtos, destaques |
| Configurações | `/settings` | Conta, slug, dados básicos do tenant |

### Sub-rotas do Cardápio

- `/menu` → redirect para `/menu/products`
- `/menu/categories` — CRUD de categorias
- `/menu/products` — CRUD de produtos
- `/menu/highlights` — produtos em destaque

### Redirects de compatibilidade

- `/catalog` → `/menu/products`
- `/catalog?action=new-category` → `/menu/categories?action=new`

## Presença Digital — Editor `/site`

Uma única rota com navegação interna por tabs (sem rotas filhas):

| Tab | Campos principais |
|-----|-------------------|
| Aparência | Logo, nome, cores, tipografia |
| Banner | Imagem, título, subtítulo, botões |
| Sobre | Título, descrição, imagem |
| Diferenciais | Lista de cards (ícone, título, descrição) |
| Produtos em Destaque | Seleção e ordem de produtos |
| Galeria | Fotos, ordem, legenda |
| Contato | WhatsApp, telefone, redes, email, endereço |
| Horários | Dias, horários, aberto/fechado |
| SEO | Título, descrição, OG, keywords |
| QR Code | Geração e download do QR |

Referências de UX: Stripe Dashboard, Vercel, Shopify, Framer.

## Dashboard — Centro de comando

Três blocos, nesta ordem:

1. **Continue configurando seu restaurante** — cards com progresso (completo/pendente)
2. **Resumo** — produtos, categorias, link público
3. **Ações rápidas** — abrir site, compartilhar QR, copiar link, editar landing page

## Landing page pública (`/{slug}`)

Página única com seções modulares. Cardápio é uma seção (`#cardapio`).

Ordem default das seções:

1. Hero
2. Sobre
3. Diferenciais
4. Produtos em Destaque
5. Cardápio
6. Galeria
7. Contato
8. Mapa
9. Rodapé

Cada seção possui `enabled` e `order` em `siteConfig.sections`. Drag-and-drop de ordem é futuro.

Section registry em `src/lib/site/sections.ts`. Componentes em `src/features/landing/`.

## Modelo de dados — `SiteConfig`

Objeto aninhado em `tenants/{tenantId}.siteConfig`. Se ausente, derivar defaults dos campos legados via `resolveSiteConfig()`.

### Galeria (subcollection)

```
tenants/{tenantId}/gallery/{imageId}
  → { url, caption?, order, createdAt }
```

### Mapeamento legado → SiteConfig

| Campo legado | Destino |
|--------------|---------|
| `name`, `logoUrl`, `theme` | `identity` + `hero.title` fallback |
| `bannerUrl` | `hero.imageUrl` |
| `description` | `about.description` |
| `highlightItemIds` | `featured.itemIds` |
| `whatsapp`, `address` | `contact`, `location` |
| `openingHours` | permanece em `Tenant` |

## Estrutura de código

```
src/
├── components/ui/     # shadcn primitives
├── features/          # código novo por domínio
├── layouts/           # AdminShell, MenuLayout, etc.
├── services/          # fachada fina sobre repositories
├── hooks/
└── lib/               # repositories, schemas, utils, firebase
```

Código legado em `components/admin/` e `components/public/` migra somente quando alterado.

## Fora de escopo (implementação atual)

Analytics, Fidelidade, CRM, IA, Reservas, Pedidos, Marketing, Domínio próprio, DnD de seções, FAQ/Depoimentos na UI.

## Roadmap de implementação

| Etapa | Entrega | Status |
|-------|---------|--------|
| 0 | Spec, types, schemas, site.service, brand copy | ✅ |
| 1 | Sidebar 4 pilares, rotas `/site` e `/menu/*`, redirects | ✅ |
| 2 | Dashboard centro de comando | ✅ |
| 3 | Módulo Cardápio (split catalog-client) | ✅ |
| 4 | Persistência siteConfig + galeria Firestore | ✅ |
| 5 | Editor Presença Digital completo | ✅ |
| 6 | Landing page modular pública | ✅ |
| 7 | Polish, performance, migração incremental | 🔄 |

## v1 — Entregue

- Navegação admin em 4 pilares com entitlements
- Editor `/site` com 10 tabs
- Cardápio em `/menu/*` com DnD, configuração avançada e destaques
- Landing modular em `/{slug}` com cache e revalidation
- Super Admin completo (spec 08)
- Onboarding por convite
- Site de marketing em `/`
- Rate limiting, audit log, regras Firestore restritivas

## v1 — Pendências conhecidas

- Migração completa de `components/admin|public/` para `features/`
- DnD de ordem de seções na landing
- UI admin para FAQ, depoimentos e badge de produto
- Cascade na exclusão de categorias
- Conteúdo das páginas legais
- Analytics, billing, pedidos online (Fase 2)

## Extensibilidade futura

Novos módulos (CRM, pedidos, fidelidade) devem ser adicionados como:

1. Entrada na sidebar (config array)
2. Rota admin dedicada
3. Service + repository se necessário

Documentar contratos aqui; não criar stubs de código antecipadamente.
