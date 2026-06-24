import type { TenantTheme } from "@/lib/schemas/tenant-menu.schema";

export const DEFAULT_TENANT_THEME: TenantTheme = {
  primaryColor: "#F4B400",
  primaryDarkColor: "#D9A000",
  secondaryColor: "#222222",
};

export function resolveTenantTheme(theme?: Partial<TenantTheme>): TenantTheme {
  return {
    ...DEFAULT_TENANT_THEME,
    ...theme,
  };
}

export function themeToCssVars(theme: TenantTheme): Record<string, string> {
  return {
    "--menu-primary": theme.primaryColor,
    "--menu-primary-dark": theme.primaryDarkColor,
    "--menu-secondary": theme.secondaryColor,
  };
}
