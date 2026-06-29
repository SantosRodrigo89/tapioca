import type { FeatureId } from "@/types/platform";
import type { Plan, PlanId } from "@/types/platform/plan";

const FUTURE_FEATURES = {
  orders: false,
  analytics: false,
  ai: false,
  crm: false,
  marketing: false,
  reservations: false,
} as const satisfies Partial<Record<FeatureId, boolean>>;

const STARTER_FEATURES = {
  landing_page: true,
  qr_code: true,
  gallery: false,
  products: true,
  categories: true,
  premium_themes: false,
  custom_domain: false,
  ...FUTURE_FEATURES,
} as const satisfies Partial<Record<FeatureId, boolean>>;

const PRO_FEATURES = {
  ...STARTER_FEATURES,
  gallery: true,
  premium_themes: true,
  analytics: true,
} as const satisfies Partial<Record<FeatureId, boolean>>;

const PREMIUM_FEATURES = {
  ...PRO_FEATURES,
  custom_domain: true,
  marketing: true,
} as const satisfies Partial<Record<FeatureId, boolean>>;

const ENTERPRISE_FEATURES = {
  landing_page: true,
  qr_code: true,
  gallery: true,
  products: true,
  categories: true,
  premium_themes: true,
  custom_domain: true,
  orders: true,
  analytics: true,
  ai: true,
  crm: true,
  marketing: true,
  reservations: true,
} as const satisfies Partial<Record<FeatureId, boolean>>;

const PLAN_FEATURE_MAP: Record<PlanId, Partial<Record<FeatureId, boolean>>> = {
  starter: STARTER_FEATURES,
  pro: PRO_FEATURES,
  premium: PREMIUM_FEATURES,
  enterprise: ENTERPRISE_FEATURES,
};

const PLAN_DEFINITIONS: Omit<Plan, "createdAt" | "updatedAt">[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Ideal para começar a presença digital",
    priceCents: 0,
    color: "#64748b",
    order: 0,
    status: "active",
    features: PLAN_FEATURE_MAP.starter,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Para restaurantes em crescimento",
    priceCents: 9900,
    color: "#2563eb",
    order: 1,
    status: "active",
    features: PLAN_FEATURE_MAP.pro,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Recursos avançados para operações maiores",
    priceCents: 19900,
    color: "#7c3aed",
    order: 2,
    status: "active",
    features: PLAN_FEATURE_MAP.premium,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Solução completa para redes e franquias",
    priceCents: 0,
    color: "#0f172a",
    order: 3,
    status: "active",
    features: PLAN_FEATURE_MAP.enterprise,
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

export function getPlanFeatureDefaults(
  planId: PlanId,
): Partial<Record<FeatureId, boolean>> {
  return PLAN_FEATURE_MAP[planId];
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
