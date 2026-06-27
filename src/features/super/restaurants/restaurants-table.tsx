"use client";

import Link from "next/link";
import { ExternalLink, Store } from "lucide-react";
import { TenantStatusBadge } from "@/components/admin/tenant-status-badge";
import { PlanBadge } from "@/components/super/plan-badge";
import { Button } from "@/components/ui/button";
import type { TenantListRow } from "@/services/platform/list-tenants.service";
import type { TenantStatus } from "@/types";

const STATUS_OPTIONS: { value: TenantStatus; label: string }[] = [
  { value: "trial", label: "Trial" },
  { value: "active", label: "Ativo" },
  { value: "suspended", label: "Suspenso" },
  { value: "cancelled", label: "Cancelado" },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

function formatDateTime(date?: Date): string {
  if (!date) return "—";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface RestaurantsTableProps {
  items: TenantListRow[];
  onStatusChange: (tenantId: string, status: TenantStatus) => void;
  updatingId: string | null;
}

export function RestaurantsTable({
  items,
  onStatusChange,
  updatingId,
}: RestaurantsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Nenhum restaurante encontrado com os filtros atuais.
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <table className="w-full text-sm min-w-[960px]">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium w-12" />
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Plano</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Domínio</th>
            <th className="px-4 py-3 font-medium">Criado em</th>
            <th className="px-4 py-3 font-medium">Último acesso</th>
            <th className="px-4 py-3 font-medium">Usuários</th>
            <th className="px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((tenant) => (
            <tr key={tenant.id} className="border-b last:border-0">
              <td className="px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border bg-muted">
                  {tenant.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tenant.logoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-medium max-w-[180px] truncate">
                {tenant.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {tenant.slug}
              </td>
              <td className="px-4 py-3">
                <PlanBadge planId={tenant.planId} />
              </td>
              <td className="px-4 py-3">
                <TenantStatusBadge status={tenant.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">
                {tenant.domain}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {formatDate(tenant.createdAt)}
              </td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {formatDateTime(tenant.lastAccessAt)}
              </td>
              <td className="px-4 py-3 text-center">{tenant.userCount}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <select
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs max-w-[110px]"
                    value={tenant.status}
                    disabled={updatingId === tenant.id}
                    onChange={(e) => {
                      onStatusChange(tenant.id, e.target.value as TenantStatus);
                    }}
                    aria-label={`Status de ${tenant.name}`}
                  >
                    {STATUS_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <Link
                      href={`/${tenant.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver site de ${tenant.name}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
