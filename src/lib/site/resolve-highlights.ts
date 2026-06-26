import type { HighlightEntry } from "@/components/public/highlights-section";
import type { Tenant } from "@/types";
import type { SiteConfig } from "@/types/site";
import type { CategoryWithItems } from "./landing-types";

export function pickHighlights(
  categoriesWithItems: CategoryWithItems[],
  limit = 6,
): HighlightEntry[] {
  const withImage: HighlightEntry[] = [];

  for (const cat of categoriesWithItems) {
    const { items, ...category } = cat;
    for (const item of items) {
      if (item.imageUrl) {
        withImage.push({ item, category });
        if (withImage.length >= limit) return withImage;
      }
    }
  }

  if (withImage.length >= 2) return withImage;

  const fallback: HighlightEntry[] = [];
  for (const cat of categoriesWithItems) {
    const { items, ...category } = cat;
    for (const item of items) {
      fallback.push({ item, category });
      if (fallback.length >= limit) return fallback;
    }
  }

  return fallback.length >= 2 ? fallback : [];
}

export function resolveHighlights(
  siteConfig: SiteConfig,
  tenant: Tenant,
  categoriesWithItems: CategoryWithItems[],
): HighlightEntry[] {
  const limit = siteConfig.featured.maxCount ?? 6;
  const itemIds =
    siteConfig.featured.itemIds.length > 0
      ? siteConfig.featured.itemIds
      : tenant.highlightItemIds;

  if (itemIds && itemIds.length > 0) {
    return itemIds
      .map((id) => {
        for (const cat of categoriesWithItems) {
          const item = cat.items.find((i) => i.id === id);
          if (item) {
            const { items: _items, ...category } = cat;
            return { item, category };
          }
        }
        return null;
      })
      .filter((entry): entry is HighlightEntry => entry !== null)
      .slice(0, limit);
  }

  return pickHighlights(categoriesWithItems, limit);
}
