"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMenuAuth } from "@/features/cardapio/use-menu-auth";
import { AppearanceTab } from "@/features/presenca-digital/appearance-tab";
import { BannerTab } from "@/features/presenca-digital/banner-tab";
import { AboutTab } from "@/features/presenca-digital/about-tab";
import { DifferentialsTab } from "@/features/presenca-digital/differentials-tab";
import { FeaturedTab } from "@/features/presenca-digital/featured-tab";
import { GalleryTab } from "@/features/presenca-digital/gallery-tab";
import { ContactTab } from "@/features/presenca-digital/contact-tab";
import { HoursTab } from "@/features/presenca-digital/hours-tab";
import { SeoTab } from "@/features/presenca-digital/seo-tab";
import { QrTab } from "@/features/presenca-digital/qr-tab";
import type { CategoryWithItems } from "@/components/admin/highlights-settings";
import type { GalleryImage, SiteConfig, Tenant } from "@/types";

type TabId =
  | "appearance"
  | "banner"
  | "about"
  | "differentials"
  | "featured"
  | "gallery"
  | "contact"
  | "hours"
  | "seo"
  | "qr";

const TABS: { id: TabId; label: string; hash?: string }[] = [
  { id: "appearance", label: "Aparência" },
  { id: "banner", label: "Banner" },
  { id: "about", label: "Sobre" },
  { id: "differentials", label: "Diferenciais" },
  { id: "featured", label: "Produtos em Destaque" },
  { id: "gallery", label: "Galeria" },
  { id: "contact", label: "Contato" },
  { id: "hours", label: "Horários" },
  { id: "seo", label: "SEO" },
  { id: "qr", label: "QR Code", hash: "qr-code" },
];

function tabFromHash(hash: string): TabId {
  const normalized = hash.replace(/^#/, "");
  const match = TABS.find((t) => t.hash === normalized || t.id === normalized);
  return match?.id ?? "appearance";
}

interface SiteEditorProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  categories: CategoryWithItems[];
  gallery: GalleryImage[];
  publicUrl: string;
}

export function SiteEditor({
  tenant: initialTenant,
  siteConfig: initialSiteConfig,
  categories,
  gallery,
  publicUrl,
}: SiteEditorProps) {
  useMenuAuth();

  const [tenant, setTenant] = useState(initialTenant);
  const [siteConfig, setSiteConfig] = useState(initialSiteConfig);
  const [activeTab, setActiveTab] = useState<TabId>("appearance");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) setActiveTab(tabFromHash(hash));
  }, []);

  const selectTab = useCallback((tab: TabId) => {
    setActiveTab(tab);
    const tabDef = TABS.find((t) => t.id === tab);
    const hash = tabDef?.hash ?? tab;
    window.history.replaceState(null, "", `#${hash}`);
  }, []);

  const handleTenantChange = useCallback((patch: Partial<Tenant>) => {
    setTenant((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSiteConfigChange = useCallback((config: SiteConfig) => {
    setSiteConfig(config);
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Presença Digital</h1>
        <p className="text-sm text-muted-foreground">
          Configure a landing page de {tenant.name}.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex w-full gap-1 overflow-x-auto pb-1 md:w-48 md:shrink-0 md:flex-col md:overflow-visible md:pb-0">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id)}
              className={cn(
                "shrink-0 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 rounded-xl border border-border/60 bg-card p-6">
          {activeTab === "appearance" && (
            <AppearanceTab
              tenant={tenant}
              siteConfig={siteConfig}
              onTenantChange={handleTenantChange}
              onSiteConfigChange={handleSiteConfigChange}
            />
          )}
          {activeTab === "banner" && (
            <BannerTab
              tenant={tenant}
              siteConfig={siteConfig}
              onTenantChange={handleTenantChange}
              onSiteConfigChange={handleSiteConfigChange}
            />
          )}
          {activeTab === "about" && (
            <AboutTab
              tenant={tenant}
              siteConfig={siteConfig}
              onTenantChange={handleTenantChange}
              onSiteConfigChange={handleSiteConfigChange}
            />
          )}
          {activeTab === "differentials" && (
            <DifferentialsTab
              tenant={tenant}
              siteConfig={siteConfig}
              onSiteConfigChange={handleSiteConfigChange}
            />
          )}
          {activeTab === "featured" && (
            <FeaturedTab
              tenant={tenant}
              siteConfig={siteConfig}
              categories={categories}
              onTenantChange={handleTenantChange}
              onSiteConfigChange={handleSiteConfigChange}
            />
          )}
          {activeTab === "gallery" && (
            <GalleryTab tenantId={tenant.id} initialImages={gallery} />
          )}
          {activeTab === "contact" && (
            <ContactTab
              tenant={tenant}
              siteConfig={siteConfig}
              onTenantChange={handleTenantChange}
              onSiteConfigChange={handleSiteConfigChange}
            />
          )}
          {activeTab === "hours" && <HoursTab tenant={tenant} />}
          {activeTab === "seo" && (
            <SeoTab
              tenant={tenant}
              siteConfig={siteConfig}
              onSiteConfigChange={handleSiteConfigChange}
            />
          )}
          {activeTab === "qr" && (
            <QrTab publicUrl={publicUrl} slug={tenant.slug} />
          )}
        </div>
      </div>
    </div>
  );
}
