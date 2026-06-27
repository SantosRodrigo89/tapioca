import type { ConfigurationGroup, ConfigurationOption, PricingStrategy } from "@/types";

const PRICING_STRATEGIES: PricingStrategy[] = [
  "fixed",
  "additional",
  "highest",
  "average",
  "sum",
  "custom",
];

function parseOption(raw: unknown, index: number): ConfigurationOption | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (typeof data.id !== "string" || typeof data.name !== "string") return null;

  return {
    id: data.id,
    name: data.name,
    description:
      typeof data.description === "string" ? data.description : undefined,
    price: typeof data.price === "number" ? data.price : 0,
    variantPrices: parseVariantPrices(data.variantPrices),
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : undefined,
    enabled: data.enabled !== false,
    displayOrder:
      typeof data.displayOrder === "number" ? data.displayOrder : index,
  };
}

function parseVariantPrices(
  raw: unknown,
): Record<string, number> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;

  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "number" && value >= 0) {
      result[key] = value;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function parseGroup(raw: unknown, index: number): ConfigurationGroup | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (typeof data.id !== "string" || typeof data.name !== "string") return null;

  const strategy = PRICING_STRATEGIES.includes(
    data.pricingStrategy as PricingStrategy,
  )
    ? (data.pricingStrategy as PricingStrategy)
    : "fixed";

  const optionsRaw = Array.isArray(data.options) ? data.options : [];

  return {
    id: data.id,
    name: data.name,
    type: typeof data.type === "string" ? data.type : "Variação",
    required: data.required === true,
    multiple: data.multiple === true,
    minSelections:
      typeof data.minSelections === "number" ? data.minSelections : 0,
    maxSelections:
      typeof data.maxSelections === "number" ? data.maxSelections : 1,
    pricingStrategy: strategy,
    definesBasePrice: data.definesBasePrice === true,
    linkedGroupId:
      typeof data.linkedGroupId === "string" ? data.linkedGroupId : undefined,
    enabled: data.enabled !== false,
    displayOrder:
      typeof data.displayOrder === "number" ? data.displayOrder : index,
    options: optionsRaw
      .map((option, optionIndex) => parseOption(option, optionIndex))
      .filter((option): option is ConfigurationOption => option != null),
  };
}

export function parseConfigurationGroups(
  raw: unknown,
): ConfigurationGroup[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;

  const groups = raw
    .map((group, index) => parseGroup(group, index))
    .filter((group): group is ConfigurationGroup => group != null);

  return groups.length > 0 ? groups : undefined;
}
