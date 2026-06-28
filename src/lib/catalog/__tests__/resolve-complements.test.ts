import { describe, expect, it } from "vitest";
import {
  buildComplementConfigurationGroup,
  resolveMenuItemWithComplements,
} from "@/lib/catalog/resolve-complements";
import type { Complement, MenuItem } from "@/types";

const catalog: Complement[] = [
  {
    id: "c1",
    name: "Bacon",
    price: 400,
    enabled: true,
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "c2",
    name: "Queijo",
    price: 300,
    enabled: false,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "c3",
    name: "Ovo",
    price: 200,
    enabled: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const baseItem: MenuItem = {
  id: "item-1",
  name: "X-Burger",
  price: 2500,
  available: true,
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("buildComplementConfigurationGroup", () => {
  it("returns null when no complement ids", () => {
    expect(buildComplementConfigurationGroup([], catalog)).toBeNull();
  });

  it("builds additional pricing group from catalog", () => {
    const group = buildComplementConfigurationGroup(["c1", "c2"], catalog);
    expect(group).not.toBeNull();
    expect(group?.pricingStrategy).toBe("additional");
    expect(group?.multiple).toBe(true);
    expect(group?.options).toHaveLength(2);
    expect(group?.options[0]?.name).toBe("Bacon");
  });

  it("filters disabled complements for public display", () => {
    const group = buildComplementConfigurationGroup(["c1", "c2"], catalog, {
      publicOnly: true,
    });
    expect(group?.options).toHaveLength(1);
    expect(group?.options[0]?.id).toBe("c1");
  });

  it("orders options by global catalog order regardless of complementIds order", () => {
    const group = buildComplementConfigurationGroup(["c3", "c1"], catalog);
    expect(group?.options.map((option) => option.id)).toEqual(["c1", "c3"]);
    expect(group?.options.map((option) => option.displayOrder)).toEqual([0, 2]);
  });
});

describe("resolveMenuItemWithComplements", () => {
  it("appends complement group to existing configuration groups", () => {
    const item: MenuItem = {
      ...baseItem,
      complementIds: ["c1"],
      configurationGroups: [
        {
          id: "size",
          name: "Tamanho",
          type: "Variação",
          required: true,
          multiple: false,
          minSelections: 1,
          maxSelections: 1,
          pricingStrategy: "fixed",
          definesBasePrice: true,
          enabled: true,
          displayOrder: 0,
          options: [
            {
              id: "p",
              name: "Pequeno",
              price: 2000,
              enabled: true,
              displayOrder: 0,
            },
          ],
        },
      ],
    };

    const resolved = resolveMenuItemWithComplements(item, catalog);
    expect(resolved.configurationGroups).toHaveLength(2);
    expect(resolved.configurationGroups?.[1]?.type).toBe("Complementos");
  });
});
