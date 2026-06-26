import type { Category, MenuItem } from "@/types";

export type CategoryWithItems = Category & { items: MenuItem[] };

export function sortCategories(cats: CategoryWithItems[]): CategoryWithItems[] {
  return [...cats]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      ...c,
      items: [...c.items].sort((a, b) => a.order - b.order),
    }));
}

export function sortCategoryList(cats: Category[]): Category[] {
  return [...cats].sort((a, b) => a.order - b.order);
}
