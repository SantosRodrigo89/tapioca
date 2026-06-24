import type { Metadata } from "next";
import { listTenantsServer } from "@/lib/repositories/server/tenant.server";
import { SuperClient } from "./super-client";

export const metadata: Metadata = { title: "Super Admin" };

export default async function SuperPage() {
  const tenants = await listTenantsServer();
  return <SuperClient initialTenants={tenants} />;
}
