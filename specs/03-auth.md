# Spec 03 — Autenticação e Autorização

> **Estado:** v1. Onboarding via **convite** (Super Admin). Cadastro público desabilitado.

## Estratégia

Firebase Auth para identidade + **session cookie HttpOnly** para sessões server-side:

- Token não fica no `localStorage` (proteção XSS)
- `src/proxy.ts` faz gate rápido por cookie em rotas admin/super
- Server Components e Route Handlers verificam sessão via Admin SDK

## Custom Claims

**Tenant admin:**

```json
{ "role": "tenant_admin", "tenantId": "<document ID do tenant>" }
```

**Super admin:**

```json
{ "role": "super_admin" }
```

Claims setadas via Admin SDK no aceite de convite ou manualmente para super_admin.

## Fluxo de Onboarding (convite)

```
Super Admin                 Next.js Server              Firebase
  |                               |                         |
  |-- POST /api/super/tenants --->|                         |
  |   (wizard)                    |-- createTenant() ------>| Firestore
  |                               |-- createInvite() ------>| invites/
  |                               |-- createSlugIndex() --->| slugIndex/
  |<-- invite link ---------------|                         |
  |                               |                         |
Admin (convidado)                 |                         |
  |-- GET /auth/invite/[token] -->|                         |
  |-- POST .../accept ----------->|                         |
  |   { name, email, password }   |-- createUser() -------->| (se novo)
  |                               |-- setCustomClaims() --->|
  |                               |-- update ownerUid ----->| Firestore
  |                               |-- createSessionCookie ->|
  |<-- Set-Cookie: __session -----|                         |
  |    redirect: /dashboard         |                         |
```

## Fluxo de Login

```
Cliente                     Next.js Server              Firebase
  |                               |                         |
  |-- signInWithEmailAndPassword->|                         | (client SDK)
  |<-- idToken -------------------|                         |
  |-- POST /api/auth/session ---->|                         |
  |   { idToken }                 |-- verifyIdToken() ----->|
  |                               |-- createSessionCookie ->|
  |<-- Set-Cookie: __session -----|                         |
  |    200 OK + audit log         |                         |
```

Se tenant `suspended`/`cancelled`: layout admin redireciona para `/auth/account-blocked`.

## Fluxo de Logout

```
Cliente                     Next.js Server
  |-- signOut() ----------------->| (client SDK)
  |-- DELETE /api/auth/session -->|
  |                               |-- revokeRefreshTokens
  |                               |-- deleteCookie
  |<-- 200 OK --------------------|
  | redirect: /auth/login         |
```

## Cadastro público (desabilitado)

- `/auth/signup` → redirect `/auth/login`
- `POST /api/tenants` → `403 { code: "SIGNUP_DISABLED" }`

## API Routes

### `POST /api/auth/session`

Troca ID token por session cookie. Rate limited.

**Request:** `{ "idToken": "<Firebase ID token>" }`

**Processo:**
1. `adminAuth.verifyIdToken(idToken, checkRevoked: true)`
2. `adminAuth.createSessionCookie(idToken, { expiresIn })`
3. Cookie `__session`: `httpOnly`, `secure`, `sameSite: "strict"`
4. Audit log `login` quando aplicável

### `DELETE /api/auth/session`

Revoga refresh tokens e deleta cookie.

### `GET /api/invites/[token]`

Preview do convite (público, rate limited).

### `POST /api/invites/[token]/accept`

Aceita convite, cria/atualiza usuário, seta claims, preenche `ownerUid`.

## Proteção de Rotas — `src/proxy.ts`

Cookie gate (sem verificação de assinatura — feita downstream):

**Rotas protegidas:** `/dashboard`, `/site`, `/menu`, `/catalog`, `/settings`, `/super`

**Rate limiting:** `/api/auth/session`, `/api/tenants`, `/api/invites/*`

Matcher em `export const config` do `proxy.ts`.

## Verificação de Sessão

```typescript
// src/lib/auth/session.ts
export async function getSessionUser() {
  const sessionCookie = (await cookies()).get('__session')?.value
  if (!sessionCookie) return null
  try {
    return await adminAuth.verifySessionCookie(sessionCookie, true)
  } catch {
    return null
  }
}
```

## Roles e Permissões

| Ação | Cliente Final | Tenant Admin | Super Admin |
|---|---|---|---|
| Ver landing pública | ✅ | ✅ | ✅ |
| Editar próprio tenant | ❌ | ✅ | ✅ |
| Editar cardápio | ❌ | ✅ | ✅ |
| Upload de imagens | ❌ | ✅ | ✅ |
| Mudar status do tenant | ❌ | ❌ | ✅ |
| Criar tenants / convites | ❌ | ❌ | ✅ |
| Gerenciar planos/features | ❌ | ❌ | ✅ |
| Acessar `/super` | ❌ | ❌ | ✅ |

## Cookies

| Cookie | Flags | Duração |
|---|---|---|
| `__session` | `httpOnly`, `secure`, `sameSite=strict`, `path=/` | 5 dias (`SESSION_DURATION_MS`) |

## Variáveis de Ambiente

Ver `.env.example` — Firebase client + Admin SDK + `NEXT_PUBLIC_APP_URL`.
