import Link from "next/link";
import { Logo } from "@/components/brand/logo";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AccountBlockedPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const isCancelled = status === "cancelled";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-8">
        <Logo size="md" />
      </div>
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold">
          {isCancelled ? "Conta encerrada" : "Conta suspensa"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isCancelled
            ? "O acesso ao painel foi encerrado. Se acredita que isso é um erro, entre em contato com o suporte."
            : "Sua conta está temporariamente suspensa. Entre em contato com o suporte para regularizar o acesso."}
        </p>
        <Link
          href="/auth/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
