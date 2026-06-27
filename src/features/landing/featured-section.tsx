import { HighlightsSection } from "@/components/public/highlights-section";
import type { LandingPageData } from "@/lib/site/landing-types";

interface FeaturedSectionProps {
  data: LandingPageData;
}

export function FeaturedSection({ data }: FeaturedSectionProps) {
  if (data.highlights.length === 0) return null;

  return (
    <HighlightsSection
      entries={data.highlights}
      whatsapp={data.whatsapp}
    />
  );
}
