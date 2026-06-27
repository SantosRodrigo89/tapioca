import type { ConfigurationGroup } from "@/types";

export function serializeConfigurationGroups(
  groups: ConfigurationGroup[] | undefined | null,
): ConfigurationGroup[] | null {
  if (!groups || groups.length === 0) return null;

  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    type: group.type,
    required: group.required,
    multiple: group.multiple,
    minSelections: group.minSelections,
    maxSelections: group.maxSelections,
    pricingStrategy: group.pricingStrategy,
    definesBasePrice: group.definesBasePrice,
    enabled: group.enabled,
    displayOrder: group.displayOrder,
    options: group.options.map((option) => ({
      id: option.id,
      name: option.name,
      description: option.description ?? null,
      price: option.price,
      imageUrl: option.imageUrl ?? null,
      enabled: option.enabled,
      displayOrder: option.displayOrder,
    })),
  })) as unknown as ConfigurationGroup[];
}
