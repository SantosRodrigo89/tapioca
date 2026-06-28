"use client";

import type { ReactNode } from "react";
import { LandingMobilePreviewShell } from "@/features/presenca-digital/landing-mobile-preview-shell";
import { LandingPreviewBand } from "@/features/presenca-digital/landing-preview-band";
import type { Tenant } from "@/types";
import type { SiteConfig, SiteSectionId } from "@/types/site";

interface LandingSectionPreviewProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  sectionId: SiteSectionId;
  bandIndex?: number;
  children: ReactNode;
  className?: string;
}

export function LandingSectionPreview({
  tenant,
  siteConfig,
  sectionId,
  bandIndex = 0,
  children,
  className,
}: LandingSectionPreviewProps) {
  return (
    <LandingMobilePreviewShell
      tenant={tenant}
      siteConfig={siteConfig}
      className={className}
    >
      <LandingPreviewBand
        tenant={tenant}
        sectionId={sectionId}
        bandIndex={bandIndex}
      >
        {children}
      </LandingPreviewBand>
    </LandingMobilePreviewShell>
  );
}
