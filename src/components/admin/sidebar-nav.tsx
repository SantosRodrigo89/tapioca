"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Settings, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/catalog", label: "Cardápio", icon: UtensilsCrossed },
  { href: "/settings", label: "Configurações", icon: Settings },
];

interface SidebarNavProps {
  tenantSlug: string;
  onNavigate?: () => void;
  className?: string;
}

export function SidebarNav({
  tenantSlug,
  onNavigate,
  className,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col flex-1", className)}>
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-2">
        <Link
          href={`/${tenantSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          Ver cardápio público
        </Link>
      </div>
    </div>
  );
}
