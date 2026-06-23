"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCategorySchema, type CreateCategoryInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryFormProps {
  defaultValues?: Partial<CreateCategoryInput>;
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function CategoryForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: { active: true, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="cat-name">Nome</Label>
        <Input
          id="cat-name"
          placeholder="Ex: Pratos Principais"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="cat-active"
          type="checkbox"
          className="h-4 w-4 rounded border-input"
          {...register("active")}
        />
        <Label htmlFor="cat-active" className="font-normal">
          Categoria ativa (visível no cardápio)
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
