import { cn } from "@/lib/utils";
import { SafeExternalLink } from "@/components/public/safe-external-link";

type LandingButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "hero-outline";

type LandingButtonSize = "sm" | "md" | "lg";

interface LandingButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: LandingButtonVariant;
  size?: LandingButtonSize;
  icon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

const sizeClasses: Record<LandingButtonSize, string> = {
  sm: "landing-btn landing-btn--sm",
  md: "landing-btn landing-btn--md",
  lg: "landing-btn landing-btn--lg",
};

const variantClasses: Record<LandingButtonVariant, string> = {
  primary: "landing-btn--primary",
  secondary: "landing-btn--secondary",
  outline: "landing-btn--outline",
  ghost: "landing-btn--ghost",
  "hero-outline": "landing-btn--hero-outline",
};

export function LandingButton({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  ariaLabel,
}: LandingButtonProps) {
  return (
    <SafeExternalLink
      href={href}
      ariaLabel={ariaLabel}
      className={cn(
        "landing-btn",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {icon}
      {children}
    </SafeExternalLink>
  );
}
