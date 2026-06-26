"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/menu/categories", label: "Categorias" },
  { href: "/menu/products", label: "Produtos" },
  { href: "/menu/highlights", label: "Destaques" },
];

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Cardápio</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie categorias, produtos e destaques do seu cardápio.
        </p>
      </div>

      <nav className="flex gap-1 border-b">
        {tabs.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors -mb-px",
              pathname === href || pathname.startsWith(href + "/")
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
