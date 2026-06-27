import type { Metadata } from "next";
import { SuperPageHeader } from "@/components/super/super-page-header";

export const metadata: Metadata = { title: "Convites — Super Admin" };

export default function SuperInvitesPage() {
  return (
    <div className="space-y-6">
      <SuperPageHeader
        title="Convites"
        description="Gerencie convites enviados aos administradores de restaurantes."
      />
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        Módulo de convites — próxima entrega.
      </div>
    </div>
  );
}
