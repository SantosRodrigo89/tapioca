import Image from "next/image";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import {
  LandingBadge,
  LandingButton,
} from "@/components/public/landing";
import type { HeroSectionContentProps } from "./hero-section-immersive";

export function HeroSectionCompact({
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
    <div className="landing-hero-compact">
      <div className="landing-hero-compact__media">
        {coverImage ? (
          <Image
            src={coverImage}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
            aria-hidden
          />
        ) : (
          <div className="landing-hero-fallback h-full w-full" aria-hidden />
        )}
        <div className="landing-hero-compact__media-overlay" aria-hidden />
      </div>

      <div className="landing-hero-compact__panel">
        <LandingBadge
          variant={isOpen ? "success" : "danger"}
          className="landing-hero-status w-fit"
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

        <div className="space-y-3">
          <h1 className="landing-hero-compact__title">{title}</h1>
          {subtitle && (
            <p className="landing-hero-compact__subtitle">{subtitle}</p>
          )}
        </div>

        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {specialties.map((tag) => (
              <LandingBadge key={tag} variant="muted">
                {tag}
              </LandingBadge>
            ))}
          </div>
        )}

        {(locationLabel || (closingLabel && !isOpen)) && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--menu-text-muted)]">
            {locationLabel && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 opacity-60" />
                {locationLabel}
              </span>
            )}
            {closingLabel && !isOpen && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0 opacity-60" />
                {closingLabel}
              </span>
            )}
          </div>
        )}

        {buttons.length > 0 && (
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            {buttons.map((button, index) => (
              <LandingButton
                key={index}
                href={button.href}
                variant={
                  mapButtonVariant(button.variant) === "hero-outline"
                    ? "outline"
                    : mapButtonVariant(button.variant)
                }
                size="md"
                className="w-full sm:w-auto"
                icon={
                  button.label.toLowerCase().includes("whatsapp") ? (
                    <MessageCircle className="h-4 w-4 shrink-0" />
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
  );
}
