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

function trimOrUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
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
    const trimmed = trimOrUndefined(raw);
    if (trimmed !== undefined && trimmed !== defaultValue) {
      patch[key] = trimmed;
    }
  }

  return Object.keys(patch).length > 0
    ? ({ [section]: patch } as SiteSectionCopy)
    : {};
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
