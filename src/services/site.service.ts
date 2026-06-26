import type { Tenant } from "@/types";
import type { SiteConfig, SiteSectionConfig, SiteSectionId } from "@/types/site";

/** Default section order for the public landing page */
export const DEFAULT_SECTION_ORDER: SiteSectionId[] = [
  "hero",
  "about",
  "differentials",
  "featured",
  "menu",
  "gallery",
  "contact",
  "location",
  "footer",
];

const FUTURE_SECTIONS: SiteSectionId[] = ["faq", "testimonials"];

function buildDefaultSections(): SiteSectionConfig[] {
  const active = DEFAULT_SECTION_ORDER.map((id, index) => ({
    id,
    enabled: true,
    order: index,
  }));

  const future = FUTURE_SECTIONS.map((id, index) => ({
    id,
    enabled: false,
    order: DEFAULT_SECTION_ORDER.length + index,
  }));

  return [...active, ...future];
}

export function createDefaultSiteConfig(): SiteConfig {
  return {
    sections: buildDefaultSections(),
    identity: {},
    hero: {},
    about: {},
    differentials: [],
    featured: { itemIds: [], maxCount: 6 },
    contact: {},
    location: {},
    seo: {},
    faq: [],
    testimonials: [],
  };
}

/**
 * Merges persisted siteConfig with tenant legacy fields.
 * When siteConfig is absent, derives values from existing tenant data.
 */
export function resolveSiteConfig(
  tenant: Tenant,
  persisted?: Partial<SiteConfig> | null,
): SiteConfig {
  const defaults = createDefaultSiteConfig();

  const merged: SiteConfig = {
    sections: persisted?.sections ?? defaults.sections,
    identity: { ...defaults.identity, ...persisted?.identity },
    hero: { ...defaults.hero, ...persisted?.hero },
    about: { ...defaults.about, ...persisted?.about },
    differentials: persisted?.differentials ?? defaults.differentials,
    featured: { ...defaults.featured, ...persisted?.featured },
    contact: { ...defaults.contact, ...persisted?.contact },
    location: { ...defaults.location, ...persisted?.location },
    seo: { ...defaults.seo, ...persisted?.seo },
    faq: persisted?.faq ?? defaults.faq,
    testimonials: persisted?.testimonials ?? defaults.testimonials,
  };

  if (!merged.hero.title && tenant.name) {
    merged.hero.title = tenant.name;
  }
  if (!merged.hero.imageUrl && tenant.bannerUrl) {
    merged.hero.imageUrl = tenant.bannerUrl;
  }
  if (!merged.about.description && tenant.description) {
    merged.about.description = tenant.description;
  }
  if (merged.featured.itemIds.length === 0 && tenant.highlightItemIds?.length) {
    merged.featured.itemIds = tenant.highlightItemIds;
  }
  if (!merged.contact.whatsapp && tenant.whatsapp) {
    merged.contact.whatsapp = tenant.whatsapp;
  }
  if (!merged.location.address && tenant.address) {
    merged.location.address = tenant.address;
  }
  if (!merged.seo.title && tenant.name) {
    merged.seo.title = tenant.name;
  }
  if (!merged.seo.description && tenant.description) {
    merged.seo.description = tenant.description;
  }
  if (!merged.seo.ogImageUrl) {
    merged.seo.ogImageUrl = tenant.bannerUrl ?? tenant.logoUrl;
  }

  return merged;
}

/** Returns enabled sections sorted by order */
export function resolveEnabledSections(
  siteConfig: SiteConfig,
): SiteSectionConfig[] {
  return [...siteConfig.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);
}
