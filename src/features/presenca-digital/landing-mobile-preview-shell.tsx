"use client";

import { Battery, Signal, Wifi } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import "@/app/(public)/public-menu.css";
import "@/features/presenca-digital/landing-preview.css";
import { PublicTheme } from "@/components/public/public-theme";
import { cn } from "@/lib/utils";
import type { Tenant } from "@/types";
import type { SiteConfig } from "@/types/site";

interface LandingMobilePreviewShellProps {
  tenant: Tenant;
  siteConfig: SiteConfig;
  children: ReactNode;
  className?: string;
}

function PhoneStatusBar() {
  return (
    <div
      aria-hidden
      className="phone-status-bar pointer-events-none absolute inset-x-0 top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-center px-6 pt-3 text-[11px] font-semibold leading-none text-white"
    >
      <span className="tracking-tight">9:41</span>
      <div className="phone-dynamic-island" />
      <div className="flex items-center justify-end gap-1">
        <Signal className="h-3 w-3" strokeWidth={2.5} />
        <Wifi className="h-3 w-3" strokeWidth={2.5} />
        <Battery className="h-3.5 w-3.5" strokeWidth={2.5} />
      </div>
    </div>
  );
}

export function LandingMobilePreviewShell({
  tenant,
  siteConfig,
  children,
  className,
}: LandingMobilePreviewShellProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    root.querySelectorAll(".scroll-reveal").forEach((el) => {
      el.classList.add("is-visible");
    });
  });

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-medium text-muted-foreground">
        Pré-visualização mobile
      </p>
      <div className="phone-device">
        <div aria-hidden className="phone-button phone-button--mute" />
        <div aria-hidden className="phone-button phone-button--volume-up" />
        <div aria-hidden className="phone-button phone-button--volume-down" />
        <div aria-hidden className="phone-button phone-button--power" />

        <div className="phone-bezel">
          <div className="phone-screen">
            <PhoneStatusBar />
            <div
              ref={contentRef}
              className="phone-screen-content landing-preview-root public-menu text-[14px] antialiased"
            >
              <PublicTheme tenant={tenant} siteConfig={siteConfig} />
              {children}
            </div>
            <div aria-hidden className="phone-home-indicator" />
          </div>
        </div>
      </div>
    </div>
  );
}
