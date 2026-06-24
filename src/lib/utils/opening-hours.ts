import type { DaySchedule, WeekdayKey } from "@/lib/schemas/tenant-menu.schema";

export const WEEKDAYS: { key: WeekdayKey; label: string; short: string }[] = [
  { key: "monday", label: "Segunda-feira", short: "Seg" },
  { key: "tuesday", label: "Terça-feira", short: "Ter" },
  { key: "wednesday", label: "Quarta-feira", short: "Qua" },
  { key: "thursday", label: "Quinta-feira", short: "Qui" },
  { key: "friday", label: "Sexta-feira", short: "Sex" },
  { key: "saturday", label: "Sábado", short: "Sáb" },
  { key: "sunday", label: "Domingo", short: "Dom" },
];

const TZ = "America/Sao_Paulo";

export function defaultOpeningHours(): DaySchedule[] {
  return WEEKDAYS.map(({ key }) => ({
    day: key,
    closed: false,
    open: "11:00",
    close: "22:00",
  }));
}

export function getCurrentWeekdayInBrazil(): WeekdayKey {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
  })
    .format(new Date())
    .toLowerCase();

  const map: Record<string, WeekdayKey> = {
    monday: "monday",
    tuesday: "tuesday",
    wednesday: "wednesday",
    thursday: "thursday",
    friday: "friday",
    saturday: "saturday",
    sunday: "sunday",
  };

  return map[weekday] ?? "monday";
}

function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h! * 60 + m!;
}

function getCurrentMinutesInBrazil(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function isOpenNow(openingHours?: DaySchedule[]): boolean | null {
  if (!openingHours || openingHours.length === 0) return null;

  const today = getCurrentWeekdayInBrazil();
  const schedule = openingHours.find((d) => d.day === today);
  if (!schedule || schedule.closed) return false;

  const now = getCurrentMinutesInBrazil();
  const open = parseMinutes(schedule.open);
  const close = parseMinutes(schedule.close);

  if (close > open) {
    return now >= open && now < close;
  }

  // Overnight (ex: 18:00 – 02:00)
  return now >= open || now < close;
}

export function formatDaySchedule(day: DaySchedule): string {
  const label = WEEKDAYS.find((w) => w.key === day.day)?.short ?? day.day;
  if (day.closed) return `${label}: Fechado`;
  return `${label}: ${day.open} – ${day.close}`;
}

export function formatTodayHours(openingHours?: DaySchedule[]): string | null {
  if (!openingHours || openingHours.length === 0) return null;

  const today = getCurrentWeekdayInBrazil();
  const schedule = openingHours.find((d) => d.day === today);
  if (!schedule) return null;
  if (schedule.closed) return "Hoje: Fechado";
  return `Hoje: ${schedule.open} – ${schedule.close}`;
}

export function formatWeekHoursSummary(openingHours: DaySchedule[]): string {
  return openingHours.map(formatDaySchedule).join(" · ");
}
