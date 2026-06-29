"use client";

import { SuperKpiCard } from "@/components/super/super-kpi-card";
import { SuperPageHeader } from "@/components/super/super-page-header";
import type { SuperPlatformMetrics } from "@/types/platform";

interface SuperMetricsPageProps {
  metrics: SuperPlatformMetrics;
}

function MetricsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
    </section>
  );
}

export function SuperMetricsPage({ metrics }: SuperMetricsPageProps) {
  return (
    <div className="space-y-8">
      <SuperPageHeader
        title="Métricas"
        description="Agregados da plataforma, incluindo visualizações via PostHog."
      />

      <MetricsSection title="Plataforma" description="Restaurantes e status">
        <SuperKpiCard label="Total de Restaurantes" value={metrics.totalTenants} />
        <SuperKpiCard label="Ativos" value={metrics.activeTenants} />
        <SuperKpiCard label="Trials" value={metrics.trialTenants} />
        <SuperKpiCard label="Suspensos" value={metrics.suspendedTenants} />
        <SuperKpiCard label="Cancelados" value={metrics.cancelledTenants} />
        <SuperKpiCard label="Convites Pendentes" value={metrics.pendingInvites} />
      </MetricsSection>

      <MetricsSection title="Conteúdo" description="Cardápio e presença digital">
        <SuperKpiCard label="Produtos" value={metrics.totalProducts} />
        <SuperKpiCard label="Categorias" value={metrics.totalCategories} />
        <SuperKpiCard label="Landing Pages" value={metrics.publishedLandings} />
        <SuperKpiCard label="QR Codes" value={metrics.totalQrCodes} />
      </MetricsSection>

      <MetricsSection title="Configuração SaaS" description="Catálogo da plataforma">
        <SuperKpiCard label="Planos" value={metrics.totalPlans} />
        <SuperKpiCard label="Templates" value={metrics.totalTemplates} />
        <SuperKpiCard label="Recursos" value={metrics.totalFeatures} />
        <SuperKpiCard label="Usuários (owners)" value={metrics.totalUsers} />
      </MetricsSection>

      <MetricsSection
        title="Engajamento"
        description="Visualizações de landing (últimos 30 dias)"
      >
        <SuperKpiCard
          label="Visualizações (30d)"
          value={metrics.totalViews ?? "—"}
          hint={
            metrics.totalViews === null
              ? "Configure PostHog ou sincronize métricas"
              : undefined
          }
        />
      </MetricsSection>
    </div>
  );
}
