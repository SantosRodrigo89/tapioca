"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { updateTenantAndSiteConfig } from "@/lib/repositories/tenant.repository";
import {
  buildSectionCopySavePatch,
  DEFAULT_SECTION_COPY,
  mergeSectionCopyPatch,
  resolveSectionCopyOverride,
} from "@/lib/site/section-copy";
import { buildPreviewLandingData } from "@/lib/site/landing-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionCopyBlock } from "@/features/presenca-digital/section-copy-block";
import { LandingSectionPreview } from "@/features/presenca-digital/landing-section-preview";
import { AboutPreviewContent } from "@/features/presenca-digital/landing-section-preview-content";
import type { SiteConfig } from "@/types/site";
import type { Tenant } from "@/types";

interface AboutTabProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  onTenantChange: (patch: Partial<Tenant>) => void;
  onSiteConfigChange: (config: SiteConfig) => void;
}

export function AboutTab({
  tenant,
  siteConfig,
  onTenantChange,
  onSiteConfigChange,
}: AboutTabProps) {
  const about = siteConfig.about;
  const savedEyebrow = siteConfig.sectionCopy?.about?.eyebrow ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(about.title ?? "Sobre nós");
  const [description, setDescription] = useState(
    about.description ?? tenant.description ?? "",
  );
  const [eyebrow, setEyebrow] = useState<string>(savedEyebrow);

  const previewData = useMemo(() => {
    const sectionCopyPatch = buildSectionCopySavePatch(
      "about",
      { eyebrow },
      siteConfig.sectionCopy,
    );
    return buildPreviewLandingData(tenant, siteConfig, {
      siteConfigPatch: {
        about: {
          ...siteConfig.about,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
        },
      },
      sectionCopyPatches: [sectionCopyPatch],
    });
  }, [tenant, siteConfig, title, description, eyebrow]);

  const nextEyebrowOverride = resolveSectionCopyOverride(
    eyebrow,
    DEFAULT_SECTION_COPY.about.eyebrow,
  );
  const savedEyebrowOverride = savedEyebrow || undefined;

  const hasChanges =
    title !== (about.title ?? "Sobre nós") ||
    description !== (about.description ?? tenant.description ?? "") ||
    nextEyebrowOverride !== savedEyebrowOverride;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const descriptionValue = description.trim() || undefined;

      const aboutPatch = {
        title: title.trim() || undefined,
        description: descriptionValue,
      };

      const sectionCopyPatch = buildSectionCopySavePatch(
        "about",
        { eyebrow },
        siteConfig.sectionCopy,
      );

      await updateTenantAndSiteConfig(
        tenant.id,
        { description: descriptionValue },
        { about: aboutPatch, sectionCopy: sectionCopyPatch },
        siteConfig,
      );

      onTenantChange({ description: descriptionValue });
      onSiteConfigChange({
        ...siteConfig,
        about: { ...siteConfig.about, ...aboutPatch },
        sectionCopy: mergeSectionCopyPatch(
          siteConfig.sectionCopy ?? {},
          sectionCopyPatch,
        ),
      });

      toast.success("Seção Sobre salva");
    } catch (err) {
      console.error("[about-tab]", err);
      toast.error("Erro ao salvar seção Sobre");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Sobre</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Conte a história do seu restaurante para os visitantes.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_min(390px,100%)] lg:items-start">
        <div className="space-y-6 min-w-0">
          <SectionCopyBlock
            blockTitle="Cabeçalho da seção"
            disabled={isSubmitting}
            fields={[
              {
                id: "about-eyebrow",
                label: "Destaque acima do título",
                value: eyebrow,
                defaultValue: DEFAULT_SECTION_COPY.about.eyebrow,
                placeholder: DEFAULT_SECTION_COPY.about.eyebrow,
                onChange: setEyebrow,
                onReset: () => setEyebrow(""),
              },
            ]}
          />

          <div className="space-y-1">
            <Label htmlFor="about-title">Título</Label>
            <Input
              id="about-title"
              value={title}
              disabled={isSubmitting}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="about-description">Descrição</Label>
            <Textarea
              id="about-description"
              rows={6}
              value={description}
              disabled={isSubmitting}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte a história do seu restaurante…"
            />
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || !hasChanges}
          >
            {isSubmitting ? "Salvando…" : "Salvar sobre"}
          </Button>
        </div>

        <div className="hidden lg:sticky lg:top-6 lg:block">
          <LandingSectionPreview
            tenant={tenant}
            siteConfig={previewData.siteConfig}
            sectionId="about"
            bandIndex={0}
          >
            <AboutPreviewContent data={previewData} />
          </LandingSectionPreview>
        </div>
      </div>
    </div>
  );
}
