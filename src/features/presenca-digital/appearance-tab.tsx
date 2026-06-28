"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  UpdateTenantAppearanceSchema,
  type TenantTheme,
} from "@/lib/schemas/tenant-menu.schema";
import { updateTenant, updateSiteConfig } from "@/lib/repositories/tenant.repository";
import { uploadTenantLogo } from "@/lib/storage/upload";
import { DEFAULT_TENANT_THEME } from "@/lib/utils/theme";
import {
  buildSectionCopyPatch,
  DEFAULT_SECTION_COPY,
  mergeSectionCopyPatch,
  resolveSectionCopy,
} from "@/lib/site/section-copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { ColorField } from "./color-field";
import { ThemeColorPreview } from "./theme-color-preview";
import {
  SectionCopyBlock,
  buildTitleSubtitleFields,
} from "@/features/presenca-digital/section-copy-block";
import { LandingSectionPreview } from "@/features/presenca-digital/landing-section-preview";
import { MenuPreviewContent } from "@/features/presenca-digital/landing-section-preview-content";
import { buildPreviewLandingData } from "@/lib/site/landing-preview";
import type { FontPreset, SiteConfig } from "@/types/site";
import type { Tenant } from "@/types";

const FONT_OPTIONS: { value: FontPreset; label: string }[] = [
  { value: "plus-jakarta", label: "Plus Jakarta Sans" },
  { value: "inter", label: "Inter" },
  { value: "dm-sans", label: "DM Sans" },
];

interface AppearanceTabProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  onTenantChange: (patch: Partial<Tenant>) => void;
  onSiteConfigChange: (config: SiteConfig) => void;
}

export function AppearanceTab({
  tenant,
  siteConfig,
  onTenantChange,
  onSiteConfigChange,
}: AppearanceTabProps) {
  const resolvedCopy = resolveSectionCopy(siteConfig.sectionCopy);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(tenant.name);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl);
  const [theme, setTheme] = useState<TenantTheme>(
    tenant.theme ?? DEFAULT_TENANT_THEME,
  );
  const [typography, setTypography] = useState<FontPreset | "">(
    siteConfig.identity.typography ?? "",
  );
  const [menuTitle, setMenuTitle] = useState<string>(resolvedCopy.menu.title ?? "");
  const [menuSubtitle, setMenuSubtitle] = useState<string>(
    resolvedCopy.menu.subtitle ?? "",
  );

  const menuPreviewData = useMemo(() => {
    const sectionCopyPatch = buildSectionCopyPatch("menu", {
      title: menuTitle,
      subtitle: menuSubtitle,
    });
    return buildPreviewLandingData(tenant, siteConfig, {
      sectionCopyPatches: [sectionCopyPatch],
    });
  }, [tenant, siteConfig, menuTitle, menuSubtitle]);

  const hasChanges =
    name !== tenant.name ||
    logoFile !== null ||
    logoUrl !== tenant.logoUrl ||
    JSON.stringify(theme) !==
      JSON.stringify(tenant.theme ?? DEFAULT_TENANT_THEME) ||
    (typography || undefined) !== siteConfig.identity.typography ||
    menuTitle !== (resolvedCopy.menu.title ?? "") ||
    menuSubtitle !== (resolvedCopy.menu.subtitle ?? "");

  const handleSave = async () => {
    if (name.trim().length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }

    const parsed = UpdateTenantAppearanceSchema.safeParse({ theme });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Cores inválidas");
      return;
    }

    setIsSubmitting(true);
    try {
      let newLogoUrl = logoUrl;
      if (logoFile) {
        newLogoUrl = await uploadTenantLogo(tenant.id, logoFile);
        setLogoUrl(newLogoUrl);
        setLogoFile(null);
      }

      await updateTenant(tenant.id, {
        name: name.trim(),
        theme: parsed.data.theme,
        ...(logoFile ? { logoUrl: newLogoUrl } : {}),
      });

      const identityPatch = typography
        ? { typography: typography as FontPreset }
        : {};

      const sectionCopyPatch = buildSectionCopyPatch("menu", {
        title: menuTitle,
        subtitle: menuSubtitle,
      });

      await updateSiteConfig(
        tenant.id,
        { identity: identityPatch, sectionCopy: sectionCopyPatch },
        siteConfig,
      );

      onTenantChange({
        name: name.trim(),
        theme: parsed.data.theme,
        ...(logoFile ? { logoUrl: newLogoUrl } : {}),
      });
      onSiteConfigChange({
        ...siteConfig,
        identity: { ...siteConfig.identity, ...identityPatch },
        sectionCopy: mergeSectionCopyPatch(
          siteConfig.sectionCopy ?? {},
          sectionCopyPatch,
        ),
      });

      toast.success("Aparência salva");
    } catch (err) {
      console.error("[appearance-tab]", err);
      const message =
        err instanceof Error ? err.message : "Erro ao salvar aparência";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Aparência</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Logo, nome e identidade visual do seu site.
        </p>
      </div>

      <ImageUpload
        label="Logo do restaurante (opcional)"
        currentUrl={logoUrl}
        onFileChange={setLogoFile}
        disabled={isSubmitting}
      />

      <div className="space-y-1">
        <Label htmlFor="restaurant-name">Nome do restaurante</Label>
        <Input
          id="restaurant-name"
          value={name}
          disabled={isSubmitting}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ColorField
          label="Cor principal"
          value={theme.primaryColor}
          disabled={isSubmitting}
          onChange={(v) => setTheme((t) => ({ ...t, primaryColor: v }))}
        />
        <ColorField
          label="Cor principal (escura)"
          value={theme.primaryDarkColor}
          disabled={isSubmitting}
          onChange={(v) => setTheme((t) => ({ ...t, primaryDarkColor: v }))}
        />
        <ColorField
          label="Cor secundária"
          hint="Textos do site e fundo do rodapé"
          value={theme.secondaryColor}
          disabled={isSubmitting}
          onChange={(v) => setTheme((t) => ({ ...t, secondaryColor: v }))}
        />
      </div>

      <ThemeColorPreview theme={theme} />

      <div className="space-y-1">
        <Label htmlFor="typography">Tipografia</Label>
        <select
          id="typography"
          value={typography}
          disabled={isSubmitting}
          onChange={(e) => setTypography(e.target.value as FontPreset | "")}
          className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Padrão do sistema</option>
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <SectionCopyBlock
        blockTitle="Cabeçalho da seção Cardápio"
        disabled={isSubmitting}
        fields={buildTitleSubtitleFields({
          idPrefix: "menu",
          title: menuTitle,
          subtitle: menuSubtitle,
          titleLabel: "Título da seção Cardápio",
          subtitleLabel: "Subtítulo do Cardápio",
          titleDefault: DEFAULT_SECTION_COPY.menu.title,
          subtitleDefault: DEFAULT_SECTION_COPY.menu.subtitle,
          onTitleChange: setMenuTitle,
          onSubtitleChange: setMenuSubtitle,
        })}
        preview={
          <LandingSectionPreview
            tenant={tenant}
            siteConfig={menuPreviewData.siteConfig}
            sectionId="menu"
            bandIndex={2}
          >
            <MenuPreviewContent data={menuPreviewData} />
          </LandingSectionPreview>
        }
      />

      <Button
        type="button"
        onClick={handleSave}
        disabled={isSubmitting || !hasChanges}
      >
        {isSubmitting ? "Salvando…" : "Salvar aparência"}
      </Button>
    </div>
  );
}
