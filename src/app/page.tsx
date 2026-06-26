import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { BRAND_TAGLINE } from "@/lib/brand";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-lg space-y-8">
        <Logo size="lg" href="/" priority className="mx-auto" />
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">{BRAND_TAGLINE}</p>
          <p className="text-muted-foreground/80 text-sm">
            Site, cardápio digital e presença online em minutos.
          </p>
        </div>
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
