export const BRAND_NAME = "Mesio";
export const BRAND_TAGLINE = "Sua presença digital começa aqui.";
export const BRAND_DESCRIPTION =
  "Plataforma moderna para restaurantes. Sua presença digital começa aqui.";
export const BRAND_KEYWORDS = [
  "restaurantes",
  "presença digital",
  "site para restaurantes",
  "gestão online",
  "Mesio",
];

export const BRAND_COLORS = {
  primary: "#F4B400",
  secondary: "#18181B",
  background: "#FFFFFF",
  neutral: "#F4F4F5",
  success: "#22C55E",
} as const;

export const BRAND_TYPOGRAPHY = {
  primary: "Plus Jakarta Sans",
  fallback: "Inter, system-ui, sans-serif",
} as const;

export const BRAND_DOMAIN_FALLBACK = "mesio.app";

/** Minimum display sizes (px) */
export const BRAND_MIN_SIZES = {
  icon: 16,
  logoHorizontal: 80,
  logoVertical: 64,
} as const;

/** Clear space = height of one pillar in the mark */
export const BRAND_CLEAR_SPACE_RATIO = 0.25;

export function getPublicUrlDisplay(slug: string, baseUrl?: string): string {
  if (baseUrl) {
    try {
      const hostname = new URL(baseUrl.replace(/\/$/, "")).hostname;
      return `${hostname}/${slug}`;
    } catch {
      // fall through to fallback
    }
  }
  return `${BRAND_DOMAIN_FALLBACK}/${slug}`;
}
