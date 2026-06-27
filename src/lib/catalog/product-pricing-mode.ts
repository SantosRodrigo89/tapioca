import { syncOptionPriceFromVariants } from "@/lib/catalog/variant-pricing";
import {
  createEmptyConfigurationOption,
  type ConfigurationGroupInput,
  type ConfigurationOptionInput,
} from "@/lib/schemas/configuration.schema";

export type ProductPricingMode = "fixed" | "options" | "pizza" | "advanced";

export type PizzaFractionStrategy = "highest" | "average";

export interface PizzaConfiguration {
  sizeGroupId: string;
  flavorGroupId: string;
  sizes: ConfigurationOptionInput[];
  flavors: ConfigurationOptionInput[];
  maxFlavors: number;
  fractionStrategy: PizzaFractionStrategy;
  addonGroups: ConfigurationGroupInput[];
}

export function detectProductPricingMode(
  groups: ConfigurationGroupInput[],
): ProductPricingMode {
  if (groups.length === 0) return "fixed";

  const sizeGroup = groups.find((group) => group.definesBasePrice);
  const flavorGroup = sizeGroup
    ? groups.find((group) => group.linkedGroupId === sizeGroup.id)
    : undefined;
  const otherGroups = groups.filter(
    (group) => group.id !== sizeGroup?.id && group.id !== flavorGroup?.id,
  );

  if (sizeGroup) {
    if (flavorGroup) {
      const addonsOnly = otherGroups.every(
        (group) => group.pricingStrategy === "additional",
      );
      return addonsOnly ? "pizza" : "advanced";
    }
    if (groups.length === 1) return "pizza";
  }

  if (
    groups.length === 1 &&
    groups[0]?.definesBasePrice &&
    !groups[0]?.linkedGroupId
  ) {
    return "options";
  }

  return "advanced";
}

export function parsePizzaConfiguration(
  groups: ConfigurationGroupInput[],
): PizzaConfiguration | null {
  const sizeGroup = groups.find((group) => group.definesBasePrice);
  if (!sizeGroup) return null;

  const existingFlavorGroup = groups.find(
    (group) => group.linkedGroupId === sizeGroup.id,
  );
  const flavorGroupId = existingFlavorGroup?.id ?? crypto.randomUUID();

  const addonGroups = groups.filter(
    (group) => group.id !== sizeGroup.id && group.id !== flavorGroupId,
  );

  return {
    sizeGroupId: sizeGroup.id,
    flavorGroupId,
    sizes: sizeGroup.options,
    flavors: existingFlavorGroup?.options ?? [],
    maxFlavors: existingFlavorGroup?.maxSelections ?? 2,
    fractionStrategy:
      existingFlavorGroup?.pricingStrategy === "average"
        ? "average"
        : "highest",
    addonGroups,
  };
}

export function buildGroupsFromPizza(
  config: PizzaConfiguration,
): ConfigurationGroupInput[] {
  const sizeGroup: ConfigurationGroupInput = {
    id: config.sizeGroupId,
    name: "Tamanho",
    type: "Variação",
    required: true,
    multiple: false,
    minSelections: 1,
    maxSelections: 1,
    pricingStrategy: "fixed",
    definesBasePrice: true,
    enabled: true,
    displayOrder: 0,
    options: config.sizes.map((size, index) => ({
      ...size,
      price: 0,
      displayOrder: index,
      enabled: size.enabled !== false,
    })),
  };

  const multiple = config.maxFlavors > 1;
  const flavorGroup: ConfigurationGroupInput = {
    id: config.flavorGroupId,
    name: "Sabores",
    type: "Sabores",
    required: true,
    multiple,
    minSelections: 1,
    maxSelections: Math.max(1, config.maxFlavors),
    pricingStrategy: config.fractionStrategy,
    definesBasePrice: false,
    linkedGroupId: sizeGroup.id,
    enabled: true,
    displayOrder: 1,
    options: config.flavors.map((flavor, index) => {
      const withVariants = syncOptionPriceFromVariants(flavor, sizeGroup);
      return { ...withVariants, displayOrder: index };
    }),
  };

  return [
    sizeGroup,
    flavorGroup,
    ...config.addonGroups.map((group, index) => ({
      ...group,
      displayOrder: index + 2,
    })),
  ];
}

export function createDefaultPizzaConfiguration(): PizzaConfiguration {
  const sizeGroupId = crypto.randomUUID();
  const flavorGroupId = crypto.randomUUID();

  return {
    sizeGroupId,
    flavorGroupId,
    sizes: ["P", "M", "G"].map((name, index) => ({
      ...createEmptyConfigurationOption(index),
      name,
      price: 0,
    })),
    flavors: [],
    maxFlavors: 2,
    fractionStrategy: "highest",
    addonGroups: [],
  };
}

export function createDefaultOptionsGroup(
  displayOrder = 0,
): ConfigurationGroupInput {
  return {
    id: crypto.randomUUID(),
    name: "Opções",
    type: "Variação",
    required: true,
    multiple: false,
    minSelections: 1,
    maxSelections: 1,
    pricingStrategy: "fixed",
    definesBasePrice: true,
    enabled: true,
    displayOrder,
    options: [],
  };
}

export function createVariantPricesForSizes(
  sizes: ConfigurationOptionInput[],
  fallbackPrice = 0,
): Record<string, number> {
  return Object.fromEntries(
    sizes
      .filter((size) => size.enabled !== false)
      .map((size) => [size.id, fallbackPrice]),
  );
}

export function ensurePizzaConfiguration(
  groups: ConfigurationGroupInput[],
): PizzaConfiguration {
  return (
    parsePizzaConfiguration(groups) ?? createDefaultPizzaConfiguration()
  );
}
