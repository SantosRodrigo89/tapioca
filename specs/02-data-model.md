# Spec 02 — Modelo de Dados

> **Estado:** v1. Dados públicos servidos via Admin SDK; client SDK lê/escreve apenas no painel autenticado. Coleções SaaS em `src/types/platform/`.

## Visão Geral — Estrutura Firestore

```
slugIndex/
  {slug}                    # lookup slug → tenantId (Admin SDK only)

tenants/
  {tenantId}/               # documento do restaurante
    categories/
      {categoryId}/         # categoria do cardápio
        items/
          {itemId}          # item do cardápio
    gallery/
      {imageId}             # imagem da galeria do site

platform/settings         # configurações globais (singleton)
plans/{planId}            # planos SaaS
features/{featureId}      # catálogo de recursos
templates/{templateId}    # templates visuais
invites/{inviteId}        # convites de admin
auditLogs/{logId}         # auditoria
```

## Collection: `slugIndex`

Índice público para lookup de tenant por slug. Escrita restrita ao servidor (Admin SDK ou Super Admin).

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `tenantId` | `string` | ✅ | ID do tenant associado |
| `createdAt` | `Timestamp` | ✅ | Data de criação |

**Caminho:** `slugIndex/{slug}`

**Regras:** leitura negada no client SDK; lookup via Admin SDK no servidor. Escrita via Admin SDK na criação de tenant.

## Collection: `tenants`

Documento principal de cada restaurante (tenant).

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | ✅ | Igual ao document ID |
| `slug` | `string` | ✅ | Identificador único na URL (imutável) |
| `name` | `string` | ✅ | Nome do restaurante |
| `description` | `string` | ❌ | Descrição curta |
| `logoUrl` | `string` | ❌ | URL da logo no Storage |
| `address` | `string` | ❌ | Endereço completo |
| `whatsapp` | `string` | ❌ | Número com DDI (ex: `5511999999999`) |
| `status` | `TenantStatus` | ✅ | `trial` \| `active` \| `suspended` \| `cancelled` |
| `ownerUid` | `string` | ✅ | UID do Firebase Auth do proprietário |
| `createdAt` | `Timestamp` | ✅ | Data de criação |
| `updatedAt` | `Timestamp` | ✅ | Data da última atualização |
| `siteConfig` | `SiteConfig` | ❌ | Configuração do site público (seções, conteúdo, SEO) |
| `planId` | `PlanId` | ❌ | Plano SaaS atribuído |
| `templateId` | `string` | ❌ | Template visual |
| `featureOverrides` | `Record<FeatureId, boolean>` | ❌ | Overrides de recursos por tenant |
| `lastAccessAt` | `Timestamp` | ❌ | Último acesso ao painel |
| `createdBy` | `string` | ❌ | UID do super_admin que criou |
| `metrics` | `TenantMetrics` | ❌ | Métricas (views = placeholder) |

**Caminho:** `tenants/{tenantId}`

**Regras (client SDK):**
- Leitura: tenant admin ou super admin
- Criação: negada (`allow create: if false`) — via Admin SDK
- Atualização: tenant admin (allowlist de campos) ou super admin via API
- Exclusão: super admin

## Subcollection: `tenants/{tenantId}/categories`

Categorias do cardápio (ex: "Entradas", "Pratos Principais", "Bebidas").

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | ✅ | Igual ao document ID |
| `name` | `string` | ✅ | Nome da categoria |
| `order` | `number` | ✅ | Posição de exibição (crescente) |
| `active` | `boolean` | ✅ | Se `false`, não aparece no cardápio público |
| `availability` | `AvailabilitySchedule` | ❌ | Horários de disponibilidade (herdável pelos items) |
| `createdAt` | `Timestamp` | ✅ | Data de criação |
| `updatedAt` | `Timestamp` | ✅ | Data da última atualização |

**Regras:** leitura/escrita pelo tenant admin ou super admin (tenant ativo).

**Índice:** `active ASC, order ASC`

## Subcollection: `tenants/{tenantId}/categories/{categoryId}/items`

Items individuais do cardápio.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | ✅ | Igual ao document ID |
| `name` | `string` | ✅ | Nome do item |
| `description` | `string` | ❌ | Descrição do item |
| `price` | `number` | ✅ | Preço armazenado em centavos (ex: R$ 12,90 = `1290`); formulário exibe em R$ |
| `imageUrl` | `string` | ❌ | URL da imagem no Storage |
| `available` | `boolean` | ✅ | Se `false`, não aparece no cardápio público |
| `order` | `number` | ✅ | Posição dentro da categoria (crescente) |
| `configurationGroups` | `ConfigurationGroup[]` | ❌ | Grupos de configuração do produto (ver abaixo) |
| `availability` | `AvailabilitySchedule` | ❌ | Horários próprios (override da categoria) |
| `badge` | `MenuItemBadge` | ❌ | Badge exibido no cardápio (ex: "Novo") — sem UI admin na v1 |
| `createdAt` | `Timestamp` | ✅ | Data de criação |
| `updatedAt` | `Timestamp` | ✅ | Data da última atualização |

