import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { InviteAcceptClient } from "@/features/auth/invite-accept-client";
import { getInvitePreviewByTokenServer } from "@/services/platform/invite.service";

export const metadata: Metadata = { title: "Aceitar convite — Mesio" };

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const preview = await getInvitePreviewByTokenServer(token);

  if (!preview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <Logo size="md" href="/" className="mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Convite inválido</h1>
            <p className="text-sm text-muted-foreground">
              Este link de convite não existe ou não é mais válido.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/auth/login">Ir para login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <InviteAcceptClient token={token} preview={preview} />;
}
