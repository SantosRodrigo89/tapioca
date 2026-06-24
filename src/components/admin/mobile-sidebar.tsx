"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/admin/sidebar-nav";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string;
}

export function MobileSidebar({
  open,
  onOpenChange,
  tenantSlug,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b px-4 py-4 text-left">
          <SheetTitle className="text-sm font-semibold">Tapioca</SheetTitle>
        </SheetHeader>
        <SidebarNav
          tenantSlug={tenantSlug}
          onNavigate={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
