import { HighlightsSection } from "@/components/public/highlights-section";
import { resolveSectionCopy } from "@/lib/site/section-copy";
import type { LandingPageData } from "@/lib/site/landing-types";

interface FeaturedSectionProps {
  data: LandingPageData;
  variant?: string;
}

export function FeaturedSection({ data, variant = "carousel-hero" }: FeaturedSectionProps) {
  if (data.highlights.length === 0) return null;

  const copy = resolveSectionCopy(data.siteConfig.sectionCopy).featured;

  return (
    <HighlightsSection entries={data.highlights} copy={copy} layoutVariant={variant} />
  );
}
