"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateSiteConfig } from "@/lib/repositories/tenant.repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteConfig } from "@/types/site";
import type { Tenant } from "@/types";

interface SeoTabProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  onSiteConfigChange: (config: SiteConfig) => void;
}

export function SeoTab({
  tenant,
  siteConfig,
  onSiteConfigChange,
}: SeoTabProps) {
  const seo = siteConfig.seo;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(seo.title ?? tenant.name);
  const [description, setDescription] = useState(
    seo.description ?? tenant.description ?? "",
  );
  const [ogImageUrl, setOgImageUrl] = useState(
    seo.ogImageUrl ?? tenant.bannerUrl ?? tenant.logoUrl ?? "",
  );
  const [keywordsText, setKeywordsText] = useState(
    (seo.keywords ?? []).join(", "),
  );

  const hasChanges =
    title !== (seo.title ?? tenant.name) ||
    description !== (seo.description ?? tenant.description ?? "") ||
    ogImageUrl !== (seo.ogImageUrl ?? tenant.bannerUrl ?? tenant.logoUrl ?? "") ||
    keywordsText !== (seo.keywords ?? []).join(", ");

  const handleSave = async () => {
    if (ogImageUrl && !/^https?:\/\/.+/.test(ogImageUrl)) {
      toast.error("URL da imagem OG inválida");
      return;
    }

    setIsSubmitting(true);
    try {
      const keywords = keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const seoPatch = {
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        ogImageUrl: ogImageUrl.trim() || undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
      };

      await updateSiteConfig(tenant.id, { seo: seoPatch }, siteConfig);

      onSiteConfigChange({
        ...siteConfig,
        seo: { ...siteConfig.seo, ...seoPatch },
      });

      toast.success("SEO salvo");
    } catch (err) {
      console.error("[seo-tab]", err);
      toast.error("Erro ao salvar SEO");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">SEO</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Otimize como seu site aparece em buscas e redes sociais.
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="seo-title">Título da página</Label>
        <Input
          id="seo-title"
          value={title}
          disabled={isSubmitting}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={70}
        />
        <p className="text-xs text-muted-foreground">
          {title.length}/70 caracteres
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="seo-description">Meta descrição</Label>
        <Textarea
          id="seo-description"
          rows={3}
          value={description}
          disabled={isSubmitting}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={160}
        />
        <p className="text-xs text-muted-foreground">
          {description.length}/160 caracteres
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="seo-og-image">Imagem OG (URL)</Label>
        <Input
          id="seo-og-image"
          value={ogImageUrl}
          disabled={isSubmitting}
          onChange={(e) => setOgImageUrl(e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="seo-keywords">Palavras-chave</Label>
        <Input
          id="seo-keywords"
          value={keywordsText}
          disabled={isSubmitting}
          onChange={(e) => setKeywordsText(e.target.value)}
          placeholder="restaurante, delivery, pizza"
        />
        <p className="text-xs text-muted-foreground">
          Separadas por vírgula
        </p>
      </div>

      <Button
        type="button"
        onClick={handleSave}
        disabled={isSubmitting || !hasChanges}
      >
        {isSubmitting ? "Salvando…" : "Salvar SEO"}
      </Button>
    </div>
  );
}
