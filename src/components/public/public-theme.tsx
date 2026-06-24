import { resolveTenantTheme, themeToCssVars } from "@/lib/utils/theme";
import type { Tenant } from "@/types";

interface PublicThemeProps {
  tenant: Tenant;
}

export function PublicTheme({ tenant }: PublicThemeProps) {
  const theme = resolveTenantTheme(tenant.theme);
  const vars = themeToCssVars(theme);

  const css = Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n    ");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `.public-menu { ${css} }`,
      }}
    />
  );
}
