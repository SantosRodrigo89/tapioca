export const BRAND_NAME = "Mesio";
export const BRAND_TAGLINE =
  "A plataforma de presença digital para restaurantes.";
export const BRAND_DESCRIPTION =
  "Plataforma SaaS de presença digital para restaurantes. Site, cardápio digital, QR Code e gestão simples em um só lugar.";
export const BRAND_KEYWORDS = [
  "Mesio",
  "restaurantes",
  "presença digital",
  "plataforma para restaurantes",
  "site para restaurantes",
  "landing page restaurante",
  "cardápio digital",
  "QR Code restaurante",
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

export const BRAND_DOMAIN_FALLBACK = "mesio.com.br";

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
