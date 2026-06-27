"use client";

import { useState } from "react";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { FeaturesByPlanTab } from "@/features/super/features/features-by-plan-tab";
import { FeaturesByTenantTab } from "@/features/super/features/features-by-tenant-tab";
import { FeaturesGlobalTab } from "@/features/super/features/features-global-tab";
import type {
  FeatureListItem,
  PlanFeaturesItem,
  TenantFeaturesItem,
} from "@/features/super/features/feature-types";
import type { FeatureId } from "@/types/platform/feature";
import type { PlanId } from "@/types/platform/plan";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "global", label: "Global" },
  { id: "plan", label: "Por Plano" },
  { id: "tenant", label: "Por Restaurante" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface FeaturesPageProps {
  initialFeatures: FeatureListItem[];
  initialPlans: PlanFeaturesItem[];
  initialTenants: TenantFeaturesItem[];
}

export function FeaturesPage({
  initialFeatures,
  initialPlans,
  initialTenants,
}: FeaturesPageProps) {
  const [tab, setTab] = useState<TabId>("global");
  const [features, setFeatures] = useState(initialFeatures);
  const [plans, setPlans] = useState(initialPlans);
  const [tenants, setTenants] = useState(initialTenants);

  const updateFeature = (featureId: string, patch: Partial<FeatureListItem>) => {
    setFeatures((current) =>
      current.map((f) => (f.id === featureId ? { ...f, ...patch } : f)),
    );
  };

  const updatePlanFeatures = (
    planId: PlanId,
    planFeatures: Partial<Record<string, boolean>>,
  ) => {
    setPlans((current) =>
      current.map((p) =>
        p.id === planId ? { ...p, features: planFeatures as PlanFeaturesItem["features"] } : p,
      ),
    );
  };

  const updateTenant = (
    tenantId: string,
    featureOverrides?: Partial<Record<FeatureId, boolean>>,
  ) => {
    setTenants((current) =>
      current.map((t) =>
        t.id === tenantId ? { ...t, featureOverrides } : t,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Recursos"
        description="Feature flags em três níveis: global, plano e restaurante."
      />

      {features.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum recurso cadastrado. Execute a inicialização da plataforma no
          Dashboard.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 border-b pb-2">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  tab === id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "global" ? (
            <FeaturesGlobalTab features={features} onUpdateFeature={updateFeature} />
          ) : null}

          {tab === "plan" ? (
            <FeaturesByPlanTab
              features={features}
              plans={plans}
              onUpdatePlanFeatures={updatePlanFeatures}
            />
          ) : null}

          {tab === "tenant" ? (
            <FeaturesByTenantTab
              features={features}
              plans={plans}
              tenants={tenants}
              onUpdateTenant={updateTenant}
            />
          ) : null}
        </>
      )}

      <p className="text-xs text-muted-foreground">
        Resolução: override do restaurante → plano → global/default. Recursos
        &quot;Futuro&quot; permanecem desabilitados globalmente até integração.
      </p>
    </div>
  );
}
