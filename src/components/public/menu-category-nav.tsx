"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/types";

interface CategoryWithItems extends Category {
  items: MenuItem[];
}

interface MenuCategoryNavProps {
  categories: CategoryWithItems[];
}

function categorySectionId(categoryId: string) {
  return `menu-cat-${categoryId}`;
}

export function MenuCategoryNav({ categories }: MenuCategoryNavProps) {
  const [activeId, setActiveId] = useState(
    categories[0] ? categorySectionId(categories[0].id) : "",
  );
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categories.length === 0) return;

    const elements = categories
      .map((cat) => document.getElementById(categorySectionId(cat.id)))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !activeId) return;

    const activeButton = track.querySelector<HTMLElement>(
      `[data-category-target="${activeId}"]`,
    );
    if (!activeButton) return;

    activeButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  if (categories.length <= 1) return null;

  function handleClick(
    e: React.MouseEvent<HTMLButtonElement>,
    targetId: string,
  ) {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(targetId);
    }
  }

  return (
    <nav
      aria-label="Categorias do cardápio"
      className="menu-category-nav"
    >
      <div
        ref={trackRef}
        className="menu-category-nav-track scrollbar-hide"
      >
        {categories.map((category) => {
          const targetId = categorySectionId(category.id);
          const isActive = activeId === targetId;

          return (
            <button
              key={category.id}
              type="button"
              data-category-target={targetId}
              onClick={(e) => handleClick(e, targetId)}
              className={cn(
                "menu-category-pill",
                isActive && "menu-category-pill--active",
              )}
              aria-current={isActive ? "true" : undefined}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export { categorySectionId };
