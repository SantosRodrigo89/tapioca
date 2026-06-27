"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  UpdatePlanFormSchema,
  type UpdatePlanFormInput,
} from "@/lib/schemas/platform/plan.schema";
import { PriceInput } from "@/components/admin/price-input";
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
import type { PlanListItem } from "@/features/super/plans/plan-types";

interface PlanEditDialogProps {
  plan: PlanListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (plan: PlanListItem) => void;
}

export function PlanEditDialog({
  plan,
  open,
  onOpenChange,
  onSaved,
}: PlanEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePlanFormInput>({
    resolver: zodResolver(UpdatePlanFormSchema),
  });

  const priceCents = watch("priceCents") ?? 0;
  const color = watch("color") ?? "#64748b";

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        description: plan.description,
        priceCents: plan.priceCents,
        color: plan.color,
        order: plan.order,
        status: plan.status,
      });
    }
  }, [plan, reset]);

  const onSubmit = async (data: UpdatePlanFormInput) => {
    if (!plan) return;

    try {
      const res = await fetch(`/api/super/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = (await res.json()) as {
        error?: string;
        details?: Record<string, string[] | undefined>;
        plan?: {
          id: PlanListItem["id"];
          name: string;
          description: string;
          priceCents: number;
          color: string;
          order: number;
          status: PlanListItem["status"];
        };
      };

      if (!res.ok) {
        const detail = body.details
          ? Object.values(body.details).flat()[0]
          : undefined;
        throw new Error(detail ?? body.error ?? "Falha ao salvar");
      }

      if (body.plan) {
        onSaved({
          id: body.plan.id,
          name: body.plan.name,
          description: body.plan.description,
          priceCents: body.plan.priceCents,
          color: body.plan.color,
          order: body.plan.order,
          status: body.plan.status,
        });
      } else {
        onSaved({ ...plan, ...data });
      }

      toast.success("Plano atualizado");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar plano");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar plano</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="plan-name">Nome</Label>
            <Input id="plan-name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="plan-description">Descrição</Label>
            <Textarea
              id="plan-description"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="plan-price">Preço (placeholder)</Label>
            <PriceInput
              id="plan-price"
              value={priceCents}
              onChange={(cents) =>
                setValue("priceCents", cents, { shouldValidate: true })
              }
            />
            <p className="text-xs text-muted-foreground">
              Cobrança ainda não integrada. Use 0 para &quot;Sob consulta&quot;.
            </p>
            {errors.priceCents && (
              <p className="text-xs text-destructive">
                {errors.priceCents.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="plan-order">Ordem</Label>
              <Input
                id="plan-order"
                type="number"
                min={0}
                {...register("order", { valueAsNumber: true })}
              />
              {errors.order && (
                <p className="text-xs text-destructive">{errors.order.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="plan-status">Status</Label>
              <select
                id="plan-status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("status")}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="plan-color">Cor</Label>
            <div className="flex items-center gap-3">
              <input
                id="plan-color-picker"
                type="color"
                value={color}
                onChange={(e) =>
                  setValue("color", e.target.value, { shouldValidate: true })
                }
                className="h-10 w-14 cursor-pointer rounded border border-input bg-background p-1"
                aria-label="Selecionar cor"
              />
              <Input id="plan-color" {...register("color")} className="font-mono" />
            </div>
            {errors.color && (
              <p className="text-xs text-destructive">{errors.color.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
