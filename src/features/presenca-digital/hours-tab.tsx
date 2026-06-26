"use client";

import { HoursSettings } from "@/components/admin/hours-settings";
import type { Tenant } from "@/types";

interface HoursTabProps {
  tenant: Tenant;
}

export function HoursTab({ tenant }: HoursTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Horários</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define se o restaurante aparece aberto ou fechado.
        </p>
      </div>

      <HoursSettings tenant={tenant} hideHeader />
    </div>
  );
}
