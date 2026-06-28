"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { UpdateTenantHighlightsSchema } from "@/lib/schemas/tenant-menu.schema";
import { updateTenant, updateSiteConfig } from "@/lib/repositories/tenant.repository";
import {
  buildSectionCopyPatch,
  DEFAULT_SECTION_COPY,
  mergeSectionCopyPatch,
  resolveSectionCopy,
} from "@/lib/site/section-copy";
import {
  buildHighlightsFromIds,
  buildPreviewLandingData,
} from "@/lib/site/landing-preview";
import { formatMenuItemPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SectionCopyBlock,
  buildTitleSubtitleFields,
} from "@/features/presenca-digital/section-copy-block";
import { LandingSectionPreview } from "@/features/presenca-digital/landing-section-preview";
import { FeaturedPreviewContent } from "@/features/presenca-digital/landing-section-preview-content";
import type { CategoryWithItems } from "@/components/admin/highlights-settings";
import type { SiteConfig } from "@/types/site";
import type { MenuItem, Tenant } from "@/types";

const MAX_HIGHLIGHTS = 6;

type ItemWithCategory = MenuItem & { categoryName: string };

interface FeaturedTabProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  categories: CategoryWithItems[];
  onTenantChange: (patch: Partial<Tenant>) => void;
  onSiteConfigChange: (config: SiteConfig) => void;
}

