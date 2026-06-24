"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { TenantStatusBadge } from "@/components/admin/tenant-status-badge";
import { Button } from "@/components/ui/button";
import type { Tenant, TenantStatus } from "@/types";

const STATUS_OPTIONS: { value: TenantStatus; label: string }[] = [
  { value: "trial", label: "Trial" },
  { value: "active", label: "Ativo" },
  { value: "suspended", label: "Suspenso" },
  { value: "cancelled", label: "Cancelado" },
];

interface SuperClientProps {
  initialTenants: Tenant[];
}

export function SuperClient({ initialTenants }: SuperClientProps) {
  const [tenants, setTenants] = useState(initialTenants);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (tenantId: string, status: TenantStatus) => {
    const previous = tenants;
    setUpdatingId(tenantId);
    setTenants((current) =>
      current.map((t) => (t.id === tenantId ? { ...t, status } : t)),
    );

    try {
      const res = await fetch(`/api/super/tenants/${tenantId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Falha ao atualizar status");
      }

      toast.success("Status atualizado");
    } catch (err) {
      setTenants(previous);
      console.error("[super/status]", err);
      toast.error(
        err instanceof Error ? err.message : "Erro ao atualizar status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = STATUS_OPTIONS.reduce(
    (acc, { value }) => {
      acc[value] = tenants.filter((t) => t.status === value).length;
      return acc;
    },
    {} as Record<TenantStatus, number>,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie restaurantes cadastrados na plataforma.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <div key={value} className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold">{counts[value]}</p>
          </div>
        ))}
      </div>

      {tenants.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nenhum tenant cadastrado.
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Restaurante</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Criado em</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{tenant.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {tenant.slug}
                  </td>
                  <td className="px-4 py-3">
                    <TenantStatusBadge status={tenant.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {tenant.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                        value={tenant.status}
                        disabled={updatingId === tenant.id}
                        onChange={(e) =>
                          handleStatusChange(
                            tenant.id,
                            e.target.value as TenantStatus,
                          )
                        }
                        aria-label={`Status de ${tenant.name}`}
                      >
                        {STATUS_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link
                          href={`/${tenant.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ver cardápio de ${tenant.name}`}
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
      )}
    </div>
  );
}
