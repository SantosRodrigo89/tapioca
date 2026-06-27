"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ConfigurationGroup } from "@/types";
import type { PizzaConfiguration } from "@/lib/catalog/product-pricing-mode";
import { createVariantPricesForSizes } from "@/lib/catalog/product-pricing-mode";
import { syncOptionPriceFromVariants } from "@/lib/catalog/variant-pricing";
import { createEmptyConfigurationOption } from "@/lib/schemas/configuration.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriceInput } from "@/components/admin/price-input";

interface PizzaModeEditorProps {
  value: PizzaConfiguration;
  onChange: (config: PizzaConfiguration) => void;
  disabled?: boolean;
}

function asSizeGroup(sizes: PizzaConfiguration["sizes"]): ConfigurationGroup {
  return {
    id: "temp",
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
    options: sizes,
  };
}

export function PizzaModeEditor({
  value,
  onChange,
  disabled,
}: PizzaModeEditorProps) {
  const enabledSizes = value.sizes.filter((size) => size.enabled !== false);

  const update = (patch: Partial<PizzaConfiguration>) => {
    onChange({ ...value, ...patch });
  };

  const syncFlavorsForSizes = (
    sizes: PizzaConfiguration["sizes"],
    flavors: PizzaConfiguration["flavors"],
  ) => {
    const sizeGroup = asSizeGroup(sizes);
    return flavors.map((flavor) => {
      const variantPrices = {
        ...createVariantPricesForSizes(sizes),
        ...flavor.variantPrices,
      };
      return syncOptionPriceFromVariants({ ...flavor, variantPrices }, sizeGroup);
    });
  };

  const addSize = () => {
    const nextSizes = [
      ...value.sizes,
      { ...createEmptyConfigurationOption(value.sizes.length), price: 0 },
    ];
    update({
      sizes: nextSizes,
      flavors: syncFlavorsForSizes(nextSizes, value.flavors),
    });
  };

  const updateSize = (sizeId: string, name: string) => {
    update({
      sizes: value.sizes.map((size) =>
        size.id === sizeId ? { ...size, name } : size,
      ),
    });
  };

  const removeSize = (sizeId: string) => {
    const nextSizes = value.sizes.filter((size) => size.id !== sizeId);
    const nextFlavors = value.flavors.map((flavor) => {
      const nextVariantPrices = { ...flavor.variantPrices };
      delete nextVariantPrices[sizeId];
      return syncOptionPriceFromVariants(
        { ...flavor, variantPrices: nextVariantPrices },
        asSizeGroup(nextSizes),
      );
    });
    update({ sizes: nextSizes, flavors: nextFlavors });
  };

  const addFlavor = () => {
    const option = createEmptyConfigurationOption(value.flavors.length);
    update({
      flavors: [
        ...value.flavors,
        syncOptionPriceFromVariants(
          {
            ...option,
            variantPrices: createVariantPricesForSizes(value.sizes),
          },
          asSizeGroup(value.sizes),
        ),
      ],
    });
  };

  const updateFlavorName = (flavorId: string, name: string) => {
    update({
      flavors: value.flavors.map((flavor) =>
        flavor.id === flavorId ? { ...flavor, name } : flavor,
      ),
    });
  };

  const updateFlavorPrice = (
    flavorId: string,
    sizeId: string,
    cents: number,
  ) => {
    update({
      flavors: value.flavors.map((flavor) => {
        if (flavor.id !== flavorId) return flavor;
        const variantPrices = {
          ...(flavor.variantPrices ?? createVariantPricesForSizes(value.sizes)),
          [sizeId]: cents,
        };
        return syncOptionPriceFromVariants(
          { ...flavor, variantPrices },
          asSizeGroup(value.sizes),
        );
      }),
    });
  };

  const removeFlavor = (flavorId: string) => {
    update({
      flavors: value.flavors.filter((flavor) => flavor.id !== flavorId),
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Tamanhos</Label>
        <p className="text-xs text-muted-foreground">
          Defina os tamanhos disponíveis. Os preços ficam na tabela de sabores
          abaixo.
        </p>
        <div className="flex flex-wrap gap-2">
          {value.sizes.map((size) => (
            <div
              key={size.id}
              className="flex items-center gap-1 rounded-md border bg-background pl-2"
            >
              <Input
                value={size.name}
                disabled={disabled}
                placeholder="Ex: M"
                className="h-8 w-20 border-0 px-1 shadow-none focus-visible:ring-0"
                onChange={(e) => updateSize(size.id, e.target.value)}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                disabled={disabled || value.sizes.length <= 1}
                onClick={() => removeSize(size.id)}
                aria-label="Remover tamanho"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={addSize}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Tamanho
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <Label>Sabores e preços</Label>
            <p className="text-xs text-muted-foreground">
              Cada linha é um sabor; cada coluna é um tamanho.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={addFlavor}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Sabor
          </Button>
        </div>

        {enabledSizes.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Adicione ao menos um tamanho.
          </p>
        ) : value.flavors.length === 0 ? (
          <p className="rounded-md border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
            Nenhum sabor cadastrado. Clique em &quot;Sabor&quot; para começar.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="min-w-[160px] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">
                    Sabor
                  </th>
                  {enabledSizes.map((size) => (
                    <th
                      key={size.id}
                      className="min-w-[108px] px-2 py-2.5 text-left text-xs font-medium text-muted-foreground"
                    >
                      {size.name.trim() || "Tamanho"}
                    </th>
                  ))}
                  <th className="w-10 px-2 py-2.5" aria-hidden />
                </tr>
              </thead>
              <tbody>
                {value.flavors.map((flavor) => (
                  <tr key={flavor.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 align-top">
                      <Input
                        value={flavor.name}
                        disabled={disabled}
                        placeholder="Ex: Calabresa"
                        onChange={(e) =>
                          updateFlavorName(flavor.id, e.target.value)
                        }
                      />
                    </td>
                    {enabledSizes.map((size) => (
                      <td key={size.id} className="px-2 py-2 align-top">
                        <PriceInput
                          value={flavor.variantPrices?.[size.id] ?? 0}
                          disabled={disabled}
                          onChange={(cents) =>
                            updateFlavorPrice(flavor.id, size.id, cents)
                          }
                        />
                      </td>
                    ))}
                    <td className="px-2 py-2 align-top">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={disabled}
                        onClick={() => removeFlavor(flavor.id)}
                        aria-label="Remover sabor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-lg border bg-muted/20 p-3">
        <div>
          <Label htmlFor="pizza-max-flavors">Fracionamento (meio a meio)</Label>
          <p className="text-xs text-muted-foreground">
            Quantos sabores o cliente pode escolher na mesma pizza.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="pizza-max-flavors" className="text-xs">
              Máximo de sabores
            </Label>
            <select
              id="pizza-max-flavors"
              value={value.maxFlavors}
              disabled={disabled}
              onChange={(e) =>
                update({ maxFlavors: Number(e.target.value) || 1 })
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={1}>1 sabor (inteira)</option>
              <option value={2}>2 sabores (meio a meio)</option>
              <option value={3}>3 sabores</option>
              <option value={4}>4 sabores</option>
            </select>
          </div>
          {value.maxFlavors > 1 && (
            <div className="space-y-1">
              <Label htmlFor="pizza-fraction-strategy" className="text-xs">
                Cobrar pelo
              </Label>
              <select
                id="pizza-fraction-strategy"
                value={value.fractionStrategy}
                disabled={disabled}
                onChange={(e) =>
                  update({
                    fractionStrategy: e.target
                      .value as PizzaConfiguration["fractionStrategy"],
                  })
                }
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="highest">Sabor mais caro</option>
                <option value="average">Média dos sabores</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
