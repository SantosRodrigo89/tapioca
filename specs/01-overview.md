# Spec 01 — Visão Geral do Produto

## Produto

**Tapioca** é um SaaS web de cardápio digital para restaurantes, bares e lanchonetes.

## Personas

| Persona | Descrição |
|---|---|
| **Admin Tenant** | Proprietário ou gerente do estabelecimento. Faz login, configura o restaurante, gerencia categorias e itens do cardápio. |
| **Cliente Final** | Consumidor do estabelecimento. Acessa o cardápio público via URL com slug ou QR Code, sem necessidade de login. |
| **Super Admin** | Operador da plataforma Tapioca. Gerencia tenants, pode suspender contas e fazer operações privilegiadas. |

## Fluxos Principais

### Fluxo 1 — Onboarding de Tenant

1. Admin acessa `/auth/signup`
2. Preenche email, senha e nome do restaurante
3. Sistema cria conta Firebase Auth
4. Sistema cria documento `tenants/{tenantId}` com status `trial`
5. Sistema cria entrada em `slugIndex/{slug}` apontando para o tenant
6. Sistema seta custom claims no token: `{ role: "tenant_admin", tenantId }`
7. Admin é redirecionado para `/dashboard`

### Fluxo 2 — Login de Admin

1. Admin acessa `/auth/login`
2. Preenche email e senha
3. Firebase Auth valida credenciais e retorna ID token
4. Sistema troca o ID token por um session cookie `__session` via `POST /api/auth/session`
5. Admin é redirecionado para `/dashboard`

### Fluxo 3 — Gestão do Cardápio

1. Admin acessa `/catalog`
2. Visualiza categorias e items do seu tenant
3. Pode criar, editar, reordenar e excluir categorias
4. Pode criar, editar, ativar/desativar e excluir items dentro de cada categoria
5. Pode fazer upload de imagem para cada item (Firebase Storage)

### Fluxo 4 — Cardápio Público

1. Cliente acessa `/{slug}` (ex: `tapioca.app/burger-house`)
2. Sistema busca `slugIndex/{slug}` para obter o `tenantId`
3. Sistema busca dados do tenant e categorias ativas com items disponíveis
4. Cardápio é renderizado em Server Component (SSR/SSG) sem necessidade de login

### Fluxo 5 — Logout

1. Admin clica em "Sair"
2. Sistema chama `DELETE /api/auth/session` para destruir o cookie
3. Firebase Auth faz signOut no cliente
4. Admin é redirecionado para `/auth/login`

## Status do Tenant

| Status | Descrição |
|---|---|
| `trial` | Recém-cadastrado, acesso completo por período de avaliação |
| `active` | Conta ativa após ativação manual pelo Super Admin |
| `suspended` | Acesso bloqueado por inadimplência ou violação |
| `cancelled` | Conta encerrada pelo próprio admin ou pela plataforma |

> Billing e pagamento são externos ao sistema. A mudança de status é manual, feita pelo Super Admin.

## Rotas da Aplicação

| Rota | Acesso | Descrição |
|---|---|---|
| `/{slug}` | Público | Cardápio do restaurante |
| `/auth/login` | Anônimo | Login do admin |
| `/auth/signup` | Anônimo | Cadastro de novo tenant |
| `/auth/forgot-password` | Anônimo | Recuperação de senha |
| `/dashboard` | Admin autenticado | Visão geral do tenant |
| `/catalog` | Admin autenticado | Gestão de categorias e items |
| `/settings` | Admin autenticado | Configurações do restaurante |
| `/super` | Super Admin | Painel de administração da plataforma |

## Restrições e Regras de Negócio

- Um tenant só pode editar seus próprios dados (isolamento por `tenantId`)
- Slug é imutável após a criação do tenant
- Items com `available: false` não aparecem no cardápio público
- Categorias com `active: false` não aparecem no cardápio público
- Imagens devem ser do tipo `image/*` e ter no máximo 5 MB
- Sem billing ou pagamento dentro do sistema
