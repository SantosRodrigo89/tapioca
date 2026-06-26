import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { formatWhatsAppLink } from "@/lib/utils";
import { formatTodayHours, isOpenNow } from "@/lib/utils/opening-hours";
import type { LandingPageData } from "@/lib/site/landing-types";
import type { SiteButton } from "@/types/site";

interface HeroSectionProps {
  data: LandingPageData;
}

function HeroButton({ button }: { button: SiteButton }) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-transform active:scale-[0.98] sm:w-auto";

  if (button.variant === "outline") {
    return (
      <Link
        href={button.href}
        className={`${base} border-2 border-[var(--menu-secondary)] text-[var(--menu-secondary)]`}
      >
        {button.label}
      </Link>
    );
  }

  if (button.variant === "secondary") {
    return (
      <Link
        href={button.href}
        className={`${base} bg-[var(--menu-surface)] text-[var(--menu-secondary)] shadow-sm`}
      >
        {button.label}
      </Link>
    );
  }

  return (
    <Link
      href={button.href}
      className={`${base} text-[var(--menu-secondary)] shadow-md`}
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

  const hoursOpen = isOpenNow(tenant.openingHours);
  const isOpen =
    hoursOpen !== null
      ? hoursOpen
      : tenant.status === "trial" || tenant.status === "active";
  const todayHours = formatTodayHours(tenant.openingHours);

  const buttons =
    hero.buttons && hero.buttons.length > 0
      ? hero.buttons
      : whatsapp
        ? [
            {
              label: "Pedir pelo WhatsApp",
              href: formatWhatsAppLink(whatsapp),
              variant: "primary" as const,
            },
          ]
        : [];

  return (
    <section aria-label="Apresentação" className="relative">
      <div className="relative h-[260px] w-full overflow-hidden sm:h-[320px] md:h-[380px]">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/75" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4">
        <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:gap-6">
          <div className="flex items-end gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl sm:h-28 sm:w-28">
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
                  className="flex h-full w-full items-center justify-center text-2xl font-bold text-[var(--menu-secondary)]"
                  style={{ background: "var(--menu-primary)" }}
                >
                  {tenant.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <span
              className="mb-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: isOpen
                  ? "color-mix(in srgb, var(--menu-success) 15%, white)"
                  : "color-mix(in srgb, var(--menu-danger) 15%, white)",
                color: isOpen ? "var(--menu-success)" : "var(--menu-danger)",
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

          <div className="space-y-3">
            <h1 className="text-[32px] font-bold leading-tight tracking-tight text-[var(--menu-secondary)] sm:text-[40px]">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-2xl text-base leading-relaxed text-[#666] sm:text-lg">
                {subtitle}
              </p>
            )}
            {todayHours && (
              <p className="text-sm text-[#888]">{todayHours}</p>
            )}
          </div>

          {buttons.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {buttons.map((button, index) =>
                button.label === "Pedir pelo WhatsApp" ? (
                  <Link
                    key={index}
                    href={button.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-[var(--menu-secondary)] shadow-md transition-transform active:scale-[0.98] sm:w-auto"
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
    </section>
  );
}
