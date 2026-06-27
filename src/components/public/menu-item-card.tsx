"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { getConfigurationCardHints } from "@/lib/catalog/configuration-hints";
import { formatMenuItemPrice } from "@/lib/pricing";
import { getItemAvailabilityStatus } from "@/lib/utils/availability";
import type { Category, MenuItem } from "@/types";
import { ProductItemBadge } from "./product-item-badge";
import { useProductDetail } from "./product-detail-context";

interface MenuItemCardProps {
  item: MenuItem;
  category: Category;
  variant?: "grid" | "featured";
}

export function MenuItemCard({
  item,
  category,
  variant = "grid",
}: MenuItemCardProps) {
  const { openProduct } = useProductDetail();
  const status = getItemAvailabilityStatus(item, category);
  const hints = getConfigurationCardHints(item);

  function handleOpen() {
    openProduct(item, category);
  }

  if (variant === "featured") {
    return (
      <div
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
        className={`product-card product-card--featured menu-card w-[260px] shrink-0 overflow-hidden text-left sm:w-[280px] ${
          !status.orderable ? "opacity-75" : ""
        }`}
      >
        <div className="relative h-[180px] bg-[var(--menu-surface)] sm:h-[200px]">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt=""
              fill
              sizes="280px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#999]">
              Sem foto
            </div>
          )}
          {item.badge && (
            <div className="absolute left-3 top-3">
              <ProductItemBadge badge={item.badge} />
            </div>
          )}
        </div>

        <div className="space-y-2.5 p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--menu-secondary)] sm:text-lg">
            {item.name}
          </h3>

          {item.description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[#777]">
              {item.description}
            </p>
          )}

          <p
            className="text-xl font-bold"
            style={{ color: "var(--menu-primary-dark)" }}
          >
            {formatMenuItemPrice(item)}
          </p>

          {hints.length > 0 && (
            <p className="line-clamp-1 text-xs text-[#999]">{hints[0]}</p>
          )}

          {!status.orderable && status.label && (
            <p className="inline-flex items-center gap-1 text-xs font-medium text-[#999]">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="line-clamp-1">{status.label}</span>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      aria-label={`Ver detalhes de ${item.name}`}
      className={`product-card menu-card flex h-full w-full flex-col overflow-hidden text-left ${
        !status.orderable ? "opacity-75" : ""
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-[var(--menu-surface)]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[#999]">
            Sem foto
          </div>
        )}
        {item.badge && (
          <div className="absolute left-3 top-3">
            <ProductItemBadge badge={item.badge} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
        <h3 className="text-lg font-semibold leading-snug text-[var(--menu-secondary)] sm:text-xl">
          {item.name}
        </h3>

        {item.description && (
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-[#777] sm:text-base">
            {item.description}
          </p>
        )}

        <div className="mt-auto space-y-2">
          <p
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--menu-primary-dark)" }}
          >
            {formatMenuItemPrice(item)}
          </p>

          {hints.map((hint) => (
            <p key={hint} className="text-xs text-[#999]">
              {hint}
            </p>
          ))}

          {!status.orderable && status.label && (
            <p className="inline-flex items-center gap-1 text-xs font-medium text-[#999]">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {status.label}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
