"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import {
  createEmptyConfigurationGroup,
  createEmptyConfigurationOption,
  type ConfigurationGroupInput,
} from "@/lib/schemas/configuration.schema";
import type { PricingStrategy } from "@/types";
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
  { value: "average", label: "Média", enabled: false },
  { value: "sum", label: "Soma", enabled: false },
  { value: "custom", label: "Personalizado", enabled: false },
];

const GROUP_TYPE_SUGGESTIONS = [
  "Variação",
  "Sabores",
  "Adicionais",
  "Complementos",
  "Bebidas",
  "Molhos",
  "Bordas",
];

interface ProductConfigurationSectionProps {
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

export function ProductConfigurationSection({
  value,
  onChange,
  disabled,
}: ProductConfigurationSectionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(value.map((group) => group.id)),
  );

  const updateGroups = (groups: ConfigurationGroupInput[]) => {
    onChange(normalizeGroupOrders(groups));
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
        return { ...group, options: [...group.options, option] };
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
    <div className="space-y-3 rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Configurações do produto</p>
          <p className="text-xs text-muted-foreground">
            Grupos opcionais como tamanho, sabores ou adicionais.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addGroup}
          disabled={disabled}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Adicionar grupo
        </Button>
      </div>

      {value.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          Sem grupos — o produto usa apenas o preço base.
        </p>
      ) : (
        <div className="space-y-3">
          {value.map((group) => {
            const expanded = expandedIds.has(group.id);

            return (
              <div
                key={group.id}
                className="rounded-md border bg-muted/20"
              >
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
                  {group.definesBasePrice && (
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground shrink-0">
                      Variação
                    </span>
                  )}
                </button>

                {expanded && (
                  <div className="space-y-4 border-t px-3 py-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label htmlFor={`group-name-${group.id}`}>Nome</Label>
                        <Input
                          id={`group-name-${group.id}`}
                          placeholder="Ex: Tamanho"
                          value={group.name}
                          disabled={disabled}
                          onChange={(e) =>
                            updateGroup(group.id, { name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`group-type-${group.id}`}>Tipo</Label>
                        <Input
                          id={`group-type-${group.id}`}
                          list={`group-type-suggestions-${group.id}`}
                          placeholder="Ex: Variação"
                          value={group.type}
                          disabled={disabled}
                          onChange={(e) =>
                            updateGroup(group.id, { type: e.target.value })
                          }
                        />
                        <datalist id={`group-type-suggestions-${group.id}`}>
                          {GROUP_TYPE_SUGGESTIONS.map((type) => (
                            <option key={type} value={type} />
                          ))}
                        </datalist>
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
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-input"
                          checked={group.enabled}
                          disabled={disabled}
                          onChange={(e) =>
                            updateGroup(group.id, { enabled: e.target.checked })
                          }
                        />
                        Ativo
                      </label>
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
                          Adicionar opção
                        </Button>
                      </div>

                      {group.options.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Adicione ao menos uma opção neste grupo.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {group.options.map((option) => (
                            <div
                              key={option.id}
                              className="grid gap-2 rounded-md border bg-background p-2 sm:grid-cols-[1fr_140px_auto_auto]"
                            >
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
                              <PriceInput
                                value={option.price}
                                disabled={disabled}
                                onChange={(cents) =>
                                  updateOption(group.id, option.id, {
                                    price: cents,
                                  })
                                }
                              />
                              <label className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-input"
                                  checked={option.enabled}
                                  disabled={disabled}
                                  onChange={(e) =>
                                    updateOption(group.id, option.id, {
                                      enabled: e.target.checked,
                                    })
                                  }
                                />
                                Ativa
                              </label>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                disabled={disabled}
                                onClick={() =>
                                  removeOption(group.id, option.id)
                                }
                                aria-label="Remover opção"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
