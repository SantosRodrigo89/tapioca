"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MenuItemCard } from "@/components/public/menu-item-card";
import type { HighlightEntry } from "@/components/public/highlights-section";

interface HighlightsCarouselProps {
  entries: HighlightEntry[];
}

function getScrollStep(track: HTMLDivElement): number {
  const row = track.firstElementChild;
  const card = row?.firstElementChild as HTMLElement | null;
  if (!card || !row) return track.clientWidth * 0.85;

  const next = card.nextElementSibling as HTMLElement | null;
  const gap = next ? next.offsetLeft - card.offsetLeft - card.offsetWidth : 16;

  return card.offsetWidth + gap;
}

export function HighlightsCarousel({ entries }: HighlightsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(maxScroll > 1 && el.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [entries, updateScrollState]);

  function scroll(direction: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;

    const step = getScrollStep(el);
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  }

  return (
    <div className="highlights-carousel relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Ver destaques anteriores"
          className="highlights-nav-btn highlights-nav-btn--prev"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Ver próximos destaques"
          className="highlights-nav-btn highlights-nav-btn--next"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      )}

      <div
        ref={trackRef}
        className="highlights-track scrollbar-hide -mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6"
      >
        <div className="flex w-max gap-4 sm:gap-5">
          {entries.map(({ item, category }) => (
            <MenuItemCard
              key={item.id}
              item={item}
              category={category}
              variant="featured"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
