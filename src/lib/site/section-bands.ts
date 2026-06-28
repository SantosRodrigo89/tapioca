import type { SiteSectionId } from "@/types/site";
import type { TemplateBandOverrides } from "@/types/platform/landing-layout";

export type LandingBandVariant = "white" | "tinted" | "surface";

const BAND_CYCLE: LandingBandVariant[] = ["white", "tinted", "surface"];

const DEFAULT_BAND_OVERRIDES: TemplateBandOverrides = {
  gallery: "surface",
  menu: "white",
};

export function resolveBandVariant(
  sectionId: SiteSectionId,
  bandIndex: number,
  templateOverrides?: TemplateBandOverrides,
): LandingBandVariant {
  const overrides = templateOverrides ?? DEFAULT_BAND_OVERRIDES;
  return (
    overrides[sectionId as keyof TemplateBandOverrides] ??
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
