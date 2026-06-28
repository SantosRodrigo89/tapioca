"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryNavItem {
  id: string;
  name: string;
}

interface CategoryNavProps {
  categories: CategoryNavItem[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (categories.length === 0) return;

    const sectionIds = categories.map((c) => `cat-${c.id}`);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          const id = visible[0].target.id.replace("cat-", "");
          setActiveId(id);

          const track = navRef.current;
          const pill = track?.querySelector<HTMLElement>(`[data-cat="${id}"]`);
          if (track && pill) {
            const targetLeft =
              pill.offsetLeft - (track.clientWidth - pill.clientWidth) / 2;
            track.scrollTo({
              left: Math.max(0, targetLeft),
              behavior: "smooth",
            });
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    catId: string,
  ) {
    e.preventDefault();
    const target = document.getElementById(`cat-${catId}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(catId);
    }
  }

  if (categories.length === 0) return null;

  return (
    <nav
      aria-label="Categorias do cardápio"
      className="sticky top-0 z-30 border-b border-[var(--menu-border)] bg-white/90 shadow-sm backdrop-blur-xl"
    >
      <div
        ref={navRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-3 sm:px-0"
      >
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`#cat-${cat.id}`}
            data-cat={cat.id}
            onClick={(e) => handleClick(e, cat.id)}
            className={cn(
              "menu-pill shrink-0 transition-all duration-300",
              activeId === cat.id && "menu-pill-active",
            )}
          >
            {cat.name}
          </a>
        ))}
      </div>
    </nav>
  );
}
