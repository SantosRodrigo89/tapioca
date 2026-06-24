# tapioca

SaaS de cardápio digital multi-tenant para restaurantes, bares e lanchonetes.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Firebase** (Auth, Firestore, Storage)
- **shadcn/ui** + Radix UI
- **Zod** + **React Hook Form**
- **@dnd-kit** (drag-and-drop no catálogo)

## Estrutura

```
src/
├── app/
│   ├── (admin)/          # Painel do restaurante (autenticado)
│   ├── (public)/[slug]/  # Cardápio público via slug
│   ├── super/            # Painel Super Admin
│   └── auth/             # Login, signup, forgot-password
├── assets/brand/         # Logo (fonte única)
├── components/
│   ├── admin/            # Componentes do painel admin
│   ├── brand/            # Logo e identidade
│   ├── public/           # Componentes do cardápio público
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── firebase/         # Firebase client + Admin SDK
│   ├── repositories/     # Abstração sobre o Firestore
│   ├── schemas/          # Schemas Zod
│   └── utils/            # Helpers (formatPrice, generateSlug, etc.)
├── hooks/                # React hooks customizados
├── types/                # TypeScript interfaces
└── specs/                # Especificações SDD em Markdown
```

## Desenvolvimento

```bash
cp .env.example .env.local
# Preencha as variáveis Firebase no .env.local

npm install
npm run dev
```

### Logo

A fonte do logo é `src/assets/brand/logo.png`. Após trocar o arquivo, rode:

```bash
npm run sync:logo
```

Isso copia para `public/logo.png` e `src/app/icon.png` (favicon).

### Com Firebase Emulator

```bash
npx firebase emulators:start
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true npm run dev
```

## Especificação

A especificação completa do produto (SDD) está em `specs/`.
