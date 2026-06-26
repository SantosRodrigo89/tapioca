import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { TenantStatusBadge } from "@/components/admin/tenant-status-badge";
import { OnboardingCards } from "@/features/dashboard/onboarding-cards";
import { SummaryCards } from "@/features/dashboard/summary-cards";
import { QuickActions } from "@/features/dashboard/quick-actions";
import {
  getDashboardStats,
  getOnboardingTasks,
} from "@/services/onboarding.service";
import { getPublicUrlDisplay } from "@/lib/brand";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenant = await getTenantByIdServer(sessionUser.tenantId as string);
  if (!tenant) redirect("/auth/login");

  const categories = await getCategoriesByTenantServer(tenant.id);
  const allItems = (
    await Promise.all(
      categories.map((c) => getItemsByCategoryServer(tenant.id, c.id)),
    )
  ).flat();

  const stats = getDashboardStats(categories, allItems);
  const tasks = getOnboardingTasks(tenant, stats);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const publicUrl = baseUrl ? `${baseUrl}/${tenant.slug}` : `/${tenant.slug}`;
  const publicUrlDisplay = getPublicUrlDisplay(
    tenant.slug,
    process.env.NEXT_PUBLIC_APP_URL,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
          <TenantStatusBadge status={tenant.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          Centro de comando da sua presença digital
        </p>
      </div>

      <OnboardingCards tasks={tasks} />
      <SummaryCards stats={stats} publicUrlDisplay={publicUrlDisplay} />
      <QuickActions publicUrl={publicUrl} slug={tenant.slug} />
    </div>
  );
}
