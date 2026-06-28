import type { SiteSectionId } from "@/types/site";

/** Layout variant IDs — mapped to components/CSS in future phases. */
export type HeroLayoutVariant = "immersive" | "compact";
export type AboutLayoutVariant = "editorial" | "centered";
export type DifferentialsLayoutVariant = "cards" | "minimal";
export type FeaturedLayoutVariant = "carousel" | "carousel-hero";
export type MenuLayoutVariant = "editorial" | "grid";
export type GalleryLayoutVariant = "asymmetric" | "grid";
export type ContactLayoutVariant = "split" | "stacked";
export type LocationLayoutVariant = "map-first" | "compact";
export type FooterLayoutVariant = "full" | "minimal";

export interface SectionLayoutVariants {
  hero: HeroLayoutVariant;
  about: AboutLayoutVariant;
  differentials: DifferentialsLayoutVariant;
  featured: FeaturedLayoutVariant;
  menu: MenuLayoutVariant;
  gallery: GalleryLayoutVariant;
  contact: ContactLayoutVariant;
  location: LocationLayoutVariant;
  footer: FooterLayoutVariant;
}

export type LayoutSectionId = keyof SectionLayoutVariants;

export const LAYOUT_SECTION_IDS = [
  "hero",
  "about",
  "differentials",
  "featured",
  "menu",
  "gallery",
  "contact",
  "location",
  "footer",
] as const satisfies readonly LayoutSectionId[];

/** Band styling overrides per section (extends global band cycle). */
export type TemplateBandOverrides = Partial<
  Record<Extract<SiteSectionId, LayoutSectionId>, "white" | "tinted" | "surface">
>;

export const LANDING_TEMPLATE_IDS = [
  "restaurante",
  "hamburgueria",
  "bar",
  "pizzaria",
  "cafeteria",
  "acai",
  "doceria",
] as const;

export type LandingTemplateId = (typeof LANDING_TEMPLATE_IDS)[number];

export interface TemplateLayoutDefinition {
  id: LandingTemplateId;
  /** Partial overrides merged onto the classic (restaurante) baseline. */
  sections: Partial<SectionLayoutVariants>;
  bandOverrides?: TemplateBandOverrides;
}

export interface ResolvedTemplateLayout {
  templateId: LandingTemplateId;
  sections: SectionLayoutVariants;
  bandOverrides: TemplateBandOverrides;
}
