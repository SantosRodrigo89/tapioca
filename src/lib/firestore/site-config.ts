import { createDefaultSiteConfig } from "@/services/site.service";
import type {
  SiteAbout,
  SiteButton,
  SiteConfig,
  SiteContact,
  SiteDifferential,
  SiteFaqItem,
  SiteFeatured,
  SiteHero,
  SiteIdentity,
  SiteLocation,
  SiteSectionConfig,
  SiteSectionId,
  SiteSeo,
  SiteSectionCopy,
  SiteSectionHeadingCopy,
  SiteContactSectionCopy,
  SiteTestimonial,
} from "@/types/site";

const VALID_SECTION_IDS = new Set<SiteSectionId>([
  "hero",
  "about",
  "differentials",
  "featured",
  "menu",
  "gallery",
  "contact",
  "location",
  "footer",
  "faq",
  "testimonials",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function parseString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function parseNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function parseStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : undefined;
}

function parseSections(value: unknown): SiteSectionConfig[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const sections = value
    .map((item): SiteSectionConfig | null => {
      if (!isRecord(item)) return null;
      const id = item.id;
      const enabled = parseBoolean(item.enabled);
      const order = parseNumber(item.order);
      if (
        typeof id !== "string" ||
        !VALID_SECTION_IDS.has(id as SiteSectionId) ||
        enabled === undefined ||
        order === undefined
      ) {
        return null;
      }
      return { id: id as SiteSectionId, enabled, order };
    })
    .filter((item): item is SiteSectionConfig => item != null);

  return sections.length > 0 ? sections : undefined;
}

function parseButtons(value: unknown): SiteButton[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const buttons = value
    .map((item): SiteButton | null => {
      if (!isRecord(item)) return null;
      const label = parseString(item.label);
      const href = parseString(item.href);
      if (!label || !href) return null;

      const variant = item.variant;
      if (
        variant !== undefined &&
        variant !== "primary" &&
        variant !== "secondary" &&
        variant !== "outline"
      ) {
        return null;
      }

      return variant ? { label, href, variant } : { label, href };
    })
    .filter((item): item is SiteButton => item != null);

  return buttons.length > 0 ? buttons : undefined;
}

function parseIdentity(value: unknown): SiteIdentity | undefined {
  if (!isRecord(value)) return undefined;

  const typography = value.typography;
  if (
    typography !== undefined &&
    typography !== "plus-jakarta" &&
    typography !== "inter" &&
    typography !== "dm-sans"
  ) {
    return {};
  }

  return typography ? { typography } : {};
}

function parseHero(value: unknown): SiteHero | undefined {
  if (!isRecord(value)) return undefined;

  return {
    title: parseString(value.title),
    subtitle: parseString(value.subtitle),
    imageUrl: parseString(value.imageUrl),
    buttons: parseButtons(value.buttons),
  };
}

function parseAbout(value: unknown): SiteAbout | undefined {
  if (!isRecord(value)) return undefined;

  return {
    title: parseString(value.title),
    description: parseString(value.description),
    imageUrl: parseString(value.imageUrl),
  };
}

function parseDifferentials(value: unknown): SiteDifferential[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const items = value
    .map((item): SiteDifferential | null => {
      if (!isRecord(item)) return null;
      const id = parseString(item.id);
      const title = parseString(item.title);
      if (!id || !title) return null;

      return {
        id,
        title,
        description: parseString(item.description),
      };
    })
    .filter((item): item is SiteDifferential => item != null);

  return items.length > 0 ? items : undefined;
}

function parseFeatured(value: unknown): SiteFeatured | undefined {
  if (!isRecord(value)) return undefined;

  const itemIds = parseStringArray(value.itemIds) ?? [];
  const maxCount = parseNumber(value.maxCount);

  return {
    itemIds,
    maxCount: maxCount ?? 6,
  };
}

function parseContact(value: unknown): SiteContact | undefined {
  if (!isRecord(value)) return undefined;

  return {
    whatsapp: parseString(value.whatsapp),
    phone: parseString(value.phone),
    instagram: parseString(value.instagram),
    facebook: parseString(value.facebook),
    tiktok: parseString(value.tiktok),
    email: parseString(value.email),
  };
}

function parseLocation(value: unknown): SiteLocation | undefined {
  if (!isRecord(value)) return undefined;

  return {
    address: parseString(value.address),
    lat: parseNumber(value.lat),
    lng: parseNumber(value.lng),
    directionsUrl: parseString(value.directionsUrl),
  };
}

function parseSeo(value: unknown): SiteSeo | undefined {
  if (!isRecord(value)) return undefined;

  const keywords = parseStringArray(value.keywords);

  return {
    title: parseString(value.title),
    description: parseString(value.description),
    ogImageUrl: parseString(value.ogImageUrl),
    keywords,
  };
}

function parseFaq(value: unknown): SiteFaqItem[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const items = value
    .map((item): SiteFaqItem | null => {
      if (!isRecord(item)) return null;
      const id = parseString(item.id);
      const question = parseString(item.question);
      const answer = parseString(item.answer);
      if (!id || !question || !answer) return null;
      return { id, question, answer };
    })
    .filter((item): item is SiteFaqItem => item != null);

  return items.length > 0 ? items : undefined;
}

function parseTestimonials(value: unknown): SiteTestimonial[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const items = value
    .map((item): SiteTestimonial | null => {
      if (!isRecord(item)) return null;
      const id = parseString(item.id);
      const author = parseString(item.author);
      const text = parseString(item.text);
      if (!id || !author || !text) return null;

      return {
        id,
        author,
        text,
        imageUrl: parseString(item.imageUrl),
      };
    })
    .filter((item): item is SiteTestimonial => item != null);

  return items.length > 0 ? items : undefined;
}

function parseHeadingCopy(value: unknown): SiteSectionHeadingCopy | undefined {
  if (!isRecord(value)) return undefined;

  return {
    title: parseString(value.title),
    subtitle: parseString(value.subtitle),
    eyebrow: parseString(value.eyebrow),
  };
}

function parseContactSectionCopy(
  value: unknown,
): SiteContactSectionCopy | undefined {
  if (!isRecord(value)) return undefined;

  const base = parseHeadingCopy(value);
  return {
    ...base,
    ctaEyebrow: parseString(value.ctaEyebrow),
    ctaTitle: parseString(value.ctaTitle),
    ctaSubtitle: parseString(value.ctaSubtitle),
  };
}

function parseSectionCopy(value: unknown): SiteSectionCopy | undefined {
  if (!isRecord(value)) return undefined;

  return {
    about: parseHeadingCopy(value.about),
    differentials: parseHeadingCopy(value.differentials),
    featured: parseHeadingCopy(value.featured),
    menu: parseHeadingCopy(value.menu),
    gallery: parseHeadingCopy(value.gallery),
    contact: parseContactSectionCopy(value.contact),
    location: parseHeadingCopy(value.location),
  };
}

/** Safely parse nested siteConfig from a Firestore tenant document. */
export function parseSiteConfigFromFirestore(data: unknown): SiteConfig | undefined {
  if (!isRecord(data)) return undefined;

  const defaults = createDefaultSiteConfig();

  return {
    sections: parseSections(data.sections) ?? defaults.sections,
    identity: { ...defaults.identity, ...parseIdentity(data.identity) },
    hero: { ...defaults.hero, ...parseHero(data.hero) },
    about: { ...defaults.about, ...parseAbout(data.about) },
    differentials: parseDifferentials(data.differentials) ?? defaults.differentials,
    featured: { ...defaults.featured, ...parseFeatured(data.featured) },
    contact: { ...defaults.contact, ...parseContact(data.contact) },
    location: { ...defaults.location, ...parseLocation(data.location) },
    seo: { ...defaults.seo, ...parseSeo(data.seo) },
    faq: parseFaq(data.faq) ?? defaults.faq,
    testimonials: parseTestimonials(data.testimonials) ?? defaults.testimonials,
    sectionCopy: {
      ...defaults.sectionCopy,
      ...parseSectionCopy(data.sectionCopy),
    },
  };
}
