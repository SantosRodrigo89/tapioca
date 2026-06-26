import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardStats } from "@/services/onboarding.service";

interface SummaryCardsProps {
  stats: DashboardStats;
  publicUrlDisplay: string;
}

export function SummaryCards({ stats, publicUrlDisplay }: SummaryCardsProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">Resumo</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Produtos</CardDescription>
            <CardTitle className="text-3xl">{stats.availableProducts}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.totalProducts} no total ·{" "}
              <Link href="/menu/products" className="underline underline-offset-2">
                Gerenciar
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categorias</CardDescription>
            <CardTitle className="text-3xl">{stats.activeCategories}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {stats.totalCategories} no total ·{" "}
              <Link href="/menu/categories" className="underline underline-offset-2">
                Gerenciar
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Link público</CardDescription>
            
            <CardTitle className="text-sm font-mono truncate pt-1">
              {publicUrlDisplay}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Seu site está disponível para clientes
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
