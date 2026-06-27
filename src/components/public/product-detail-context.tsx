"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CategoryWithItems } from "@/lib/site/landing-types";
import type { Category, MenuItem } from "@/types";
import type { ProductDrawerActionId } from "@/types/site";
import { ProductDetailDrawer } from "./product-detail-drawer";

interface ProductSelection {
  item: MenuItem;
  category: Category;
}

interface ProductDetailContextValue {
  openProduct: (item: MenuItem, category: Category) => void;
}

const ProductDetailContext = createContext<ProductDetailContextValue | null>(
  null,
);

export function useProductDetail() {
  const context = useContext(ProductDetailContext);
  if (!context) {
    throw new Error("useProductDetail must be used within ProductDetailProvider");
  }
  return context;
}

interface ProductDetailProviderProps {
  tenantSlug: string;
  whatsapp?: string;
  drawerActions: ProductDrawerActionId[];
  categories: CategoryWithItems[];
  children: ReactNode;
}

export function ProductDetailProvider({
  tenantSlug,
  whatsapp,
  drawerActions,
  categories,
  children,
}: ProductDetailProviderProps) {
  const [selection, setSelection] = useState<ProductSelection | null>(null);
  const [open, setOpen] = useState(false);

  const itemIndex = useMemo(() => {
    const map = new Map<string, ProductSelection>();
    for (const category of categories) {
      for (const item of category.items) {
        map.set(item.id, { item, category });
      }
    }
    return map;
  }, [categories]);

  const openProduct = useCallback((item: MenuItem, category: Category) => {
    setSelection({ item, category });
    setOpen(true);
    window.history.replaceState(null, "", `#produto-${item.id}`);
  }, []);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      window.setTimeout(() => setSelection(null), 320);
      if (window.location.hash.startsWith("#produto-")) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
    }
  }, []);

  useEffect(() => {
    function openFromHash() {
      const hash = window.location.hash;
      if (!hash.startsWith("#produto-")) return;

      const itemId = hash.replace("#produto-", "");
      const match = itemIndex.get(itemId);
      if (match) {
        setSelection(match);
        setOpen(true);
      }
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [itemIndex]);

  const value = useMemo(() => ({ openProduct }), [openProduct]);

  return (
    <ProductDetailContext.Provider value={value}>
      {children}
      <ProductDetailDrawer
        open={open}
        onOpenChange={handleOpenChange}
        item={selection?.item ?? null}
        category={selection?.category ?? null}
        tenantSlug={tenantSlug}
        whatsapp={whatsapp}
        drawerActions={drawerActions}
      />
    </ProductDetailContext.Provider>
  );
}
