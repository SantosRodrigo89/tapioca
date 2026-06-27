"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { Button } from "@/components/ui/button";
import { RestaurantsFilters } from "@/features/super/restaurants/restaurants-filters";
import { RestaurantsPagination } from "@/features/super/restaurants/restaurants-pagination";
import { RestaurantsTable } from "@/features/super/restaurants/restaurants-table";
import type { ListTenantsResult } from "@/services/platform/list-tenants.service";
import type { TenantStatus } from "@/types";

interface RestaurantsPageProps {
  data: ListTenantsResult;
}

export function RestaurantsPage({ data }: RestaurantsPageProps) {
  const [items, setItems] = useState(data.items);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (tenantId: string, status: TenantStatus) => {
    const previous = items;
    setUpdatingId(tenantId);
    setItems((current) =>
      current.map((t) => (t.id === tenantId ? { ...t, status } : t)),
    );

    try {
      const res = await fetch(`/api/super/tenants/${tenantId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Falha ao atualizar status");
      }

      toast.success("Status atualizado");
    } catch (err) {
      setItems(previous);
      toast.error(
        err instanceof Error ? err.message : "Erro ao atualizar status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Restaurantes"
        description="Gerencie restaurantes cadastrados na plataforma."
        action={
          <Button asChild>
            <Link href="/super/restaurants/new">Novo restaurante</Link>
          </Button>
        }
      />

      <RestaurantsFilters total={data.total} />

      <RestaurantsTable
        items={items}
        onStatusChange={handleStatusChange}
        updatingId={updatingId}
      />

      <RestaurantsPagination
        page={data.page}
        totalPages={data.totalPages}
        total={data.total}
        pageSize={data.pageSize}
      />
    </div>
  );
}
