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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="menu-card max-w-sm space-y-4 p-8">
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, var(--menu-danger) 12%, white)" }}
        >
          <span
            className="text-2xl"
            style={{ color: "var(--menu-danger)" }}
            aria-hidden
          >
            ×
          </span>
        </div>
        <h1 className="text-xl font-semibold text-[var(--menu-secondary)]">
          {msg.title}
        </h1>
        <p className="text-sm leading-relaxed text-[#777]">{msg.body}</p>
        <p className="text-xs font-medium text-[#999]">{name}</p>
      </div>
    </div>
  );
}
