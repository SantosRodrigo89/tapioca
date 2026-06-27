import { formatPrice } from "@/lib/utils";
import type { ConfigurationGroup } from "@/types";
import type { MenuItem } from "@/types";

export function getEnabledConfigurationGroups(
  item: MenuItem,
): ConfigurationGroup[] {
  return (item.configurationGroups ?? [])
    .filter(
      (group) =>
        group.enabled && group.options.some((option) => option.enabled),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function enabledOptionCount(group: ConfigurationGroup): number {
  return group.options.filter((option) => option.enabled).length;
}

function getGroupHint(group: ConfigurationGroup): string | null {
  const count = enabledOptionCount(group);
  if (count === 0) return null;

  const label = group.name.toLowerCase();

  if (group.definesBasePrice) {
    return `Disponível em ${count} ${label}`;
  }

  if (group.multiple && group.maxSelections > 1) {
    if (group.maxSelections < count) {
      return `Até ${group.maxSelections} ${label}`;
    }
    return `Escolha entre ${count} ${label}`;
  }

  if (!group.required) {
    if (count === 1) {
      return `${group.name} opcional`;
    }
    return `Possui opções de ${label}`;
  }

  if (count === 1) {
    return `${group.name} disponível`;
  }

  return `${count} opções de ${label}`;
}

export function getConfigurationCardHints(item: MenuItem): string[] {
  const groups = getEnabledConfigurationGroups(item);
  if (groups.length === 0) return [];

  const hints = groups
    .map(getGroupHint)
    .filter((hint): hint is string => hint != null);

  if (groups.length >= 2 && hints.length > 0) {
    const curated = hints.slice(0, 2);
    if (groups.length > curated.length) {
      curated.push("Escolha suas opções ao abrir");
    }
    return curated;
  }

  if (groups.length >= 2) {
    return ["Monte do seu jeito"];
  }

  return hints.slice(0, 2);
}

export function getConfigurationDrawerHints(item: MenuItem): string[] {
  return getEnabledConfigurationGroups(item)
    .map(getGroupHint)
    .filter((hint): hint is string => hint != null);
}

export function getGroupSelectionLabel(group: ConfigurationGroup): string {
  if (!group.required) return "Opcional";

  if (group.maxSelections === 1) {
    return group.required ? "Escolha 1 opção" : "Até 1 opção";
  }

  if (group.minSelections > 0 && group.minSelections === group.maxSelections) {
    return `Escolha ${group.maxSelections} opções`;
  }

  if (group.minSelections > 0) {
    return `Escolha de ${group.minSelections} a ${group.maxSelections}`;
  }

  return `Até ${group.maxSelections} opções`;
}

export function formatOptionPrice(
  group: ConfigurationGroup,
  optionPriceCents: number,
): string | null {
  if (optionPriceCents <= 0) return null;

  const formatted = formatPrice(optionPriceCents);

  if (group.definesBasePrice || group.pricingStrategy === "fixed") {
    return formatted;
  }

  return `+ ${formatted}`;
}
