import type { Metadata } from "next";
import { listTenantsServer } from "@/lib/repositories/server/tenant.server";
import { RestaurantsPage } from "@/features/super/restaurants/restaurants-page";

export const metadata: Metadata = { title: "Restaurantes — Super Admin" };

export default async function SuperRestaurantsRoute() {
  const tenants = await listTenantsServer();
  return <RestaurantsPage initialTenants={tenants} />;
}
