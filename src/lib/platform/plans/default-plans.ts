import type { FeatureId } from "@/types/platform";
import type { Plan, PlanId } from "@/types/platform/plan";
import { ALL_FEATURES_ENABLED } from "@/lib/platform/features/feature-catalog";

const PLAN_DEFINITIONS: Omit<Plan, "createdAt" | "updatedAt">[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Ideal para começar a presença digital",
    priceCents: 0,
    color: "#64748b",
    order: 0,
    status: "active",
    features: ALL_FEATURES_ENABLED,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para restaurantes em crescimento",
    priceCents: 9900,
    color: "#2563eb",
    order: 1,
    status: "active",
    features: ALL_FEATURES_ENABLED,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Recursos avançados para operações maiores",
    priceCents: 19900,
    color: "#7c3aed",
    order: 2,
    status: "active",
    features: ALL_FEATURES_ENABLED,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Solução completa para redes e franquias",
    priceCents: 0,
    color: "#0f172a",
    order: 3,
    status: "active",
    features: ALL_FEATURES_ENABLED,
  },
];

export function getDefaultPlans(): Omit<Plan, "createdAt" | "updatedAt">[] {
  return PLAN_DEFINITIONS;
}

export function getDefaultPlanId(): PlanId {
  return "starter";
}

export function isPlanId(value: string): value is PlanId {
  return ["starter", "pro", "premium", "enterprise"].includes(value);
}

export function resolvePlanFeature(
  plan: Pick<Plan, "features"> | null | undefined,
  featureId: FeatureId,
  globalDefault: boolean,
): boolean {
  const planValue = plan?.features?.[featureId];
  if (planValue !== undefined) return planValue;
  return globalDefault;
}
