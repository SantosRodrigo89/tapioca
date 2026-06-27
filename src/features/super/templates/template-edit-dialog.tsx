"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  UpdateTemplateFormSchema,
  type UpdateTemplateFormInput,
} from "@/lib/schemas/platform/template.schema";
import { DEFAULT_TENANT_THEME } from "@/lib/utils/theme";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TEMPLATE_CATEGORY_LABELS,
  type TemplateListItem,
} from "@/features/super/templates/template-types";

interface TemplateEditDialogProps {
  template: TemplateListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (template: TemplateListItem) => void;
}

export function TemplateEditDialog({
  template,
  open,
  onOpenChange,
  onSaved,
}: TemplateEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTemplateFormInput>({
    resolver: zodResolver(UpdateTemplateFormSchema),
  });

  const theme = watch("themePreset") ?? DEFAULT_TENANT_THEME;

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        description: template.description,
        category: template.category,
        thumbnailUrl: template.thumbnailUrl ?? "",
        status: template.status,
        order: template.order,
        themePreset: template.themePreset ?? DEFAULT_TENANT_THEME,
      });
    }
  }, [template, reset]);

  const onSubmit = async (data: UpdateTemplateFormInput) => {
    if (!template) return;

    try {
      const res = await fetch(`/api/super/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = (await res.json()) as {
        error?: string;
        details?: Record<string, string[] | undefined>;
        template?: TemplateListItem;
      };

      if (!res.ok) {
        const detail = body.details
          ? Object.values(body.details).flat()[0]
          : undefined;
        throw new Error(detail ?? body.error ?? "Falha ao salvar");
      }

      onSaved(body.template ?? { ...template, ...data, thumbnailUrl: data.thumbnailUrl || undefined });
      toast.success("Template atualizado");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar template");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="template-name">Nome</Label>
            <Input id="template-name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="template-description">Descrição</Label>
            <Textarea id="template-description" rows={2} {...register("description")} />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="template-category">Categoria</Label>
              <select
                id="template-category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("category")}
              >
                {Object.entries(TEMPLATE_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="template-order">Ordem</Label>
              <Input
                id="template-order"
                type="number"
                min={0}
                {...register("order", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="template-status">Status</Label>
            <select
              id="template-status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("status")}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="template-thumbnail">Thumbnail URL (opcional)</Label>
            <Input id="template-thumbnail" {...register("thumbnailUrl")} placeholder="https://…" />
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-sm font-medium">Tema (identidade visual)</p>
            {(
              [
                ["primaryColor", "Cor primária"],
                ["primaryDarkColor", "Primária escura"],
                ["secondaryColor", "Secundária"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) =>
                    setValue(`themePreset.${key}`, e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  className="h-9 w-12 rounded border border-input cursor-pointer"
                  aria-label={label}
                />
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    {...register(`themePreset.${key}`)}
                    className="font-mono text-xs h-8"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
