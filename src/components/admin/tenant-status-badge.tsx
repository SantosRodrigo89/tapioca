import { Badge } from "@/components/ui/badge";
import type { TenantStatus } from "@/types";

const statusConfig: Record<
  TenantStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  trial: { label: "Trial", variant: "secondary" },
  active: { label: "Ativo", variant: "default" },
  suspended: { label: "Suspenso", variant: "destructive" },
  cancelled: { label: "Cancelado", variant: "outline" },
};

interface TenantStatusBadgeProps {
  status: TenantStatus;
}

export function TenantStatusBadge({ status }: TenantStatusBadgeProps) {
  const { label, variant } = statusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}
