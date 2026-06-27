import { DEFAULT_PLATFORM_FEATURES } from "@/lib/platform/features/feature-catalog";
import { getDefaultPlans } from "@/lib/platform/plans/default-plans";
import { getDefaultTemplates } from "@/lib/platform/templates/default-templates";
import { upsertFeatureServer } from "@/lib/repositories/server/platform/feature.server";
import { upsertPlanServer } from "@/lib/repositories/server/platform/plan.server";
import {
  getDefaultPlatformSettings,
  upsertPlatformSettingsServer,
} from "@/lib/repositories/server/platform/platform-settings.server";
import { upsertTemplateServer } from "@/lib/repositories/server/platform/template.server";

export interface SeedPlatformResult {
  plans: number;
  features: number;
  templates: number;
  settings: boolean;
}

export async function seedPlatformServer(): Promise<SeedPlatformResult> {
  const plans = getDefaultPlans();
  for (const plan of plans) {
    await upsertPlanServer(plan);
  }

  for (const feature of DEFAULT_PLATFORM_FEATURES) {
    await upsertFeatureServer(feature);
  }

  const templates = getDefaultTemplates();
  for (const template of templates) {
    await upsertTemplateServer(template);
  }

  await upsertPlatformSettingsServer(getDefaultPlatformSettings());

  return {
    plans: plans.length,
    features: DEFAULT_PLATFORM_FEATURES.length,
    templates: templates.length,
    settings: true,
  };
}

export async function isPlatformSeededServer(): Promise<boolean> {
  const { listPlansServer } = await import(
    "@/lib/repositories/server/platform/plan.server"
  );
  const plans = await listPlansServer();
  return plans.length > 0;
}
