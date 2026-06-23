import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenant = await getTenantByIdServer(sessionUser.tenantId as string);
  if (!tenant) redirect("/auth/login");

  return <SettingsClient tenant={tenant} />;
}
