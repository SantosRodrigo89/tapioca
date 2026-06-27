import {
  designTokensToCssVars,
  resolveDesignTokens,
} from "@/lib/utils/theme";
import type { Tenant } from "@/types";
import type { SiteConfig } from "@/types/site";

const FONT_STACKS: Record<string, string> = {
  "plus-jakarta": '"Plus Jakarta Sans", Inter, system-ui, sans-serif',
  inter: "Inter, system-ui, sans-serif",
  "dm-sans": '"DM Sans", Inter, system-ui, sans-serif',
};

interface PublicThemeProps {
  tenant: Tenant;
  siteConfig?: SiteConfig;
}

export function PublicTheme({ tenant, siteConfig }: PublicThemeProps) {
  const tokens = resolveDesignTokens(tenant.theme);
  const vars = designTokensToCssVars(tokens);

  const typography = siteConfig?.identity.typography;
  const fontFamily = typography ? FONT_STACKS[typography] : undefined;

  const cssRules = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n    ");

  const fontRule = fontFamily
    ? `\n    font-family: ${fontFamily};`
    : "";

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `.public-menu { ${cssRules}${fontRule} }`,
      }}
    />
  );
}
