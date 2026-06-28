import { describe, expect, it } from "vitest";
import {
  buildSectionCopyPatch,
  buildSectionCopySavePatch,
  DEFAULT_SECTION_COPY,
  mergeSectionCopyPatch,
  resolveSectionCopy,
  resolveSectionCopyOverride,
} from "@/lib/site/section-copy";
import { createDefaultSiteConfig, mergeSiteConfigPatch } from "@/services/site.service";

describe("section-copy about eyebrow", () => {
  it("persists custom eyebrow via buildSectionCopyPatch + mergeSiteConfigPatch", () => {
    const patch = buildSectionCopyPatch("about", { eyebrow: "Nossa história 2" });
    expect(patch).toEqual({ about: { eyebrow: "Nossa história 2" } });

    const base = createDefaultSiteConfig();
    const merged = mergeSiteConfigPatch(base, { sectionCopy: patch });

    expect(merged.sectionCopy).toEqual({ about: { eyebrow: "Nossa história 2" } });
    expect(resolveSectionCopy(merged.sectionCopy).about.eyebrow).toBe(
      "Nossa história 2",
    );
  });

  it("omits eyebrow when form matches platform default", () => {
    const patch = buildSectionCopyPatch("about", {
      eyebrow: DEFAULT_SECTION_COPY.about.eyebrow,
    });
    expect(patch).toEqual({});
  });

  it("clears persisted override when merge receives empty section patch", () => {
    const existing = { about: { eyebrow: "Nossa história 2" } };
    const cleared = mergeSectionCopyPatch(existing, { about: {} });
    expect(cleared).toEqual({});
  });

  it("does not clear persisted override when save patch is empty", () => {
    const existing = { about: { eyebrow: "Nossa história 2" } };
    const unchanged = mergeSectionCopyPatch(existing, {});
    expect(unchanged).toEqual(existing);
  });

  it("buildSectionCopySavePatch clears override when form restores default", () => {
    const existing = { about: { eyebrow: "Nossa história 2" } };
    const patch = buildSectionCopySavePatch(
      "about",
      { eyebrow: "" },
      existing,
    );
    expect(patch).toEqual({ about: {} });
  });

  it("resolveSectionCopyOverride treats empty and default as undefined", () => {
    expect(
      resolveSectionCopyOverride("", DEFAULT_SECTION_COPY.about.eyebrow),
    ).toBeUndefined();
    expect(
      resolveSectionCopyOverride(
        DEFAULT_SECTION_COPY.about.eyebrow,
        DEFAULT_SECTION_COPY.about.eyebrow,
      ),
    ).toBeUndefined();
    expect(
      resolveSectionCopyOverride(
        "Nossa história 2",
        DEFAULT_SECTION_COPY.about.eyebrow,
      ),
    ).toBe("Nossa história 2");
  });
});
