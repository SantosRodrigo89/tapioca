import { cn } from "@/lib/utils";

interface LandingHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
  titleId?: string;
}

export function LandingHeading({
  title,
  subtitle,
  eyebrow,
  align = "left",
  className,
  titleId,
}: LandingHeadingProps) {
  return (
    <div
      className={cn(
        "landing-heading-block",
        align === "center" && "landing-heading-block--center",
        className,
      )}
    >
      {eyebrow && <p className="landing-eyebrow">{eyebrow}</p>}
      <h2 id={titleId} className="landing-heading">
        {title}
      </h2>
      {subtitle && <p className="landing-subheading">{subtitle}</p>}
    </div>
  );
}
