"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  UpdateTenantHoursSchema,
  type DaySchedule,
} from "@/lib/schemas/tenant-menu.schema";
import { updateTenant } from "@/lib/repositories/tenant.repository";
import {
  WEEKDAYS,
  defaultOpeningHours,
} from "@/lib/utils/opening-hours";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tenant } from "@/types";

interface HoursSettingsProps {
  tenant: Tenant;
  hideHeader?: boolean;
}

export function HoursSettings({ tenant, hideHeader }: HoursSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hours, setHours] = useState<DaySchedule[]>(
    tenant.openingHours ?? defaultOpeningHours(),
  );

  const updateDay = (day: DaySchedule["day"], patch: Partial<DaySchedule>) => {
    setHours((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...patch } : d)),
    );
  };

  const handleSave = async () => {
    const parsed = UpdateTenantHoursSchema.safeParse({ openingHours: hours });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Horários inválidos");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTenant(tenant.id, {
        openingHours: parsed.data.openingHours,
      });
      toast.success("Horários salvos");
    } catch (err) {
      console.error("[hours-settings]", err);
      toast.error("Erro ao salvar horários");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      {!hideHeader && (
        <div>
          <h2 className="text-lg font-semibold">Horário de funcionamento</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Define se o restaurante aparece aberto ou fechado no cardápio.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {WEEKDAYS.map(({ key, label }) => {
          const day = hours.find((d) => d.day === key)!;
          return (
            <div
              key={key}
              className="flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2.5"
            >
              <span className="w-28 text-sm font-medium">{label}</span>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={day.closed}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    updateDay(key, { closed: e.target.checked })
                  }
                  className="rounded border-input"
                />
                Fechado
              </label>
              {!day.closed && (
                <div className="flex items-center gap-2">
                  <div className="space-y-0.5">
                    <Label className="text-xs text-muted-foreground">
                      Abre
                    </Label>
                    <Input
                      type="time"
                      value={day.open}
                      disabled={isSubmitting}
                      onChange={(e) =>
                        updateDay(key, { open: e.target.value })
                      }
                      className="w-28"
                    />
                  </div>
                  <span className="mt-5 text-muted-foreground">–</span>
                  <div className="space-y-0.5">
                    <Label className="text-xs text-muted-foreground">
                      Fecha
                    </Label>
                    <Input
                      type="time"
                      value={day.close}
                      disabled={isSubmitting}
                      onChange={(e) =>
                        updateDay(key, { close: e.target.value })
                      }
                      className="w-28"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        onClick={handleSave}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Salvando…" : "Salvar horários"}
      </Button>
    </section>
  );
}
