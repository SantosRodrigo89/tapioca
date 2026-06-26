"use client";

import { useState } from "react";
import { Sidebar } from "@/layouts/admin-sidebar";
import { MobileSidebar } from "@/layouts/admin-mobile-sidebar";
import { AdminHeader } from "@/layouts/admin-header";
import { TenantStatusBadge } from "@/components/admin/tenant-status-badge";
import type { TenantStatus } from "@/types";

interface AdminShellProps {
  tenantSlug: string;
  tenantName: string;
  tenantStatus: TenantStatus;
  children: React.ReactNode;
}

export function AdminShell({
  tenantSlug,
  tenantName,
  tenantStatus,
  children,
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isBlocked =
    tenantStatus === "suspended" || tenantStatus === "cancelled";

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar tenantSlug={tenantSlug} />
      <MobileSidebar
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        tenantSlug={tenantSlug}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          tenantName={tenantName}
          onMenuClick={() => setMobileNavOpen(true)}
        />

        {isBlocked && (
          <div className="flex items-center gap-3 border-b bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <TenantStatusBadge status={tenantStatus} />
            <span>
              {tenantStatus === "suspended"
                ? "Sua conta está suspensa. Entre em contato com o suporte."
                : "Sua conta foi encerrada."}
            </span>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
