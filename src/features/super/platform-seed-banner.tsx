"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SuperPageHeader } from "@/components/super/super-page-header";
import { Button } from "@/components/ui/button";

export function PlatformSeedBanner() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/super/seed", { method: "POST" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Falha no seed");
      toast.success("Plataforma inicializada com sucesso");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao inicializar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">Plataforma não inicializada</p>
        <p className="text-xs text-muted-foreground mt-1">
          Execute o seed para criar planos, recursos, templates e configurações
          globais.
        </p>
      </div>
      <Button onClick={handleSeed} disabled={loading} size="sm">
        {loading ? "Inicializando…" : "Inicializar plataforma"}
      </Button>
    </div>
  );
}
