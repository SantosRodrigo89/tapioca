import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categorias" };

export default function MenuCategoriesPage() {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
      Gerenciamento dedicado de categorias em construção. Por enquanto, use a
      aba Produtos para criar e editar categorias.
    </div>
  );
}
