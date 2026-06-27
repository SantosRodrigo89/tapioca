import { resolveEnabledSections } from "@/services/site.service";
import type { LandingPageData } from "./landing-types";

export interface LandingNavItem {
  href: string;
  label: string;
  targetId: string;
}

export function resolveLandingNavItems(
  data: LandingPageData,
): LandingNavItem[] {
  const enabled = new Set(
    resolveEnabledSections(data.siteConfig).map((s) => s.id),
  );
  const items: LandingNavItem[] = [];

  if (
    enabled.has("about") &&
    (data.siteConfig.about.description || data.siteConfig.about.imageUrl)
  ) {
    items.push({ href: "#sobre", label: "Sobre", targetId: "sobre" });
  }

  if (enabled.has("menu")) {
    items.push({ href: "#cardapio", label: "Cardápio", targetId: "cardapio" });
  }

  if (enabled.has("gallery") && data.gallery.length > 0) {
    items.push({ href: "#galeria", label: "Galeria", targetId: "galeria" });
  }

  const contact = data.siteConfig.contact;
  const hasContact =
    contact.whatsapp ||
    contact.phone ||
    contact.email ||
    contact.instagram ||
    contact.facebook ||
    contact.tiktok ||
    data.siteConfig.location.address ||
    data.tenant.address ||
    data.tenant.openingHours;

  if (enabled.has("contact") && hasContact) {
    items.push({ href: "#contato", label: "Contato", targetId: "contato" });
  }

  const location = data.siteConfig.location;
  const hasLocation =
    location.address ||
    data.tenant.address ||
    location.directionsUrl ||
    (location.lat != null && location.lng != null);

  if (enabled.has("location") && hasLocation) {
    items.push({
      href: "#localizacao",
      label: "Localização",
      targetId: "localizacao",
    });
  }

  return items;
}
