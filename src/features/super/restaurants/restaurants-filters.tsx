"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TenantStatus } from "@/types";

const STATUS_FILTERS: { value: TenantStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "trial", label: "Trial" },
  { value: "active", label: "Ativo" },
  { value: "suspended", label: "Suspenso" },
  { value: "cancelled", label: "Cancelado" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Criado em" },
  { value: "name", label: "Nome" },
  { value: "slug", label: "Slug" },
  { value: "lastAccessAt", label: "Último acesso" },
] as const;

interface RestaurantsFiltersProps {
  total: number;
}

export function RestaurantsFilters({ total }: RestaurantsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentStatus = (searchParams.get("status") ?? "all") as
    | TenantStatus
    | "all";
  const currentSort = searchParams.get("sort") ?? "createdAt";
  const currentOrder = searchParams.get("order") ?? "desc";
  const currentQ = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(currentQ);

  useEffect(() => {
    setSearchInput(currentQ);
  }, [currentQ]);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>, resetPage = false) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }

      if (resetPage) params.delete("page");

      startTransition(() => {
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput === currentQ) return;
      updateParams({ q: searchInput || undefined }, true);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput, currentQ, updateParams]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nome, slug ou domínio…"
            className="pl-9"
            aria-label="Buscar restaurantes"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={currentSort}
            onChange={(e) =>
              updateParams({ sort: e.target.value }, true)
            }
            aria-label="Ordenar por"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={currentOrder}
            onChange={(e) =>
              updateParams({ order: e.target.value }, true)
            }
            aria-label="Direção da ordenação"
          >
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              updateParams(
                { status: value === "all" ? undefined : value },
                true,
              )
            }
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              currentStatus === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {total} restaurante{total !== 1 ? "s" : ""}
        {isPending ? " · atualizando…" : null}
      </p>
    </div>
  );
}
