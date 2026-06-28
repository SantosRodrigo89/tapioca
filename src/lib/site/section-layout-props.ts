import type { LayoutSectionId } from "@/types/platform/landing-layout";

/** HTML attrs for section layout variant hooks (CSS / future components). */
export function sectionLayoutProps(
  sectionId: LayoutSectionId,
  variant: string,
): { "data-section": LayoutSectionId; "data-layout": string } {
  return {
    "data-section": sectionId,
    "data-layout": variant,
  };
}
