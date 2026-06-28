import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import {
  requireFeature,
  requireTenantEntitlements,
} from "@/lib/platform/require-entitlements.server";
import { getComplementsByTenantServer } from "@/lib/repositories/server/complement.server";
import { ComplementsPanel } from "@/features/cardapio/complements-panel";

export const metadata: Metadata = { title: "Complementos" };

export default async function MenuComplementsPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenantId = sessionUser.tenantId as string;
  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) redirect("/auth/login");

  const entitlements = await requireTenantEntitlements(tenant);
  requireFeature(entitlements, "products");

  const complements = await getComplementsByTenantServer(tenantId);

  return (
    <Suspense>
      <ComplementsPanel tenantId={tenantId} initialComplements={complements} />
    </Suspense>
  );
}
