import type { TenantTheme } from "@/lib/schemas/tenant-menu.schema";

export const DEFAULT_TENANT_THEME: TenantTheme = {
  primaryColor: "#F4B400",
  primaryDarkColor: "#D9A000",
  secondaryColor: "#222222",
};

export interface TenantDesignTokens extends TenantTheme {
  primaryForeground: string;
  surface: string;
  surfaceElevated: string;
  border: string;
}

function parseHex(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHex(color: string, withColor: string, amount: number): string {
  const [r1, g1, b1] = parseHex(color);
  const [r2, g2, b2] = parseHex(withColor);
  return toHex(
    Math.round(r1 * (1 - amount) + r2 * amount),
    Math.round(g1 * (1 - amount) + g2 * amount),
    Math.round(b1 * (1 - amount) + b2 * amount),
  );
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastForeground(bgHex: string): string {
  const [r, g, b] = parseHex(bgHex);
  return relativeLuminance(r, g, b) > 0.45 ? "#222222" : "#ffffff";
}

export function resolveTenantTheme(theme?: Partial<TenantTheme>): TenantTheme {
  return {
    ...DEFAULT_TENANT_THEME,
    ...theme,
  };
}

export function resolveDesignTokens(
  theme?: Partial<TenantTheme>,
): TenantDesignTokens {
  const base = resolveTenantTheme(theme);

  return {
    ...base,
    primaryForeground: getContrastForeground(base.primaryColor),
    surface: mixHex(base.secondaryColor, "#ffffff", 0.96),
    surfaceElevated: "#ffffff",
    border: mixHex(base.secondaryColor, "#ffffff", 0.88),
  };
}

export function designTokensToCssVars(
  tokens: TenantDesignTokens,
): Record<string, string> {
  return {
    "--menu-primary": tokens.primaryColor,
    "--menu-primary-dark": tokens.primaryDarkColor,
    "--menu-secondary": tokens.secondaryColor,
    "--menu-primary-foreground": tokens.primaryForeground,
    "--menu-surface": tokens.surface,
    "--menu-surface-elevated": tokens.surfaceElevated,
    "--menu-border": tokens.border,
  };
}

/** @deprecated Use designTokensToCssVars(resolveDesignTokens(...)) */
export function themeToCssVars(theme: TenantTheme): Record<string, string> {
  return designTokensToCssVars(resolveDesignTokens(theme));
}
