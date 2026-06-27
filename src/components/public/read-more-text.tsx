"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReadMoreTextProps {
  text: string;
  className?: string;
  maxLines?: number;
}

export function ReadMoreText({
  text,
  className,
  maxLines = 4,
}: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 180 || text.split("\n").length > maxLines;

  return (
    <div className={className}>
      <p
        className={cn(
          "text-base leading-relaxed text-[#666] whitespace-pre-line sm:text-lg",
          !expanded && isLong && `line-clamp-${maxLines}`,
        )}
        style={
          !expanded && isLong
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
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm font-semibold text-[var(--menu-primary-dark)] transition-colors hover:text-[var(--menu-secondary)]"
        >
          {expanded ? "Leia menos" : "Leia mais"}
        </button>
      )}
    </div>
  );
}
