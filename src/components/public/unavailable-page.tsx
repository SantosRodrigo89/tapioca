import type { TenantStatus } from "@/types";

interface UnavailablePageProps {
  status: TenantStatus;
  name: string;
}

const messages: Partial<Record<TenantStatus, { title: string; body: string }>> = {
  suspended: {
    title: "Cardápio temporariamente indisponível",
    body: "Este cardápio está temporariamente indisponível. Por favor, tente novamente mais tarde.",
  },
  cancelled: {
    title: "Cardápio encerrado",
    body: "Este cardápio não está mais disponível.",
  },
};

export function UnavailablePage({ status, name }: UnavailablePageProps) {
  const msg = messages[status] ?? {
    title: "Cardápio indisponível",
    body: "Este cardápio não está disponível no momento.",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-2 max-w-sm">
        <h1 className="text-xl font-semibold">{msg.title}</h1>
        <p className="text-sm text-muted-foreground">{msg.body}</p>
        <p className="text-xs text-muted-foreground pt-2">{name}</p>
      </div>
    </div>
  );
}
