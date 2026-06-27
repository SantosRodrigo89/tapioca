import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLAN_COLORS: Record<string, string> = {
  starter: "#64748b",
  pro: "#2563eb",
  premium: "#7c3aed",
  enterprise: "#0f172a",
};

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  premium: "Premium",
  enterprise: "Enterprise",
};

interface PlanBadgeProps {
  planId: string;
  className?: string;
}

export function PlanBadge({ planId, className }: PlanBadgeProps) {
  const color = PLAN_COLORS[planId] ?? PLAN_COLORS.starter;
  const label = PLAN_LABELS[planId] ?? planId;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-normal capitalize", className)}
    >
      <span
        className="h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      {label}
    </Badge>
  );
}
