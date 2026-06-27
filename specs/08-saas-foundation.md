# Spec 08 — SaaS Foundation (Tenant Management)

## Escopo

Fundação SaaS do Mesio **sem cobrança**. Prepara planos, recursos (feature flags), templates, convites, auditoria e configurações globais para escala operacional (centenas/milhares de tenants).

## Navegação Super Admin

| Módulo | Rota |
|--------|------|
| Dashboard | `/super` |
| Restaurantes | `/super/restaurants` |
| Convites | `/super/invites` |
| Planos | `/super/plans` |
| Recursos | `/super/features` |
| Templates | `/super/templates` |
| Métricas | `/super/metrics` |
| Logs | `/super/logs` |
| Configurações | `/super/settings` |

Shell: `SuperShell` + sidebar (espelha `AdminShell`).

## Coleções Firestore

```
platform/settings     → configurações globais (singleton)
plans/{planId}        → planos SaaS
features/{featureId}  → catálogo de recursos
templates/{templateId}→ templates visuais
invites/{inviteId}    → convites de admin
auditLogs/{logId}     → auditoria
tenants/{tenantId}    → + planId, templateId, category, customDomain,
                        featureOverrides, lastAccessAt, createdBy, metrics
```

## Entitlements (3 níveis)

1. **Global** — `features/{id}.globalEnabled`
2. **Por plano** — `plans/{id}.features`
3. **Por restaurante** — `tenants/{id}.featureOverrides`

Resolução: `resolveFeature()` em `src/lib/platform/features/resolve-feature.ts`.

## Seed inicial

`POST /api/super/seed` (super_admin): cria 4 planos, 13 recursos, 7 templates e `platform/settings`.

## Fora de escopo (Fase 2)

- Cobrança / gateways de pagamento
- Analytics real
- Pedidos online, CRM, IA
- Regras complexas de entitlements

## Entregas

Ver roadmap no documento de arquitetura da Fase 2.

- Entregas 0–2: tipos, seed, shell, dashboard
- Entrega 3: listagem de restaurantes com busca, filtros por status, ordenação, paginação (20/página) e colunas completas
- Entrega 4: wizard `/super/restaurants/new`, `POST /api/super/tenants`, criação de tenant + convite + audit log

Listagem: `listTenantsPaginatedServer()` + query params em `/super/restaurants`.
Cadastro: `createTenantWithInviteServer()` — tenant com `ownerUid` vazio até aceite do convite (Entrega 5).
