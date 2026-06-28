import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoriesServer } from "@/lib/repositories/server/menu-item.server";
import { getComplementsByTenantServer } from "@/lib/repositories/server/complement.server";
import type { CategoryWithItems } from "@/lib/site/landing-types";

export interface TenantCatalogOptions {
  /** When true, only categories with active === true. */
  activeCategoriesOnly?: boolean;
  /** When true, only items with available === true. */
  availableItemsOnly?: boolean;
  /** When true, merges global complements into item configurationGroups. */
  resolveComplements?: boolean;
}

/**
 * Loads categories and their items in two round-trips:
 * 1) categories query, 2) parallel item queries (one per category).
 */
export async function getTenantCatalogServer(
  tenantId: string,
  options: TenantCatalogOptions = {},
): Promise<CategoryWithItems[]> {
  const { activeCategoriesOnly = false, availableItemsOnly = false, resolveComplements = false } = options;

  const categories = await getCategoriesByTenantServer(tenantId, {
    activeOnly: activeCategoriesOnly,
  });

  if (categories.length === 0) return [];

  const complementsCatalog = resolveComplements
    ? await getComplementsByTenantServer(tenantId)
    : undefined;

  const itemsByCategoryId = await getItemsByCategoriesServer(
    tenantId,
    categories.map((c) => c.id),
    {
      availableOnly: availableItemsOnly,
      resolveComplements,
      complementsCatalog,
    },
  );

  return categories.map((category) => ({
    ...category,
    items: itemsByCategoryId.get(category.id) ?? [],
  }));
}

export function filterCategoriesWithItems(
  categories: CategoryWithItems[],
): CategoryWithItems[] {
  return categories.filter((category) => category.items.length > 0);
}
