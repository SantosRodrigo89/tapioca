# Spec 05 — Landing Pública e Cardápio

> **Estado:** v1 concluída. A rota `/{slug}` é uma **landing page modular** com cardápio integrado como seção — não uma página de cardápio isolada.

## Visão Geral

Landing page mobile-first acessível via `/{slug}`, renderizada server-side. Seções configuráveis por `siteConfig.sections`. Dados carregados exclusivamente via Admin SDK (Firestore rules negam leitura client-side).

## Rota

**Path:** `src/app/(public)/[slug]/page.tsx`

Route group `(public)` não adiciona segmento na URL.

**Cache:** `revalidate = 120` + tag-based revalidation via `POST /api/revalidate/public`.

## Fluxo de Renderização

```
Request /{slug}
    |
    v
page.tsx (Server Component)
    |
    v
getTenantBySlug(slug)  [Admin SDK: slugIndex → tenantId → tenant]
    |
    ├── not found → notFound()
    |
    v
status suspended|cancelled → unavailable page
    |
    v
loadPublicLandingData(tenantId)
    ├── categories (active) + items (available)
    ├── gallery
    └── entitlements (feature flags)
    |
    v
renderLandingSections() → seções modulares
    + ProductDetailDrawer (client)
```

Loader: `src/lib/repositories/server/load-public-landing.server.ts`

## Seções da Landing

Ordem default (configurável via `siteConfig.sections`):

| Seção | ID | Componente |
|---|---|---|
| Hero | `hero` | `src/features/landing/hero-section*.tsx` |
| Sobre | `about` | `about-section.tsx` |
| Diferenciais | `features` | `features-section.tsx` |
| Destaques | `featured` | `highlights-carousel` |
| Cardápio | `menu` | `menu-section.tsx` + `menu-catalog` |
| Galeria | `gallery` | `gallery-section.tsx` |
| Contato | `contact` | `contact-section.tsx` |
| Mapa | `location` | `location-section.tsx` |
| Rodapé | `footer` | `footer-section.tsx` |

Registry: `src/lib/site/sections.ts`. Seções futuras (`faq`, `testimonials`) existem no tipo mas sem UI admin.

Hero suporta variantes `immersive` e `compact`.

## Cardápio (seção `#cardapio`)

Componentes em `src/components/public/`:

| Componente | Função |
|---|---|
| `menu-catalog.tsx` | Grid/lista de produtos por categoria |
| `category-nav.tsx` | Navegação sticky + scroll spy |
| `highlights-carousel.tsx` | Carrossel de destaques |
| `product-detail-drawer.tsx` | Drawer com detalhe e configurações |
| `product-drawer-actions.tsx` | WhatsApp, copiar link, compartilhar |
| `public-theme.tsx` | CSS variables por tenant/template |

### Comportamento de disponibilidade

- `available: false` → item **não aparece** no cardápio público
- Categoria `active: false` → categoria oculta
- Item fora do horário de `availability` → **visível**, sem CTA de pedido (regra de negócio v1)
- Produtos com configuração: preço fixo ou "a partir de" (`definesBasePrice`)

### Pedido

Via link WhatsApp (`formatWhatsAppLink`). Sem carrinho ou checkout.

## Metadata Dinâmica

`generateMetadata` usa `siteConfig.seo` quando presente; fallback para `tenant.name` e `description`.

Open Graph inclui logo/imagem do hero quando disponível.

## Estrutura de Arquivos

```
src/app/(public)/[slug]/
├── page.tsx
├── loading.tsx       # Skeleton
└── not-found.tsx

src/features/landing/   # Seções modulares
src/components/public/  # Cardápio, drawer, tema
```

## Página de Indisponível

Tenant `suspended` ou `cancelled`: mensagem genérica sem expor detalhes internos.

## Performance

- Server Components por padrão; `"use client"` apenas no drawer e interações
- Dynamic imports para seções below-the-fold
- Imagens via `next/image`
- Cache com tags; invalidação ao salvar no admin

## Slugs Reservados

Definidos em `src/lib/schemas/tenant.schema.ts`:

```
auth, dashboard, catalog, site, menu, settings, super, api, public, admin, _next
```

> Rotas estáticas `/termos` e `/privacidade` existem mas ainda não estão na lista de reservados.

Validação no schema Zod de slug e na criação de tenant (Super Admin).
