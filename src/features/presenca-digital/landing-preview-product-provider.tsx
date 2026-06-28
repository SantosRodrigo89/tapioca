"use client";

import type { ReactNode } from "react";
import { ProductDetailProvider } from "@/components/public/product-detail-context";
import { resolveProductDrawerActions } from "@/lib/site/product-experience";
import type { LandingPageData } from "@/lib/site/landing-types";

interface LandingPreviewProductProviderProps {
  data: LandingPageData;
  children: ReactNode;
}

/** Wraps catalog preview sections that open the product drawer. */
export function LandingPreviewProductProvider({
  data,
  children,
}: LandingPreviewProductProviderProps) {
  const drawerActions = resolveProductDrawerActions(
    data.siteConfig,
    data.whatsapp,
  );

  return (
    <ProductDetailProvider
      tenantSlug={data.tenant.slug}
      whatsapp={data.whatsapp}
      drawerActions={drawerActions}
      categories={data.categoriesWithItems}
    >
      {children}
    </ProductDetailProvider>
  );
}
