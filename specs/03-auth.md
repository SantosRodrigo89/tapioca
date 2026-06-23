# Spec 03 — Autenticação e Autorização

## Estratégia

O sistema usa **Firebase Auth** para identidade + **session cookie HttpOnly** para sessões server-side. Isso garante:

- Token não fica exposto no `localStorage` (XSS)
- Middleware Next.js pode verificar a sessão sem chamar Firebase no Edge
- Server Components podem verificar a sessão via Admin SDK

## Custom Claims

O token Firebase de cada usuário deve conter as seguintes custom claims:

```json
{
  "role": "tenant_admin",
  "tenantId": "<document ID do tenant>"
}
```

Para Super Admins:

```json
{
  "role": "super_admin"
}
```

As claims são setadas pelo servidor via Admin SDK após o signup/criação do tenant.

## Fluxo de Signup

```
Cliente                     Next.js Server              Firebase
  |                               |                         |
  |-- POST /auth/signup --------->|                         |
  |   { name, email, password,   |                         |
  |     restaurantName }         |                         |
  |                               |-- createUser() -------->|
  |                               |<-- { uid } -------------|
  |                               |-- createTenant(uid) --->| (Firestore)
  |                               |-- createSlugIndex() --->| (Firestore)
  |                               |-- setCustomClaims() --->| (Admin Auth)
  |                               |   { role, tenantId }   |
  |                               |-- createSessionCookie ->| (Admin Auth)
  |<-- Set-Cookie: __session -----|                         |
  |    redirect: /dashboard       |                         |
```

> O signup é feito via Server Action ou Route Handler para garantir que as custom claims sejam setadas antes do primeiro acesso ao dashboard.

## Fluxo de Login

```
Cliente                     Next.js Server              Firebase
  |                               |                         |
  |-- signInWithEmailAndPassword->|                         | (client SDK)
  |<-- idToken -------------------|                         |
  |                               |                         |
  |-- POST /api/auth/session ---->|                         |
  |   { idToken }                 |-- verifyIdToken() ----->|
  |                               |<-- decodedToken --------|
  |                               |-- createSessionCookie ->|
  |                               |<-- sessionCookie -------|
  |<-- Set-Cookie: __session -----|                         |
  |    200 OK                     |                         |
```

## Fluxo de Logout

```
Cliente                     Next.js Server              Firebase
  |                               |                         |
  |-- signOut() ----------------->|                         | (client SDK)
  |-- DELETE /api/auth/session -->|                         |
  |                               |-- revokeRefreshTokens ->|
  |                               |-- deleteCookie -------->|
  |<-- 200 OK --------------------|                         |
  | redirect: /auth/login         |                         |
```

## API Routes

### `POST /api/auth/session`

Troca um ID token do Firebase por um session cookie seguro.

**Request body:**
```json
{ "idToken": "<Firebase ID token>" }
```

**Processo:**
1. Verifica `idToken` com `adminAuth.verifyIdToken(idToken)`
2. Verifica expiração: o token deve ter no máximo 5 minutos (`checkRevoked: true`)
3. Cria session cookie com `adminAuth.createSessionCookie(idToken, { expiresIn })`
4. Seta cookie `__session` com flags `httpOnly: true`, `secure: true`, `sameSite: "strict"`

**Response:** `200 OK`

### `DELETE /api/auth/session`

Destrói a sessão.

**Processo:**
1. Lê o cookie `__session`
2. Verifica o cookie com `adminAuth.verifySessionCookie(sessionCookie)`
3. Revoga refresh tokens: `adminAuth.revokeRefreshTokens(uid)`
4. Deleta o cookie `__session`

**Response:** `200 OK`

### `POST /api/auth/claims`

Seta custom claims após signup. Chamado internamente pelo servidor.

**Request body:**
```json
{ "uid": "<Firebase UID>", "role": "tenant_admin", "tenantId": "<tenantId>" }
```

**Processo:**
1. Verifica que o chamador é o próprio servidor (não exposto ao cliente diretamente)
2. `adminAuth.setCustomUserClaims(uid, { role, tenantId })`

## Middleware Next.js

O `src/middleware.ts` verifica a presença do cookie `__session` em rotas protegidas.

**Rotas protegidas:** `/dashboard`, `/catalog`, `/settings`, `/super`

O middleware **não verifica** a assinatura do cookie — isso ocorre nos Server Components e Route Handlers usando o Admin SDK. O middleware só faz o redirect rápido quando o cookie está ausente.

## Verificação de Sessão em Server Components

```typescript
// src/lib/auth/session.ts
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase/admin'

export async function getSessionUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('__session')?.value
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
| Ler cardápio público | ✅ | ✅ | ✅ |
| Editar próprio tenant | ❌ | ✅ | ✅ |
| Editar categorias/items | ❌ | ✅ | ✅ |
| Fazer upload de imagens | ❌ | ✅ | ✅ |
| Mudar status do tenant | ❌ | ❌ | ✅ |
| Criar/excluir tenants | ❌ | ❌ | ✅ |
| Acessar `/super` | ❌ | ❌ | ✅ |

## Cookies

| Cookie | Valor | Flags |
|---|---|---|
| `__session` | Session cookie Firebase (JWT assinado) | `httpOnly`, `secure`, `sameSite=strict`, `path=/` |

**Duração:** 5 dias (configurável via `SESSION_DURATION_MS`)

## Variáveis de Ambiente

```bash
# Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin SDK (server only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# App
NEXT_PUBLIC_APP_URL=
```
