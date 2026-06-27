import type { Plan, PlanStatus } from "@/types/platform/plan";

export interface PlanListItem {
  id: Plan["id"];
  name: string;
  description: string;
  priceCents: number;
  color: string;
  order: number;
  status: PlanStatus;
}

export function serializePlanForClient(plan: Plan): PlanListItem {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    priceCents: plan.priceCents,
    color: plan.color,
    order: plan.order,
    status: plan.status,
  };
}

export function formatPlanPrice(priceCents: number): string {
  if (priceCents <= 0) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}
