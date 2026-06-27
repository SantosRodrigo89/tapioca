"use client";

import { useState } from "react";
import { Sidebar } from "@/layouts/admin-sidebar";
import { MobileSidebar } from "@/layouts/admin-mobile-sidebar";
import { AdminHeader } from "@/layouts/admin-header";
import type { TenantEntitlements } from "@/lib/platform/entitlements";

interface AdminShellProps {
  tenantSlug: string;
  tenantName: string;
  tenantStatus: import("@/types").TenantStatus;
  entitlements: TenantEntitlements;
  children: React.ReactNode;
}

export function AdminShell({
  tenantSlug,
  tenantName,
  entitlements,
  children,
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar tenantSlug={tenantSlug} entitlements={entitlements} />
      <MobileSidebar
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        tenantSlug={tenantSlug}
        entitlements={entitlements}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          tenantName={tenantName}
          onMenuClick={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
