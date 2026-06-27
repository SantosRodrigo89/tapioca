import { Badge } from "@/components/ui/badge";
import type { TemplateStatus } from "@/types/platform/template";

const statusConfig: Record<
  TemplateStatus,
  { label: string; variant: "default" | "outline" }
> = {
  active: { label: "Ativo", variant: "default" },
  inactive: { label: "Inativo", variant: "outline" },
};

interface TemplateStatusBadgeProps {
  status: TemplateStatus;
}

export function TemplateStatusBadge({ status }: TemplateStatusBadgeProps) {
  const { label, variant } = statusConfig[status];
  return <Badge variant={variant}>{label}</Badge>;
}
