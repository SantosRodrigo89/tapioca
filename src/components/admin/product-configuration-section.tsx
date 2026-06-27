"use client";

import { useState } from "react";
import type { ConfigurationGroupInput } from "@/lib/schemas/configuration.schema";
import {
  buildGroupsFromPizza,
  createDefaultOptionsGroup,
  createDefaultPizzaConfiguration,
  detectProductPricingMode,
  ensurePizzaConfiguration,
  type ProductPricingMode,
} from "@/lib/catalog/product-pricing-mode";
import { AdvancedConfigurationEditor } from "@/components/admin/advanced-configuration-editor";
import { PizzaModeEditor } from "@/components/admin/pizza-mode-editor";
import { SimpleOptionsEditor } from "@/components/admin/simple-options-editor";
import { Label } from "@/components/ui/label";

const PRICING_MODES: {
  value: ProductPricingMode;
  label: string;
  description: string;
}[] = [
  {
    value: "fixed",
    label: "Preço único",
    description: "Um valor fixo para o produto.",
  },
  {
    value: "options",
    label: "Opções de preço",
    description: "Variações com preços diferentes (ex.: tamanhos de milkshake).",
  },
  {
    value: "pizza",
    label: "Modo pizza",
    description: "Tamanhos + sabores com preço por combinação, meio a meio.",
  },
  {
    value: "advanced",
    label: "Avançado",
    description: "Grupos personalizados com regras de preço.",
  },
];

interface ProductConfigurationSectionProps {
  value: ConfigurationGroupInput[];
  onChange: (groups: ConfigurationGroupInput[]) => void;
  disabled?: boolean;
}

export function ProductConfigurationSection({
  value,
  onChange,
  disabled,
}: ProductConfigurationSectionProps) {
  const [mode, setMode] = useState<ProductPricingMode>(() =>
    detectProductPricingMode(value),
  );

  const switchMode = (nextMode: ProductPricingMode) => {
    setMode(nextMode);

    if (nextMode === "fixed") {
      onChange([]);
      return;
    }

    if (nextMode === "options") {
      const existing = value.find((group) => group.definesBasePrice);
      onChange([existing ?? createDefaultOptionsGroup()]);
      return;
    }

    if (nextMode === "pizza") {
      onChange(buildGroupsFromPizza(ensurePizzaConfiguration(value)));
      return;
    }

    if (nextMode === "advanced" && value.length === 0) {
      onChange([createDefaultOptionsGroup()]);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-3">
      <div className="space-y-1">
        <p className="text-sm font-medium">Precificação</p>
        <p className="text-xs text-muted-foreground">
          Escolha como o preço deste produto funciona no cardápio.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {PRICING_MODES.map((option) => {
          const selected = mode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => switchMode(option.value)}
              className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-input bg-background hover:bg-muted/30"
              }`}
            >
              <p className="text-sm font-medium">{option.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {mode === "fixed" && (
        <p className="rounded-md bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Use o campo <strong>Preço</strong> acima. Nenhuma variação extra.
        </p>
      )}

      {mode === "options" && (
        <SimpleOptionsEditor
          group={value[0] ?? createDefaultOptionsGroup()}
          disabled={disabled}
          onChange={(group) => onChange([group])}
        />
      )}

      {mode === "pizza" && (
        <div className="space-y-2">
          <Label className="sr-only">Configuração modo pizza</Label>
          <PizzaModeEditor
            value={ensurePizzaConfiguration(value)}
            disabled={disabled}
            onChange={(config) => onChange(buildGroupsFromPizza(config))}
          />
        </div>
      )}

      {mode === "advanced" && (
        <AdvancedConfigurationEditor
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}
    </div>
  );
}
