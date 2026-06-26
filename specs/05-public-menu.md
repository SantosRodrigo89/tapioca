# Spec 05 — Cardápio Público

## Visão Geral

O cardápio público é acessado via URL `/{slug}` por qualquer pessoa, sem necessidade de login. É renderizado server-side para performance e SEO.

## Rota

**Path:** `src/app/(public)/[slug]/page.tsx`

O route group `(public)` não adiciona segmento na URL — o path real é `/{slug}`.

> **Atenção:** O slug não pode colidir com rotas reservadas da aplicação (`auth`, `dashboard`, `catalog`, `settings`, `super`, `api`). Essa validação deve ocorrer no momento do signup.

## Fluxo de Renderização

```
Request /{slug}
    |
    v
page.tsx (Server Component)
    |
    v
getTenantBySlug(slug) → slugIndex/{slug} → tenantId
    |
    ├── not found → notFound() → 404 page
    |
    v
getTenant(tenantId) → tenants/{tenantId}
    |
    ├── status === "suspended" | "cancelled" → página de indisponível
    |
    v
getActiveCategories(tenantId) → categories WHERE active=true ORDER BY order
    |
    v
getAvailableItems(tenantId, categoryId) → items WHERE available=true ORDER BY order
    (paralelo para todas as categorias)
    |
    v
Renderiza <MenuPage />
```

## Metadata Dinâmica

```typescript
export async function generateMetadata({ params }) {
  const tenant = await getTenantBySlug(params.slug)
  if (!tenant) return { title: 'Cardápio não encontrado' }
  
  return {
    title: `Cardápio — ${tenant.name}`,
    description: tenant.description ?? `Veja o cardápio completo de ${tenant.name}`,
    openGraph: {
      title: tenant.name,
      description: tenant.description,
      images: tenant.logoUrl ? [tenant.logoUrl] : [],
    },
  }
}
```

## Estrutura de Componentes

```
src/app/(public)/[slug]/
├── page.tsx          # Server Component — busca dados e passa para UI
├── loading.tsx       # Skeleton loading state
└── not-found.tsx     # Página 404 customizada

src/components/public/
├── menu-page.tsx     # Layout principal do cardápio
├── menu-header.tsx   # Logo, nome, endereço, whatsapp
├── category-section.tsx  # Seção de uma categoria com seus items
├── menu-item-card.tsx    # Card de um item individual
└── unavailable-page.tsx  # Tenant suspenso ou cancelado
```

## Componente `MenuPage`

Props:
```typescript
interface MenuPageProps {
  tenant: Tenant
  categories: Array<Category & { items: MenuItem[] }>
}
```

Layout:
- Header com logo, nome do restaurante, endereço, link WhatsApp
- Navegação por categorias (tabs horizontais ou âncoras)
- Lista de seções, uma por categoria
- Cada seção: título da categoria + grid de cards de items
- Footer com logo Mesio e slogan "Sua presença digital começa aqui."

## Componente `MenuItemCard`

Props:
```typescript
interface MenuItemCardProps {
  item: MenuItem
}
```

Exibe:
- Imagem do item (com fallback para placeholder)
- Nome
- Descrição (truncada em 2 linhas)
- Preço formatado em BRL (`formatPrice(item.price)`)

## Página de Indisponível

Exibida quando:
- `tenant.status === "suspended"` — "Este cardápio está temporariamente indisponível"
- `tenant.status === "cancelled"` — "Este cardápio não está mais disponível"

Não expõe detalhes internos ao visitante.

## Loading State — `loading.tsx`

Skeleton com:
- Header skeleton (logo + nome)
- 3 categorias skeleton com 4 items cada

## Not Found — `not-found.tsx`

Exibido quando:
- Slug não existe no `slugIndex`

Mensagem amigável: "Cardápio não encontrado. Verifique o endereço e tente novamente."

## Performance e SEO

- Página renderizada em Server Component (sem JavaScript desnecessário no cliente)
- `generateMetadata` para Open Graph
- Imagens via `next/image` com sizes otimizados
- Cache de dados: usar `unstable_cache` do Next.js para cachear dados do cardápio por slug
  - TTL sugerido: 60 segundos (ou revalidação por tag ao salvar)

## Slugs Reservados

Os seguintes slugs não podem ser usados por tenants:

```
auth, dashboard, catalog, settings, super, api, public, admin, _next
```

Validação deve estar no `generateSlug` e no schema Zod de criação do tenant.
