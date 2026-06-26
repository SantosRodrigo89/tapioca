import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
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

function buildMapSearchUrl(data: LandingPageData): string | null {
  const { location } = data.siteConfig;
  const address = location.address ?? data.tenant.address;

  if (location.lat != null && location.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  }

  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  return null;
}

export function LocationSection({ data }: LocationSectionProps) {
  const address =
    data.siteConfig.location.address ?? data.tenant.address;
  const directionsUrl = buildDirectionsUrl(data);
  const mapSearchUrl = buildMapSearchUrl(data);

  if (!address && !directionsUrl) return null;

  return (
    <section
      aria-labelledby="location-heading"
      className="landing-section menu-animate-in mx-auto max-w-3xl px-4"
    >
      <h2
        id="location-heading"
        className="mb-8 text-2xl font-semibold text-[var(--menu-secondary)] sm:text-3xl"
      >
        Localização
      </h2>

      <div className="menu-card overflow-hidden">
        {mapSearchUrl && (
          <Link
            href={mapSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-40 items-center justify-center bg-[var(--menu-surface)] transition-colors hover:bg-[#eee]"
            aria-label="Ver no mapa"
          >
            <div className="flex flex-col items-center gap-2 text-[#999]">
              <MapPin className="h-8 w-8 text-[var(--menu-primary)]" />
              <span className="text-xs font-medium">Ver no Google Maps</span>
            </div>
          </Link>
        )}

        <div className="space-y-4 p-6">
          {address && (
            <p className="flex items-start gap-3 text-sm leading-relaxed text-[#666]">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--menu-primary)]" />
              {address}
            </p>
          )}

          {directionsUrl && (
            <Link
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[var(--menu-secondary)] shadow-sm transition-transform active:scale-[0.98]"
              style={{ backgroundColor: "var(--menu-primary)" }}
            >
              <Navigation className="h-4 w-4" />
              Como chegar
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
