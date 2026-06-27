import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { formatWhatsAppLink } from "@/lib/utils";
import { getHeroLocationLabel } from "@/lib/utils/address";
import {
  formatTodayClosingLabel,
  isOpenNow,
} from "@/lib/utils/opening-hours";
import type { LandingPageData } from "@/lib/site/landing-types";
import type { SiteButton } from "@/types/site";

interface HeroSectionProps {
  data: LandingPageData;
}

function HeroButton({
  button,
  variant = "primary",
}: {
  button: SiteButton;
  variant?: "primary" | "outline" | "secondary";
}) {
  const resolved = button.variant ?? variant;
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] sm:w-auto";

  if (resolved === "outline") {
    return (
      <Link
        href={button.href}
        className={`${base} border-2 border-white/80 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20`}
      >
        {button.label}
      </Link>
    );
  }

  if (resolved === "secondary") {
    return (
      <Link
        href={button.href}
        className={`${base} bg-white text-[var(--menu-secondary)] shadow-md hover:shadow-lg`}
      >
        {button.label}
      </Link>
    );
  }

  return (
    <Link
      href={button.href}
      className={`${base} text-[var(--menu-secondary)] shadow-md hover:shadow-lg`}
      style={{ backgroundColor: "var(--menu-primary)" }}
    >
      {button.label}
    </Link>
  );
}

export function HeroSection({ data }: HeroSectionProps) {
  const { tenant, siteConfig, whatsapp } = data;
  const hero = siteConfig.hero;

  const coverImage = hero.imageUrl ?? tenant.bannerUrl ?? tenant.logoUrl;
  const title = hero.title ?? tenant.name;
  const subtitle = hero.subtitle ?? tenant.description;

  const address = siteConfig.location.address ?? tenant.address;
  const locationLabel = getHeroLocationLabel(address);

  const hoursOpen = isOpenNow(tenant.openingHours);
  const isOpen =
    hoursOpen !== null
      ? hoursOpen
      : tenant.status === "trial" || tenant.status === "active";
  const closingLabel = formatTodayClosingLabel(tenant.openingHours);

  const configuredButtons = hero.buttons ?? [];
  const hasMenuButton = configuredButtons.some(
    (b) => b.href === "#cardapio" || b.label.toLowerCase().includes("cardápio"),
  );

  const defaultButtons: SiteButton[] = [
    ...(hasMenuButton
      ? []
      : [{ label: "Ver Cardápio", href: "#cardapio", variant: "outline" as const }]),
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

  const buttons =
    configuredButtons.length > 0 ? configuredButtons : defaultButtons;

  return (
    <section aria-label="Apresentação" className="relative">
      <div className="relative flex min-h-[65vh] flex-col justify-end sm:min-h-[75vh] lg:min-h-[85vh]">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover scale-105"
              aria-hidden
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, var(--menu-primary) 0%, #e8a234 50%, var(--menu-secondary) 100%)`,
              }}
              aria-hidden
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
        </div>

        {/* Content overlay */}
        <div className="relative mx-auto w-full max-w-5xl px-4 pb-10 pt-32 sm:px-6 sm:pb-14 sm:pt-40">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            {/* Logo */}
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl sm:h-28 sm:w-28">
              {tenant.logoUrl ? (
                <Image
                  src={tenant.logoUrl}
                  alt={`Logo ${tenant.name}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-3xl font-bold text-[var(--menu-secondary)]"
                  style={{ background: "var(--menu-primary)" }}
                >
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Title & subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mx-auto max-w-2xl line-clamp-2 text-base leading-relaxed text-white/80 sm:text-lg">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Meta row — rating slot reserved for future data */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/90">
              {locationLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-white/70" />
                  {locationLabel}
                </span>
              )}

              {closingLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 shrink-0 text-white/70" />
                  {closingLabel}
                </span>
              )}

              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: isOpen
                    ? "color-mix(in srgb, var(--menu-success) 25%, transparent)"
                    : "color-mix(in srgb, var(--menu-danger) 25%, transparent)",
                  color: isOpen ? "#86efac" : "#fca5a5",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: isOpen
                      ? "var(--menu-success)"
                      : "var(--menu-danger)",
                  }}
                />
                {isOpen ? "Aberto agora" : "Fechado"}
              </span>
            </div>

            {/* CTAs */}
            {buttons.length > 0 && (
              <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
                {buttons.map((button, index) =>
                  button.label.toLowerCase().includes("whatsapp") ? (
                    <Link
                      key={index}
                      href={button.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[var(--menu-secondary)] shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98] sm:w-auto"
                      style={{ backgroundColor: "var(--menu-primary)" }}
                    >
                      <MessageCircle className="h-5 w-5" />
                      {button.label}
                    </Link>
                  ) : (
                    <HeroButton key={index} button={button} />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
