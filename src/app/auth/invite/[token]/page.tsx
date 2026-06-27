import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Aceitar convite — Mesio" };

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <Logo size="md" href="/" className="mx-auto" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Convite Mesio</h1>
          <p className="text-sm text-muted-foreground">
            O fluxo de aceite de convite será concluído na próxima entrega.
          </p>
        </div>
        <p className="text-xs font-mono text-muted-foreground break-all">
          Token: {token}
        </p>
        <Button asChild variant="outline">
          <Link href="/auth/login">Ir para login</Link>
        </Button>
      </div>
    </div>
  );
}
