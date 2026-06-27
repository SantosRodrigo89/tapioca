"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ConfigurationGroupInput } from "@/lib/schemas/configuration.schema";
import { createEmptyConfigurationOption } from "@/lib/schemas/configuration.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriceInput } from "@/components/admin/price-input";

interface SimpleOptionsEditorProps {
  group: ConfigurationGroupInput;
  onChange: (group: ConfigurationGroupInput) => void;
  disabled?: boolean;
}

export function SimpleOptionsEditor({
  group,
  onChange,
  disabled,
}: SimpleOptionsEditorProps) {
  const addOption = () => {
    onChange({
      ...group,
      options: [
        ...group.options,
        createEmptyConfigurationOption(group.options.length),
      ],
    });
  };

  const updateOption = (
    optionId: string,
    patch: Partial<ConfigurationGroupInput["options"][number]>,
  ) => {
    onChange({
      ...group,
      options: group.options.map((option) =>
        option.id === optionId ? { ...option, ...patch } : option,
      ),
    });
  };

  const removeOption = (optionId: string) => {
    onChange({
      ...group,
      options: group.options
        .filter((option) => option.id !== optionId)
        .map((option, index) => ({ ...option, displayOrder: index })),
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="options-group-name">Nome da variação</Label>
        <Input
          id="options-group-name"
          value={group.name}
          disabled={disabled}
          placeholder="Ex: Tamanho, Sabor, Volume…"
          onChange={(e) => onChange({ ...group, name: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Cada opção tem seu preço. No cardápio aparece &quot;A partir de&quot;.
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label>Opções</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={addOption}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Adicionar
        </Button>
      </div>

      {group.options.length === 0 ? (
        <p className="rounded-md border border-dashed px-3 py-5 text-center text-xs text-muted-foreground">
          Adicione as opções e preços do produto.
        </p>
      ) : (
        <div className="space-y-2">
          {group.options.map((option) => (
            <div
              key={option.id}
              className="grid gap-2 rounded-md border bg-background p-2 sm:grid-cols-[1fr_140px_auto]"
            >
              <Input
                placeholder="Nome da opção"
                value={option.name}
                disabled={disabled}
                onChange={(e) =>
                  updateOption(option.id, { name: e.target.value })
                }
              />
              <PriceInput
                value={option.price}
                disabled={disabled}
                onChange={(cents) => updateOption(option.id, { price: cents })}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-destructive hover:text-destructive"
                disabled={disabled}
                onClick={() => removeOption(option.id)}
                aria-label="Remover opção"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
