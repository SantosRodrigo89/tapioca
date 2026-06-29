"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  getConfigurationDrawerHints,
  getEnabledConfigurationGroups,
} from "@/lib/catalog/configuration-hints";
import { formatMenuItemPrice } from "@/lib/pricing";
import { getItemAvailabilityStatus } from "@/lib/utils/availability";
import type { Category, MenuItem } from "@/types";
import type { ProductDrawerActionId } from "@/types/site";
import { ProductConfigurationDisplay } from "./product-configuration-display";
import {
  ProductDrawerActions,
  ProductDrawerCommerceSlot,
} from "./product-drawer-actions";
import { ProductItemBadge } from "./product-item-badge";

interface ProductDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  category: Category | null;
  tenantSlug: string;
  whatsapp?: string;
  drawerActions: ProductDrawerActionId[];
  /** Future: quantity picker, add-to-cart, checkout controls */
  commerceSlot?: React.ReactNode;
}

export function ProductDetailDrawer({
  open,
  onOpenChange,
  item,
  category,
  tenantSlug,
  whatsapp,
  drawerActions,
  commerceSlot,
}: ProductDetailDrawerProps) {
  const isMobile = useMediaQuery("(max-width: 639px)");

  if (!item || !category) return null;

  const status = getItemAvailabilityStatus(item, category);
  const groups = getEnabledConfigurationGroups(item);
  const hints = getConfigurationDrawerHints(item);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className="product-detail-sheet w-full gap-0 overflow-hidden p-0 sm:max-w-lg"
        aria-describedby={undefined}
        data-product-drawer
      >
        <SheetTitle className="sr-only">{item.name}</SheetTitle>

        <div className="flex h-full max-h-[inherit] flex-col">
          <div className="product-detail-scroll flex-1 overflow-y-auto overscroll-contain">
            <div className="relative aspect-[4/3] w-full bg-[var(--menu-surface)] sm:aspect-[16/10]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 512px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#999]">
                  Sem foto
                </div>
              )}
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-6 sm:py-8">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#999]">
                    {category.name}
                  </p>
                  {item.badge && <ProductItemBadge badge={item.badge} />}
                </div>

                <h2 className="text-2xl font-bold leading-tight tracking-tight text-[var(--menu-secondary)] sm:text-3xl">
                  {item.name}
                </h2>

                {item.description && (
                  <p className="text-base leading-relaxed text-[#666]">
                    {item.description}
                  </p>
                )}

                {!status.orderable && status.label && (
                  <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[#999]">
                    <Clock className="h-4 w-4 shrink-0" />
                    {status.label}
                  </p>
                )}

                <p
                  className="text-2xl font-bold sm:text-3xl"
                  style={{ color: "var(--menu-primary-dark)" }}
                >
                  {formatMenuItemPrice(item)}
                </p>
              </div>

              {hints.length > 0 && (
                <ul className="space-y-2 rounded-xl bg-[var(--menu-surface)] px-4 py-3">
                  {hints.map((hint) => (
                    <li
                      key={hint}
                      className="flex items-start gap-2 text-sm text-[#555]"
                    >
                      <span
                        className="mt-0.5 text-[var(--menu-primary-dark)]"
                        aria-hidden
                      >
                        ✓
                      </span>
                      {hint}
                    </li>
                  ))}
                </ul>
              )}

              <ProductConfigurationDisplay groups={groups} />
            </div>
          </div>

          <ProductDrawerCommerceSlot>{commerceSlot}</ProductDrawerCommerceSlot>

          <ProductDrawerActions
            item={item}
            tenantSlug={tenantSlug}
            whatsapp={whatsapp}
            actions={drawerActions}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
