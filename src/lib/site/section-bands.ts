import type { SiteSectionId } from "@/types/site";

export type LandingBandVariant = "white" | "tinted" | "surface";

const BAND_CYCLE: LandingBandVariant[] = ["white", "tinted", "surface"];

const SECTION_BAND_OVERRIDES: Partial<Record<SiteSectionId, LandingBandVariant>> =
  {
    gallery: "surface",
    menu: "white",
  };

export function resolveBandVariant(
  sectionId: SiteSectionId,
  bandIndex: number,
): LandingBandVariant {
  return (
    SECTION_BAND_OVERRIDES[sectionId] ??
    BAND_CYCLE[bandIndex % BAND_CYCLE.length]
  );
}

export function bandVariantToClass(variant: LandingBandVariant): string {
  switch (variant) {
    case "tinted":
      return "landing-section-band--tinted";
    case "surface":
      return "landing-section-band--surface";
    default:
      return "landing-section-band--white";
  }
}
