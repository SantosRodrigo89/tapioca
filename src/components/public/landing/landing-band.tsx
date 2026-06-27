import { cn } from "@/lib/utils";

type LandingBandVariant =
  | "contained-white"
  | "tinted-primary"
  | "elevated-surface"
  | "full-bleed";

interface LandingBandProps {
  children: React.ReactNode;
  variant?: LandingBandVariant;
  id?: string;
  className?: string;
  ariaLabelledBy?: string;
}

const variantClasses: Record<LandingBandVariant, string> = {
  "contained-white": "landing-section-band landing-section-band--white",
  "tinted-primary": "landing-section-band landing-section-band--tinted",
  "elevated-surface": "landing-section-band landing-section-band--surface",
  "full-bleed": "landing-section-band landing-section-band--full",
};

export function LandingBand({
  children,
  variant = "contained-white",
  id,
  className,
  ariaLabelledBy,
}: LandingBandProps) {
  return (
    <div
      id={id}
      className={cn(variantClasses[variant], className)}
      {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {})}
    >
      <div className="landing-container">{children}</div>
    </div>
  );
}
