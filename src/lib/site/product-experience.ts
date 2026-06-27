import type { ProductDrawerActionId, SiteConfig } from "@/types/site";

const DEFAULT_DRAWER_ACTIONS: ProductDrawerActionId[] = [
  "share",
  "copy-link",
  "whatsapp",
];

export function resolveProductDrawerActions(
  siteConfig: SiteConfig,
  whatsapp?: string,
): ProductDrawerActionId[] {
  const configured =
    siteConfig.menuExperience?.productDrawerActions ?? DEFAULT_DRAWER_ACTIONS;

  return configured.filter((action) => {
    if (action === "whatsapp") return !!whatsapp;
    return true;
  });
}

export function getProductShareUrl(tenantSlug: string, itemId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  const path = `/${tenantSlug}#produto-${itemId}`;
  return baseUrl ? `${baseUrl}${path}` : path;
}
