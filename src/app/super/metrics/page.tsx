import type { Metadata } from "next";
import { getSuperPlatformMetricsServer } from "@/services/platform/super-metrics.service";
import { SuperMetricsPage } from "@/features/super/metrics/super-metrics-page";

export const metadata: Metadata = { title: "Métricas — Super Admin" };

export default async function SuperMetricsRoute() {
  const metrics = await getSuperPlatformMetricsServer();
  return <SuperMetricsPage metrics={metrics} />;
}
