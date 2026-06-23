# tapioca

SaaS de cardápio digital multi-tenant para restaurantes, bares e lanchonetes.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Firebase** (Auth, Firestore, Storage)
- **shadcn/ui** + Radix UI
- **Zod** + **React Hook Form**

## Estrutura

```
src/
├── app/
│   ├── (admin)/          # Painel do restaurante (autenticado)
│   ├── (public)/[slug]/  # Cardápio público via slug
│   └── auth/             # Login, signup, forgot-password
├── components/
│   ├── admin/            # Componentes do painel admin
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

### Com Firebase Emulator

```bash
npx firebase emulators:start
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true npm run dev
```

## Especificação

A especificação completa do produto (SDD) está disponível no canvas `menudigital-sdd-specs.canvas.tsx`.
