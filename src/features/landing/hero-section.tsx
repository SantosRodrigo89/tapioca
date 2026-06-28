import Image from "next/image";
import { ChevronDown, Clock, MapPin, MessageCircle } from "lucide-react";
import {
  LandingBadge,
  LandingButton,
} from "@/components/public/landing";
import { formatWhatsAppLink } from "@/lib/utils";
import { getHeroLocationLabel } from "@/lib/utils/address";
import {
  formatTodayClosingLabel,
  isOpenNow,
} from "@/lib/utils/opening-hours";
import type { LandingPageData } from "@/lib/site/landing-types";
import type { SiteButton } from "@/types/site";
import { sectionLayoutProps } from "@/lib/site/section-layout-props";

interface HeroSectionProps {
  data: LandingPageData;
  variant?: string;
}

function resolveHeroButtons(
  configured: SiteButton[],
  whatsapp?: string,
): SiteButton[] {
  const hasMenuButton = configured.some(
    (b) =>
      b.href === "#cardapio" || b.label.toLowerCase().includes("cardápio"),
  );

  const defaults: SiteButton[] = [
    ...(hasMenuButton
      ? []
      : [
          {
            label: "Ver Cardápio",
            href: "#cardapio",
            variant: "outline" as const,
          },
        ]),
    ...(whatsapp
      ? [
          {
            label: "WhatsApp",
            href: formatWhatsAppLink(whatsapp),
            variant: "primary" as const,
          },
        ]
      : []),
  ];

  return configured.length > 0 ? configured : defaults;
}

function mapButtonVariant(
  variant?: SiteButton["variant"],
): "primary" | "secondary" | "hero-outline" {
  if (variant === "secondary") return "secondary";
  if (variant === "outline") return "hero-outline";
  return "primary";
}

export function HeroSection({ data, variant = "immersive" }: HeroSectionProps) {
  const { tenant, siteConfig, whatsapp } = data;
  const hero = siteConfig.hero;

  const coverImage = hero.imageUrl ?? tenant.bannerUrl ?? tenant.logoUrl;
  const title = hero.title ?? tenant.name;
  const subtitle = hero.subtitle ?? tenant.description;
  const specialties = hero.specialties?.filter(Boolean) ?? [];

  const address = siteConfig.location.address ?? tenant.address;
  const locationLabel = getHeroLocationLabel(address);

  const hoursOpen = isOpenNow(tenant.openingHours);
  const isOpen =
    hoursOpen !== null
      ? hoursOpen
      : tenant.status === "trial" || tenant.status === "active";
  const closingLabel = formatTodayClosingLabel(tenant.openingHours);

  const buttons = resolveHeroButtons(hero.buttons ?? [], whatsapp);

  return (
    <section
      id="landing-hero"
      aria-label="Apresentação"
      className="landing-hero relative"
      {...sectionLayoutProps("hero", variant)}
    >
      <div className="relative flex min-h-[92svh] flex-col justify-end sm:min-h-[88vh] lg:min-h-[90vh]">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover scale-[1.03] motion-safe:transition-transform motion-safe:duration-[20s] motion-safe:ease-out"
              aria-hidden
            />
          ) : (
            <div
              className="absolute inset-0 landing-hero-fallback"
              aria-hidden
            />
          )}
          <div className="landing-hero-overlay absolute inset-0" aria-hidden />
        </div>

        {/* Content */}
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:items-start sm:gap-7 sm:text-left lg:max-w-2xl lg:gap-8">
            {/* Status badge */}
            <LandingBadge
              variant={isOpen ? "success" : "danger"}
              className="landing-hero-status"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: isOpen
                    ? "var(--menu-success)"
                    : "var(--menu-danger)",
                }}
                aria-hidden
              />
              {isOpen ? "Aberto agora" : "Fechado"}
              {closingLabel && isOpen && (
                <span className="font-normal opacity-80"> · {closingLabel}</span>
              )}
            </LandingBadge>

            {/* Title & subtitle */}
            <div className="space-y-4">
              <h1 className="landing-display text-white">{title}</h1>
              {subtitle && (
                <p className="landing-lead mx-auto max-w-xl text-white/85 sm:mx-0">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Specialties */}
            {specialties.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {specialties.map((tag) => (
                  <LandingBadge key={tag} variant="outline">
                    {tag}
                  </LandingBadge>
                ))}
              </div>
            )}

            {/* Meta row */}
            {(locationLabel || (closingLabel && !isOpen)) && (
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/75 sm:justify-start">
                {locationLabel && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0 text-white/50" />
                    {locationLabel}
                  </span>
                )}
                {closingLabel && !isOpen && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 shrink-0 text-white/50" />
                    {closingLabel}
                  </span>
                )}
              </div>
            )}

            {/* CTAs */}
            {buttons.length > 0 && (
              <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row">
                {buttons.map((button, index) => (
                  <LandingButton
                    key={index}
                    href={button.href}
                    variant={mapButtonVariant(button.variant)}
                    size="lg"
                    className="w-full sm:w-auto"
                    icon={
                      button.label.toLowerCase().includes("whatsapp") ? (
                        <MessageCircle className="h-5 w-5 shrink-0" />
                      ) : undefined
                    }
                  >
                    {button.label}
                  </LandingButton>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
          aria-hidden
        >
          <ChevronDown className="landing-scroll-hint h-6 w-6 text-white/50" />
        </div>
      </div>
    </section>
  );
}
