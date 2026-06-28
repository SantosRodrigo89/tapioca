import type {
  Complement,
  ConfigurationGroup,
  ConfigurationOption,
  MenuItem,
} from "@/types";

export const COMPLEMENT_GROUP_ID = "__complements__";

const DEFAULT_MAX_SELECTIONS = 99;

export interface ResolveComplementsOptions {
  /** When true, disabled complements are omitted from the synthetic group. */
  publicOnly?: boolean;
}

function sortComplementIdsByCatalogOrder(
  complementIds: string[],
  catalog: Complement[],
): string[] {
  const catalogById = new Map(catalog.map((entry) => [entry.id, entry]));

  return [...complementIds].sort((a, b) => {
    const orderA = catalogById.get(a)?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = catalogById.get(b)?.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}

export function buildComplementConfigurationGroup(
  complementIds: string[],
  catalog: Complement[],
  options: ResolveComplementsOptions = {},
): ConfigurationGroup | null {
  if (complementIds.length === 0) return null;

  const catalogById = new Map(catalog.map((entry) => [entry.id, entry]));
  const resolvedOptions: ConfigurationOption[] = [];
  const orderedIds = sortComplementIdsByCatalogOrder(complementIds, catalog);

  for (const complementId of orderedIds) {
    const complement = catalogById.get(complementId);
    if (!complement) continue;
    if (options.publicOnly && !complement.enabled) continue;

    resolvedOptions.push({
      id: complement.id,
      name: complement.name,
      description: complement.description,
      price: complement.price,
      imageUrl: complement.imageUrl,
      enabled: complement.enabled,
      displayOrder: complement.order,
    });
  }

  if (resolvedOptions.length === 0) return null;

  return {
    id: COMPLEMENT_GROUP_ID,
    name: "Complementos",
    type: "Complementos",
    required: false,
    multiple: true,
    minSelections: 0,
    maxSelections: DEFAULT_MAX_SELECTIONS,
    pricingStrategy: "additional",
    definesBasePrice: false,
    enabled: true,
    displayOrder: Number.MAX_SAFE_INTEGER,
    options: resolvedOptions,
  };
}

export function resolveMenuItemConfigurationGroups(
  item: MenuItem,
  catalog: Complement[],
  options: ResolveComplementsOptions = {},
): ConfigurationGroup[] {
  const groups = [...(item.configurationGroups ?? [])];
  const complementGroup = buildComplementConfigurationGroup(
    item.complementIds ?? [],
    catalog,
    options,
  );

  if (complementGroup) {
    groups.push(complementGroup);
  }

  return groups;
}

export function resolveMenuItemWithComplements(
  item: MenuItem,
  catalog: Complement[],
  options: ResolveComplementsOptions = {},
): MenuItem {
  const configurationGroups = resolveMenuItemConfigurationGroups(
    item,
    catalog,
    options,
  );

  return {
    ...item,
    configurationGroups:
      configurationGroups.length > 0 ? configurationGroups : undefined,
  };
}

export function resolveMenuItemsWithComplements(
  items: MenuItem[],
  catalog: Complement[],
  options: ResolveComplementsOptions = {},
): MenuItem[] {
  return items.map((item) =>
    resolveMenuItemWithComplements(item, catalog, options),
  );
}
