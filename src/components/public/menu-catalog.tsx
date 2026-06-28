"use client";

import { LayoutGrid, List } from "lucide-react";
import {
  MenuCategoryNav,
  categorySectionId,
} from "@/components/public/menu-category-nav";
import { MenuItemCard } from "@/components/public/menu-item-card";
import { MenuItemRow } from "@/components/public/menu-item-row";
import { cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/types";
import { useState } from "react";

interface CategoryWithItems extends Category {
  items: MenuItem[];
}

export type MenuDisplayMode = "list" | "grid";

interface MenuCatalogProps {
  categories: CategoryWithItems[];
  defaultDisplay?: MenuDisplayMode;
  /** Template layout: editorial (lista) ou grid (fotos em destaque). */
  catalogLayout?: "editorial" | "grid";
}

export function MenuCatalog({
  categories,
  defaultDisplay,
  catalogLayout = "editorial",
}: MenuCatalogProps) {
  const initialDisplay =
    defaultDisplay ?? (catalogLayout === "grid" ? "grid" : "list");
  const [display, setDisplay] = useState<MenuDisplayMode>(initialDisplay);
  const hasPhotoItems = categories.some((cat) =>
    cat.items.some((item) => item.imageUrl),
  );

  return (
    <div
      className={cn(
        "menu-catalog",
        catalogLayout === "grid" && "menu-catalog--grid-first",
      )}
    >
      <MenuCategoryNav categories={categories} />

      <div className="menu-catalog-body">
        {hasPhotoItems && categories.length > 0 && (
          <div className="menu-display-toggle" role="group" aria-label="Modo de exibição">
            <button
              type="button"
              onClick={() => setDisplay("list")}
              className={cn(
                "menu-display-toggle__btn",
                display === "list" && "menu-display-toggle__btn--active",
              )}
              aria-pressed={display === "list"}
            >
              <List className="h-4 w-4" aria-hidden />
              Lista
            </button>
            <button
              type="button"
              onClick={() => setDisplay("grid")}
              className={cn(
                "menu-display-toggle__btn",
                display === "grid" && "menu-display-toggle__btn--active",
              )}
              aria-pressed={display === "grid"}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
              Fotos
            </button>
          </div>
        )}

        <div className="menu-catalog-sections">
        {categories.map((category) => (
          <section
            key={category.id}
            id={categorySectionId(category.id)}
            className="menu-category-section"
            aria-labelledby={`menu-heading-${category.id}`}
          >
            <header className="menu-category-header">
              <h3
                id={`menu-heading-${category.id}`}
                className="menu-category-title"
              >
                {category.name}
              </h3>
            </header>

            {display === "list" ? (
              <ul className="menu-item-list">
                {category.items.map((item) => (
                  <li key={item.id}>
                    <MenuItemRow item={item} category={category} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="menu-items-grid grid gap-3 grid-cols-2 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    category={category}
                    variant="grid"
                  />
                ))}
              </div>
            )}
          </section>
        ))}
        </div>
      </div>
    </div>
  );
}
