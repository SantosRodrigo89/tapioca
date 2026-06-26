"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateTenant, updateSiteConfig } from "@/lib/repositories/tenant.repository";
import { uploadTenantBanner } from "@/lib/storage/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/image-upload";
import type { SiteConfig } from "@/types/site";
import type { Tenant } from "@/types";

interface BannerTabProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  onTenantChange: (patch: Partial<Tenant>) => void;
  onSiteConfigChange: (config: SiteConfig) => void;
}

function buildWhatsappHref(whatsapp?: string): string | undefined {
  if (!whatsapp) return undefined;
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
}

export function BannerTab({
  tenant,
  siteConfig,
  onTenantChange,
  onSiteConfigChange,
}: BannerTabProps) {
  const hero = siteConfig.hero;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerRemoved, setBannerRemoved] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(
    hero.imageUrl ?? tenant.bannerUrl,
  );
  const [title, setTitle] = useState(hero.title ?? tenant.name);
  const [subtitle, setSubtitle] = useState(hero.subtitle ?? "");
  const [ctaLabel, setCtaLabel] = useState(hero.buttons?.[0]?.label ?? "");

  const whatsappHref = buildWhatsappHref(tenant.whatsapp);

  const hasChanges =
    bannerFile !== null ||
    bannerRemoved ||
    title !== (hero.title ?? tenant.name) ||
    subtitle !== (hero.subtitle ?? "") ||
    ctaLabel !== (hero.buttons?.[0]?.label ?? "") ||
    (bannerUrl ?? undefined) !== (hero.imageUrl ?? tenant.bannerUrl);

  const handleSave = async () => {
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
        ...(bannerFile || bannerRemoved
          ? { bannerUrl: newBannerUrl ?? null }
          : {}),
      });

      const buttons =
        ctaLabel.trim() && whatsappHref
          ? [{ label: ctaLabel.trim(), href: whatsappHref, variant: "primary" as const }]
          : ctaLabel.trim()
            ? [{ label: ctaLabel.trim(), href: "#contato", variant: "primary" as const }]
            : undefined;

      const heroPatch = {
        title: title.trim() || undefined,
        subtitle: subtitle.trim() || undefined,
        imageUrl: newBannerUrl,
        buttons,
      };

      await updateSiteConfig(tenant.id, { hero: heroPatch }, siteConfig);

      onTenantChange({
        ...(bannerFile || bannerRemoved
          ? { bannerUrl: newBannerUrl ?? undefined }
          : {}),
      });
      onSiteConfigChange({
        ...siteConfig,
        hero: { ...siteConfig.hero, ...heroPatch },
      });

      toast.success("Banner salvo");
    } catch (err) {
      console.error("[banner-tab]", err);
      toast.error("Erro ao salvar banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Banner</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Imagem de destaque e mensagem principal da landing page.
        </p>
      </div>

      <ImageUpload
        label="Imagem do banner (opcional)"
        currentUrl={bannerRemoved ? null : bannerUrl}
        onFileChange={(file) => {
          setBannerFile(file);
          if (file) setBannerRemoved(false);
        }}
        onRemoveExisting={() => setBannerRemoved(true)}
        disabled={isSubmitting}
        previewClassName="h-32 w-full max-w-lg rounded-xl"
        aspect="banner"
      />

      <div className="space-y-1">
        <Label htmlFor="hero-title">Título</Label>
        <Input
          id="hero-title"
          value={title}
          disabled={isSubmitting}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome do restaurante"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="hero-subtitle">Subtítulo</Label>
        <Input
          id="hero-subtitle"
          value={subtitle}
          disabled={isSubmitting}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Sabor autêntico, feito com carinho"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="hero-cta">Texto do botão (opcional)</Label>
        <Input
          id="hero-cta"
          value={ctaLabel}
          disabled={isSubmitting}
          onChange={(e) => setCtaLabel(e.target.value)}
          placeholder="Fazer pedido"
        />
        {ctaLabel.trim() && !whatsappHref && (
          <p className="text-xs text-muted-foreground">
            Configure o WhatsApp na aba Contato para link direto.
          </p>
        )}
      </div>

      <Button
        type="button"
        onClick={handleSave}
        disabled={isSubmitting || !hasChanges}
      >
        {isSubmitting ? "Salvando…" : "Salvar banner"}
      </Button>
    </div>
  );
}
