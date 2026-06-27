import type { FeatureId } from "./feature";

export type PlanId = "starter" | "pro" | "premium" | "enterprise";

export type PlanStatus = "active" | "inactive";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  /** Placeholder — billing not implemented */
  priceCents: number;
  color: string;
  order: number;
  status: PlanStatus;
  features: Partial<Record<FeatureId, boolean>>;
  createdAt: Date;
  updatedAt: Date;
}
