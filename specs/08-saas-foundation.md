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
- Entrega 5: aceite em `/auth/invite/[token]`, `POST /api/invites/[token]/accept`, claims + `ownerUid`
- Entrega 6: módulo `/super/invites` com reenviar, cancelar, copiar link e detalhes
- Entrega 7: CRUD de planos em `/super/plans` (edição dos 4 planos fixos + audit `plan_changed`)
- Entrega 8: módulo `/super/features` — toggles global, por plano e por restaurante + `resolveFeature()`
- Entrega 9: CRUD de templates em `/super/templates` (edição + tema visual)
- Entrega 10: métricas em `/super/metrics` com seções e `GET /api/super/metrics`
- Entrega 11: logs em `/super/logs` com filtros, detalhes e hooks de auditoria (login, suspensão, reativação)
- Entrega 12: configurações globais editáveis em `/super/settings`, `PATCH /api/super/settings` e audit `settings_changed`

Listagem: `listTenantsPaginatedServer()` + query params em `/super/restaurants`.
Cadastro: `createTenantWithInviteServer()` — tenant com `ownerUid` vazio até aceite do convite.
Aceite: `acceptInviteServer()` — cria usuário Firebase ou usa sessão existente.
