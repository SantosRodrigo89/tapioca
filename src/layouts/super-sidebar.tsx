"use client";

import { SuperSidebarNav } from "@/layouts/super-sidebar-nav";
import { Logo } from "@/components/brand/logo";

export function SuperSidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border/60 bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Logo size="sm" href="/super" />
      </div>
      <SuperSidebarNav />
    </aside>
  );
}
