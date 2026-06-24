import { z } from "zod";

const hexColor = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida (use formato #RRGGBB)");

export const TenantThemeSchema = z.object({
  primaryColor: hexColor,
  primaryDarkColor: hexColor,
  secondaryColor: hexColor,
});

export const WeekdayKeySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const DayScheduleSchema = z.object({
  day: WeekdayKeySchema,
  closed: z.boolean(),
  open: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  close: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
});

export const OpeningHoursSchema = z.array(DayScheduleSchema).length(7);

export const UpdateTenantAppearanceSchema = z.object({
  theme: TenantThemeSchema,
});

export const UpdateTenantHoursSchema = z.object({
  openingHours: OpeningHoursSchema,
});

export const UpdateTenantHighlightsSchema = z.object({
  highlightItemIds: z
    .array(z.string())
    .max(6, "Máximo de 6 destaques"),
});

export type TenantTheme = z.infer<typeof TenantThemeSchema>;
export type WeekdayKey = z.infer<typeof WeekdayKeySchema>;
export type DaySchedule = z.infer<typeof DayScheduleSchema>;
export type UpdateTenantAppearanceInput = z.infer<
  typeof UpdateTenantAppearanceSchema
>;
export type UpdateTenantHoursInput = z.infer<typeof UpdateTenantHoursSchema>;
export type UpdateTenantHighlightsInput = z.infer<
  typeof UpdateTenantHighlightsSchema
>;
