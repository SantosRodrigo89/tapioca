
# Spec 10 — Analytics (PostHog)

> **Estado:** MVP implementado. Coleta via PostHog cloud; leitura no dashboard admin e Super Admin.

## Objetivo

Medir engajamento da landing pública por tenant: visitas, cliques WhatsApp, abertura de produtos e origem QR.

## Ferramenta

- **PostHog cloud** — free tier (1M eventos/mês)
- Client: `posthog-js` na landing pública
- Server: API HogQL para dashboard e sync Firestore

## Entitlement

Feature `analytics` — habilitada em planos **Pro**, **Premium** e **Enterprise** (`default-plans.ts`). Gating no client evita enviar eventos para tenants sem o recurso.

## Eventos

| Evento | Quando | Propriedades |
|--------|--------|--------------|
| `page_view` | Mount da landing | `tenant_id`, `slug`, `referrer`, `utm_*`, `visit_source` |
| `qr_visit` | `?from=qr` ou referrer QR | `tenant_id`, `slug` |
| `product_open` | Abrir drawer de produto | `tenant_id`, `slug`, `product_id`, `category_id` |
| `whatsapp_click` | Clique em link wa.me / api.whatsapp | `tenant_id`, `slug`, `source` (hero\|contact\|footer\|drawer\|other) |

## Variáveis de ambiente

```bash
NEXT_PUBLIC_POSTHOG_KEY=          # Project API key (client)
NEXT_PUBLIC_POSTHOG_HOST=         # Opcional; default https://us.i.posthog.com
POSTHOG_PERSONAL_API_KEY=         # Personal API key (server queries)
POSTHOG_PROJECT_ID=               # ID numérico do projeto
```

Sem as variáveis, tracking e dashboards de analytics ficam desabilitados (graceful degradation).

## Persistência Mesio

- `tenants/{tenantId}.metrics.views` — total sincronizado (page views 30d)
- Sync via `POST /api/super/analytics/sync` (super admin) ou leitura live HogQL no dashboard

## Rotas

| Rota | Descrição |
|------|-----------|
| `POST /api/super/analytics/sync` | Super Admin — sync views de todos os tenants |

## Fora de escopo (MVP)

- Session replay
- Funnels na UI admin
- Cookie consent banner dedicado (PostHog usa cookies próprios)
