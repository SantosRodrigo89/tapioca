"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FeatureToggleRow } from "@/components/super/feature-toggle-row";
import { Label } from "@/components/ui/label";
import {
  getPlanFeatureValue,
  type FeatureListItem,
  type PlanFeaturesItem,
} from "@/features/super/features/feature-types";
import type { PlanId } from "@/types/platform/plan";

interface FeaturesByPlanTabProps {
  features: FeatureListItem[];
  plans: PlanFeaturesItem[];
  onUpdatePlanFeatures: (planId: PlanId, features: Partial<Record<string, boolean>>) => void;
}

export function FeaturesByPlanTab({
  features,
  plans,
  onUpdatePlanFeatures,
}: FeaturesByPlanTabProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(
    plans[0]?.id ?? "starter",
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? plans[0];

  const togglePlanFeature = async (featureId: string, enabled: boolean) => {
    if (!selectedPlan) return;

    setUpdatingId(featureId);
    const previous = selectedPlan.features;

    onUpdatePlanFeatures(selectedPlan.id, {
      ...selectedPlan.features,
      [featureId]: enabled,
    });

    try {
      const res = await fetch(`/api/super/plans/${selectedPlan.id}/features`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, enabled }),
      });
      const body = (await res.json()) as {
        error?: string;
        planFeatures?: Partial<Record<string, boolean>>;
      };
      if (!res.ok) throw new Error(body.error ?? "Falha ao atualizar");

      if (body.planFeatures) {
        onUpdatePlanFeatures(selectedPlan.id, body.planFeatures);
      }
    } catch (err) {
      onUpdatePlanFeatures(selectedPlan.id, previous);
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!selectedPlan) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum plano disponível. Execute o seed da plataforma.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-w-xs space-y-1">
        <Label htmlFor="plan-select">Plano</Label>
        <select
          id="plan-select"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={selectedPlanId}
          onChange={(e) => setSelectedPlanId(e.target.value as PlanId)}
        >
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border px-4">
        {features.map((feature) => (
          <FeatureToggleRow
            key={feature.id}
            feature={feature}
            enabled={getPlanFeatureValue(selectedPlan, feature)}
            disabled={updatingId === feature.id}
            onToggle={(enabled) => togglePlanFeature(feature.id, enabled)}
            hint={`Plano ${selectedPlan.name}`}
          />
        ))}
      </div>
    </div>
  );
}
