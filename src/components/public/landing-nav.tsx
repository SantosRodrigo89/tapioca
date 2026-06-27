"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { LandingButton } from "@/components/public/landing";
import { cn } from "@/lib/utils";
import { formatWhatsAppLink } from "@/lib/utils";
import type { LandingNavItem } from "@/lib/site/landing-nav";

interface LandingNavProps {
  items: LandingNavItem[];
  tenantName: string;
  tenantLogo?: string;
  whatsapp?: string;
  heroSelector?: string;
}

export function LandingNav({
  items,
  tenantName,
  tenantLogo,
  whatsapp,
  heroSelector = "#landing-hero",
}: LandingNavProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(items[0]?.targetId ?? "");
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    const hero = document.querySelector(heroSelector);
    if (!hero) {
      setIsOverHero(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsOverHero(entry.isIntersecting),
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroSelector]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const root = header.closest(".public-menu") as HTMLElement | null;
    if (!root) return;

    const navRoot = root;
    const navHeader = header;

    function syncNavOffset() {
      navRoot.style.setProperty(
        "--landing-nav-offset",
        `${navHeader.offsetHeight}px`,
      );
    }

    syncNavOffset();
    const ro = new ResizeObserver(syncNavOffset);
    ro.observe(header);
    return () => ro.disconnect();
  }, [isOverHero, items.length, whatsapp]);

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.targetId))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  function handleClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(targetId);
    }
  }

  const showBrand = !isOverHero;
  const hasNavLinks = items.length > 0;

  if (!hasNavLinks && !whatsapp) return null;

  return (
    <header
      ref={headerRef}
      className={cn(
        "landing-nav fixed top-0 z-50 w-full transition-all duration-300",
        isOverHero ? "landing-nav--overlay" : "landing-nav--solid",
        showBrand && "landing-nav--with-brand",
      )}
    >
      <div className="landing-container landing-nav-inner landing-nav-inner--row">
        {/* Brand — aparece após sair do hero */}
        {showBrand && (
          <div className="landing-nav-brand flex min-w-0 shrink-0 items-center gap-2.5">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-[var(--menu-border)] bg-white shadow-sm">
              {tenantLogo ? (
                <Image
                  src={tenantLogo}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-sm font-bold text-[var(--menu-primary-foreground)]"
                  style={{ backgroundColor: "var(--menu-primary)" }}
                  aria-hidden
                >
                  {tenantName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="landing-nav-brand-name truncate text-sm font-semibold text-[var(--menu-secondary)] sm:text-base">
              {tenantName}
            </span>
          </div>
        )}

        {/* Links de seção */}
        {hasNavLinks && (
          <nav
            aria-label="Navegação da página"
            className="landing-nav-links scrollbar-hide min-w-0 flex-1 overflow-x-auto"
          >
            <div
              className={cn(
                "flex w-max items-center gap-1 sm:gap-1.5",
                isOverHero ? "mx-auto sm:justify-center" : "sm:mx-auto",
              )}
            >
              {items.map((item) => (
                <a
                  key={item.targetId}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.targetId)}
                  className={cn(
                    "landing-nav-link shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-300 sm:px-4 sm:py-2",
                    isOverHero && "landing-nav-link--overlay",
                    activeId === item.targetId &&
                      (isOverHero
                        ? "landing-nav-link--overlay-active"
                        : "landing-nav-link--active"),
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* CTA WhatsApp — apenas desktop */}
        {whatsapp && showBrand && (
          <LandingButton
            href={formatWhatsAppLink(whatsapp)}
            variant="primary"
            size="sm"
            icon={<MessageCircle className="h-4 w-4 shrink-0" aria-hidden />}
            className="landing-nav-whatsapp shrink-0"
            ariaLabel="Pedir pelo WhatsApp"
          >
            WhatsApp
          </LandingButton>
        )}
      </div>
    </header>
  );
}
