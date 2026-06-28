// ─── Site sections (public landing page) ───────────────────────────────────

export type SiteSectionId =
  | "hero"
  | "about"
  | "differentials"
  | "featured"
  | "menu"
  | "gallery"
  | "contact"
  | "location"
  | "footer"
  | "faq"
  | "testimonials";

export interface SiteSectionConfig {
  id: SiteSectionId;
  enabled: boolean;
  order: number;
}

// ─── Typography ────────────────────────────────────────────────────────────

export type FontPreset = "plus-jakarta" | "inter" | "dm-sans";

// ─── Site content blocks ───────────────────────────────────────────────────

export interface SiteButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface SiteIdentity {
  typography?: FontPreset;
}

export interface SiteHero {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: SiteButton[];
  /** Tags de especialidade exibidas no hero (ex.: "Pizza artesanal", "Delivery") */
  specialties?: string[];
}

export interface SiteAbout {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export interface SiteDifferential {
  id: string;
  icon?: string;
  title: string;
  description?: string;
}

export interface SiteFeatured {
  itemIds: string[];
  maxCount: number;
}

export interface SiteContact {
  whatsapp?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  email?: string;
}

export interface SiteLocation {
  address?: string;
  lat?: number;
  lng?: number;
  directionsUrl?: string;
}

export interface SiteSeo {
  title?: string;
  description?: string;
  ogImageUrl?: string;
  keywords?: string[];
}

export interface SiteFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteTestimonial {
  id: string;
  author: string;
  text: string;
  imageUrl?: string;
}

export interface SiteMenuExperience {
  productDrawerActions?: ProductDrawerActionId[];
}

export type ProductDrawerActionId = "share" | "copy-link" | "whatsapp";

/** Optional heading copy overrides for landing sections */
export interface SiteSectionHeadingCopy {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}

export interface SiteContactSectionCopy extends SiteSectionHeadingCopy {
  ctaEyebrow?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
}

export interface SiteSectionCopy {
  about?: SiteSectionHeadingCopy;
  differentials?: SiteSectionHeadingCopy;
  featured?: SiteSectionHeadingCopy;
  menu?: SiteSectionHeadingCopy;
  gallery?: SiteSectionHeadingCopy;
  contact?: SiteContactSectionCopy;
  location?: SiteSectionHeadingCopy;
}

export interface SiteConfig {
  sections: SiteSectionConfig[];
  identity: SiteIdentity;
  hero: SiteHero;
  about: SiteAbout;
  differentials: SiteDifferential[];
  featured: SiteFeatured;
  contact: SiteContact;
  location: SiteLocation;
  seo: SiteSeo;
  faq: SiteFaqItem[];
  testimonials: SiteTestimonial[];
  menuExperience?: SiteMenuExperience;
  sectionCopy?: SiteSectionCopy;
}

// ─── Gallery (subcollection) ───────────────────────────────────────────────

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
  createdAt: Date;
}
