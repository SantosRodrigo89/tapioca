import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { LandingButton, LandingHeading } from "@/components/public/landing";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { resolveSectionCopy } from "@/lib/site/section-copy";
import type { LandingPageData } from "@/lib/site/landing-types";

interface LocationSectionProps {
  data: LandingPageData;
}

function buildDirectionsUrl(data: LandingPageData): string | null {
  const { location } = data.siteConfig;

  if (location.directionsUrl) return location.directionsUrl;

  if (location.lat != null && location.lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
  }

  const address = location.address ?? data.tenant.address;
  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }

  return null;
}

function buildMapEmbedUrl(data: LandingPageData): string | null {
  const { location } = data.siteConfig;
  const address = location.address ?? data.tenant.address;

  if (location.lat != null && location.lng != null) {
    return `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;
  }

  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
  }

  return null;
}

export function LocationSection({ data }: LocationSectionProps) {
  const address =
    data.siteConfig.location.address ?? data.tenant.address;
  const copy = resolveSectionCopy(data.siteConfig.sectionCopy).location;
  const directionsUrl = buildDirectionsUrl(data);
  const mapEmbedUrl = buildMapEmbedUrl(data);

  if (!address && !directionsUrl) return null;

  return (
    <section
      aria-labelledby="location-heading"
      id="localizacao"
      className="landing-section location-section"
    >
      <ScrollReveal>
        <LandingHeading
          align="center"
          title={copy.title}
          titleId="location-heading"
          subtitle={copy.subtitle}
        />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="location-block mt-8 sm:mt-10">
          {mapEmbedUrl && (
            <div className="location-map">
              <iframe
                src={mapEmbedUrl}
                title="Mapa de localização"
                className="location-map__iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}

          <div className="location-details">
            {address && (
              <p className="location-details__address">
                <MapPin className="h-5 w-5 shrink-0 text-[var(--menu-primary-dark)]" aria-hidden />
                <span>{address}</span>
              </p>
            )}

            {directionsUrl && (
              <LandingButton
                href={directionsUrl}
                variant="primary"
                size="md"
                icon={<Navigation className="h-4 w-4 shrink-0" aria-hidden />}
                className="location-details__cta w-full sm:w-auto"
                ariaLabel="Como chegar"
              >
                Como chegar
              </LandingButton>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
