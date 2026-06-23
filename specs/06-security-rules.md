# Spec 06 — Regras de Segurança

## Firestore Rules

### Estrutura Atual

As regras em `firestore.rules` estão bem estruturadas para multi-tenant. A análise abaixo documenta as decisões de design e identifica gaps.

### Helpers

```javascript
function isSignedIn() {
  return request.auth != null;
}

function isSuperAdmin() {
  return isSignedIn() && request.auth.token.role == 'super_admin';
}

function isTenantAdmin(tenantId) {
  return isSignedIn() && request.auth.token.tenantId == tenantId;
}

function isOwnerOrSuperAdmin(tenantId) {
  return isTenantAdmin(tenantId) || isSuperAdmin();
}
```

**Dependência crítica:** `isTenantAdmin` depende do custom claim `tenantId` no token. Se o claim não for setado no momento do signup, o admin não conseguirá escrever dados. O fluxo de signup **deve** setar claims antes de redirecionar para o dashboard.

### `slugIndex/{slug}`

```javascript
allow read: if true;               // Cardápio público faz lookup por slug
allow write: if isSuperAdmin();    // Apenas servidor/super admin cria slugs
```

**Risco:** Qualquer pessoa pode ler todos os slugs. Isso é intencional e necessário para o cardápio público. A escrita é restrita ao servidor.

**Gap:** Atualmente `write` permite super_admin via client SDK. Para maior segurança, considerar permitir apenas via Admin SDK (sem rules de escrita para cliente) e usar regras de `deny all` para writes do client.

### `tenants/{tenantId}`

```javascript
allow read: if true;
allow create: if isSignedIn() && request.auth.uid == request.resource.data.ownerUid;
allow update: if isOwnerOrSuperAdmin(tenantId);
allow delete: if isSuperAdmin();
```

**Nota:** `create` valida que o `ownerUid` no documento é o UID do usuário criador. Isso evita que um usuário crie um tenant "em nome de outro".

**Gap identificado:** A regra `update` não impede que o admin mude o `slug` ou `ownerUid`. Adicionar validação:

```javascript
allow update: if isOwnerOrSuperAdmin(tenantId)
  && request.resource.data.slug == resource.data.slug    // slug imutável
  && request.resource.data.ownerUid == resource.data.ownerUid;  // ownerUid imutável
```

### `tenants/{tenantId}/categories/{categoryId}`

```javascript
allow read: if true;
allow write: if isOwnerOrSuperAdmin(tenantId);
```

**Correto.** Leitura pública para o cardápio público.

### `tenants/{tenantId}/categories/{categoryId}/items/{itemId}`

```javascript
allow read: if true;
allow write: if isOwnerOrSuperAdmin(tenantId);
```

**Correto.** Leitura pública para o cardápio público.

### Validação de Campos (a adicionar)

Considerar adicionar validação de campos nas rules para segurança extra:

```javascript
function isValidCategory() {
  let data = request.resource.data;
  return data.name is string && data.name.size() >= 2 && data.name.size() <= 50
    && data.order is int
    && data.active is bool;
}

function isValidMenuItem() {
  let data = request.resource.data;
  return data.name is string && data.name.size() >= 2 && data.name.size() <= 100
    && data.price is int && data.price >= 0
    && data.available is bool
    && data.order is int;
}
```

## Storage Rules

### Estrutura Atual

```javascript
match /tenants/{tenantId}/{allPaths=**} {
  allow read: if true;
  allow write: if (isTenantAdmin(tenantId) || isSuperAdmin()) && isValidImage();
  allow delete: if isTenantAdmin(tenantId) || isSuperAdmin();
}
```

**Correto.** O path `/tenants/{tenantId}/` isola os arquivos de cada tenant.

**`isValidImage()`** valida:
- `contentType` começa com `image/`
- Tamanho máximo de 5 MB

### Gaps Identificados

1. **Sem limite de path depth:** `{allPaths=**}` permite qualquer estrutura. Considerar paths mais específicos:
   ```javascript
   match /tenants/{tenantId}/logo.{ext} { ... }
   match /tenants/{tenantId}/items/{filename} { ... }
   ```

2. **Extensões não validadas:** A rule valida `contentType` mas não a extensão do arquivo. Um cliente poderia enviar `image/svg+xml` (potencial XSS via SVG). Considerar restringir a `image/jpeg`, `image/png`, `image/webp`.

## Checklist de Segurança

| Item | Status | Ação Necessária |
|---|---|---|
| Isolamento por tenantId | ✅ Implementado | — |
| Leitura pública do cardápio | ✅ Implementado | — |
| Custom claims para escrita | ✅ Nas rules | Garantir no fluxo de signup |
| Slug imutável nas rules | ❌ Gap | Adicionar validação no update |
| ownerUid imutável nas rules | ❌ Gap | Adicionar validação no update |
| Validação de tipos de campo | ❌ Gap | Adicionar functions de validação |
| Restrição de content-type de imagem | ⚠️ Parcial | Restringir SVG |
| Deny all por padrão | ✅ (implícito no Firestore) | — |

## Indexes Firestore

Os indexes em `firestore.indexes.json` suportam as queries do cardápio público:

```json
// Query: WHERE active=true ORDER BY order (para categorias)
{ "collectionGroup": "categories", "fields": ["active ASC", "order ASC"] }

// Query: WHERE available=true ORDER BY order (para items)
{ "collectionGroup": "items", "fields": ["available ASC", "order ASC"] }
```

Esses indexes são suficientes para o cardápio público. Queries admin que filtram apenas por tenant não precisam de index composto (a collection já está aninhada por tenant).
