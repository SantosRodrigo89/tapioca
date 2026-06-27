"use client";

import { SidebarNav } from "@/layouts/admin-sidebar-nav";
import { Logo } from "@/components/brand/logo";

import type { TenantEntitlements } from "@/lib/platform/entitlements";

interface SidebarProps {
  tenantSlug: string;
  entitlements: TenantEntitlements;
}

export function Sidebar({ tenantSlug, entitlements }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border/60 bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Logo size="sm" href="/dashboard" />
      </div>
      <SidebarNav tenantSlug={tenantSlug} entitlements={entitlements} />
    </aside>
  );
}
