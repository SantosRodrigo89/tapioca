import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@/types";

export type MenuItemPriceDisplay =
  | { kind: "fixed"; cents: number; label: string }
  | { kind: "starting_from"; cents: number; label: string };

export function getBasePriceGroup(item: MenuItem) {
  return (item.configurationGroups ?? [])
    .filter((g) => g.enabled && g.definesBasePrice)
    .sort((a, b) => a.displayOrder - b.displayOrder)[0];
}

export function getStartingPriceCents(item: MenuItem): number | null {
  const baseGroup = getBasePriceGroup(item);
  if (!baseGroup) return null;

  const prices = baseGroup.options
    .filter((o) => o.enabled)
    .map((o) => o.price);

  if (prices.length === 0) return item.price;
  return Math.min(...prices);
}

export function hasConfigurablePricing(item: MenuItem): boolean {
  return getBasePriceGroup(item) != null;
}

export function getMenuItemPriceDisplay(item: MenuItem): MenuItemPriceDisplay {
  const startingCents = getStartingPriceCents(item);

  if (startingCents != null && hasConfigurablePricing(item)) {
    return {
      kind: "starting_from",
      cents: startingCents,
      label: `A partir de ${formatPrice(startingCents)}`,
    };
  }

  return {
    kind: "fixed",
    cents: item.price,
    label: formatPrice(item.price),
  };
}

export function formatMenuItemPrice(item: MenuItem): string {
  return getMenuItemPriceDisplay(item).label;
}
