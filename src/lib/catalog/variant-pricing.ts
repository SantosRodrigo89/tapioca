import type {
  ConfigurationGroup,
  ConfigurationOption,
  MenuItem,
} from "@/types";

export function getBasePriceGroup(
  groups: ConfigurationGroup[],
): ConfigurationGroup | undefined {
  return [...groups]
    .filter((group) => group.enabled && group.definesBasePrice)
    .sort((a, b) => a.displayOrder - b.displayOrder)[0];
}

export function getLinkedSizeGroup(
  group: ConfigurationGroup,
  groups: ConfigurationGroup[],
): ConfigurationGroup | undefined {
  if (!group.linkedGroupId) return undefined;
  return groups.find(
    (candidate) =>
      candidate.id === group.linkedGroupId &&
      candidate.enabled &&
      candidate.definesBasePrice,
  );
}

export function getEnabledSizeOptions(
  sizeGroup: ConfigurationGroup,
): ConfigurationOption[] {
  return sizeGroup.options
    .filter((option) => option.enabled)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function hasVariantPricing(item: MenuItem): boolean {
  const groups = item.configurationGroups ?? [];
  return groups.some(
    (group) =>
      group.enabled &&
      group.linkedGroupId &&
      group.options.some(
        (option) =>
          option.enabled &&
          option.variantPrices &&
          Object.keys(option.variantPrices).length > 0,
      ),
  );
}

export function groupUsesVariantPricing(
  group: ConfigurationGroup,
  groups: ConfigurationGroup[],
): boolean {
  if (!group.linkedGroupId) return false;
  const sizeGroup = getLinkedSizeGroup(group, groups);
  if (!sizeGroup) return false;

  return group.options.some(
    (option) =>
      option.enabled &&
      option.variantPrices &&
      Object.keys(option.variantPrices).length > 0,
  );
}

export function getVariantPrice(
  option: ConfigurationOption,
  sizeOptionId: string,
  fallbackCents = 0,
): number {
  const variantPrice = option.variantPrices?.[sizeOptionId];
  if (typeof variantPrice === "number") return variantPrice;
  return fallbackCents;
}

export function getOptionVariantPrices(
  option: ConfigurationOption,
  sizeGroup: ConfigurationGroup,
): number[] {
  return getEnabledSizeOptions(sizeGroup)
    .map((sizeOption) => option.variantPrices?.[sizeOption.id])
    .filter((price): price is number => typeof price === "number");
}

export function syncOptionPriceFromVariants(
  option: ConfigurationOption,
  sizeGroup: ConfigurationGroup,
): ConfigurationOption {
  const prices = getOptionVariantPrices(option, sizeGroup);
  if (prices.length === 0) return option;

  return {
    ...option,
    price: Math.min(...prices),
  };
}

export function getAllVariantPriceCents(item: MenuItem): number[] {
  const groups = item.configurationGroups ?? [];
  const prices: number[] = [];

  for (const group of groups) {
    if (!group.enabled || !group.linkedGroupId) continue;
    const sizeGroup = getLinkedSizeGroup(group, groups);
    if (!sizeGroup) continue;

    for (const option of group.options) {
      if (!option.enabled) continue;
      prices.push(...getOptionVariantPrices(option, sizeGroup));
    }
  }

  return prices;
}

export function getMinVariantPriceCents(item: MenuItem): number | null {
  const prices = getAllVariantPriceCents(item);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

export function resolveMatrixPrice(
  item: MenuItem,
  selections: Record<string, string[]>,
): number | null {
  const groups = item.configurationGroups ?? [];
  const sizeGroup = getBasePriceGroup(groups);
  if (!sizeGroup) return null;

  const sizeOptionId = selections[sizeGroup.id]?.[0];
  if (!sizeOptionId) return null;

  const linkedGroups = groups.filter(
    (group) =>
      group.enabled &&
      group.linkedGroupId === sizeGroup.id &&
      (selections[group.id]?.length ?? 0) > 0,
  );

  if (linkedGroups.length === 0) return null;

  const matrixPrices: number[] = [];

  for (const group of linkedGroups) {
    const selectedIds = selections[group.id] ?? [];
    for (const option of group.options) {
      if (!option.enabled || !selectedIds.includes(option.id)) continue;
      const variantPrice = option.variantPrices?.[sizeOptionId];
      if (typeof variantPrice === "number") {
        matrixPrices.push(variantPrice);
      }
    }
  }

  if (matrixPrices.length === 0) return null;

  const flavorGroup = linkedGroups.find((group) => group.multiple) ?? linkedGroups[0];

  if (flavorGroup?.multiple) {
    if (flavorGroup.pricingStrategy === "average") {
      const sum = matrixPrices.reduce((total, price) => total + price, 0);
      return Math.round(sum / matrixPrices.length);
    }
    return Math.max(...matrixPrices);
  }

  return matrixPrices[0] ?? null;
}
