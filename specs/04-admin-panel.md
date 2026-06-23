# Spec 04 — Painel Admin

## Estrutura de Rotas

Todas as rotas admin ficam no route group `(admin)` em `src/app/(admin)/`. O layout verifica a sessão server-side e redireciona para `/auth/login` se não autenticado.

```
src/app/
├── (admin)/
│   ├── layout.tsx              # Shell autenticado com sidebar
│   ├── dashboard/
│   │   └── page.tsx            # Visão geral do tenant
│   ├── catalog/
│   │   ├── page.tsx            # Listagem de categorias e items
│   │   ├── categories/
│   │   │   ├── new/page.tsx    # Criar categoria
│   │   │   └── [id]/
│   │   │       └── edit/page.tsx  # Editar categoria
│   │   └── items/
│   │       ├── new/page.tsx    # Criar item (recebe categoryId via search param)
│   │       └── [id]/
│   │           └── edit/page.tsx  # Editar item
│   └── settings/
│       └── page.tsx            # Configurações do restaurante
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── forgot-password/page.tsx
└── (public)/
    └── [slug]/page.tsx
```

## Layout Admin — `(admin)/layout.tsx`

- Server Component
- Chama `getSessionUser()` para verificar sessão
- Se não autenticado: `redirect('/auth/login')`
- Se tenant com status `suspended` ou `cancelled`: exibe banner de aviso
- Renderiza shell com sidebar e header

**Sidebar links:**
- Dashboard (`/dashboard`)
- Cardápio (`/catalog`)
- Configurações (`/settings`)
- Link para ver cardápio público (`/{slug}`, `target="_blank"`)
- Botão de logout

## Dashboard — `/dashboard`

### Dados exibidos

- Nome e logo do restaurante
- Status do tenant (badge colorido)
- Link para o cardápio público com o slug
- Contagem de categorias ativas
- Contagem de items disponíveis
- Atalhos para ações rápidas (adicionar categoria, adicionar item)

### Componentes

- `TenantHeader` — nome, logo, status badge
- `StatsGrid` — cards com contagens
- `QuickActions` — botões de atalho

## Catálogo — `/catalog`

### Visualização

- Lista de categorias em ordem (`order ASC`)
- Cada categoria é expansível mostrando seus items
- Cada item exibe: nome, preço formatado, badge de disponibilidade, imagem thumbnail

### Ações por Categoria

- Criar nova categoria (abre modal ou navega para `/catalog/categories/new`)
- Editar nome e status (`active`)
- Reordenar via drag-and-drop ou botões ↑↓
- Excluir (com confirmação — só permite se sem items)

### Ações por Item

- Criar novo item dentro de uma categoria
- Editar todos os campos
- Toggle de disponibilidade (`available`) in-line
- Upload de imagem
- Reordenar dentro da categoria
- Excluir (com confirmação)

### Formulário de Categoria

**Campos:**
| Campo | Tipo | Validação |
|---|---|---|
| `name` | texto | obrigatório, min 2, max 50 caracteres |
| `active` | checkbox | padrão `true` |

### Formulário de Item

**Campos:**
| Campo | Tipo | Validação |
|---|---|---|
| `name` | texto | obrigatório, min 2, max 100 caracteres |
| `description` | textarea | opcional, max 300 caracteres |
| `price` | number (centavos) | obrigatório, min 0 |
| `imageUrl` | file upload | opcional, image/*, max 5 MB |
| `available` | checkbox | padrão `true` |

## Configurações — `/settings`

### Seções

1. **Informações do Restaurante**
   - Nome (`name`)
   - Descrição (`description`)
   - Endereço (`address`)
   - WhatsApp (`whatsapp`)
   - Logo (upload)

2. **Link do Cardápio**
   - Exibe o slug (read-only, imutável)
   - Exibe a URL completa com botão de copiar
   - QR Code para download

3. **Conta**
   - Email (read-only, vem do Firebase Auth)
   - Botão de alterar senha (envia email de reset)
   - Botão de excluir conta (perigoso, com confirmação)

### Formulário de Informações

**Campos:**
| Campo | Tipo | Validação |
|---|---|---|
| `name` | texto | obrigatório, min 2, max 100 |
| `description` | textarea | opcional, max 500 |
| `address` | texto | opcional, max 200 |
| `whatsapp` | texto | opcional, formato numérico |
| `logo` | file | opcional, image/*, max 5 MB |

## Auth Pages

### Login — `/auth/login`

- Formulário com email e senha
- Validação client-side com Zod + React Hook Form
- Submit: `signInWithEmailAndPassword` → `POST /api/auth/session`
- Link para `/auth/signup` e `/auth/forgot-password`
- Redirect para `/dashboard` após sucesso (ou `?redirect=` param)

### Signup — `/auth/signup`

- Campos: nome do usuário, email, senha, nome do restaurante
- Validação client-side com Zod + React Hook Form
- Submit: Server Action que cria user + tenant + claims + session
- Redirect para `/dashboard` após sucesso

### Forgot Password — `/auth/forgot-password`

- Campo de email
- Submit: `sendPasswordResetEmail` (client SDK)
- Feedback de sucesso/erro

## Componentes Compartilhados Admin

```
src/components/
├── admin/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── tenant-status-badge.tsx
│   ├── category-card.tsx
│   ├── menu-item-card.tsx
│   ├── image-upload.tsx
│   └── confirm-dialog.tsx
└── ui/                         # shadcn/ui components
```

## Estados e Feedback

- Loading states com skeleton em listas
- Toast notifications para ações (criado, atualizado, excluído, erro)
- Formulários desabilitados durante submit (`isSubmitting`)
- Confirmação modal para ações destrutivas (excluir)
