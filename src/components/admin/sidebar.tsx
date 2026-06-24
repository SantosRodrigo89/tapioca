"use client";

import { SidebarNav } from "@/components/admin/sidebar-nav";

interface SidebarProps {
  tenantSlug: string;
}

export function Sidebar({ tenantSlug }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold text-sm">Tapioca</span>
      </div>
      <SidebarNav tenantSlug={tenantSlug} />
    </aside>
  );
}
