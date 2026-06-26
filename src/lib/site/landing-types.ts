import type { HighlightEntry } from "@/components/public/highlights-section";
import type { Category, MenuItem, Tenant } from "@/types";
import type { GalleryImage, SiteConfig } from "@/types/site";

export type { HighlightEntry };

export type CategoryWithItems = Category & { items: MenuItem[] };

export interface LandingPageData {
  tenant: Tenant;
  siteConfig: SiteConfig;
  gallery: GalleryImage[];
  categoriesWithItems: CategoryWithItems[];
  visibleCategories: CategoryWithItems[];
  highlights: HighlightEntry[];
  whatsapp?: string;
}
