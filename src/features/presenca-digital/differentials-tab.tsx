"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { updateSiteConfig } from "@/lib/repositories/tenant.repository";
import {
  buildSectionCopyPatch,
  DEFAULT_SECTION_COPY,
  mergeSectionCopyPatch,
  resolveSectionCopy,
} from "@/lib/site/section-copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionHeadingFields } from "@/features/presenca-digital/section-heading-fields";
import type { SiteConfig, SiteDifferential } from "@/types/site";
import type { Tenant } from "@/types";

const MAX_ITEMS = 6;

interface DifferentialsTabProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  onSiteConfigChange: (config: SiteConfig) => void;
}

export function DifferentialsTab({
  tenant,
  siteConfig,
  onSiteConfigChange,
}: DifferentialsTabProps) {
  const resolvedCopy = resolveSectionCopy(siteConfig.sectionCopy);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<SiteDifferential[]>(
    siteConfig.differentials,
  );
  const [sectionTitle, setSectionTitle] = useState<string>(
    resolvedCopy.differentials.title ?? "",
  );
  const [sectionSubtitle, setSectionSubtitle] = useState<string>(
    resolvedCopy.differentials.subtitle ?? "",
  );

  const hasChanges =
    JSON.stringify(items) !== JSON.stringify(siteConfig.differentials) ||
    sectionTitle !== (resolvedCopy.differentials.title ?? "") ||
    sectionSubtitle !== (resolvedCopy.differentials.subtitle ?? "");

  const addItem = () => {
    if (items.length >= MAX_ITEMS) {
      toast.error(`Máximo de ${MAX_ITEMS} diferenciais`);
      return;
    }
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", description: "" },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, patch: Partial<SiteDifferential>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const handleSave = async () => {
    const valid = items.filter((item) => item.title.trim());
    if (valid.some((item) => !item.title.trim())) {
      toast.error("Preencha o título de todos os diferenciais");
      return;
    }

    setIsSubmitting(true);
    try {
      const cleaned = valid.map((item) => ({
        ...item,
        title: item.title.trim(),
        description: item.description?.trim() || undefined,
        icon: item.icon?.trim() || undefined,
      }));

      const sectionCopyPatch = buildSectionCopyPatch("differentials", {
        title: sectionTitle,
        subtitle: sectionSubtitle,
      });

      await updateSiteConfig(
        tenant.id,
        { differentials: cleaned, sectionCopy: sectionCopyPatch },
        siteConfig,
      );

      setItems(cleaned);
      onSiteConfigChange({
        ...siteConfig,
        differentials: cleaned,
        sectionCopy: mergeSectionCopyPatch(
          siteConfig.sectionCopy ?? {},
          sectionCopyPatch,
        ),
      });
      toast.success("Diferenciais salvos");
    } catch (err) {
      console.error("[differentials-tab]", err);
      toast.error("Erro ao salvar diferenciais");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Diferenciais</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Destaque até {MAX_ITEMS} motivos para escolher seu restaurante.
        </p>
      </div>

      <SectionHeadingFields
        title={sectionTitle}
        subtitle={sectionSubtitle}
        disabled={isSubmitting}
        titlePlaceholder={DEFAULT_SECTION_COPY.differentials.title}
        subtitlePlaceholder={DEFAULT_SECTION_COPY.differentials.subtitle}
        onTitleChange={setSectionTitle}
        onSubtitleChange={setSectionSubtitle}
      />

      <div className="space-y-4 border-t border-border/60 pt-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/60 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Diferencial {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isSubmitting}
                onClick={() => removeItem(item.id)}
                aria-label="Remover diferencial"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-[4rem_1fr]">
              <div className="space-y-1">
                <Label>Ícone</Label>
                <Input
                  value={item.icon ?? ""}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    updateItem(item.id, { icon: e.target.value })
                  }
                  placeholder="🍕"
                  className="text-center text-lg"
                  maxLength={4}
                />
              </div>
              <div className="space-y-1">
                <Label>Título</Label>
                <Input
                  value={item.title}
                  disabled={isSubmitting}
                  onChange={(e) =>
                    updateItem(item.id, { title: e.target.value })
                  }
                  placeholder="Ingredientes frescos"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Descrição (opcional)</Label>
              <Textarea
                rows={2}
                value={item.description ?? ""}
                disabled={isSubmitting}
                onChange={(e) =>
                  updateItem(item.id, { description: e.target.value })
                }
                placeholder="Selecionamos os melhores produtos…"
              />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {items.length < MAX_ITEMS && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={addItem}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar diferencial
            </Button>
          )}

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || !hasChanges}
          >
            {isSubmitting ? "Salvando…" : "Salvar diferenciais"}
          </Button>
        </div>
      </div>
    </div>
  );
}
