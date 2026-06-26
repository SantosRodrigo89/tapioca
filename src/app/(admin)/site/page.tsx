import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";

export const metadata: Metadata = { title: "Presença Digital" };

export default async function SitePage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenant = await getTenantByIdServer(sessionUser.tenantId);
  if (!tenant) redirect("/auth/login");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Presença Digital</h1>
        <p className="text-sm text-muted-foreground">
          Configure a landing page de {tenant.name}. O editor completo será
          disponibilizado em breve.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
        Editor da landing page em construção — Aparência, Banner, Sobre,
        Galeria, Contato, Horários, SEO e QR Code.
      </div>
    </div>
  );
}
