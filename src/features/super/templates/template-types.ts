import type { SiteTemplate, TemplateCategory, TemplateStatus } from "@/types/platform/template";
import type { TenantTheme } from "@/types";

export interface TemplateListItem {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnailUrl?: string;
  status: TemplateStatus;
  order: number;
  themePreset?: TenantTheme;
}

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  restaurante: "Restaurante",
  hamburgueria: "Hamburgueria",
  bar: "Bar",
  pizzaria: "Pizzaria",
  cafeteria: "Cafeteria",
  acai: "Açaí",
  doceria: "Doceria",
};

export function serializeTemplateForClient(template: SiteTemplate): TemplateListItem {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    thumbnailUrl: template.thumbnailUrl,
    status: template.status,
    order: template.order,
    themePreset: template.themePreset,
  };
}
