import Image from "next/image";
import { ChevronDown, Clock, MapPin, MessageCircle } from "lucide-react";
import {
  LandingBadge,
  LandingButton,
} from "@/components/public/landing";
import type { SiteButton } from "@/types/site";

export interface HeroSectionContentProps {
  coverImage?: string;
  title: string;
  subtitle?: string;
  specialties: string[];
  locationLabel: string | null;
  closingLabel: string | null;
  isOpen: boolean;
  buttons: SiteButton[];
  mapButtonVariant: (
    variant?: SiteButton["variant"],
  ) => "primary" | "secondary" | "hero-outline";
}

export function HeroSectionImmersive({
  coverImage,
  title,
  subtitle,
  specialties,
  locationLabel,
  closingLabel,
  isOpen,
  buttons,
  mapButtonVariant,
}: HeroSectionContentProps) {
  return (
    <div className="relative flex min-h-[92svh] flex-col justify-end sm:min-h-[88vh] lg:min-h-[90vh]">
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

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:items-start sm:gap-7 sm:text-left lg:max-w-2xl lg:gap-8">
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

          <div className="space-y-4">
            <h1 className="landing-display text-white">{title}</h1>
            {subtitle && (
              <p className="landing-lead mx-auto max-w-xl text-white/85 sm:mx-0">
                {subtitle}
              </p>
            )}
          </div>

          {specialties.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {specialties.map((tag) => (
                <LandingBadge key={tag} variant="outline">
                  {tag}
                </LandingBadge>
              ))}
            </div>
          )}

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

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
        aria-hidden
      >
        <ChevronDown className="landing-scroll-hint h-6 w-6 text-white/50" />
      </div>
    </div>
  );
}
