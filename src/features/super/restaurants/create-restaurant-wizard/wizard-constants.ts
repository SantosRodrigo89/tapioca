import type { TemplateCategory } from "@/types/platform/template";

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  restaurante: "Restaurante",
  hamburgueria: "Hamburgueria",
  bar: "Bar",
  pizzaria: "Pizzaria",
  cafeteria: "Cafeteria",
  acai: "Açaí",
  doceria: "Doceria",
};

export const WIZARD_STEPS = [
  { id: 1, label: "Restaurante" },
  { id: 2, label: "Administrador" },
  { id: 3, label: "Resumo" },
] as const;
