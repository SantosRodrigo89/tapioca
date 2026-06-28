import type { TenantTheme } from "@/lib/schemas/tenant-menu.schema";
import { resolveDesignTokens } from "@/lib/utils/theme";

interface ThemeColorPreviewProps {
  theme: TenantTheme;
  caption?: string;
}

export function ThemeColorPreview({
  theme,
  caption = "Pré-visualização das cores",
}: ThemeColorPreviewProps) {
  const tokens = resolveDesignTokens(theme);

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{caption}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div
          className="rounded-xl border p-4 text-sm font-medium"
          style={{
            backgroundColor: tokens.primaryColor,
            color: tokens.primaryForeground,
          }}
        >
          Botões e destaques
        </div>
        <div
          className="rounded-xl border p-4 text-sm font-medium"
          style={{
            backgroundColor: tokens.secondaryColor,
            color: "rgb(255 255 255 / 0.82)",
          }}
        >
          Fundo do rodapé
        </div>
      </div>
      <p
        className="rounded-xl border bg-white px-4 py-3 text-sm"
        style={{ color: tokens.secondaryColor }}
      >
        Textos do site — exemplo de parágrafo
      </p>
    </div>
  );
}
