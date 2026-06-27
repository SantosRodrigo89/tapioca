"use client";

import Link from "next/link";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMenuAuth } from "@/features/cardapio/use-menu-auth";
import { useCatalogDndSensors } from "@/features/cardapio/use-catalog-dnd";
import { useProductsPanel } from "@/features/cardapio/use-products-panel";
import { ProductCategorySection } from "@/features/cardapio/product-category-section";
import { ProductDialogs } from "@/features/cardapio/product-dialogs";
import type { CategoryWithItems } from "@/features/cardapio/types";

interface ProductsPanelProps {
  tenantId: string;
  initialCategories: CategoryWithItems[];
}

export function ProductsPanel({
  tenantId,
  initialCategories,
}: ProductsPanelProps) {
  useMenuAuth();
  const sensors = useCatalogDndSensors();
  const {
    categories,
    dialog,
    setDialog,
    pickCategoryId,
    setPickCategoryId,
    reordering,
    totalItems,
    handleCreateItem,
    handleUpdateItem,
    handleToggleAvailable,
    handleDeleteItem,
    handleDragEnd,
    openNewProduct,
  } = useProductsPanel({ tenantId, initialCategories });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Crie uma{" "}
            <Link
              href="/menu/categories"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              categoria
            </Link>{" "}
            antes de adicionar produtos.
          </p>
        ) : (
          <Button onClick={openNewProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Novo produto
          </Button>
        )}
      </div>

      {categories.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p className="text-sm">Nenhuma categoria encontrada.</p>
          <Button variant="link" className="mt-1 h-auto p-0 text-sm" asChild>
            <Link href="/menu/categories">Ir para categorias</Link>
          </Button>
        </div>
      )}

      {categories.length > 0 && totalItems === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <p className="text-sm">Nenhum produto criado ainda.</p>
          <Button
            variant="link"
            className="mt-1 h-auto p-0 text-sm"
            onClick={openNewProduct}
          >
            Criar primeiro produto
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-6">
          {categories.map((category) => (
            <ProductCategorySection
              key={category.id}
              category={category}
              reordering={reordering}
              onAddProduct={() =>
                setDialog({ type: "new-item", categoryId: category.id })
              }
              onToggleAvailable={handleToggleAvailable}
              onEditItem={(categoryId, item) =>
                setDialog({ type: "edit-item", categoryId, item })
              }
              onDeleteItem={(categoryId, itemId, name) =>
                setDialog({ type: "delete-item", categoryId, itemId, name })
              }
            />
          ))}
        </div>
      </DndContext>

      <ProductDialogs
        dialog={dialog}
        categories={categories}
        pickCategoryId={pickCategoryId}
        onPickCategoryIdChange={setPickCategoryId}
        onClose={() => setDialog({ type: "none" })}
        onContinuePickCategory={(categoryId) =>
          setDialog({ type: "new-item", categoryId })
        }
        onCreate={handleCreateItem}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}
