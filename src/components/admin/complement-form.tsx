"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateComplementSchema,
  type CreateComplementInput,
} from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PriceInput } from "@/components/admin/price-input";

interface ComplementFormProps {
  defaultValues?: Partial<CreateComplementInput>;
  onSubmit: (data: CreateComplementInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ComplementForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: ComplementFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateComplementInput>({
    resolver: zodResolver(CreateComplementSchema),
    defaultValues: { enabled: true, price: 0, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="complement-name">Nome</Label>
        <Input
          id="complement-name"
          placeholder="Ex: Bacon extra"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="complement-desc">Descrição (opcional)</Label>
        <Textarea
          id="complement-desc"
          placeholder="Detalhes do complemento…"
          rows={2}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="complement-price">Preço</Label>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <PriceInput
              id="complement-price"
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

      <div className="flex items-center gap-2">
        <input
          id="complement-enabled"
          type="checkbox"
          className="h-4 w-4 rounded border-input"
          {...register("enabled", {
            setValueAs: (v) => v === true || v === "on",
          })}
        />
        <Label htmlFor="complement-enabled" className="font-normal">
          Complemento ativo (disponível para vincular)
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
