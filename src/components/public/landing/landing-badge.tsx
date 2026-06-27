import { cn } from "@/lib/utils";

type LandingBadgeVariant = "default" | "success" | "danger" | "outline" | "muted";

interface LandingBadgeProps {
  children: React.ReactNode;
  variant?: LandingBadgeVariant;
  className?: string;
}

const variantClasses: Record<LandingBadgeVariant, string> = {
  default: "landing-badge landing-badge--default",
  success: "landing-badge landing-badge--success",
  danger: "landing-badge landing-badge--danger",
  outline: "landing-badge landing-badge--outline",
  muted: "landing-badge landing-badge--muted",
};

export function LandingBadge({
  children,
  variant = "default",
  className,
}: LandingBadgeProps) {
  return (
    <span className={cn(variantClasses[variant], className)}>{children}</span>
  );
}
