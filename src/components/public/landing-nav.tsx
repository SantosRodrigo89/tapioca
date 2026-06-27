"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LandingNavItem } from "@/lib/site/landing-nav";

interface LandingNavProps {
  items: LandingNavItem[];
}

export function LandingNav({ items }: LandingNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.targetId ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.targetId))
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
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(targetId);
    }
  }

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Navegação da página"
      className="landing-nav sticky top-0 z-40 border-b border-[var(--menu-border)] bg-white/90 shadow-sm backdrop-blur-xl"
    >
      <div className="landing-container">
        <div className="scrollbar-hide overflow-x-auto py-3">
          <div className="flex w-max min-w-full items-center justify-center gap-1 sm:gap-2">
            {items.map((item) => (
              <a
                key={item.targetId}
                href={item.href}
                onClick={(e) => handleClick(e, item.targetId)}
                className={cn(
                  "landing-nav-link shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  activeId === item.targetId && "landing-nav-link--active",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
