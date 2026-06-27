import type { SiteConfig } from "@/types/site";
import type { TenantTheme } from "@/types";

export type TemplateCategory =
  | "restaurante"
  | "hamburgueria"
  | "bar"
  | "pizzaria"
  | "cafeteria"
  | "acai"
  | "doceria";

export type TemplateStatus = "active" | "inactive";

export interface SiteTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnailUrl?: string;
  siteConfigPreset: Partial<SiteConfig>;
  themePreset?: TenantTheme;
  status: TemplateStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
