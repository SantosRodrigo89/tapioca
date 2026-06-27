import type { FeatureId, PlatformFeature } from "@/types/platform";

export const FEATURE_IDS: FeatureId[] = [
  "landing_page",
  "qr_code",
  "gallery",
  "products",
  "categories",
  "premium_themes",
  "orders",
  "analytics",
  "ai",
  "crm",
  "custom_domain",
  "marketing",
  "reservations",
];

export const DEFAULT_PLATFORM_FEATURES: Omit<
  PlatformFeature,
  "createdAt" | "updatedAt"
>[] = [
  {
    id: "landing_page",
    name: "Landing Page",
    description: "Página pública do restaurante",
    category: "core",
    globalEnabled: true,
    defaultEnabled: true,
    order: 0,
  },
  {
    id: "qr_code",
    name: "QR Code",
    description: "Geração e download de QR Code",
    category: "core",
    globalEnabled: true,
    defaultEnabled: true,
    order: 1,
  },
  {
    id: "gallery",
    name: "Galeria",
    description: "Galeria de fotos na landing page",
    category: "core",
    globalEnabled: true,
    defaultEnabled: true,
    order: 2,
  },
  {
    id: "products",
    name: "Produtos",
    description: "Cadastro de produtos no cardápio",
    category: "core",
    globalEnabled: true,
    defaultEnabled: true,
    order: 3,
  },
  {
    id: "categories",
    name: "Categorias",
    description: "Organização do cardápio por categorias",
    category: "core",
    globalEnabled: true,
    defaultEnabled: true,
    order: 4,
  },
  {
    id: "premium_themes",
    name: "Temas Premium",
    description: "Temas visuais avançados",
    category: "premium",
    globalEnabled: true,
    defaultEnabled: true,
    order: 5,
  },
  {
    id: "orders",
    name: "Pedidos",
    description: "Pedidos online (futuro)",
    category: "future",
    globalEnabled: false,
    defaultEnabled: false,
    order: 6,
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Métricas e visualizações (futuro)",
    category: "future",
    globalEnabled: false,
    defaultEnabled: false,
    order: 7,
  },
  {
    id: "ai",
    name: "IA",
    description: "Recursos de inteligência artificial (futuro)",
    category: "future",
    globalEnabled: false,
    defaultEnabled: false,
    order: 8,
  },
  {
    id: "crm",
    name: "CRM",
    description: "Gestão de clientes (futuro)",
    category: "future",
    globalEnabled: false,
    defaultEnabled: false,
    order: 9,
  },
  {
    id: "custom_domain",
    name: "Domínio Próprio",
    description: "Domínio customizado para o restaurante",
    category: "growth",
    globalEnabled: true,
    defaultEnabled: true,
    order: 10,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Ferramentas de marketing (futuro)",
    category: "future",
    globalEnabled: false,
    defaultEnabled: false,
    order: 11,
  },
  {
    id: "reservations",
    name: "Reservas",
    description: "Sistema de reservas (futuro)",
    category: "future",
    globalEnabled: false,
    defaultEnabled: false,
    order: 12,
  },
];

export function buildDefaultFeatureMap(
  enabled: boolean,
): Partial<Record<FeatureId, boolean>> {
  return Object.fromEntries(
    FEATURE_IDS.map((id) => [id, enabled]),
  ) as Partial<Record<FeatureId, boolean>>;
}

export const ALL_FEATURES_ENABLED = buildDefaultFeatureMap(true);
