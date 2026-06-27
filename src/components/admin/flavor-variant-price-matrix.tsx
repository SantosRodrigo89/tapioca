"use client";

import type { ConfigurationGroup, ConfigurationOption } from "@/types";
import { getEnabledSizeOptions } from "@/lib/catalog/variant-pricing";
import { PriceInput } from "@/components/admin/price-input";

interface FlavorVariantPriceMatrixProps {
  sizeGroup: ConfigurationGroup;
  option: ConfigurationOption;
  disabled?: boolean;
  onChange: (patch: Partial<ConfigurationOption>) => void;
}

export function FlavorVariantPriceMatrix({
  sizeGroup,
  option,
  disabled,
  onChange,
}: FlavorVariantPriceMatrixProps) {
  const sizeOptions = getEnabledSizeOptions(sizeGroup);

  if (sizeOptions.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Adicione tamanhos no grupo de variação para definir preços por sabor.
      </p>
    );
  }

  const variantPrices = option.variantPrices ?? {};

  const updateVariantPrice = (sizeOptionId: string, cents: number) => {
    const nextVariantPrices = {
      ...variantPrices,
      [sizeOptionId]: cents,
    };
    const prices = Object.values(nextVariantPrices).filter(
      (price) => typeof price === "number",
    );

    onChange({
      variantPrices: nextVariantPrices,
      price: prices.length > 0 ? Math.min(...prices) : option.price,
    });
  };

  return (
    <div className="overflow-x-auto rounded-md border bg-background">
      <table className="w-full min-w-[280px] text-sm">
        <thead>
          <tr className="border-b bg-muted/30">
            {sizeOptions.map((sizeOption) => (
              <th
                key={sizeOption.id}
                className="px-2 py-1.5 text-left text-xs font-medium text-muted-foreground"
              >
                {sizeOption.name.trim() || "Tamanho"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {sizeOptions.map((sizeOption) => (
              <td key={sizeOption.id} className="px-2 py-1.5 align-top">
                <PriceInput
                  value={variantPrices[sizeOption.id] ?? 0}
                  disabled={disabled}
                  onChange={(cents) =>
                    updateVariantPrice(sizeOption.id, cents)
                  }
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
