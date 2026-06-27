import type { Tenant } from "@/types";
import type { SiteConfig, SiteSectionConfig, SiteSectionId } from "@/types/site";
import { sanitizeHref } from "@/lib/utils/safe-url";

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
    menuExperience: {
      productDrawerActions: ["share", "copy-link", "whatsapp"],
    },
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
    menuExperience: {
      ...defaults.menuExperience,
      ...persisted?.menuExperience,
    },
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

function sanitizeSiteConfigLinks(config: SiteConfig): SiteConfig {
  const heroButtons = config.hero.buttons
    ?.map((btn) => {
      const href = sanitizeHref(btn.href);
      return href ? { ...btn, href } : null;
    })
    .filter((btn): btn is NonNullable<typeof btn> => btn !== null);

  return {
    ...config,
    hero: {
      ...config.hero,
      buttons: heroButtons?.length ? heroButtons : undefined,
    },
    contact: {
      ...config.contact,
      instagram: config.contact.instagram
        ? sanitizeHref(config.contact.instagram)
        : undefined,
      facebook: config.contact.facebook
        ? sanitizeHref(config.contact.facebook)
        : undefined,
      tiktok: config.contact.tiktok
        ? sanitizeHref(config.contact.tiktok)
        : undefined,
    },
    location: {
      ...config.location,
      directionsUrl: config.location.directionsUrl
        ? sanitizeHref(config.location.directionsUrl)
        : undefined,
    },
  };
}

export function getResolvedSiteConfig(tenant: Tenant): SiteConfig {
  return sanitizeSiteConfigLinks(resolveSiteConfig(tenant, tenant.siteConfig));
}

function mergePartial<T extends object>(existing: T, patch?: Partial<T>): T {
  if (!patch) return existing;
  const merged = { ...existing };
  for (const [key, value] of Object.entries(patch) as [keyof T, T[keyof T]][]) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }
  return merged;
}

export function mergeSiteConfigPatch(
  existing: SiteConfig,
  patch: Partial<SiteConfig>,
): SiteConfig {
  return {
    sections: patch.sections ?? existing.sections,
    identity: mergePartial(existing.identity, patch.identity),
    hero: mergePartial(existing.hero, patch.hero),
    about: mergePartial(existing.about, patch.about),
    differentials: patch.differentials ?? existing.differentials,
    featured: mergePartial(existing.featured, patch.featured),
    contact: mergePartial(existing.contact, patch.contact),
    location: mergePartial(existing.location, patch.location),
    seo: mergePartial(existing.seo, patch.seo),
    faq: patch.faq ?? existing.faq,
    testimonials: patch.testimonials ?? existing.testimonials,
    menuExperience: mergePartial(existing.menuExperience ?? {}, patch.menuExperience),
  };
}

/** Returns enabled sections sorted by order */
export function resolveEnabledSections(
  siteConfig: SiteConfig,
): SiteSectionConfig[] {
  return [...siteConfig.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);
}
