"use client";

import type { ReactNode } from "react";
import {
  bandVariantToClass,
  resolveBandVariant,
} from "@/lib/site/section-bands";
import { resolveTemplateLayout } from "@/lib/site/template-registry";
import type { Tenant } from "@/types";
import type { SiteSectionId } from "@/types/site";

const BANDED_SECTIONS = new Set<SiteSectionId>([
  "about",
  "differentials",
  "featured",
  "menu",
  "gallery",
  "contact",
  "location",
]);

interface LandingPreviewBandProps {
  tenant: Tenant;
  sectionId: SiteSectionId;
  bandIndex?: number;
  children: ReactNode;
}

export function LandingPreviewBand({
  tenant,
  sectionId,
  bandIndex = 0,
  children,
}: LandingPreviewBandProps) {
  if (!BANDED_SECTIONS.has(sectionId)) {
    return <div className="landing-container">{children}</div>;
  }

  const layout = resolveTemplateLayout(tenant.templateId);
  const variant = resolveBandVariant(
    sectionId,
    bandIndex,
    layout.bandOverrides,
  );

  return (
    <div className={`landing-section-band ${bandVariantToClass(variant)}`}>
      <div className="landing-container">{children}</div>
    </div>
  );
}
