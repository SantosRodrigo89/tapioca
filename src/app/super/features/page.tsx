import type { Metadata } from "next";
import { listFeaturesServer } from "@/lib/repositories/server/platform/feature.server";
import { listPlansServer } from "@/lib/repositories/server/platform/plan.server";
import { listTenantsMinimalServer } from "@/lib/repositories/server/tenant.server";
import { FeaturesPage } from "@/features/super/features/features-page";
import type { PlanFeaturesItem } from "@/features/super/features/feature-types";

export const metadata: Metadata = { title: "Recursos — Super Admin" };

export default async function SuperFeaturesRoute() {
  const [features, plans, tenants] = await Promise.all([
    listFeaturesServer(),
    listPlansServer(),
    listTenantsMinimalServer(),
  ]);

  const planItems: PlanFeaturesItem[] = plans.map((p) => ({
    id: p.id,
    name: p.name,
    features: p.features,
  }));

  return (
    <FeaturesPage
      initialFeatures={features}
      initialPlans={planItems}
      initialTenants={tenants.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        planId: t.planId ?? "starter",
        featureOverrides: t.featureOverrides,
      }))}
    />
  );
}
