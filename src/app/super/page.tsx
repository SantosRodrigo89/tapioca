import type { Metadata } from "next";
import { getSuperDashboardMetricsServer } from "@/services/platform/super-metrics.service";
import { SuperDashboardPage } from "@/features/super/dashboard/super-dashboard-page";
import { PlatformSeedBanner } from "@/features/super/platform-seed-banner";
import { isPlatformSeededServer } from "@/services/platform/seed-platform.service";

export const metadata: Metadata = { title: "Dashboard — Super Admin" };

export default async function SuperDashboardRoute() {
  const [metrics, seeded] = await Promise.all([
    getSuperDashboardMetricsServer(),
    isPlatformSeededServer(),
  ]);

  return (
    <div className="space-y-6">
      {!seeded ? <PlatformSeedBanner /> : null}
      <SuperDashboardPage metrics={metrics} />
    </div>
  );
}
