import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { TenantStatusBadge } from "@/components/admin/tenant-status-badge";

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
    redirect("/auth/login");
  }

  const tenant = await getTenantByIdServer(tenantId);
  if (!tenant) {
    redirect("/auth/login");
  }

  const isBlocked =
    tenant.status === "suspended" || tenant.status === "cancelled";

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar tenantSlug={tenant.slug} />

      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader tenantName={tenant.name} />

        {isBlocked && (
          <div className="flex items-center gap-3 border-b bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <TenantStatusBadge status={tenant.status} />
            <span>
              {tenant.status === "suspended"
                ? "Sua conta está suspensa. Entre em contato com o suporte."
                : "Sua conta foi encerrada."}
            </span>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
