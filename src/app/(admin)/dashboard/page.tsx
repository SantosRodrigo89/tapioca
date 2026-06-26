import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getTenantByIdServer } from "@/lib/repositories/server/tenant.server";
import { getCategoriesByTenantServer } from "@/lib/repositories/server/category.server";
import { getItemsByCategoryServer } from "@/lib/repositories/server/menu-item.server";
import { TenantStatusBadge } from "@/components/admin/tenant-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Plus, ExternalLink } from "lucide-react";
import { getPublicUrlDisplay } from "@/lib/brand";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.tenantId) redirect("/auth/login");

  const tenant = await getTenantByIdServer(sessionUser.tenantId as string);
  if (!tenant) redirect("/auth/login");

  const categories = await getCategoriesByTenantServer(tenant.id);
  const activeCategories = categories.filter((c) => c.active);

  const itemCounts = await Promise.all(
    categories.map((c) => getItemsByCategoryServer(tenant.id, c.id)),
  );
  const totalItems = itemCounts.flat().length;
  const availableItems = itemCounts.flat().filter((i) => i.available).length;

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/${tenant.slug}`;
  const publicUrlDisplay = getPublicUrlDisplay(
    tenant.slug,
    process.env.NEXT_PUBLIC_APP_URL,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
            <TenantStatusBadge status={tenant.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {publicUrlDisplay}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/${tenant.slug}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver cardápio
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categorias ativas</CardDescription>
            <CardTitle className="text-3xl">{activeCategories.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {categories.length} no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Itens disponíveis</CardDescription>
            <CardTitle className="text-3xl">{availableItems}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {totalItems} no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Link público</CardDescription>
            <CardTitle className="text-sm font-mono truncate pt-1">
              {publicUrl}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
              <Link href={`/${tenant.slug}`} target="_blank">
                Abrir cardápio
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/catalog">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Gerenciar cardápio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/catalog?action=new-category">
              <Plus className="mr-2 h-4 w-4" />
              Nova categoria
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
