import { HighlightsSection } from "@/components/public/highlights-section";
import type { LandingPageData } from "@/lib/site/landing-types";

interface FeaturedSectionProps {
  data: LandingPageData;
}

export function FeaturedSection({ data }: FeaturedSectionProps) {
  if (data.highlights.length === 0) return null;

  return (
    <section
      aria-label="Destaques"
      className="landing-section mx-auto max-w-3xl px-4"
    >
      <HighlightsSection
        entries={data.highlights}
        whatsapp={data.whatsapp}
      />
    </section>
  );
}
