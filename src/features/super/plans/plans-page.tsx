"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { PlanBadge } from "@/components/super/plan-badge";
import { PlanStatusBadge } from "@/components/super/plan-status-badge";
import { Button } from "@/components/ui/button";
import { PlanEditDialog } from "@/features/super/plans/plan-edit-dialog";
import {
  formatPlanPrice,
  type PlanListItem,
} from "@/features/super/plans/plan-types";

interface PlansPageProps {
  initialPlans: PlanListItem[];
}

export function PlansPage({ initialPlans }: PlansPageProps) {
  const [plans, setPlans] = useState(initialPlans);
  const [editingPlan, setEditingPlan] = useState<PlanListItem | null>(null);

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Planos"
        description="Gerencie os planos da plataforma. Cobrança ainda não implementada."
      />

      {plans.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum plano cadastrado. Execute a inicialização da plataforma no
          Dashboard.
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Plano</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3 font-medium">Ordem</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium w-20">Ações</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <PlanBadge planId={plan.id} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {plan.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatPlanPrice(plan.priceCents)}
                  </td>
                  <td className="px-4 py-3 text-center">{plan.order}</td>
                  <td className="px-4 py-3">
                    <PlanStatusBadge status={plan.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingPlan(plan)}
                      aria-label={`Editar ${plan.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Os planos Starter, Pro, Premium e Enterprise são fixos nesta fase.
        Recursos por plano serão configurados em Recursos.
      </p>

      <PlanEditDialog
        plan={editingPlan}
        open={editingPlan !== null}
        onOpenChange={(open) => {
          if (!open) setEditingPlan(null);
        }}
        onSaved={(updated) => {
          setPlans((current) =>
            [...current.map((p) => (p.id === updated.id ? updated : p))].sort(
              (a, b) => a.order - b.order,
            ),
          );
        }}
      />
    </div>
  );
}
