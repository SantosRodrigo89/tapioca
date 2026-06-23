import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight">Tapioca</h1>
        <p className="text-muted-foreground text-lg">
          Cardápio digital para restaurantes, bares e lanchonetes.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/auth/signup"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Começar grátis
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
