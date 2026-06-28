"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  UpdateTenantAppearanceSchema,
  type TenantTheme,
} from "@/lib/schemas/tenant-menu.schema";
import { updateTenant } from "@/lib/repositories/tenant.repository";
import { uploadTenantBanner } from "@/lib/storage/upload";
import { DEFAULT_TENANT_THEME } from "@/lib/utils/theme";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import { ColorField } from "@/features/presenca-digital/color-field";
import { ThemeColorPreview } from "@/features/presenca-digital/theme-color-preview";
import type { Tenant } from "@/types";

interface AppearanceSettingsProps {
  tenant: Tenant;
}

export function AppearanceSettings({ tenant }: AppearanceSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerRemoved, setBannerRemoved] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(tenant.bannerUrl);
  const [theme, setTheme] = useState<TenantTheme>(
    tenant.theme ?? DEFAULT_TENANT_THEME,
  );

  const hasChanges =
    bannerFile !== null ||
    bannerRemoved ||
    JSON.stringify(theme) !==
      JSON.stringify(tenant.theme ?? DEFAULT_TENANT_THEME);

  const handleSave = async () => {
    const parsed = UpdateTenantAppearanceSchema.safeParse({ theme });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Cores inválidas");
      return;
    }

    setIsSubmitting(true);
    try {
      let newBannerUrl = bannerUrl;
      if (bannerFile) {
        newBannerUrl = await uploadTenantBanner(tenant.id, bannerFile);
        setBannerUrl(newBannerUrl);
        setBannerFile(null);
        setBannerRemoved(false);
      } else if (bannerRemoved) {
        newBannerUrl = undefined;
        setBannerUrl(undefined);
        setBannerRemoved(false);
      }

      await updateTenant(tenant.id, {
        theme: parsed.data.theme,
        ...(bannerFile || bannerRemoved
          ? { bannerUrl: newBannerUrl ?? null }
          : {}),
      });
      toast.success("Aparência salva");
    } catch (err) {
      console.error("[appearance-settings]", err);
      toast.error("Erro ao salvar aparência");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Aparência do cardápio</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Banner, cores e identidade visual da página pública.
        </p>
      </div>

      <ImageUpload
        label="Banner do cardápio (opcional)"
        currentUrl={bannerRemoved ? null : bannerUrl}
        onFileChange={(file) => {
          setBannerFile(file);
          if (file) setBannerRemoved(false);
        }}
        onRemoveExisting={() => setBannerRemoved(true)}
        disabled={isSubmitting}
        previewClassName="h-20 w-full max-w-md rounded-md"
        aspect="banner"
      />

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

      <ThemeColorPreview
        theme={theme}
        caption="Pré-visualização das cores do cardápio"
      />

      <Button
        type="button"
        onClick={handleSave}
        disabled={isSubmitting || !hasChanges}
      >
        {isSubmitting ? "Salvando…" : "Salvar aparência"}
      </Button>
    </section>
  );
}
