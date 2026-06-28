"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UpdateTenantHighlightsSchema } from "@/lib/schemas/tenant-menu.schema";
import { updateTenant, updateSiteConfig } from "@/lib/repositories/tenant.repository";
import {
  buildSectionCopyPatch,
  DEFAULT_SECTION_COPY,
  mergeSectionCopyPatch,
  resolveSectionCopy,
} from "@/lib/site/section-copy";
import { formatMenuItemPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SectionHeadingFields } from "@/features/presenca-digital/section-heading-fields";
import type { CategoryWithItems } from "@/components/admin/highlights-settings";
import type { SiteConfig } from "@/types/site";
import type { Tenant } from "@/types";

const MAX_HIGHLIGHTS = 6;

interface FeaturedTabProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  categories: CategoryWithItems[];
  onTenantChange: (patch: Partial<Tenant>) => void;
  onSiteConfigChange: (config: SiteConfig) => void;
}

export function FeaturedTab({
  tenant,
  siteConfig,
  categories,
  onTenantChange,
  onSiteConfigChange,
}: FeaturedTabProps) {
  const initialIds =
    siteConfig.featured.itemIds.length > 0
      ? siteConfig.featured.itemIds
      : (tenant.highlightItemIds ?? []);

  const resolvedCopy = resolveSectionCopy(siteConfig.sectionCopy);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [sectionTitle, setSectionTitle] = useState<string>(
    resolvedCopy.featured.title ?? "",
  );
  const [sectionSubtitle, setSectionSubtitle] = useState<string>(
    resolvedCopy.featured.subtitle ?? "",
  );

  const toggleItem = (itemId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      if (prev.length >= MAX_HIGHLIGHTS) {
        toast.error(`Máximo de ${MAX_HIGHLIGHTS} destaques`);
        return prev;
      }
      return [...prev, itemId];
    });
  };

  const hasChanges =
    JSON.stringify(selectedIds) !== JSON.stringify(initialIds) ||
    sectionTitle !== (resolvedCopy.featured.title ?? "") ||
    sectionSubtitle !== (resolvedCopy.featured.subtitle ?? "");

  const handleSave = async () => {
    const parsed = UpdateTenantHighlightsSchema.safeParse({
      highlightItemIds: selectedIds,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Seleção inválida");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTenant(tenant.id, {
        highlightItemIds: parsed.data.highlightItemIds,
      });

      const featuredPatch = {
        itemIds: parsed.data.highlightItemIds,
        maxCount: MAX_HIGHLIGHTS,
      };

      const sectionCopyPatch = buildSectionCopyPatch("featured", {
        title: sectionTitle,
        subtitle: sectionSubtitle,
      });

      await updateSiteConfig(
        tenant.id,
        { featured: featuredPatch, sectionCopy: sectionCopyPatch },
        siteConfig,
      );

      onTenantChange({ highlightItemIds: parsed.data.highlightItemIds });
      onSiteConfigChange({
        ...siteConfig,
        featured: { ...siteConfig.featured, ...featuredPatch },
        sectionCopy: mergeSectionCopyPatch(
          siteConfig.sectionCopy ?? {},
          sectionCopyPatch,
        ),
      });

      toast.success("Produtos em destaque salvos");
    } catch (err) {
      console.error("[featured-tab]", err);
      toast.error("Erro ao salvar destaques");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allItems = categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryName: cat.name })),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Produtos em Destaque</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha até {MAX_HIGHLIGHTS} itens para exibir na landing page.
        </p>
      </div>

      <SectionHeadingFields
        title={sectionTitle}
        subtitle={sectionSubtitle}
        disabled={isSubmitting}
        titlePlaceholder={DEFAULT_SECTION_COPY.featured.title}
        subtitlePlaceholder={DEFAULT_SECTION_COPY.featured.subtitle}
        onTitleChange={setSectionTitle}
        onSubtitleChange={setSectionSubtitle}
      />

      {allItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Adicione produtos no cardápio para poder destacá-los.
        </p>
      ) : (
        <div className="space-y-2">
          <Label>
            Selecionados: {selectedIds.length}/{MAX_HIGHLIGHTS}
          </Label>
          <ul className="divide-y rounded-xl border">
            {allItems.map((item) => {
              const checked = selectedIds.includes(item.id);
              const order = selectedIds.indexOf(item.id);
              return (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={isSubmitting}
                      onChange={() => toggleItem(item.id)}
                      className="rounded border-input"
                    />
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                          —
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.categoryName} · {formatMenuItemPrice(item)}
                        {!item.available && " · Indisponível"}
                      </p>
                    </div>
                    {checked && (
                      <span className="text-xs font-semibold text-muted-foreground">
                        #{order + 1}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Button
        type="button"
        onClick={handleSave}
        disabled={isSubmitting || !hasChanges}
      >
        {isSubmitting ? "Salvando…" : "Salvar destaques"}
      </Button>
    </div>
  );
}
