import { z } from "zod";
import { AvailabilityScheduleSchema } from "./availability.schema";
import { ConfigurationGroupsSchema } from "./configuration.schema";
import { MENU_ITEM_BADGES } from "@/types/menu-item-badge";

const MenuItemBadgeSchema = z.enum(MENU_ITEM_BADGES);

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  available: z.boolean(),
  configurationGroups: ConfigurationGroupsSchema.optional(),
  complementIds: z.array(z.string().min(1)).optional(),
  badge: MenuItemBadgeSchema.optional(),
  order: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateMenuItemSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(300, "Descrição deve ter no máximo 300 caracteres")
    .optional(),
  price: z
    .number({ error: "Preço inválido" })
    .int()
    .nonnegative("Preço não pode ser negativo"),
  available: z.boolean(),
  availability: AvailabilityScheduleSchema.optional(),
  configurationGroups: ConfigurationGroupsSchema.optional(),
  complementIds: z.array(z.string().min(1)).optional(),
  badge: MenuItemBadgeSchema.optional(),
});

export const UpdateMenuItemSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .optional(),
  description: z
    .string()
    .max(300, "Descrição deve ter no máximo 300 caracteres")
    .optional(),
  price: z
    .number({ error: "Preço inválido" })
    .int()
    .nonnegative("Preço não pode ser negativo")
    .optional(),
  available: z.boolean().optional(),
  availability: AvailabilityScheduleSchema.optional(),
  order: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().optional().nullable(),
  configurationGroups: ConfigurationGroupsSchema.optional().nullable(),
  complementIds: z.array(z.string().min(1)).optional().nullable(),
  badge: MenuItemBadgeSchema.optional().nullable(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
export type CreateMenuItemInput = z.infer<typeof CreateMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof UpdateMenuItemSchema>;
