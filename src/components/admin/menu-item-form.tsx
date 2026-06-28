"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateMenuItemSchema,
  type CreateMenuItemInput,
  type ConfigurationGroupInput,
} from "@/lib/schemas";
import { AvailabilityScheduleFields } from "@/components/admin/availability-schedule-fields";
import { ProductConfigurationSection } from "@/components/admin/product-configuration-section";
import { ProductComplementsSection } from "@/components/admin/product-complements-section";
import type { AvailabilitySchedule, Complement } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { PriceInput } from "@/components/admin/price-input";

interface MenuItemFormProps {
  currentImageUrl?: string;
  defaultValues?: Partial<CreateMenuItemInput>;
  categoryAvailability?: AvailabilitySchedule;
  complements: Complement[];
  onSubmit: (data: CreateMenuItemInput, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function MenuItemForm({
  currentImageUrl,
  defaultValues,
  categoryAvailability,
  complements,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: MenuItemFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [availability, setAvailability] = useState<
    AvailabilitySchedule | undefined
  >(defaultValues?.availability);
  const [configurationGroups, setConfigurationGroups] = useState<
    ConfigurationGroupInput[]
  >(defaultValues?.configurationGroups ?? []);
  const [complementIds, setComplementIds] = useState<string[]>(
    defaultValues?.complementIds ?? [],
  );
  const [configError, setConfigError] = useState<string | null>(null);

  const hasBasePriceGroup = configurationGroups.some(
    (group) => group.definesBasePrice,
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateMenuItemInput>({
    resolver: zodResolver(CreateMenuItemSchema),
    defaultValues: { available: true, ...defaultValues },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const payload = {
          ...data,
          availability,
          configurationGroups:
            configurationGroups.length > 0 ? configurationGroups : undefined,
          complementIds: complementIds.length > 0 ? complementIds : undefined,
        };

        const parsed = CreateMenuItemSchema.safeParse(payload);
        if (!parsed.success) {
          const groupIssue = parsed.error.issues.find((issue) =>
            issue.path.includes("configurationGroups"),
          );
          setConfigError(
            groupIssue?.message ?? "Verifique as configurações do produto",
          );
          return;
        }

        setConfigError(null);
        return onSubmit(parsed.data, imageFile);
      })}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
    >
      <div className="space-y-1">
        <Label htmlFor="item-name">Nome</Label>
        <Input id="item-name" placeholder="Ex: X-Burguer" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="item-desc">Descrição (opcional)</Label>
        <Textarea
          id="item-desc"
          placeholder="Descreva o item brevemente…"
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="item-price">
          {hasBasePriceGroup ? "Preço base (opcional)" : "Preço"}
        </Label>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <PriceInput
              id="item-price"
              value={field.value ?? 0}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
        {hasBasePriceGroup && (
          <p className="text-xs text-muted-foreground">
            Com variação de preço, deixe em R$ 0 — o cardápio mostra
            &quot;A partir de&quot; automaticamente.
          </p>
        )}
        {errors.price && (
          <p className="text-xs text-destructive">{errors.price.message}</p>
        )}
      </div>

      <ImageUpload
        label="Foto do item (opcional)"
        currentUrl={currentImageUrl}
        onFileChange={setImageFile}
        disabled={isSubmitting}
      />

      <div className="flex items-center gap-2">
        <input
          id="item-available"
          type="checkbox"
          className="h-4 w-4 rounded border-input"
          {...register("available", { setValueAs: (v) => v === true || v === "on" })}
        />
        <Label htmlFor="item-available" className="font-normal">
          Item disponível (visível no cardápio)
        </Label>
      </div>

      <ProductConfigurationSection
        value={configurationGroups}
        onChange={setConfigurationGroups}
        disabled={isSubmitting}
      />
      {configError && (
        <p className="text-xs text-destructive">{configError}</p>
      )}

      <ProductComplementsSection
        complements={complements}
        value={complementIds}
        onChange={setComplementIds}
        disabled={isSubmitting}
      />

      <AvailabilityScheduleFields
        value={availability}
        onChange={setAvailability}
        disabled={isSubmitting}
        inheritHint={
          categoryAvailability?.enabled
            ? `Sem horário próprio, usa o da categoria (${categoryAvailability.windows.map((w) => `${w.start}–${w.end}`).join(", ")}).`
            : "Sem horário próprio, fica disponível o dia todo (quando ativo)."
        }
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
