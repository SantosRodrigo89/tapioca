import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import {
  getTenantByIdServer,
  touchLastAccessAtIfStaleServer,
} from "@/lib/repositories/server/tenant.server";
import { AdminShell } from "@/layouts/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/auth/login");
  }

  const tenantId = sessionUser.tenantId as string | undefined;
  if (!tenantId) {
    if (isSuperAdmin(sessionUser)) {
      redirect("/super");
    }
    redirect("/auth/login");
  }

  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) {
    redirect("/auth/login");
  }

  void touchLastAccessAtIfStaleServer(tenantId, tenant.lastAccessAt).catch(
    (err) => console.error("[lastAccessAt]", err),
  );

  return (
    <AdminShell
      tenantSlug={tenant.slug}
      tenantName={tenant.name}
      tenantStatus={tenant.status}
    >
      {children}
    </AdminShell>
  );
}
