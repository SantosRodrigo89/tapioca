import type { SiteConfig, SiteSectionCopy } from "@/types/site";
import type {
  LandingTemplateId,
  ResolvedTemplateLayout,
  SectionLayoutVariants,
  TemplateLayoutDefinition,
} from "@/types/platform/landing-layout";

/** Default template — current production landing (formerly "classic"). */
export const CLASSIC_TEMPLATE_ID = "restaurante" as const satisfies LandingTemplateId;

/** Baseline layout matching the implemented Fase 1–6 landing. */
export const CLASSIC_SECTION_LAYOUT: SectionLayoutVariants = {
  hero: "immersive",
  about: "editorial",
  differentials: "cards",
  featured: "carousel-hero",
  menu: "editorial",
  gallery: "asymmetric",
  contact: "split",
  location: "map-first",
  footer: "full",
};

const CLASSIC_BAND_OVERRIDES: ResolvedTemplateLayout["bandOverrides"] = {
  gallery: "surface",
  menu: "white",
};

function defineTemplate(
  definition: TemplateLayoutDefinition,
): TemplateLayoutDefinition {
  return definition;
}

/**
 * Registry of landing layout variants per SaaS template.
 * Variants map to section `variant` props + CSS `[data-section][data-layout]`.
 */
export const SECTION_REGISTRY: Record<LandingTemplateId, TemplateLayoutDefinition> =
  {
    restaurante: defineTemplate({
      id: "restaurante",
      sections: {},
    }),
    hamburgueria: defineTemplate({
      id: "hamburgueria",
      sections: {
        hero: "immersive",
        featured: "carousel-hero",
        menu: "editorial",
      },
    }),
    bar: defineTemplate({
      id: "bar",
      sections: {
        hero: "compact",
        featured: "carousel",
        menu: "editorial",
        gallery: "grid",
        contact: "stacked",
      },
      bandOverrides: {
        gallery: "surface",
        menu: "tinted",
      },
    }),
    pizzaria: defineTemplate({
      id: "pizzaria",
      sections: {
        hero: "immersive",
        featured: "carousel-hero",
        menu: "grid",
        gallery: "asymmetric",
      },
    }),
    cafeteria: defineTemplate({
      id: "cafeteria",
      sections: {
        hero: "immersive",
        about: "centered",
        featured: "carousel",
        menu: "editorial",
      },
    }),
    acai: defineTemplate({
      id: "acai",
      sections: {
        hero: "immersive",
        featured: "carousel-hero",
        menu: "grid",
        differentials: "minimal",
      },
    }),
    doceria: defineTemplate({
      id: "doceria",
      sections: {
        hero: "immersive",
        about: "centered",
        featured: "carousel-hero",
        gallery: "grid",
        footer: "minimal",
      },
    }),
  };

/** Optional section copy presets applied at tenant provisioning. */
const TEMPLATE_SECTION_COPY_PRESETS: Partial<
  Record<LandingTemplateId, SiteSectionCopy>
> = {
  pizzaria: {
    menu: {
      title: "Nossas Pizzas",
      subtitle: "Massa artesanal e ingredientes selecionados.",
    },
    featured: {
      title: "Pizzas em Destaque",
      subtitle: "Os sabores mais pedidos",
    },
  },
  bar: {
    menu: {
      title: "Cardápio",
      subtitle: "Drinks, petiscos e pratos para acompanhar.",
    },
    featured: {
      title: "Drinks & Petiscos",
      subtitle: "Os favoritos do balcão",
    },
  },
  hamburgueria: {
    menu: {
      title: "Nossos Burgers",
      subtitle: "Blend especial, pão artesanal e molhos da casa.",
    },
    featured: {
      title: "Burgers em Destaque",
    },
  },
  cafeteria: {
    menu: {
      title: "Cardápio",
      subtitle: "Cafés, bebidas e opções para acompanhar.",
    },
  },
  acai: {
    menu: {
      title: "Monte seu Açaí",
      subtitle: "Tamanhos, complementos e combinações.",
    },
  },
  doceria: {
    menu: {
      title: "Doces & Sobremesas",
      subtitle: "Feitos com carinho, todos os dias.",
    },
    featured: {
      title: "Favoritos da Vitrine",
    },
  },
};

export function isLandingTemplateId(value: string): value is LandingTemplateId {
  return value in SECTION_REGISTRY;
}

/** Maps legacy/unknown IDs to a known template (fallback: restaurante). */
export function normalizeTemplateId(
  templateId?: string | null,
): LandingTemplateId {
  if (!templateId || templateId === "classic") {
    return CLASSIC_TEMPLATE_ID;
  }
  if (isLandingTemplateId(templateId)) {
    return templateId;
  }
  return CLASSIC_TEMPLATE_ID;
}

export function resolveTemplateLayout(
  templateId?: string | null,
): ResolvedTemplateLayout {
  const id = normalizeTemplateId(templateId);
  const entry = SECTION_REGISTRY[id];

  return {
    templateId: id,
    sections: {
      ...CLASSIC_SECTION_LAYOUT,
      ...entry.sections,
    },
    bandOverrides: {
      ...CLASSIC_BAND_OVERRIDES,
      ...entry.bandOverrides,
    },
  };
}

/** Alias for documentation / call sites expecting "sections" resolution. */
export const resolveTemplateSections = resolveTemplateLayout;

export function resolveTemplateSectionVariant<
  K extends keyof SectionLayoutVariants,
>(layout: ResolvedTemplateLayout, sectionId: K): SectionLayoutVariants[K] {
  return layout.sections[sectionId];
}

export function getTemplateSiteConfigPreset(
  templateId: LandingTemplateId,
): Partial<SiteConfig> {
  const sectionCopy = TEMPLATE_SECTION_COPY_PRESETS[templateId];
  return sectionCopy ? { sectionCopy } : {};
}

export function listTemplateLayoutDefinitions(): TemplateLayoutDefinition[] {
  return Object.values(SECTION_REGISTRY);
}
