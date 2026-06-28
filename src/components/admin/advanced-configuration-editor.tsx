"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  createEmptyConfigurationGroup,
  createEmptyConfigurationOption,
  type ConfigurationGroupInput,
} from "@/lib/schemas/configuration.schema";
import {
  getEnabledSizeOptions,
  syncOptionPriceFromVariants,
} from "@/lib/catalog/variant-pricing";
import type { PricingStrategy } from "@/types";
import { FlavorVariantPriceMatrix } from "@/components/admin/flavor-variant-price-matrix";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriceInput } from "@/components/admin/price-input";
import { Separator } from "@/components/ui/separator";

const PRICING_STRATEGIES: {
  value: PricingStrategy;
  label: string;
  enabled: boolean;
}[] = [
  { value: "fixed", label: "Preço fixo", enabled: true },
  { value: "additional", label: "Preço adicional", enabled: true },
  { value: "highest", label: "Maior valor", enabled: true },
  { value: "average", label: "Média", enabled: true },
  { value: "sum", label: "Soma", enabled: false },
  { value: "custom", label: "Personalizado", enabled: false },
];

const GROUP_TYPES = [
  "Variação",
  "Sabores",
  "Bebidas",
  "Molhos",
  "Bordas",
] as const;

/** Preserved for existing products — not offered when creating new groups. */
const LEGACY_GROUP_TYPES = ["Adicionais", "Complementos"] as const;

function isPresetGroupType(type: string): type is (typeof GROUP_TYPES)[number] {
  return (GROUP_TYPES as readonly string[]).includes(type);
}

function isLegacyGroupType(
  type: string,
): type is (typeof LEGACY_GROUP_TYPES)[number] {
  return (LEGACY_GROUP_TYPES as readonly string[]).includes(type);
}

function getGroupTypeSelectValue(type: string): string {
  const trimmed = type.trim();
  return trimmed || "Variação";
}

function getGroupTypeSelectOptions(type: string): string[] {
  const current = getGroupTypeSelectValue(type);

  if (isPresetGroupType(current)) {
    return [...GROUP_TYPES];
  }

  if (isLegacyGroupType(current)) {
    return [current, ...GROUP_TYPES];
  }

  // Custom type from older data — preserve without overwriting on edit.
  return [current, ...GROUP_TYPES];
}

interface AdvancedConfigurationEditorProps {
  value: ConfigurationGroupInput[];
  onChange: (groups: ConfigurationGroupInput[]) => void;
  disabled?: boolean;
}

function normalizeGroupOrders(
  groups: ConfigurationGroupInput[],
): ConfigurationGroupInput[] {
  return groups.map((group, index) => ({
    ...group,
    displayOrder: index,
  }));
}

