import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Clock,
  FolderTree,
  Globe,
  ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  MessageCircle,
  Package,
  Palette,
  Phone,
  QrCode,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { BRAND_DOMAIN_FALLBACK } from "@/lib/brand";

export const MARKETING_CONTACT_EMAIL = `contato@${BRAND_DOMAIN_FALLBACK}`;

export const MARKETING_NAV = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#segmentos", label: "Segmentos" },
  { href: "#precos", label: "Preços" },
  { href: "#contato", label: "Contato" },
] as const;

export const MARKETING_SEGMENTS = [
  { emoji: "🍔", label: "Hamburguerias" },
  { emoji: "🍕", label: "Pizzarias" },
  { emoji: "🍺", label: "Bares" },
  { emoji: "☕", label: "Cafeterias" },
  { emoji: "🥩", label: "Churrascarias" },
  { emoji: "🍰", label: "Docerias" },
  { emoji: "🍨", label: "Açaíterias" },
] as const;

export const MARKETING_STEPS = [
  {
    step: 1,
    title: "Cadastre seu restaurante",
    description: "Crie sua conta e configure os dados básicos em poucos minutos.",
  },
  {
    step: 2,
    title: "Personalize sua Landing",
    description: "Escolha cores, banner, seções e conteúdo que representam sua marca.",
  },
  {
    step: 3,
    title: "Organize seu cardápio",
    description: "Cadastre categorias, produtos e opções configuráveis com preços claros.",
  },
  {
    step: 4,
    title: "Compartilhe seu QR Code",
    description: "Disponibilize seu link e QR Code nas mesas, redes e materiais impressos.",
  },
  {
    step: 5,
    title: "Atualize tudo quando quiser",
    description: "Mude preços, fotos e disponibilidade em tempo real, sem depender de terceiros.",
  },
] as const;

export type MarketingFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  comingSoon?: boolean;
};

export const MARKETING_FEATURES: MarketingFeature[] = [
  {
    icon: LayoutTemplate,
    title: "Landing Page",
    description: "Site profissional mobile-first com seções configuráveis para apresentar seu restaurante.",
  },
  {
    icon: ShoppingBag,
    title: "Cardápio Digital",
    description: "Cardápio organizado por categorias, com destaques e navegação fluida para seus clientes.",
  },
  {
    icon: QrCode,
    title: "QR Code",
    description: "Gere e baixe QR Codes prontos para mesas, balcão e materiais de divulgação.",
  },
  {
    icon: ImageIcon,
    title: "Galeria",
    description: "Mostre fotos do ambiente, pratos e momentos que reforçam a identidade do seu negócio.",
  },
  {
    icon: Package,
    title: "Produtos Configuráveis",
    description: "Tamanhos, adicionais e variações com preços claros — do simples ao mais completo.",
  },
  {
    icon: FolderTree,
    title: "Categorias",
    description: "Organize o cardápio em seções, com ordem personalizada e controle de visibilidade.",
  },
  {
    icon: Phone,
    title: "Contato",
    description: "WhatsApp, endereço, horários e mapa integrados para facilitar o contato dos clientes.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel Administrativo",
    description: "Gerencie site, cardápio e aparência em um painel simples, feito para o dia a dia.",
  },
  {
    icon: Search,
    title: "SEO",
    description: "Título, descrição e imagem de compartilhamento configuráveis para cada restaurante.",
  },
  {
    icon: Settings2,
    title: "Gestão Simples",
    description: "Fluxos diretos, sem complexidade desnecessária — você foca no restaurante, não na ferramenta.",
  },
  {
    icon: Globe,
    title: "Domínio Personalizado",
    description: "Use seu próprio domínio para reforçar a marca do estabelecimento.",
    comingSoon: true,
  },
  {
    icon: MessageCircle,
    title: "Pedidos Online",
    description: "Receba pedidos diretamente pela plataforma, além do WhatsApp.",
    comingSoon: true,
  },
];

export const MARKETING_BENEFITS = [
  {
    icon: Sparkles,
    title: "Mais profissionalismo",
    description: "Transmita credibilidade com uma presença digital coesa e bem apresentada.",
  },
  {
    icon: BarChart3,
    title: "Mais credibilidade",
    description: "Informações claras e atualizadas aumentam a confiança antes mesmo da visita.",
  },
  {
    icon: Clock,
    title: "Informações sempre atualizadas",
    description: "Preços, horários e disponibilidade refletem a realidade do seu negócio em tempo real.",
  },
  {
    icon: Palette,
    title: "Experiência moderna",
    description: "Ofereça uma navegação fluida no celular — onde seus clientes realmente estão.",
  },
  {
    icon: MessageCircle,
    title: "Facilidade para seus clientes",
    description: "Cardápio, contato e localização acessíveis em um único link ou QR Code.",
  },
  {
    icon: Globe,
    title: "Menos dependência das redes sociais",
    description: "Sua presença não fica presa a algoritmos — você controla o que mostra e quando.",
  },
  {
    icon: LayoutTemplate,
    title: "Sua marca em destaque",
    description: "Cores, conteúdo e identidade visual alinhados ao que torna seu restaurante único.",
  },
] as const;

export const MARKETING_COMPARISON = {
  without: [
    "Cardápio em PDF desatualizado",
    "Informações espalhadas em vários lugares",
    "Dependência exclusiva das redes sociais",
    "Atualização difícil e demorada",
  ],
  with: [
    "Site profissional dedicado ao restaurante",
    "Cardápio digital organizado e acessível",
    "QR Code para mesas e materiais impressos",
    "Atualizações rápidas pelo painel",
    "Presença digital completa em um só lugar",
  ],
} as const;

export const MARKETING_FOOTER_LINKS = {
  produto: [
    { href: "#recursos", label: "Recursos" },
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#demonstracao", label: "Demonstração" },
    { href: "#precos", label: "Preços" },
  ],
  empresa: [
    { href: "#contato", label: "Contato" },
    { href: "/privacidade", label: "Política de Privacidade" },
    { href: "/termos", label: "Termos de Uso" },
  ],
} as const;

export const MARKETING_SOCIAL = {
  instagram: "https://instagram.com/mesio",
  linkedin: "#",
} as const;

export function getDemoMailtoUrl(): string {
  const subject = encodeURIComponent("Solicitar demonstração — Mesio");
  const body = encodeURIComponent(
    "Olá! Gostaria de conhecer a plataforma Mesio para o meu restaurante.\n\nNome do restaurante:\nCidade:\nTelefone:",
  );
  return `mailto:${MARKETING_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
