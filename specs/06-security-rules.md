# Spec 06 — Regras de Segurança

> **Estado:** v1. Regras em `firestore.rules` e `storage.rules`. Dados públicos do cardápio são servidos **apenas via Admin SDK** no servidor — o client SDK do browser não lê tenants, categorias ou items.

## Firestore Rules

### Helpers

```javascript
function isSignedIn() { return request.auth != null; }
function isSuperAdmin() { return isSignedIn() && request.auth.token.role == 'super_admin'; }
function isTenantAdmin(tenantId) { return isSignedIn() && request.auth.token.tenantId == tenantId; }
function isOwnerOrSuperAdmin(tenantId) { return isTenantAdmin(tenantId) || isSuperAdmin(); }
function isTenantActive(tenantId) { /* status trial|active|null */ }
function canWriteTenantData(tenantId) { /* owner + tenant ativo, ou super_admin */ }
function canUpdateTenantDoc(tenantId) { /* idem para update do doc tenant */ }
```

**Dependência crítica:** `isTenantAdmin` exige custom claim `tenantId`. Claims são setadas no aceite de convite (`acceptInviteServer`) ou manualmente para super_admin.

### `slugIndex/{slug}`

```javascript
allow read: if false;           // lookup apenas via Admin SDK (SSR)
allow write: if isSuperAdmin();
```

Escrita na prática ocorre via Admin SDK na criação de tenant (Super Admin wizard).

### `tenants/{tenantId}`

```javascript
allow read: if isOwnerOrSuperAdmin(tenantId);
allow create: if false;         // tenants criados apenas via Admin SDK
allow update: if canUpdateTenantDoc(tenantId)
  && request.resource.data.diff(resource.data).affectedKeys().hasOnly([
    'name', 'description', 'address', 'whatsapp', 'logoUrl', 'bannerUrl',
    'theme', 'openingHours', 'highlightItemIds', 'siteConfig',
    'updatedAt', 'lastAccessAt',
  ]);
allow delete: if isSuperAdmin();
```

**Imutabilidade:** `slug`, `ownerUid`, `planId`, `status` e campos SaaS não estão no allowlist — tenant admin não pode alterá-los via client SDK. Super Admin usa Admin SDK nas APIs `/api/super/*`.

### Subcollections (`categories`, `items`, `gallery`)

```javascript
allow read: if isOwnerOrSuperAdmin(tenantId);
allow write: if canWriteTenantData(tenantId);
```

Leitura pública negada no client. Páginas públicas usam Admin SDK.

Tenants `suspended`/`cancelled` não podem escrever (exceto super_admin).

### Coleções SaaS (super_admin only)

```
platform/{document=**}
plans/{planId}
features/{featureId}
templates/{templateId}
invites/{inviteId}
auditLogs/{logId}
```

Todas: `allow read, write: if isSuperAdmin();`

Operações reais também passam por Route Handlers com verificação de sessão super_admin.

## Storage Rules

```javascript
match /tenants/{tenantId}/{allPaths=**} {
  allow read: if true;
  allow write: if (isTenantAdmin(tenantId) || isSuperAdmin()) && isValidImage();
  allow delete: if isTenantAdmin(tenantId) || isSuperAdmin();
}
```

**`isValidImage()`:** `contentType` começa com `image/`, máx. 5 MB.

Paths usados:

```
tenants/{tenantId}/logo.{ext}
tenants/{tenantId}/banner.{ext}
tenants/{tenantId}/items/{itemId}.{ext}
tenants/{tenantId}/items/{itemId}/options/{optionId}.{ext}
tenants/{tenantId}/gallery/{imageId}.{ext}
```

## Proteção de Rotas (Next.js)

`src/proxy.ts` (matcher configurado):

- Cookie gate em `/dashboard`, `/site`, `/menu`, `/catalog`, `/settings`, `/super`
- Rate limiting em `/api/auth/session`, `/api/tenants`, `/api/invites/*`
- Verificação de assinatura do cookie ocorre nos Server Components e Route Handlers (Admin SDK)

Layouts `(admin)/layout.tsx` e `super/layout.tsx` também validam sessão server-side.

## Checklist de Segurança (v1)

| Item | Status |
|---|---|
| Isolamento por tenantId | ✅ |
| Dados públicos via Admin SDK only | ✅ |
| Custom claims para escrita | ✅ |
| Slug/owner/plan imutáveis no client update | ✅ (allowlist) |
| Tenant create bloqueado no client | ✅ |
| Writes bloqueados para tenant suspenso | ✅ |
| Coleções SaaS restritas a super_admin | ✅ |
| Rate limiting em auth/invite | ✅ |
| Audit log em ações super | ✅ |
| Validação de tipos de campo nas rules | ⚠️ Parcial |
| Restrição de SVG no Storage | ⚠️ Parcial (`image/*`) |

## Indexes Firestore

`firestore.indexes.json`:

```json
{ "collectionGroup": "categories", "fields": ["active ASC", "order ASC"] }
{ "collectionGroup": "items", "fields": ["available ASC", "order ASC"] }
```

Queries admin filtram por tenant (subcollection); indexes compostos acima servem queries públicas no servidor.
