"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMenuItemSchema, type CreateMenuItemInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { PriceInput } from "@/components/admin/price-input";

interface MenuItemFormProps {
  currentImageUrl?: string;
  defaultValues?: Partial<CreateMenuItemInput>;
  onSubmit: (data: CreateMenuItemInput, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function MenuItemForm({
  currentImageUrl,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: MenuItemFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

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
      onSubmit={handleSubmit((data) => onSubmit(data, imageFile))}
      className="space-y-4"
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
        <Label htmlFor="item-price">Preço</Label>
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
