"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { MenuItemCard } from "@/components/public/menu-item-card";
import { cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/types";

interface CategoryWithItems extends Category {
  items: MenuItem[];
}

interface CategoryAccordionProps {
  categories: CategoryWithItems[];
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  const [openId, setOpenId] = useState(categories[0]?.id ?? "");

  function toggleCategory(catId: string) {
    setOpenId((current) => (current === catId ? "" : catId));
  }

  return (
    <div className="menu-categories space-y-3">
      {categories.map((category) => {
        const isOpen = openId === category.id;

        return (
          <div
            key={category.id}
            id={`cat-${category.id}`}
            className="menu-category-panel scroll-mt-20 overflow-hidden rounded-2xl border border-[var(--menu-border)] bg-white shadow-sm"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`panel-${category.id}`}
              onClick={() => toggleCategory(category.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--menu-surface)]/60 sm:px-6 sm:py-5"
            >
              <span className="min-w-0">
                <span className="block text-lg font-semibold text-[var(--menu-secondary)] sm:text-xl">
                  {category.name}
                </span>
                <span className="mt-0.5 block text-sm text-[#888]">
                  {category.items.length}{" "}
                  {category.items.length === 1 ? "item" : "itens"}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-[#999] transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {isOpen && (
              <div
                id={`panel-${category.id}`}
                className="border-t border-[var(--menu-border)] px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5"
              >
                <div className="menu-items-grid grid gap-4 sm:gap-5 lg:grid-cols-2">
                  {category.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      category={category}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
