import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

// TODO: substituir wordmark por logo Mesio em src/assets/brand/logo.png

const sizeClasses = {
  xs: "text-sm font-bold tracking-tight",
  sm: "text-lg font-bold tracking-tight",
  md: "text-3xl font-bold tracking-tight",
  lg: "text-6xl font-bold tracking-tight",
} as const;

interface LogoProps {
  size?: keyof typeof sizeClasses;
  href?: string;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = "md",
  href,
  className,
}: LogoProps) {
  const wordmark = (
    <span
      role="img"
      aria-label={`${BRAND_NAME} — ${BRAND_TAGLINE}`}
      className={cn(
        "inline-flex shrink-0 text-foreground",
        sizeClasses[size],
        className,
      )}
    >
      {BRAND_NAME}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {wordmark}
      </Link>
    );
  }

  return wordmark;
}
