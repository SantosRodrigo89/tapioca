"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SuperSidebarNav } from "@/layouts/super-sidebar-nav";
import { Logo } from "@/components/brand/logo";

interface SuperMobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuperMobileSidebar({
  open,
  onOpenChange,
}: SuperMobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b px-4 py-4 text-left">
          <SheetTitle className="sr-only">Menu Super Admin</SheetTitle>
          <Logo size="sm" href="/super" />
        </SheetHeader>
        <SuperSidebarNav onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
