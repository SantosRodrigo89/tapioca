"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

type PendingScrollAdjust = {
  panel: HTMLElement;
  topBefore: number;
};

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  const [openId, setOpenId] = useState(categories[0]?.id ?? "");
  const pendingAdjustRef = useRef<PendingScrollAdjust | null>(null);

  function compensatePanelScroll() {
    const pending = pendingAdjustRef.current;
    if (!pending) return;

    const delta = pending.panel.getBoundingClientRect().top - pending.topBefore;
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, left: 0, behavior: "auto" });
    }
  }

  function toggleCategory(
    catId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const panel = event.currentTarget.closest(
      ".menu-category-panel",
    ) as HTMLElement | null;
    if (!panel) return;

    pendingAdjustRef.current = {
      panel,
      topBefore: panel.getBoundingClientRect().top,
    };
    setOpenId((current) => (current === catId ? "" : catId));
  }

  useLayoutEffect(() => {
    compensatePanelScroll();
  }, [openId]);

  useEffect(() => {
    const pending = pendingAdjustRef.current;
    if (!pending) return;

    compensatePanelScroll();

    const container = pending.panel.parentElement;
    const ro = new ResizeObserver(() => {
      compensatePanelScroll();
    });

    ro.observe(pending.panel);
    if (container) ro.observe(container);

    const timer = window.setTimeout(() => {
      pendingAdjustRef.current = null;
      ro.disconnect();
    }, 600);

    return () => {
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, [openId]);

  return (
    <div className="menu-categories space-y-3">
      {categories.map((category) => {
        const isOpen = openId === category.id;

        return (
          <div
            key={category.id}
            className="menu-category-panel overflow-hidden rounded-2xl border border-[var(--menu-border)] bg-white shadow-sm"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`panel-${category.id}`}
              onClick={(event) => toggleCategory(category.id, event)}
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
