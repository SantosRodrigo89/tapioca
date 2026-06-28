# Spec 08 — SaaS Foundation (Tenant Management)

> **Estado:** v1 concluída (jun/2026). Entregas 0–13 implementadas. Billing e analytics real ficam para Fase 2.

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

## Entregas (v1)

| # | Entrega | Status |
|---|---------|--------|
| 0–2 | Tipos, seed, SuperShell, dashboard | ✅ |
| 3 | Listagem paginada de restaurantes | ✅ |
| 4 | Wizard de criação + `POST /api/super/tenants` | ✅ |
| 5 | Aceite de convite em `/auth/invite/[token]` | ✅ |
| 6 | Módulo de convites (reenviar, cancelar, copiar) | ✅ |
| 7 | Edição de planos em `/super/plans` | ✅ |
| 8 | Feature toggles (global, plano, tenant) | ✅ |
| 9 | Templates visuais em `/super/templates` | ✅ |
| 10 | Métricas em `/super/metrics` (views = placeholder) | ✅ |
| 11 | Audit logs em `/super/logs` | ✅ |
| 12 | Configurações globais em `/super/settings` | ✅ |
| 13 | Polish: `lastAccessAt`, proxy `/super`, regras imutáveis | ✅ |

Listagem: `listTenantsPaginatedServer()` + query params em `/super/restaurants`.
Cadastro: `createTenantWithInviteServer()` — `ownerUid` vazio até aceite.
Aceite: `acceptInviteServer()` — cria usuário ou usa sessão existente.
