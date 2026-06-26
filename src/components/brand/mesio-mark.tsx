import { cn } from "@/lib/utils";
import { BRAND_COLORS } from "@/lib/brand";

export type MesioMarkVariant =
  | "default"
  | "light"
  | "monochrome-dark"
  | "monochrome-white";

const variantColors: Record<
  MesioMarkVariant,
  { pillar: string; accent: string }
> = {
  default: { pillar: BRAND_COLORS.secondary, accent: BRAND_COLORS.primary },
  light: { pillar: BRAND_COLORS.background, accent: BRAND_COLORS.primary },
  "monochrome-dark": {
    pillar: BRAND_COLORS.secondary,
    accent: BRAND_COLORS.secondary,
  },
  "monochrome-white": {
    pillar: BRAND_COLORS.background,
    accent: BRAND_COLORS.background,
  },
};

interface MesioMarkProps {
  size?: number;
  variant?: MesioMarkVariant;
  className?: string;
  "aria-hidden"?: boolean;
}

/**
 * Mesio Nexus Mark — abstract platform symbol.
 * Two pillars connected by a golden arch (connection, flow, hospitality)
 * with a center node (digital experience focal point).
 */
export function MesioMark({
  size = 32,
  variant = "default",
  className,
  "aria-hidden": ariaHidden = true,
}: MesioMarkProps) {
  const { pillar, accent } = variantColors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden={ariaHidden}
    >
      {/* Left pillar — connection / community */}
      <rect x="5" y="10" width="7" height="18" rx="3.5" fill={pillar} />
      {/* Right pillar */}
      <rect x="20" y="10" width="7" height="18" rx="3.5" fill={pillar} />
      {/* Arch bridge — platform, flow, shared experience */}
      <path
        d="M8.5 10.5C8.5 6.5 11.5 4 16 4C20.5 4 23.5 6.5 23.5 10.5C23.5 12.5 22 13.5 20.5 12.5C19 11.5 17.5 9.5 16 9.5C14.5 9.5 13 11.5 11.5 12.5C10 13.5 8.5 12.5 8.5 10.5Z"
        fill={accent}
      />
      {/* Center node — digital focal point / growth */}
      <circle cx="16" cy="17.5" r="2.25" fill={accent} />
    </svg>
  );
}
