import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade da plataforma Mesio.",
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Logo size="sm" href="/" className="mb-10" />
        <h1 className="text-3xl font-bold tracking-tight">Política de Privacidade</h1>
        <p className="mt-4 text-muted-foreground">
          Esta página será atualizada com a política de privacidade completa da
          Mesio. Enquanto isso, para dúvidas sobre tratamento de dados, entre em
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
