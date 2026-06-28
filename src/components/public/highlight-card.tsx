"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { getConfigurationCardHints } from "@/lib/catalog/configuration-hints";
import { formatMenuItemPrice } from "@/lib/pricing";
import { getItemAvailabilityStatus } from "@/lib/utils/availability";
import { cn } from "@/lib/utils";
import type { HighlightEntry } from "@/components/public/highlights-section";
import { ProductItemBadge } from "./product-item-badge";
import { useProductDetail } from "./product-detail-context";

interface HighlightCardProps {
  entry: HighlightEntry;
  variant?: "standard" | "hero";
}

export function HighlightCard({
  entry,
  variant = "standard",
}: HighlightCardProps) {
  const { item, category } = entry;
  const { openProduct } = useProductDetail();
  const status = getItemAvailabilityStatus(item, category);
  const hints = getConfigurationCardHints(item);
  const isHero = variant === "hero";

  function handleOpen() {
    openProduct(item, category);
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      aria-label={`Ver detalhes de ${item.name}`}
      className={cn(
        "highlight-card product-card",
        isHero ? "highlight-card--hero" : "highlight-card--standard",
        !status.orderable && "opacity-80",
      )}
    >
      <div className="highlight-card__media">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes={isHero ? "(max-width: 640px) 85vw, 520px" : "300px"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="highlight-card__placeholder">Sem foto</div>
        )}
        <div className="highlight-card__overlay" aria-hidden />
        {item.badge && (
          <div className="highlight-card__badge">
            <ProductItemBadge badge={item.badge} />
          </div>
        )}
        <div className="highlight-card__caption">
          <h3 className="highlight-card__title">{item.name}</h3>
          <p className="highlight-card__price">{formatMenuItemPrice(item)}</p>
        </div>
      </div>

      {(item.description || hints.length > 0 || !status.orderable) && (
        <div className="highlight-card__body">
          {item.description && (
            <p className="highlight-card__description">{item.description}</p>
          )}
          {hints.length > 0 && (
            <p className="highlight-card__hint">{hints[0]}</p>
          )}
          {!status.orderable && status.label && (
            <p className="highlight-card__availability">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {status.label}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
