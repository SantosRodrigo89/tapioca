"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FeatureToggleRow } from "@/components/super/feature-toggle-row";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getResolvedFeatureState } from "@/lib/platform/features/resolve-feature";
import {
  getPlanFeatureValue,
  type FeatureListItem,
  type PlanFeaturesItem,
  type TenantFeaturesItem,
} from "@/features/super/features/feature-types";
import type { FeatureId } from "@/types/platform/feature";

interface FeaturesByTenantTabProps {
  features: FeatureListItem[];
  plans: PlanFeaturesItem[];
  tenants: TenantFeaturesItem[];
  onUpdateTenant: (tenantId: string, featureOverrides?: Partial<Record<FeatureId, boolean>>) => void;
}

export function FeaturesByTenantTab({
  features,
  plans,
  tenants,
  onUpdateTenant,
}: FeaturesByTenantTabProps) {
  const [search, setSearch] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id ?? "");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredTenants = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tenants;
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q),
    );
  }, [tenants, search]);

  const selectedTenant =
    tenants.find((t) => t.id === selectedTenantId) ?? filteredTenants[0];

  const selectedPlan = plans.find((p) => p.id === selectedTenant?.planId) ?? plans[0];

  const setOverride = async (featureId: FeatureId, enabled: boolean | null) => {
    if (!selectedTenant) return;

    setUpdatingId(featureId);
    const previous = selectedTenant.featureOverrides;

    const nextOverrides = { ...selectedTenant.featureOverrides };
    if (enabled === null) {
      delete nextOverrides[featureId];
    } else {
      nextOverrides[featureId] = enabled;
    }
    onUpdateTenant(
      selectedTenant.id,
      Object.keys(nextOverrides).length > 0 ? nextOverrides : undefined,
    );

    try {
      const res = await fetch(`/api/super/tenants/${selectedTenant.id}/features`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, enabled }),
      });
      const body = (await res.json()) as {
        error?: string;
        featureOverrides?: Partial<Record<FeatureId, boolean>>;
      };
      if (!res.ok) throw new Error(body.error ?? "Falha ao atualizar");

      onUpdateTenant(selectedTenant.id, body.featureOverrides);
    } catch (err) {
      onUpdateTenant(selectedTenant.id, previous);
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar");
    } finally {
      setUpdatingId(null);
    }
  };

  if (tenants.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum restaurante cadastrado.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="tenant-search">Buscar restaurante</Label>
          <Input
            id="tenant-search"
            placeholder="Nome ou slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tenant-select">Restaurante</Label>
          <select
            id="tenant-select"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedTenant?.id ?? ""}
            onChange={(e) => setSelectedTenantId(e.target.value)}
          >
            {filteredTenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name} ({tenant.slug})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedTenant && selectedPlan ? (
        <div className="rounded-lg border px-4">
          {features.map((feature) => {
            const { resolved, hasOverride } = getResolvedFeatureState(
              feature.id,
              {
                feature,
                plan: selectedPlan,
                tenantOverrides: selectedTenant.featureOverrides,
              },
            );

            const planValue = getPlanFeatureValue(selectedPlan, feature);

            return (
              <FeatureToggleRow
                key={feature.id}
                feature={feature}
                enabled={resolved}
                disabled={updatingId === feature.id}
                onToggle={(enabled) => setOverride(feature.id, enabled)}
                hint={
                  hasOverride
                    ? "Override ativo para este restaurante"
                    : `Herdando do plano ${selectedPlan.name} (${planValue ? "ativo" : "inativo"})`
                }
                extra={
                  hasOverride ? (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs"
                      disabled={updatingId === feature.id}
                      onClick={() => setOverride(feature.id, null)}
                    >
                      Resetar override
                    </Button>
                  ) : null
                }
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
