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
  enabled: boolean;
  displayOrder: number;
  options: ConfigurationOption[];
}
