"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateTenant, updateSiteConfig } from "@/lib/repositories/tenant.repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(about.title ?? "Sobre nós");
  const [description, setDescription] = useState(
    about.description ?? tenant.description ?? "",
  );

  const hasChanges =
    title !== (about.title ?? "Sobre nós") ||
    description !== (about.description ?? tenant.description ?? "");

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const descriptionValue = description.trim() || undefined;

      await updateTenant(tenant.id, {
        description: descriptionValue,
      });

      const aboutPatch = {
        title: title.trim() || undefined,
        description: descriptionValue,
      };

      await updateSiteConfig(tenant.id, { about: aboutPatch }, siteConfig);

      onTenantChange({ description: descriptionValue });
      onSiteConfigChange({
        ...siteConfig,
        about: { ...siteConfig.about, ...aboutPatch },
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
  );
}
