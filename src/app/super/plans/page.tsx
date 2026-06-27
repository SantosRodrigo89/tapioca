import type { Metadata } from "next";
import { listPlansServer } from "@/lib/repositories/server/platform/plan.server";
import { PlansPage } from "@/features/super/plans/plans-page";
import { serializePlanForClient } from "@/features/super/plans/plan-types";

export const metadata: Metadata = { title: "Planos — Super Admin" };

export default async function SuperPlansRoute() {
  const plans = await listPlansServer();

  return (
    <PlansPage initialPlans={plans.map(serializePlanForClient)} />
  );
}
