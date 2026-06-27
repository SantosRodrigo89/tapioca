import { Badge } from "@/components/ui/badge";
import type { PlanStatus } from "@/types/platform/plan";

const statusConfig: Record<
  PlanStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  active: { label: "Ativo", variant: "default" },
  inactive: { label: "Inativo", variant: "outline" },
};

interface PlanStatusBadgeProps {
  status: PlanStatus;
}

export function PlanStatusBadge({ status }: PlanStatusBadgeProps) {
  const { label, variant } = statusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}
