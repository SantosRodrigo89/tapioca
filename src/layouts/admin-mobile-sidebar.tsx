"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/layouts/admin-sidebar-nav";
import { Logo } from "@/components/brand/logo";

import type { TenantEntitlements } from "@/lib/platform/entitlements";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string;
  entitlements: TenantEntitlements;
}

export function MobileSidebar({
  open,
  onOpenChange,
  tenantSlug,
  entitlements,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b px-4 py-4 text-left">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo size="sm" href="/dashboard" />
        </SheetHeader>
        <SidebarNav
          tenantSlug={tenantSlug}
          entitlements={entitlements}
          onNavigate={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
