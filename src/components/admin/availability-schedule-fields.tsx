"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  emptyAvailabilitySchedule,
  type AvailabilitySchedule,
} from "@/lib/schemas/availability.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AvailabilityScheduleFieldsProps {
  value?: AvailabilitySchedule;
  onChange: (value: AvailabilitySchedule | undefined) => void;
  disabled?: boolean;
  inheritHint?: string;
}

export function AvailabilityScheduleFields({
  value,
  onChange,
  disabled,
  inheritHint,
}: AvailabilityScheduleFieldsProps) {
  const schedule = value ?? emptyAvailabilitySchedule();

  const setEnabled = (enabled: boolean) => {
    if (!enabled) {
      onChange(undefined);
      return;
    }
    onChange({
      enabled: true,
      windows:
        schedule.windows.length > 0
          ? schedule.windows
          : [{ start: "11:00", end: "15:00" }],
    });
  };

  const updateWindow = (
    index: number,
    field: "start" | "end",
    fieldValue: string,
  ) => {
    const windows = schedule.windows.map((w, i) =>
      i === index ? { ...w, [field]: fieldValue } : w,
    );
    onChange({ enabled: true, windows });
  };

  const addWindow = () => {
    onChange({
      enabled: true,
      windows: [...schedule.windows, { start: "18:00", end: "23:00" }],
    });
  };

  const removeWindow = (index: number) => {
    const windows = schedule.windows.filter((_, i) => i !== index);
    onChange({ enabled: true, windows });
  };

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={Boolean(value?.enabled)}
          disabled={disabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-input"
        />
        <div className="space-y-0.5">
          <span className="text-sm font-medium">
            Restringir horário de disponibilidade
          </span>
          {inheritHint && (
            <p className="text-xs text-muted-foreground">{inheritHint}</p>
          )}
        </div>
      </label>

      {value?.enabled && (
        <div className="space-y-2 pl-6">
          {value.windows.map((window, index) => (
            <div key={index} className="flex flex-wrap items-end gap-2">
              <div className="space-y-0.5">
                <Label className="text-xs text-muted-foreground">Início</Label>
                <Input
                  type="time"
                  value={window.start}
                  disabled={disabled}
                  onChange={(e) => updateWindow(index, "start", e.target.value)}
                  className="w-28"
                />
              </div>
              <span className="pb-2 text-muted-foreground">–</span>
              <div className="space-y-0.5">
                <Label className="text-xs text-muted-foreground">Fim</Label>
                <Input
                  type="time"
                  value={window.end}
                  disabled={disabled}
                  onChange={(e) => updateWindow(index, "end", e.target.value)}
                  className="w-28"
                />
              </div>
              {value.windows.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-destructive"
                  disabled={disabled}
                  onClick={() => removeWindow(index)}
                  aria-label="Remover horário"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={addWindow}
            className="gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar faixa
          </Button>
          <p className="text-xs text-muted-foreground">
            Ex: almoço 11:00–15:00 ou pizzas após 18:00.
          </p>
        </div>
      )}
    </div>
  );
}
