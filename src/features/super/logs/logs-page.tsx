"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, Search } from "lucide-react";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { AuditEventBadge } from "@/components/super/audit-event-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogDetailSheet } from "@/features/super/logs/log-detail-sheet";
import {
  AUDIT_EVENT_FILTERS,
  type AuditLogClientItem,
  type AuditLogsPageData,
} from "@/features/super/logs/audit-labels";
import type { AuditEventType } from "@/types/platform/audit-log";
import { cn } from "@/lib/utils";

interface LogsPageProps {
  data: AuditLogsPageData;
}

export function LogsPage({ data }: LogsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentType = (searchParams.get("type") ?? "all") as AuditEventType | "all";
  const currentQ = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(currentQ);
  const [detailLog, setDetailLog] = useState<AuditLogClientItem | null>(null);

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

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Logs"
        description="Auditoria de eventos críticos da plataforma."
      />

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por e-mail, restaurante…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {AUDIT_EVENT_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                updateParams({ type: value === "all" ? undefined : value }, true)
              }
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                currentType === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-accent",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {data.total} evento{data.total !== 1 ? "s" : ""}
          {isPending ? " · atualizando…" : null}
        </p>
      </div>

      {data.items.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum evento encontrado.
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Evento</th>
                <th className="px-4 py-3 font-medium">Ator</th>
                <th className="px-4 py-3 font-medium">Restaurante</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium w-16" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((log) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <AuditEventBadge type={log.type} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">
                    {log.actorEmail ?? log.actorUid ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {log.tenantName ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setDetailLog(log)}
                      aria-label="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.totalPages > 1 ? (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Página {data.page} de {data.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1 || isPending}
              onClick={() => goToPage(data.page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages || isPending}
              onClick={() => goToPage(data.page + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      ) : null}

      <LogDetailSheet
        log={detailLog}
        open={detailLog !== null}
        onOpenChange={(open) => {
          if (!open) setDetailLog(null);
        }}
      />
    </div>
  );
}
