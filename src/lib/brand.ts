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
export const BRAND_DOMAIN_FALLBACK = "mesio.app";

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
