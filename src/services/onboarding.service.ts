import type { Tenant } from "@/types";
import { resolveSiteConfig } from "@/services/site.service";

export interface OnboardingTask {
  id: string;
  label: string;
  completed: boolean;
  href: string;
}

export interface DashboardStats {
  totalCategories: number;
  activeCategories: number;
  totalProducts: number;
  availableProducts: number;
}

export function getDashboardStats(
  categories: { active: boolean }[],
  items: { available: boolean }[],
): DashboardStats {
  return {
    totalCategories: categories.length,
    activeCategories: categories.filter((c) => c.active).length,
    totalProducts: items.length,
    availableProducts: items.filter((i) => i.available).length,
  };
}

export function getOnboardingTasks(
  tenant: Tenant,
  stats: DashboardStats,
): OnboardingTask[] {
  const siteConfig = resolveSiteConfig(tenant);

  const hasBanner = Boolean(
    siteConfig.hero.imageUrl ?? tenant.bannerUrl,
  );
  const hasCategories = stats.totalCategories > 0;
  const hasProducts = stats.totalProducts > 0;
  const hasSiteCustomization = Boolean(
    tenant.theme ||
      tenant.logoUrl ||
      siteConfig.about.description ||
      tenant.description,
  );

  return [
    {
      id: "banner",
      label: "Adicionar Banner",
      completed: hasBanner,
      href: "/site",
    },
    {
      id: "categories",
      label: "Criar Categorias",
      completed: hasCategories,
      href: "/menu/categories",
    },
    {
      id: "products",
      label: "Adicionar Produtos",
      completed: hasProducts,
      href: "/menu/products",
    },
    {
      id: "landing",
      label: "Personalizar Landing Page",
      completed: hasSiteCustomization,
      href: "/site",
    },
    {
      id: "share",
      label: "Compartilhar Link",
      completed: hasProducts,
      href: "/site",
    },
  ];
}
