import type { AvailabilitySchedule } from "@/lib/schemas/availability.schema";
import type { Category, MenuItem } from "@/types";
import {
  getCurrentMinutesInBrazil,
  parseMinutes,
} from "@/lib/utils/opening-hours";

export interface ItemAvailabilityStatus {
  orderable: boolean;
  label?: string;
  source?: "item" | "category";
}

function isMinuteInWindow(now: number, start: string, end: string): boolean {
  const open = parseMinutes(start);
  const close = parseMinutes(end);

  if (close > open) {
    return now >= open && now < close;
  }

  return now >= open || now < close;
}

export function isWithinAvailabilitySchedule(
  schedule?: AvailabilitySchedule | null,
): boolean {
  if (!schedule?.enabled || schedule.windows.length === 0) return true;

  const now = getCurrentMinutesInBrazil();
  return schedule.windows.some((w) =>
    isMinuteInWindow(now, w.start, w.end),
  );
}

export function resolveItemAvailabilitySchedule(
  item: MenuItem,
  category: Category,
): AvailabilitySchedule | null {
  if (item.availability?.enabled) return item.availability;
  if (category.availability?.enabled) return category.availability;
  return null;
}

export function formatAvailabilityWindows(
  schedule: AvailabilitySchedule,
): string {
  return schedule.windows
    .map((w) => `${w.start} – ${w.end}`)
    .join(" · ");
}

export function getItemAvailabilityStatus(
  item: MenuItem,
  category: Category,
): ItemAvailabilityStatus {
  if (!item.available) {
    return { orderable: false, label: "Indisponível" };
  }

  if (item.availability?.enabled) {
    const open = isWithinAvailabilitySchedule(item.availability);
    return {
      orderable: open,
      source: "item",
      label: open
        ? undefined
        : `Disponível ${formatAvailabilityWindows(item.availability)}`,
    };
  }

  if (category.availability?.enabled) {
    const open = isWithinAvailabilitySchedule(category.availability);
    return {
      orderable: open,
      source: "category",
      label: open
        ? undefined
        : `Disponível ${formatAvailabilityWindows(category.availability)}`,
    };
  }

  return { orderable: true };
}

export function formatAvailabilitySummary(
  schedule?: AvailabilitySchedule | null,
): string | null {
  if (!schedule?.enabled || schedule.windows.length === 0) return null;
  return formatAvailabilityWindows(schedule);
}
