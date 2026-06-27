"use client";

import { useState } from "react";
import { SuperSidebar } from "@/layouts/super-sidebar";
import { SuperMobileSidebar } from "@/layouts/super-mobile-sidebar";
import { SuperHeader } from "@/components/super/super-header";

interface SuperShellProps {
  children: React.ReactNode;
}

export function SuperShell({ children }: SuperShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen">
      <SuperSidebar />
      <SuperMobileSidebar
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <SuperHeader onMenuClick={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