function ItemThumbnail({
  item,
  size = "md",
}: {
  item: ItemWithCategory;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-10 w-10" : "h-12 w-12";

  return (
    <div
      className={`relative ${dim} shrink-0 overflow-hidden rounded-md border bg-muted`}
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt=""
          fill
          sizes={size === "sm" ? "40px" : "48px"}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
          —
        </div>
      )}
    </div>
  );
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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const allItems = useMemo<ItemWithCategory[]>(
    () =>
      categories.flatMap((cat) =>
        cat.items.map((item) => ({ ...item, categoryName: cat.name })),
      ),
    [categories],
  );

  const itemsById = useMemo(() => {
    const map = new Map<string, ItemWithCategory>();
    for (const item of allItems) {
      map.set(item.id, item);
    }
    return map;
  }, [allItems]);

  const selectedItems = useMemo(
    () =>
      selectedIds
        .map((id) => itemsById.get(id))
        .filter((item): item is ItemWithCategory => item !== undefined),
    [selectedIds, itemsById],
  );

  const previewData = useMemo(() => {
    const sectionCopyPatch = buildSectionCopyPatch("featured", {
      title: sectionTitle,
      subtitle: sectionSubtitle,
    });
    return buildPreviewLandingData(tenant, siteConfig, {
      highlights: buildHighlightsFromIds(categories, selectedIds),
      categoriesWithItems: categories,
      sectionCopyPatches: [sectionCopyPatch],
    });
  }, [
    tenant,
    siteConfig,
    categories,
    selectedIds,
    sectionTitle,
    sectionSubtitle,
  ]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allItems.filter((item) => {
      if (categoryFilter !== "all" && item.categoryName !== categoryFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        item.name.toLowerCase().includes(query) ||
        item.categoryName.toLowerCase().includes(query)
      );
    });
  }, [allItems, categoryFilter, searchQuery]);

  const listItems = useMemo(() => {
    const matchesFilters = (item: ItemWithCategory) =>
      filteredItems.some((candidate) => candidate.id === item.id);

    if (showSelectedOnly) {
      return selectedItems.filter(matchesFilters);
    }

    const selected = selectedItems.filter(matchesFilters);
    const unselected = filteredItems.filter(
      (item) => !selectedIds.includes(item.id),
    );

    return [...selected, ...unselected];
  }, [
    filteredItems,
    selectedIds,
    selectedItems,
    showSelectedOnly,
  ]);

  const categoryNames = useMemo(
    () => [...new Set(categories.map((cat) => cat.name))].sort(),
    [categories],
  );

  const addItem = (itemId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(itemId)) {
        return prev;
      }
      if (prev.length >= MAX_HIGHLIGHTS) {
        toast.error(`Máximo de ${MAX_HIGHLIGHTS} destaques`);
        return prev;
      }
      return [...prev, itemId];
    });
  };

  const removeItem = (itemId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== itemId));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= selectedIds.length) {
      return;
    }

    setSelectedIds((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Produtos em Destaque</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha até {MAX_HIGHLIGHTS} itens para exibir na landing page.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_min(390px,100%)] lg:items-start">
        <div className="space-y-6 min-w-0">
          <SectionCopyBlock
            disabled={isSubmitting}
            fields={buildTitleSubtitleFields({
              idPrefix: "featured",
              title: sectionTitle,
              subtitle: sectionSubtitle,
              titleDefault: DEFAULT_SECTION_COPY.featured.title,
              subtitleDefault: DEFAULT_SECTION_COPY.featured.subtitle,
              onTitleChange: setSectionTitle,
              onSubtitleChange: setSectionSubtitle,
            })}
          />

          <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Label>Produtos em destaque</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Selecionados: {selectedIds.length}/{MAX_HIGHLIGHTS}. A ordem
                  dos selecionados é a ordem do carrossel no site.
                </p>
              </div>
            </div>

            {allItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Adicione produtos no cardápio para poder destacá-los.
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                  <div className="relative min-w-0 flex-1 sm:min-w-[200px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      disabled={isSubmitting}
                      placeholder="Buscar por nome ou categoria…"
                      className="pl-9"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1 sm:w-48">
                    <Label htmlFor="featured-category-filter" className="sr-only">
                      Categoria
                    </Label>
                    <select
                      id="featured-category-filter"
                      value={categoryFilter}
                      disabled={isSubmitting}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="all">Todas as categorias</option>
                      {categoryNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={showSelectedOnly}
                      disabled={isSubmitting}
                      onChange={(e) => setShowSelectedOnly(e.target.checked)}
                      className="rounded border-input"
                    />
                    Mostrar só selecionados
                  </label>
                </div>

                {listItems.length === 0 ? (
                  <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
                    {showSelectedOnly
                      ? "Nenhum produto selecionado com os filtros atuais."
                      : "Nenhum produto encontrado com os filtros atuais."}
                  </p>
                ) : (
                  <ul className="divide-y rounded-xl border bg-background max-h-[520px] overflow-y-auto">
                    {listItems.map((item) => {
                      const isSelected = selectedIds.includes(item.id);
                      const order = selectedIds.indexOf(item.id);

                      return (
                        <li key={item.id} className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0">
                              <ItemThumbnail item={item} size="md" />
                              {isSelected ? (
                                <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                                  {order + 1}
                                </span>
                              ) : null}
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0 space-y-1">
                                <p className="text-sm font-medium leading-snug break-words">
                                  {item.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.categoryName}
                                </p>
                                <p className="text-xs font-medium text-foreground/80">
                                  {formatMenuItemPrice(item)}
                                  {!item.available && (
                                    <span className="font-normal text-muted-foreground">
                                      {" "}
                                      · Indisponível
                                    </span>
                                  )}
                                </p>
                              </div>

                              <div className="flex shrink-0 items-center justify-end gap-1 self-stretch lg:self-start">
                                {isSelected ? (
                                  <>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      disabled={isSubmitting || order === 0}
                                      onClick={() => moveItem(order, -1)}
                                      aria-label="Mover para cima"
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      disabled={
                                        isSubmitting ||
                                        order === selectedIds.length - 1
                                      }
                                      onClick={() => moveItem(order, 1)}
                                      aria-label="Mover para baixo"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:border-destructive/30 hover:text-destructive"
                                      disabled={isSubmitting}
                                      onClick={() => removeItem(item.id)}
                                      aria-label="Remover destaque"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                      isSubmitting ||
                                      selectedIds.length >= MAX_HIGHLIGHTS
                                    }
                                    onClick={() => addItem(item.id)}
                                  >
                                    Adicionar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || !hasChanges}
          >
            {isSubmitting ? "Salvando…" : "Salvar destaques"}
          </Button>
        </div>

        <div className="hidden lg:sticky lg:top-6 lg:block">
          <LandingSectionPreview
            tenant={tenant}
            siteConfig={previewData.siteConfig}
            sectionId="featured"
            bandIndex={2}
          >
            <FeaturedPreviewContent data={previewData} />
          </LandingSectionPreview>
        </div>
      </div>
    </div>
  );
}
