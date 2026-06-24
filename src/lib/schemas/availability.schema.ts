import { z } from "zod";

const timeString = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Horário inválido (use HH:MM)");

export const TimeWindowSchema = z.object({
  start: timeString,
  end: timeString,
});

export const AvailabilityScheduleSchema = z
  .object({
    enabled: z.boolean(),
    windows: z.array(TimeWindowSchema),
  })
  .refine((data) => !data.enabled || data.windows.length > 0, {
    message: "Adicione pelo menos um horário",
    path: ["windows"],
  });

export type TimeWindow = z.infer<typeof TimeWindowSchema>;
export type AvailabilitySchedule = z.infer<typeof AvailabilityScheduleSchema>;

export const emptyAvailabilitySchedule = (): AvailabilitySchedule => ({
  enabled: false,
  windows: [{ start: "11:00", end: "15:00" }],
});
