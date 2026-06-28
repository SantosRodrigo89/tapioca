import type {
  SiteContactSectionCopy,
  SiteSectionCopy,
  SiteSectionHeadingCopy,
} from "@/types/site";

export const DEFAULT_SECTION_COPY = {
  about: {
    eyebrow: "Nossa história",
  },
  differentials: {
    title: "Por que escolher a gente",
    subtitle: "O que torna nossa experiência especial",
  },
  featured: {
    title: "Destaques da Casa",
    subtitle: "Os favoritos dos nossos clientes",
  },
  menu: {
    title: "Nosso Cardápio",
    subtitle:
      "Conheça nossas especialidades preparadas com ingredientes selecionados.",
  },
  gallery: {
    title: "Galeria",
    subtitle: "Momentos e sabores do nosso restaurante",
  },
  contact: {
    title: "Contato",
    subtitle: "Estamos prontos para atender você",
    ctaEyebrow: "Peça agora",
    ctaTitle: "Faça seu pedido pelo WhatsApp",
    ctaSubtitle: "Resposta rápida e atendimento personalizado",
  },
  location: {
    title: "Localização",
    subtitle: "Venha nos visitar",
  },
} as const satisfies Required<{
  [K in keyof SiteSectionCopy]: NonNullable<SiteSectionCopy[K]>;
}>;

export type ResolvedSectionCopy = {
  about: SiteSectionHeadingCopy & { eyebrow: string };
  differentials: SiteSectionHeadingCopy & { title: string; subtitle: string };
  featured: SiteSectionHeadingCopy & { title: string; subtitle: string };
  menu: SiteSectionHeadingCopy & { title: string; subtitle: string };
  gallery: SiteSectionHeadingCopy & { title: string; subtitle: string };
  contact: SiteContactSectionCopy & {
    title: string;
    subtitle: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaSubtitle: string;
  };
  location: SiteSectionHeadingCopy & { title: string; subtitle: string };
};

function mergeHeadingCopy<T extends SiteSectionHeadingCopy>(
  defaults: T,
  persisted?: SiteSectionHeadingCopy,
): T {
  if (!persisted) return { ...defaults };
  return {
    ...defaults,
    ...(persisted.title !== undefined ? { title: persisted.title } : {}),
    ...(persisted.subtitle !== undefined
      ? { subtitle: persisted.subtitle }
      : {}),
    ...(persisted.eyebrow !== undefined ? { eyebrow: persisted.eyebrow } : {}),
  };
}

function mergeContactCopy(
  defaults: SiteContactSectionCopy,
  persisted?: SiteContactSectionCopy,
): SiteContactSectionCopy {
  const base = mergeHeadingCopy(defaults, persisted);
  if (!persisted) return base;

  return {
    ...base,
    ...(persisted.ctaEyebrow !== undefined
      ? { ctaEyebrow: persisted.ctaEyebrow }
      : {}),
    ...(persisted.ctaTitle !== undefined
      ? { ctaTitle: persisted.ctaTitle }
      : {}),
    ...(persisted.ctaSubtitle !== undefined
      ? { ctaSubtitle: persisted.ctaSubtitle }
      : {}),
  };
}

/** Merges persisted overrides with platform defaults for landing display. */
export function resolveSectionCopy(
  persisted?: SiteSectionCopy,
): ResolvedSectionCopy {
  return {
    about: mergeHeadingCopy(DEFAULT_SECTION_COPY.about, persisted?.about),
    differentials: mergeHeadingCopy(
      DEFAULT_SECTION_COPY.differentials,
      persisted?.differentials,
    ),
    featured: mergeHeadingCopy(
      DEFAULT_SECTION_COPY.featured,
      persisted?.featured,
    ),
    menu: mergeHeadingCopy(DEFAULT_SECTION_COPY.menu, persisted?.menu),
    gallery: mergeHeadingCopy(DEFAULT_SECTION_COPY.gallery, persisted?.gallery),
    contact: mergeContactCopy(
      DEFAULT_SECTION_COPY.contact,
      persisted?.contact,
    ),
    location: mergeHeadingCopy(
      DEFAULT_SECTION_COPY.location,
      persisted?.location,
    ),
  } as ResolvedSectionCopy;
}

/** Resolves admin field value for preview and default badges. */
export function resolveFieldDisplay(
  value: string,
  defaultValue: string,
): { display: string; isDefault: boolean } {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { display: defaultValue, isDefault: true };
  }
  return { display: trimmed, isDefault: trimmed === defaultValue };
}

function trimOrUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeCopyValue(value: string, defaultValue: string): string | undefined {
  const trimmed = trimOrUndefined(value.normalize("NFC"));
  if (trimmed === undefined) return undefined;
  if (trimmed === defaultValue.normalize("NFC")) return undefined;
  return trimmed;
}

/** Normalizes an admin field to the persisted override (undefined = platform default). */
export function resolveSectionCopyOverride(
  value: string,
  defaultValue: string,
): string | undefined {
  return normalizeCopyValue(value, defaultValue);
}

/** Persists only values that differ from defaults (empty = omit). */
export function buildSectionCopyPatch<K extends keyof SiteSectionCopy>(
  section: K,
  values: NonNullable<SiteSectionCopy[K]>,
): SiteSectionCopy {
  const defaults = DEFAULT_SECTION_COPY[section];
  const patch: Record<string, string | undefined> = {};

  for (const [key, defaultValue] of Object.entries(defaults)) {
    const raw = (values as Record<string, string | undefined>)[key] ?? "";
    const override = normalizeCopyValue(raw, defaultValue);
    if (override !== undefined) {
      patch[key] = override;
    }
  }

  return Object.keys(patch).length > 0
    ? ({ [section]: patch } as SiteSectionCopy)
    : {};
}

/**
 * Builds a sectionCopy patch for admin save/preview.
 * Returns `{ [section]: {} }` when a persisted override should be cleared.
 */
export function buildSectionCopySavePatch<K extends keyof SiteSectionCopy>(
  section: K,
  values: NonNullable<SiteSectionCopy[K]>,
  existing?: SiteSectionCopy,
): SiteSectionCopy {
  const persistPatch = buildSectionCopyPatch(section, values);
  if (Object.keys(persistPatch).length > 0) {
    return persistPatch;
  }

  if (existing?.[section] === undefined) {
    return {};
  }

  const defaults = DEFAULT_SECTION_COPY[section];
  const persisted = existing[section] as Record<string, string | undefined>;

  for (const key of Object.keys(defaults)) {
    const raw = (values as Record<string, string | undefined>)[key] ?? "";
    const defaultValue = defaults[key as keyof typeof defaults];
    const override = normalizeCopyValue(raw, defaultValue);
    if (override === undefined && persisted[key] !== undefined) {
      return { [section]: {} } as SiteSectionCopy;
    }
  }

  return {};
}

export function mergeSectionCopyPatch(
  existing: SiteSectionCopy,
  patch?: SiteSectionCopy,
): SiteSectionCopy {
  if (!patch) return existing;

  const merged: SiteSectionCopy = { ...existing };

  for (const section of Object.keys(patch) as (keyof SiteSectionCopy)[]) {
    const sectionPatch = patch[section];
    if (sectionPatch === undefined) continue;

    const overrides = Object.fromEntries(
      Object.entries(sectionPatch).filter(
        ([, value]) => value !== undefined && value !== "",
      ),
    );

    if (Object.keys(overrides).length === 0) {
      delete merged[section];
    } else {
      merged[section] = overrides as NonNullable<SiteSectionCopy[typeof section]>;
    }
  }

  return merged;
}
