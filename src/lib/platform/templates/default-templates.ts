import type { SiteTemplate, TemplateCategory } from "@/types/platform/template";
import { getTemplateSiteConfigPreset } from "@/lib/site/template-registry";
import { DEFAULT_TENANT_THEME } from "@/lib/utils/theme";

const TEMPLATE_DEFINITIONS: Omit<
  SiteTemplate,
  "createdAt" | "updatedAt"
>[] = [
  {
    id: "restaurante",
    name: "Restaurante",
    description: "Layout versátil para restaurantes em geral",
    category: "restaurante",
    siteConfigPreset: getTemplateSiteConfigPreset("restaurante"),
    themePreset: DEFAULT_TENANT_THEME,
    status: "active",
    order: 0,
  },
  {
    id: "hamburgueria",
    name: "Hamburgueria",
    description: "Visual bold para hamburguerias",
    category: "hamburgueria",
    siteConfigPreset: getTemplateSiteConfigPreset("hamburgueria"),
    themePreset: {
      primaryColor: "#dc2626",
      primaryDarkColor: "#991b1b",
      secondaryColor: "#fbbf24",
    },
    status: "active",
    order: 1,
  },
  {
    id: "bar",
    name: "Bar",
    description: "Atmosfera noturna para bares",
    category: "bar",
    siteConfigPreset: getTemplateSiteConfigPreset("bar"),
    themePreset: {
      primaryColor: "#1e293b",
      primaryDarkColor: "#0f172a",
      secondaryColor: "#f59e0b",
    },
    status: "active",
    order: 2,
  },
  {
    id: "pizzaria",
    name: "Pizzaria",
    description: "Cores quentes para pizzarias",
    category: "pizzaria",
    siteConfigPreset: getTemplateSiteConfigPreset("pizzaria"),
    themePreset: {
      primaryColor: "#ea580c",
      primaryDarkColor: "#c2410c",
      secondaryColor: "#fef3c7",
    },
    status: "active",
    order: 3,
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    description: "Visual acolhedor para cafeterias",
    category: "cafeteria",
    siteConfigPreset: getTemplateSiteConfigPreset("cafeteria"),
    themePreset: {
      primaryColor: "#78350f",
      primaryDarkColor: "#451a03",
      secondaryColor: "#fde68a",
    },
    status: "active",
    order: 4,
  },
  {
    id: "acai",
    name: "Açaí",
    description: "Vibrante para lojas de açaí",
    category: "acai",
    siteConfigPreset: getTemplateSiteConfigPreset("acai"),
    themePreset: {
      primaryColor: "#7c3aed",
      primaryDarkColor: "#5b21b6",
      secondaryColor: "#fbbf24",
    },
    status: "active",
    order: 5,
  },
  {
    id: "doceria",
    name: "Doceria",
    description: "Doce e elegante para confeitarias",
    category: "doceria",
    siteConfigPreset: getTemplateSiteConfigPreset("doceria"),
    themePreset: {
      primaryColor: "#db2777",
      primaryDarkColor: "#9d174d",
      secondaryColor: "#fce7f3",
    },
    status: "active",
    order: 6,
  },
];

export function getDefaultTemplates(): Omit<
  SiteTemplate,
  "createdAt" | "updatedAt"
>[] {
  return TEMPLATE_DEFINITIONS;
}

export function getDefaultTemplateId(): string {
  return "restaurante";
}

export function isTemplateCategory(value: string): value is TemplateCategory {
  return [
    "restaurante",
    "hamburgueria",
    "bar",
    "pizzaria",
    "cafeteria",
    "acai",
    "doceria",
  ].includes(value);
}
