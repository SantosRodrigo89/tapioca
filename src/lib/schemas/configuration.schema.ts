import { z } from "zod";

export const PricingStrategySchema = z.enum([
  "fixed",
  "additional",
  "highest",
  "average",
  "sum",
  "custom",
]);

const VariantPricesSchema = z.record(
  z.string().min(1),
  z.number().int().nonnegative("Preço não pode ser negativo"),
);

export const ConfigurationOptionSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(1, "Nome da opção é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(200, "Descrição deve ter no máximo 200 caracteres")
    .optional(),
  price: z.number().int().nonnegative("Preço não pode ser negativo"),
  variantPrices: VariantPricesSchema.optional(),
  imageUrl: z.string().url().optional(),
  enabled: z.boolean(),
  displayOrder: z.number().int().nonnegative(),
});

export const ConfigurationGroupSchema = z
  .object({
    id: z.string().min(1),
    name: z
      .string()
      .min(1, "Nome do grupo é obrigatório")
      .max(80, "Nome deve ter no máximo 80 caracteres"),
    type: z
      .string()
      .min(1, "Tipo é obrigatório")
      .max(50, "Tipo deve ter no máximo 50 caracteres"),
    required: z.boolean(),
    multiple: z.boolean(),
    minSelections: z.number().int().nonnegative(),
    maxSelections: z.number().int().positive(),
    pricingStrategy: PricingStrategySchema,
    definesBasePrice: z.boolean(),
    linkedGroupId: z.string().min(1).optional(),
    enabled: z.boolean(),
    displayOrder: z.number().int().nonnegative(),
    options: z.array(ConfigurationOptionSchema),
  })
  .superRefine((group, ctx) => {
    if (group.minSelections > group.maxSelections) {
      ctx.addIssue({
        code: "custom",
        message: "Mínimo não pode ser maior que o máximo",
        path: ["minSelections"],
      });
    }

    if (!group.multiple && group.maxSelections !== 1) {
      ctx.addIssue({
        code: "custom",
        message: "Grupo de seleção única deve ter máximo 1",
        path: ["maxSelections"],
      });
    }

    if (group.required && group.minSelections < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Grupo obrigatório precisa de mínimo 1",
        path: ["minSelections"],
      });
    }

    if (group.definesBasePrice && group.pricingStrategy !== "fixed") {
      ctx.addIssue({
        code: "custom",
        message: "Variação de preço base exige estratégia Preço fixo",
        path: ["definesBasePrice"],
      });
    }

    if (group.definesBasePrice && group.maxSelections !== 1) {
      ctx.addIssue({
        code: "custom",
        message: "Variação de preço base exige seleção única",
        path: ["definesBasePrice"],
      });
    }

    if (group.enabled && group.required && group.options.filter((o) => o.enabled).length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Grupo obrigatório precisa de ao menos uma opção ativa",
        path: ["options"],
      });
    }
  });

export const ConfigurationGroupsSchema = z
  .array(ConfigurationGroupSchema)
  .superRefine((groups, ctx) => {
    const basePriceGroups = groups.filter((g) => g.definesBasePrice);
    if (basePriceGroups.length > 1) {
      ctx.addIssue({
        code: "custom",
        message: "Apenas um grupo pode definir o preço base",
      });
    }

    const groupIds = new Set(groups.map((g) => g.id));
    for (const group of groups) {
      if (!group.linkedGroupId) continue;

      if (!groupIds.has(group.linkedGroupId)) {
        ctx.addIssue({
          code: "custom",
          message: "Grupo vinculado não encontrado",
          path: [groups.indexOf(group), "linkedGroupId"],
        });
        continue;
      }

      const linked = groups.find((g) => g.id === group.linkedGroupId);
      if (!linked?.definesBasePrice) {
        ctx.addIssue({
          code: "custom",
          message: "Grupo vinculado deve ser a variação de tamanho",
          path: [groups.indexOf(group), "linkedGroupId"],
        });
      }

      if (group.definesBasePrice) {
        ctx.addIssue({
          code: "custom",
          message: "Grupo de variação não pode ser vinculado a outro",
          path: [groups.indexOf(group), "linkedGroupId"],
        });
      }
    }
  });

export type ConfigurationOptionInput = z.infer<typeof ConfigurationOptionSchema>;
export type ConfigurationGroupInput = z.infer<typeof ConfigurationGroupSchema>;

export function createEmptyConfigurationGroup(
  displayOrder: number,
): ConfigurationGroupInput {
  return {
    id: crypto.randomUUID(),
    name: "",
    type: "Variação",
    required: true,
    multiple: false,
    minSelections: 1,
    maxSelections: 1,
    pricingStrategy: "fixed",
    definesBasePrice: displayOrder === 0,
    enabled: true,
    displayOrder,
    options: [],
  };
}

export function createEmptyConfigurationOption(
  displayOrder: number,
): ConfigurationOptionInput {
  return {
    id: crypto.randomUUID(),
    name: "",
    price: 0,
    enabled: true,
    displayOrder,
  };
}
