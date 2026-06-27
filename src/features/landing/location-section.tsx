import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";
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
  const directionsUrl = buildDirectionsUrl(data);
  const mapEmbedUrl = buildMapEmbedUrl(data);

  if (!address && !directionsUrl) return null;

  return (
    <section
      aria-labelledby="location-heading"
      className="landing-section"
    >
      <ScrollReveal>
        <h2 id="location-heading" className="landing-heading mb-10 sm:mb-12">
          Localização
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="menu-card overflow-hidden">
          {mapEmbedUrl && (
            <div className="relative h-56 w-full sm:h-72">
              <iframe
                src={mapEmbedUrl}
                title="Mapa de localização"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}

          <div className="space-y-5 p-6 sm:p-8">
            {address && (
              <p className="flex items-start gap-3 text-sm leading-relaxed text-[#666] sm:text-base">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--menu-primary-dark)]" />
                {address}
              </p>
            )}

            {directionsUrl && (
              <Link
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[var(--menu-secondary)] shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                style={{ backgroundColor: "var(--menu-primary)" }}
              >
                <Navigation className="h-4 w-4" />
                Como chegar
              </Link>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
