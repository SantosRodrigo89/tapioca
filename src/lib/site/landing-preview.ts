import type { HighlightEntry, LandingPageData, CategoryWithItems } from "@/lib/site/landing-types";
import {
  mergeSectionCopyPatch,
} from "@/lib/site/section-copy";
import { resolveTemplateLayout } from "@/lib/site/template-registry";
import type { Tenant } from "@/types";
import type {
  GalleryImage,
  SiteConfig,
  SiteDifferential,
  SiteSectionCopy,
} from "@/types/site";
import type { LayoutSectionId } from "@/types/platform/landing-layout";

const EMPTY_CATEGORIES: CategoryWithItems[] = [];

export interface BuildPreviewLandingDataOptions {
  siteConfig?: SiteConfig;
  siteConfigPatch?: Partial<SiteConfig>;
  sectionCopyPatches?: SiteSectionCopy[];
  highlights?: HighlightEntry[];
  gallery?: GalleryImage[];
  categoriesWithItems?: CategoryWithItems[];
  whatsapp?: string;
}

export function buildPreviewLandingData(
  tenant: Tenant,
  baseSiteConfig: SiteConfig,
  options: BuildPreviewLandingDataOptions = {},
): LandingPageData {
  let siteConfig = options.siteConfig ?? {
    ...baseSiteConfig,
    ...options.siteConfigPatch,
  };

  if (options.sectionCopyPatches?.length) {
    let sectionCopy = siteConfig.sectionCopy ?? {};
    for (const patch of options.sectionCopyPatches) {
      sectionCopy = mergeSectionCopyPatch(sectionCopy, patch);
    }
    siteConfig = { ...siteConfig, sectionCopy };
  }

  const categories = options.categoriesWithItems ?? EMPTY_CATEGORIES;

  return {
    tenant,
    siteConfig,
    layout: resolveTemplateLayout(tenant.templateId),
    gallery: options.gallery ?? [],
    categoriesWithItems: categories,
    visibleCategories: categories,
    highlights: options.highlights ?? [],
    whatsapp: options.whatsapp ?? tenant.whatsapp,
  };
}

export function buildHighlightsFromIds(
  categories: CategoryWithItems[],
  itemIds: string[],
): HighlightEntry[] {
  return itemIds
    .map((id) => {
      for (const cat of categories) {
        const item = cat.items.find((i) => i.id === id);
        if (item) {
          const { items: _items, ...category } = cat;
          return { item, category };
        }
      }
      return null;
    })
    .filter((entry): entry is HighlightEntry => entry !== null);
}

export function previewDifferentialItems(
  items: SiteDifferential[],
): SiteDifferential[] {
  return items
    .filter((item) => item.title.trim())
    .map(({ id, title, description }) => ({
      id,
      title: title.trim(),
      description: description?.trim() || undefined,
    }));
}

export function getPreviewSectionVariant(
  tenant: Tenant,
  sectionId: LayoutSectionId,
): string {
  return resolveTemplateLayout(tenant.templateId).sections[sectionId];
}
