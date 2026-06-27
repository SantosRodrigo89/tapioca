"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface ReadMoreTextProps {
  text: string;
  className?: string;
  maxLines?: number;
  /** Impede que o clique em "Leia mais" dispare handlers do elemento pai */
  isolateToggleClick?: boolean;
  variant?: "default" | "compact";
  /** Trunca e exibe "Leia mais" apenas em telas pequenas */
  mobileOnly?: boolean;
}

export function ReadMoreText({
  text,
  className,
  maxLines = 4,
  isolateToggleClick = false,
  variant = "default",
  mobileOnly = false,
}: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 639px)");
  const isLong = text.length > 120 || text.split("\n").length > maxLines;
  const canTruncate = isLong && (!mobileOnly || isMobile);
  const isClamped = canTruncate && !expanded;

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    if (isolateToggleClick) {
      e.stopPropagation();
    }
    setExpanded((v) => !v);
  }

  return (
    <div className={className}>
      <p
        className={cn(
          variant === "compact"
            ? "menu-item-row__description"
            : "text-base leading-relaxed text-[#666] whitespace-pre-line sm:text-lg",
        )}
        style={
          isClamped
            ? {
                display: "-webkit-box",
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
      >
        {text}
      </p>
      {canTruncate && (
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            variant === "compact"
              ? "menu-item-row__read-more"
              : "mt-3 text-sm font-semibold text-[var(--menu-primary-dark)] transition-colors hover:text-[var(--menu-secondary)]",
          )}
        >
          {expanded ? "Leia menos" : "Leia mais"}
        </button>
      )}
    </div>
  );
}
