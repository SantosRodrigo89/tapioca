"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { identifyUser } from "@/lib/analytics/posthog-client";
import { getClientAuth } from "@/lib/firebase/client";
import posthog from "posthog-js";
import {
  AcceptInviteFormSchema,
  type AcceptInviteFormInput,
} from "@/lib/schemas/platform/accept-invite.schema";
import type { InvitePreview } from "@/services/platform/invite.service";

interface InviteAcceptClientProps {
  token: string;
  preview: InvitePreview;
}

export function InviteAcceptClient({ token, preview }: InviteAcceptClientProps) {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteFormInput>({
    resolver: zodResolver(AcceptInviteFormSchema),
  });

  const loginRedirect = `/auth/login?redirect=${encodeURIComponent(`/auth/invite/${token}`)}`;

  const acceptWithSession = async () => {
    setServerError(null);
    setAccepting(true);
    try {
      const res = await fetch(`/api/invites/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Falha ao aceitar convite");

      const idToken = await refreshAuthTokenAndGetToken();
      if (idToken) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
      }

      if (user) {
        identifyUser(user.uid, { email: user.email, role: user.role, tenantId: user.tenantId });
      }
      posthog.capture(ANALYTICS_EVENTS.INVITE_ACCEPTED);

      router.push("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao aceitar convite");
    } finally {
      setAccepting(false);
    }
  };

  const onSubmit = async (data: AcceptInviteFormInput) => {
    setServerError(null);
    try {
      const res = await fetch(`/api/invites/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { error?: string; email?: string };
      if (!res.ok) {
        if (body.error?.includes("já possui conta")) {
          throw new Error(body.error);
        }
        throw new Error(body.error ?? "Falha ao aceitar convite");
      }

      const authUser = await signIn(preview.email, data.password!);
      identifyUser(authUser.uid, { email: authUser.email, role: authUser.role, tenantId: authUser.tenantId });
      posthog.capture(ANALYTICS_EVENTS.INVITE_ACCEPTED);
      router.push("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Erro ao aceitar convite");
    }
  };

  if (preview.status === "accepted") {
    return (
      <InviteShell>
        <h1 className="text-2xl font-bold tracking-tight">Convite já aceito</h1>
        <p className="text-sm text-muted-foreground">
          Este convite para <strong>{preview.tenantName}</strong> já foi utilizado.
        </p>
        <Button asChild>
          <Link href="/auth/login">Ir para login</Link>
        </Button>
      </InviteShell>
    );
  }

  if (preview.status === "cancelled") {
    return (
      <InviteShell>
        <h1 className="text-2xl font-bold tracking-tight">Convite cancelado</h1>
        <p className="text-sm text-muted-foreground">
          Entre em contato com o suporte da plataforma para solicitar um novo convite.
        </p>
      </InviteShell>
    );
  }

  if (preview.status === "expired" || preview.expired) {
    return (
      <InviteShell>
        <h1 className="text-2xl font-bold tracking-tight">Convite expirado</h1>
        <p className="text-sm text-muted-foreground">
          O convite para <strong>{preview.tenantName}</strong> expirou em{" "}
          {preview.expiresAt.toLocaleDateString("pt-BR")}.
        </p>
      </InviteShell>
    );
  }

  const emailMatchesSession =
    user?.email?.toLowerCase() === preview.email.toLowerCase();

  return (
    <InviteShell>
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Aceitar convite</h1>
        <p className="text-sm text-muted-foreground">
          Você foi convidado para administrar{" "}
          <strong>{preview.tenantName}</strong>
        </p>
      </div>

      <div className="rounded-lg border p-4 text-sm space-y-2 text-left">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Administrador</span>
          <span className="font-medium">{preview.adminName}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">E-mail</span>
          <span className="font-medium break-all">{preview.email}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Expira em</span>
          <span>{preview.expiresAt.toLocaleDateString("pt-BR")}</span>
        </div>
      </div>

      {serverError && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {serverError}
          {serverError.includes("já possui conta") ? (
            <p className="mt-2">
              <Link href={loginRedirect} className="underline font-medium">
                Fazer login
              </Link>
            </p>
          ) : null}
        </div>
      )}

      {!loading && user && emailMatchesSession ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Conectado como {user.email}
          </p>
          <Button
            className="w-full"
            onClick={acceptWithSession}
            disabled={accepting}
          >
            {accepting ? "Aceitando…" : "Aceitar convite"}
          </Button>
        </div>
      ) : !loading && user && !emailMatchesSession ? (
        <div className="space-y-3 text-sm text-center">
          <p className="text-muted-foreground">
            Você está logado com outro e-mail. Saia e entre com{" "}
            <strong>{preview.email}</strong>.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href={loginRedirect}>Trocar conta</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="password">Criar senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta…" : "Aceitar convite e criar conta"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Já tem conta?{" "}
            <Link href={loginRedirect} className="underline">
              Fazer login
            </Link>
          </p>
        </form>
      )}
    </InviteShell>
  );
}

async function refreshAuthTokenAndGetToken(): Promise<string | null> {
  const user = getClientAuth().currentUser;
  if (!user) return null;
  return user.getIdToken(true);
}

function InviteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo size="md" href="/" />
        </div>
        {children}
      </div>
    </div>
  );
}
