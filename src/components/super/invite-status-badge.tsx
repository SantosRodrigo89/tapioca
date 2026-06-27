import { Badge } from "@/components/ui/badge";
import type { InviteStatus } from "@/types/platform/invite";

const statusConfig: Record<
  InviteStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pendente", variant: "secondary" },
  accepted: { label: "Aceito", variant: "default" },
  expired: { label: "Expirado", variant: "outline" },
  cancelled: { label: "Cancelado", variant: "destructive" },
};

interface InviteStatusBadgeProps {
  status: InviteStatus;
}

export function InviteStatusBadge({ status }: InviteStatusBadgeProps) {
  const { label, variant } = statusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}
