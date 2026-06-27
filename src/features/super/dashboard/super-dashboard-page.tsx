import type { SuperDashboardMetrics } from "@/types/platform";
import { SuperKpiCard } from "@/components/super/super-kpi-card";
import { SuperPageHeader } from "@/components/super/super-page-header";

interface SuperDashboardPageProps {
  metrics: SuperDashboardMetrics;
}

export function SuperDashboardPage({ metrics }: SuperDashboardPageProps) {
  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Dashboard"
        description="Visão executiva da plataforma Mesio."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SuperKpiCard label="Restaurantes Ativos" value={metrics.activeTenants} />
        <SuperKpiCard label="Trials" value={metrics.trialTenants} />
        <SuperKpiCard label="Suspensos" value={metrics.suspendedTenants} />
        <SuperKpiCard label="Cancelados" value={metrics.cancelledTenants} />
        <SuperKpiCard label="Convites Pendentes" value={metrics.pendingInvites} />
        <SuperKpiCard label="Total de Produtos" value={metrics.totalProducts} />
        <SuperKpiCard
          label="Landing Pages Publicadas"
          value={metrics.publishedLandings}
        />
        <SuperKpiCard
          label="Visualizações"
          value={metrics.totalViews ?? "—"}
          hint="Placeholder — analytics em breve"
        />
      </div>
    </div>
  );
}
