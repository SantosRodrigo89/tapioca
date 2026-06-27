import type { Metadata } from "next";
import { getSuperPlatformMetricsServer } from "@/services/platform/super-metrics.service";
import { SuperKpiCard } from "@/components/super/super-kpi-card";
import { SuperPageHeader } from "@/components/super/super-page-header";

export const metadata: Metadata = { title: "Métricas — Super Admin" };

export default async function SuperMetricsPage() {
  const metrics = await getSuperPlatformMetricsServer();

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Métricas"
        description="Agregados da plataforma. Analytics real ainda não implementado."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SuperKpiCard label="Total de Restaurantes" value={metrics.totalTenants} />
        <SuperKpiCard label="Produtos" value={metrics.totalProducts} />
        <SuperKpiCard label="Categorias" value={metrics.totalCategories} />
        <SuperKpiCard label="Landing Pages" value={metrics.publishedLandings} />
        <SuperKpiCard label="Usuários" value={metrics.totalUsers} />
        <SuperKpiCard label="QR Codes" value={metrics.totalQrCodes} />
        <SuperKpiCard
          label="Visualizações"
          value={metrics.totalViews ?? "—"}
          hint="Placeholder"
        />
        <SuperKpiCard label="Convites Pendentes" value={metrics.pendingInvites} />
      </div>
    </div>
  );
}
