import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { MesioMark, type MesioMarkVariant } from "@/components/brand/mesio-mark";

type LogoLayout = "horizontal" | "vertical" | "icon";
type LogoTheme = "default" | "light" | "monochrome-dark" | "monochrome-white";

const sizeConfig = {
  xs: { mark: 20, text: "text-sm", gap: "gap-1.5", layout: "horizontal" as const },
  sm: { mark: 24, text: "text-base", gap: "gap-2", layout: "horizontal" as const },
  md: { mark: 32, text: "text-xl", gap: "gap-2.5", layout: "horizontal" as const },
  lg: { mark: 48, text: "text-4xl", gap: "gap-3", layout: "vertical" as const },
} as const;

const textColor: Record<LogoTheme, string> = {
  default: "text-[#18181B]",
  light: "text-white",
  "monochrome-dark": "text-[#18181B]",
  "monochrome-white": "text-white",
};

interface LogoProps {
  size?: keyof typeof sizeConfig;
  layout?: LogoLayout;
  theme?: LogoTheme;
  href?: string;
  className?: string;
  showWordmark?: boolean;
  priority?: boolean;
}

export function Logo({
  size = "md",
  layout,
  theme = "default",
  href,
  className,
  showWordmark = true,
}: LogoProps) {
  const config = sizeConfig[size];
  const resolvedLayout = layout ?? config.layout;
  const markVariant = theme as MesioMarkVariant;

  const content = (
    <span
      role="img"
      aria-label={`${BRAND_NAME} — ${BRAND_TAGLINE}`}
      className={cn(
        "inline-flex items-center",
        resolvedLayout === "vertical" ? "flex-col" : "flex-row",
        config.gap,
        className,
      )}
    >
      <MesioMark size={config.mark} variant={markVariant} aria-hidden />
      {showWordmark && (
        <span
          className={cn(
            "font-semibold tracking-tight leading-none",
            config.text,
            textColor[theme],
          )}
        >
          {BRAND_NAME}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
