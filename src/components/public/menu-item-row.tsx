"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { getConfigurationCardHints } from "@/lib/catalog/configuration-hints";
import { formatMenuItemPrice } from "@/lib/pricing";
import { getItemAvailabilityStatus } from "@/lib/utils/availability";
import type { Category, MenuItem } from "@/types";
import { ProductItemBadge } from "./product-item-badge";
import { ReadMoreText } from "./read-more-text";
import { useProductDetail } from "./product-detail-context";

interface MenuItemRowProps {
  item: MenuItem;
  category: Category;
}

export function MenuItemRow({ item, category }: MenuItemRowProps) {
  const { openProduct } = useProductDetail();
  const status = getItemAvailabilityStatus(item, category);
  const hints = getConfigurationCardHints(item);

  function handleOpen() {
    openProduct(item, category);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Ver detalhes de ${item.name}`}
      className={`menu-item-row product-card ${!status.orderable ? "menu-item-row--unavailable" : ""}`}
    >
      <div className="menu-item-row__body">
        <div className="menu-item-row__headline">
          <span className="menu-item-row__name">{item.name}</span>
          <span className="menu-item-row__price">
            {formatMenuItemPrice(item)}
          </span>
        </div>

        {item.description && (
          <ReadMoreText
            text={item.description}
            maxLines={2}
            variant="compact"
            isolateToggleClick
            mobileOnly
          />
        )}

        <div className="menu-item-row__meta">
          {item.badge && <ProductItemBadge badge={item.badge} />}
          {hints.map((hint) => (
            <span key={hint} className="menu-item-row__hint">
              {hint}
            </span>
          ))}
          {!status.orderable && status.label && (
            <span className="menu-item-row__availability">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {status.label}
            </span>
          )}
        </div>
      </div>

      {item.imageUrl && (
        <div className="menu-item-row__thumb">
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
