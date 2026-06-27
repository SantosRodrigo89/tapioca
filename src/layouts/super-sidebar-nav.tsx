"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Mail,
  CreditCard,
  ToggleLeft,
  LayoutTemplate,
  BarChart3,
  ScrollText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { href: "/super", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/super/restaurants", label: "Restaurantes", icon: Store },
  { href: "/super/invites", label: "Convites", icon: Mail },
  { href: "/super/plans", label: "Planos", icon: CreditCard },
  { href: "/super/features", label: "Recursos", icon: ToggleLeft },
  { href: "/super/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/super/metrics", label: "Métricas", icon: BarChart3 },
  { href: "/super/logs", label: "Logs", icon: ScrollText },
  { href: "/super/settings", label: "Configurações", icon: Settings },
];

interface SuperSidebarNavProps {
  onNavigate?: () => void;
  className?: string;
}

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function SuperSidebarNav({
  onNavigate,
  className,
}: SuperSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1 p-2 flex-1", className)}>
      {navLinks.map(({ href, label, icon: Icon, exact }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(pathname, href, exact)
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
