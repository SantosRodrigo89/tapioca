import type { Metadata } from "next";
import { SuperPageHeader } from "@/components/super/super-page-header";

export const metadata: Metadata = { title: "Novo Restaurante — Super Admin" };

export default function NewRestaurantPage() {
  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Novo Restaurante"
        description="Wizard de cadastro — em implementação na próxima entrega."
      />
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Etapas: dados do restaurante → administrador → resumo e convite.
      </div>
    </div>
  );
}
