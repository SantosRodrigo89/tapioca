import type { Metadata } from "next";
import { listPlansServer } from "@/lib/repositories/server/platform/plan.server";
import { listTemplatesServer } from "@/lib/repositories/server/platform/template.server";
import { getPlatformSettingsServer } from "@/lib/repositories/server/platform/platform-settings.server";
import { getDefaultPlanId } from "@/lib/platform/plans/default-plans";
import { CreateRestaurantWizard } from "@/features/super/restaurants/create-restaurant-wizard/create-restaurant-wizard";

export const metadata: Metadata = { title: "Novo Restaurante — Super Admin" };

export default async function NewRestaurantPage() {
  const [plans, templates, settings] = await Promise.all([
    listPlansServer(),
    listTemplatesServer(),
    getPlatformSettingsServer(),
  ]);

  const activePlans = plans.filter((p) => p.status === "active");
  const activeTemplates = templates.filter((t) => t.status === "active");

  return (
    <CreateRestaurantWizard
      plans={(activePlans.length > 0 ? activePlans : plans).map((p) => ({
        id: p.id,
        name: p.name,
      }))}
      templates={(activeTemplates.length > 0 ? activeTemplates : templates).map(
        (t) => ({
          id: t.id,
          name: t.name,
          category: t.category,
        }),
      )}
      defaultPlanId={settings.defaultPlanId || getDefaultPlanId()}
    />
  );
}