**Regras:** leitura/escrita pelo tenant admin ou super admin (tenant ativo).

**Índice:** `available ASC, order ASC`

### Campo embutido: `configurationGroups`

Produtos podem ter zero ou mais grupos de configuração, embutidos no documento do item (sem subcollection). Produtos legados sem este campo funcionam normalmente.

**ConfigurationGroup**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | ✅ | Identificador estável do grupo |
| `name` | `string` | ✅ | Nome exibido (ex: "Tamanho") |
| `type` | `string` | ✅ | Rótulo livre (ex: "Variação", "Adicionais") |
| `required` | `boolean` | ✅ | Cliente deve selecionar opções |
| `multiple` | `boolean` | ✅ | Permite múltiplas opções |
| `minSelections` | `number` | ✅ | Mínimo de opções selecionadas |
| `maxSelections` | `number` | ✅ | Máximo de opções selecionadas |
| `pricingStrategy` | `PricingStrategy` | ✅ | `fixed` \| `additional` \| `highest` \| `average` \| `sum` \| `custom` |
| `definesBasePrice` | `boolean` | ✅ | Grupo de variação — catálogo exibe "A partir de R$ XX" |
| `enabled` | `boolean` | ✅ | Grupo ativo |
| `displayOrder` | `number` | ✅ | Ordem de exibição |
| `options` | `ConfigurationOption[]` | ✅ | Opções do grupo |

**ConfigurationOption**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | ✅ | Identificador estável da opção |
| `name` | `string` | ✅ | Nome da opção |
| `description` | `string` | ❌ | Descrição opcional |
| `price` | `number` | ✅ | Preço em centavos |
| `imageUrl` | `string` | ❌ | URL da imagem (opcional) |
| `enabled` | `boolean` | ✅ | Opção ativa |
| `displayOrder` | `number` | ✅ | Ordem dentro do grupo |

**Estratégias de preço (implementadas):**

- `fixed` — preço da opção selecionada substitui a base do grupo
- `additional` — soma o preço de cada opção selecionada
- `highest` — usa o maior preço entre as opções selecionadas

**Invariantes:**

- Apenas um grupo por produto pode ter `definesBasePrice: true`
- Grupos com `definesBasePrice` exigem `pricingStrategy: fixed` e seleção única
- Pedidos futuros farão snapshot das opções selecionadas (sem referência viva ao catálogo)

## Subcollection: `tenants/{tenantId}/gallery`

Imagens exibidas na seção galeria do site público.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | ✅ | Igual ao document ID |
| `url` | `string` | ✅ | URL da imagem no Storage |
| `caption` | `string` | ❌ | Legenda opcional |
| `order` | `number` | ✅ | Posição de exibição (crescente) |
| `createdAt` | `Timestamp` | ✅ | Data de criação |

**Regras:** leitura/escrita pelo tenant admin ou super admin (tenant ativo).

**Índice:** `order ASC`

## Coleções SaaS (spec 08)

| Collection | Caminho | Descrição |
|---|---|---|
| Settings | `platform/settings` | Configurações globais da plataforma |
| Plans | `plans/{planId}` | 4 planos fixos com mapa de features |
| Features | `features/{featureId}` | 13 recursos (`globalEnabled`, categoria) |
| Templates | `templates/{templateId}` | Identidade visual (cores, fontes) |
| Invites | `invites/{inviteId}` | Convites de onboarding |
| Audit logs | `auditLogs/{logId}` | Trilha de auditoria |

**Regras:** super_admin only no client SDK. APIs `/api/super/*` usam Admin SDK.

Entitlements: `resolveFeature()` combina global → plano → override do tenant.

## Firebase Storage

Estrutura de paths:

```
tenants/{tenantId}/logo.{ext}
tenants/{tenantId}/banner.{ext}
tenants/{tenantId}/items/{itemId}.{ext}
tenants/{tenantId}/items/{itemId}/options/{optionId}.{ext}
tenants/{tenantId}/gallery/{imageId}.{ext}
```

**Regras:** leitura pública, escrita apenas pelo tenant admin ou super admin. Restrição de tipo (`image/*`) e tamanho (máx 5 MB).

## Invariantes Multi-tenant

1. Todo documento dentro de `tenants/{tenantId}/` pertence exclusivamente ao tenant `tenantId`
2. Nenhum tenant pode ler ou escrever nos dados de outro tenant via client SDK (garantido pelas rules)
3. O slug é único globalmente (garantido pela collection `slugIndex`)
4. O `ownerUid` nunca muda após a criação do tenant
5. O `tenantId` no custom claim do token sempre corresponde ao document ID do tenant

## Tipos TypeScript Correspondentes

Os tipos em `src/types/index.ts` mapeiam diretamente este modelo:

- `Tenant` → `tenants/{id}` (inclui `siteConfig` opcional)
- `Category` → `categories/{id}`
- `MenuItem` → `items/{id}` (inclui `configurationGroups` opcional)
- `GalleryImage` → `gallery/{id}`
- `SlugIndexEntry` → `slugIndex/{slug}`
- `AuthUser` → usuário Firebase Auth com claims
- Tipos em `src/types/platform/` → planos, features, templates, invites, audit
