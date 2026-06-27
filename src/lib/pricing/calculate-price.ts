import type { ConfigurationGroup, MenuItem } from "@/types";

export type ItemSelections = Record<string, string[]>;

function getEnabledGroups(item: MenuItem): ConfigurationGroup[] {
  return [...(item.configurationGroups ?? [])]
    .filter((g) => g.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function getSelectedOptions(
  group: ConfigurationGroup,
  selections: ItemSelections,
) {
  const optionIds = selections[group.id] ?? [];
  return group.options.filter((o) => o.enabled && optionIds.includes(o.id));
}

/**
 * Calculates the final price for a configurable item given user selections.
 * Used by future cart/order flows; catalog display uses display-price helpers.
 */
export function calculateItemPrice(
  item: MenuItem,
  selections: ItemSelections,
): number {
  let total = item.price;

  for (const group of getEnabledGroups(item)) {
    const selected = getSelectedOptions(group, selections);
    if (selected.length === 0) continue;

    switch (group.pricingStrategy) {
      case "fixed":
        total = selected[0]!.price;
        break;
      case "additional":
        total += selected.reduce((sum, option) => sum + option.price, 0);
        break;
      case "highest":
        total += Math.max(...selected.map((option) => option.price));
        break;
      default:
        break;
    }
  }

  return total;
}
