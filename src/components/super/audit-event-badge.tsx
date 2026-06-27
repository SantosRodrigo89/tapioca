import { Badge } from "@/components/ui/badge";
import { AUDIT_EVENT_LABELS } from "@/features/super/logs/audit-labels";
import type { AuditEventType } from "@/types/platform/audit-log";

const variantMap: Partial<
  Record<AuditEventType, "default" | "secondary" | "destructive" | "outline">
> = {
  tenant_created: "default",
  invite_accepted: "secondary",
  login: "outline",
  plan_changed: "outline",
  settings_changed: "outline",
  suspended: "destructive",
  reactivated: "default",
};

interface AuditEventBadgeProps {
  type: AuditEventType;
}

export function AuditEventBadge({ type }: AuditEventBadgeProps) {
  return (
    <Badge variant={variantMap[type] ?? "outline"}>
      {AUDIT_EVENT_LABELS[type]}
    </Badge>
  );
}
