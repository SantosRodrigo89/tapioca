export type PricingStrategy =
  | "fixed"
  | "additional"
  | "highest"
  | "average"
  | "sum"
  | "custom";

export interface ConfigurationOption {
  id: string;
  name: string;
  description?: string;
  /** Price in cents */
  price: number;
  /**
   * Preço por opção de outro grupo (ex.: tamanho).
   * Chave = id da opção de tamanho; valor = preço em centavos.
   */
  variantPrices?: Record<string, number>;
  imageUrl?: string;
  enabled: boolean;
  displayOrder: number;
}

export interface ConfigurationGroup {
  id: string;
  name: string;
  type: string;
  required: boolean;
  multiple: boolean;
  minSelections: number;
  maxSelections: number;
  pricingStrategy: PricingStrategy;
  definesBasePrice: boolean;
  /** Quando definido, opções usam variantPrices indexadas por opções deste grupo (ex.: tamanhos). */
  linkedGroupId?: string;
  enabled: boolean;
  displayOrder: number;
  options: ConfigurationOption[];
}
