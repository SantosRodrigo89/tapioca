"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  UtensilsCrossed,
  Settings,
  ExternalLink,
  FolderOpen,
  Package,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TenantEntitlements } from "@/lib/platform/entitlements";
import type { FeatureId } from "@/types/platform";

const mainLinks: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  feature?: FeatureId;
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/site", label: "Presença Digital", icon: Globe, feature: "landing_page" },
];

const menuLinks: {
  href: string;
  label: string;
  icon: typeof FolderOpen;
  feature: FeatureId;
}[] = [
  { href: "/menu/categories", label: "Categorias", icon: FolderOpen, feature: "categories" },
  { href: "/menu/products", label: "Produtos", icon: Package, feature: "products" },
  { href: "/menu/highlights", label: "Destaques", icon: Star, feature: "products" },
];

interface SidebarNavProps {
  tenantSlug: string;
  entitlements: TenantEntitlements;
  onNavigate?: () => void;
  className?: string;
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

function isFeatureEnabled(
  entitlements: TenantEntitlements,
  feature?: FeatureId,
): boolean {
  if (!feature) return true;
  return entitlements[feature] ?? false;
}

export function SidebarNav({
  tenantSlug,
  entitlements,
  onNavigate,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();
  const menuActive = pathname.startsWith("/menu");

  const visibleMainLinks = mainLinks.filter((link) =>
    isFeatureEnabled(entitlements, link.feature),
  );
  const visibleMenuLinks = menuLinks.filter((link) =>
    isFeatureEnabled(entitlements, link.feature),
  );
  const showMenuSection = visibleMenuLinks.length > 0;

  return (
    <div className={cn("flex flex-col flex-1", className)}>
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {visibleMainLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(pathname, href)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        {showMenuSection && (
          <div className="pt-2">
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                menuActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <UtensilsCrossed className="h-4 w-4 shrink-0" />
              Cardápio
            </div>
            <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l pl-2">
              {visibleMenuLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                    isActive(pathname, href)
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(pathname, "/settings")
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Configurações
        </Link>
      </nav>

      {isFeatureEnabled(entitlements, "landing_page") && (
        <div className="border-t p-2">
          <Link
            href={`/${tenantSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            Ver site público
          </Link>
        </div>
      )}
    </div>
  );
}
