"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UpdateTenantHighlightsSchema } from "@/lib/schemas/tenant-menu.schema";
import { updateTenant } from "@/lib/repositories/tenant.repository";
import { formatMenuItemPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Category, MenuItem, Tenant } from "@/types";

export type CategoryWithItems = Category & { items: MenuItem[] };

interface HighlightsSettingsProps {
  tenant: Tenant;
  categories: CategoryWithItems[];
}

const MAX_HIGHLIGHTS = 6;

export function HighlightsSettings({
  tenant,
  categories,
}: HighlightsSettingsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    tenant.highlightItemIds ?? [],
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
      toast.success("Destaques salvos");
    } catch (err) {
      console.error("[highlights-settings]", err);
      toast.error("Erro ao salvar destaques");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allItems = categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryName: cat.name })),
  );

  const hasChanges =
    JSON.stringify(selectedIds) !==
    JSON.stringify(tenant.highlightItemIds ?? []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Destaques da casa</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Escolha até {MAX_HIGHLIGHTS} itens para exibir no carrossel do
          cardápio. Se nenhum for selecionado, o sistema escolhe automaticamente.
        </p>
      </div>

      {allItems.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Adicione itens no cardápio para poder destacá-los.
        </p>
      ) : (
        <div className="space-y-2">
          <Label>
            Selecionados: {selectedIds.length}/{MAX_HIGHLIGHTS}
          </Label>
          <ul className="divide-y rounded-lg border">
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
    </section>
  );
}