export function AdvancedConfigurationEditor({
  value,
  onChange,
  disabled,
}: AdvancedConfigurationEditorProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(value.map((group) => group.id)),
  );

  const updateGroups = (groups: ConfigurationGroupInput[]) => {
    onChange(normalizeGroupOrders(groups));
  };

  const baseSizeGroup = value.find(
    (group) => group.enabled && group.definesBasePrice,
  );

  const createVariantPricesForOption = (
    sizeGroup: ConfigurationGroupInput,
    fallbackPrice = 0,
  ) =>
    Object.fromEntries(
      getEnabledSizeOptions(sizeGroup).map((sizeOption) => [
        sizeOption.id,
        fallbackPrice,
      ]),
    );

  const toggleLinkedPricing = (groupId: string, enabled: boolean) => {
    if (!baseSizeGroup) return;

    updateGroups(
      value.map((group) => {
        if (group.id !== groupId) return group;

        if (!enabled) {
          return {
            ...group,
            linkedGroupId: undefined,
            options: group.options.map((option) => ({
              ...option,
              variantPrices: undefined,
            })),
          };
        }

        return {
          ...group,
          linkedGroupId: baseSizeGroup.id,
          pricingStrategy: "fixed",
          definesBasePrice: false,
          options: group.options.map((option) => {
            const variantPrices =
              option.variantPrices ??
              createVariantPricesForOption(baseSizeGroup, option.price);
            return syncOptionPriceFromVariants(
              { ...option, variantPrices },
              baseSizeGroup,
            );
          }),
        };
      }),
    );
  };

  const toggleExpanded = (groupId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const addGroup = () => {
    const group = createEmptyConfigurationGroup(value.length);
    updateGroups([...value, group]);
    setExpandedIds((prev) => new Set(prev).add(group.id));
  };

  const removeGroup = (groupId: string) => {
    updateGroups(value.filter((group) => group.id !== groupId));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  };

  const updateGroup = (
    groupId: string,
    patch: Partial<ConfigurationGroupInput>,
  ) => {
    updateGroups(
      value.map((group) => {
        if (group.id !== groupId) {
          if (patch.definesBasePrice) {
            return { ...group, definesBasePrice: false };
          }
          return group;
        }

        const next = { ...group, ...patch };

        if (next.multiple === false) {
          next.maxSelections = 1;
          if (next.minSelections > 1) next.minSelections = 1;
        }

        if (patch.pricingStrategy && patch.pricingStrategy !== "fixed") {
          next.definesBasePrice = false;
        }

        if (next.definesBasePrice) {
          next.pricingStrategy = "fixed";
          next.maxSelections = 1;
          next.multiple = false;
          if (next.minSelections < 1) next.minSelections = 1;
        }

        return next;
      }),
    );
  };

  const addOption = (groupId: string) => {
    updateGroups(
      value.map((group) => {
        if (group.id !== groupId) return group;
        const option = createEmptyConfigurationOption(group.options.length);
        const linkedSizeGroup = group.linkedGroupId
          ? value.find((candidate) => candidate.id === group.linkedGroupId)
          : undefined;

        const nextOption =
          linkedSizeGroup?.definesBasePrice
            ? {
                ...option,
                variantPrices: createVariantPricesForOption(linkedSizeGroup),
              }
            : option;

        return { ...group, options: [...group.options, nextOption] };
      }),
    );
  };

  const updateOption = (
    groupId: string,
    optionId: string,
    patch: Partial<ConfigurationGroupInput["options"][number]>,
  ) => {
    updateGroups(
      value.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          options: group.options.map((option) =>
            option.id === optionId ? { ...option, ...patch } : option,
          ),
        };
      }),
    );
  };

  const removeOption = (groupId: string, optionId: string) => {
    updateGroups(
      value.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          options: group.options
            .filter((option) => option.id !== optionId)
            .map((option, index) => ({ ...option, displayOrder: index })),
        };
      }),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Configuração avançada com grupos e estratégias de preço. Para
          adicionais simples, use a seção Complementos abaixo.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addGroup}
          disabled={disabled}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Grupo
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          Nenhum grupo configurado.
        </p>
      ) : (
        <div className="space-y-3">
          {value.map((group) => {
            const expanded = expandedIds.has(group.id);
            const linkedSizeGroup = group.linkedGroupId
              ? value.find((candidate) => candidate.id === group.linkedGroupId)
              : undefined;
            const usesVariantPricing =
              !group.definesBasePrice &&
              linkedSizeGroup?.definesBasePrice === true;
            const groupTypeValue = getGroupTypeSelectValue(group.type);
            const groupTypeOptions = getGroupTypeSelectOptions(group.type);
            const isLegacyType = isLegacyGroupType(groupTypeValue);

            return (
              <div key={group.id} className="rounded-md border bg-muted/20">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
                  onClick={() => toggleExpanded(group.id)}
                  disabled={disabled}
                >
                  {expanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium truncate flex-1">
                    {group.name.trim() || "Novo grupo"}
                  </span>
                </button>

                {expanded && (
                  <div className="space-y-4 border-t px-3 py-3">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor={`group-name-${group.id}`}>Nome</Label>
                        <Input
                          id={`group-name-${group.id}`}
                          placeholder="Ex: Tamanho, Sabores, Bordas…"
                          value={group.name}
                          disabled={disabled}
                          onChange={(e) =>
                            updateGroup(group.id, { name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`group-type-${group.id}`}>Tipo</Label>
                        <select
                          id={`group-type-${group.id}`}
                          value={groupTypeValue}
                          disabled={disabled}
                          onChange={(e) =>
                            updateGroup(group.id, { type: e.target.value })
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {groupTypeOptions.map((type) => (
                            <option key={type} value={type}>
                              {type}
                              {isLegacyGroupType(type) ? " (legado)" : ""}
                            </option>
                          ))}
                        </select>
                        {isLegacyType && (
                          <p className="text-xs text-muted-foreground">
                            Tipo legado preservado. Para novos adicionais, use a
                            seção Complementos abaixo.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label htmlFor={`group-strategy-${group.id}`}>
                          Estratégia de preço
                        </Label>
                        <select
                          id={`group-strategy-${group.id}`}
                          value={group.pricingStrategy}
                          disabled={disabled}
                          onChange={(e) =>
                            updateGroup(group.id, {
                              pricingStrategy: e.target
                                .value as PricingStrategy,
                            })
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {PRICING_STRATEGIES.map((strategy) => (
                            <option
                              key={strategy.value}
                              value={strategy.value}
                              disabled={!strategy.enabled}
                            >
                              {strategy.label}
                              {!strategy.enabled ? " (em breve)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor={`group-min-${group.id}`}>Mín.</Label>
                          <Input
                            id={`group-min-${group.id}`}
                            type="number"
                            min={0}
                            value={group.minSelections}
                            disabled={disabled || !group.multiple}
                            onChange={(e) =>
                              updateGroup(group.id, {
                                minSelections: Number(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`group-max-${group.id}`}>Máx.</Label>
                          <Input
                            id={`group-max-${group.id}`}
                            type="number"
                            min={1}
                            value={group.maxSelections}
                            disabled={disabled || !group.multiple}
                            onChange={(e) =>
                              updateGroup(group.id, {
                                maxSelections: Math.max(
                                  1,
                                  Number(e.target.value) || 1,
                                ),
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-input"
                          checked={group.required}
                          disabled={disabled}
                          onChange={(e) =>
                            updateGroup(group.id, { required: e.target.checked })
                          }
                        />
                        Obrigatório
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-input"
                          checked={group.multiple}
                          disabled={disabled || group.definesBasePrice}
                          onChange={(e) =>
                            updateGroup(group.id, { multiple: e.target.checked })
                          }
                        />
                        Seleção múltipla
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-input"
                          checked={group.definesBasePrice}
                          disabled={
                            disabled || group.pricingStrategy !== "fixed"
                          }
                          onChange={(e) =>
                            updateGroup(group.id, {
                              definesBasePrice: e.target.checked,
                            })
                          }
                        />
                        Define preço base
                      </label>
                      {baseSizeGroup &&
                        !group.definesBasePrice &&
                        group.id !== baseSizeGroup.id && (
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-input"
                              checked={usesVariantPricing}
                              disabled={disabled}
                              onChange={(e) =>
                                toggleLinkedPricing(group.id, e.target.checked)
                              }
                            />
                            Preço por tamanho
                          </label>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Label>Opções</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={disabled}
                          onClick={() => addOption(group.id)}
                        >
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Opção
                        </Button>
                      </div>

                      {group.options.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Adicione ao menos uma opção.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {group.options.map((option) => (
                            <div
                              key={option.id}
                              className="space-y-2 rounded-md border bg-background p-2"
                            >
                              <div className="grid gap-2 sm:grid-cols-[1fr_140px_auto]">
                                <Input
                                  placeholder="Nome da opção"
                                  value={option.name}
                                  disabled={disabled}
                                  onChange={(e) =>
                                    updateOption(group.id, option.id, {
                                      name: e.target.value,
                                    })
                                  }
                                />
                                {!usesVariantPricing && (
                                  <PriceInput
                                    value={option.price}
                                    disabled={disabled}
                                    onChange={(cents) =>
                                      updateOption(group.id, option.id, {
                                        price: cents,
                                      })
                                    }
                                  />
                                )}
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-9 w-9 text-destructive hover:text-destructive"
                                  disabled={disabled}
                                  onClick={() =>
                                    removeOption(group.id, option.id)
                                  }
                                  aria-label="Remover opção"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {usesVariantPricing && linkedSizeGroup && (
                                <FlavorVariantPriceMatrix
                                  sizeGroup={linkedSizeGroup}
                                  option={option}
                                  disabled={disabled}
                                  onChange={(patch) =>
                                    updateOption(group.id, option.id, patch)
                                  }
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={disabled}
                        onClick={() => removeGroup(group.id)}
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" />
                        Remover grupo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
