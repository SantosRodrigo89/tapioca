import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso da plataforma Mesio.",
  robots: { index: true, follow: true },
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Logo size="sm" href="/" className="mb-10" />
        <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
        <p className="mt-4 text-muted-foreground">
          Esta página será atualizada com os termos de uso completos da Mesio.
          Para informações sobre contratação e uso da plataforma, entre em
          contato pelo e-mail{" "}
          <a
            href="mailto:contato@mesio.com.br"
            className="text-foreground underline underline-offset-4"
          >
            contato@mesio.com.br
          </a>
          .
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-medium text-primary hover:underline"
        >
          ← Voltar para a home
        </Link>
      </div>
    </main>
  );
}
