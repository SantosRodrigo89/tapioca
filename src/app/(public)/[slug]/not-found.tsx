import Link from "next/link";

export default function MenuNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="menu-card max-w-sm space-y-4 p-8">
        <h1 className="text-xl font-semibold text-[var(--menu-secondary)]">
          Cardápio não encontrado
        </h1>
        <p className="text-sm text-[#777]">
          Verifique o endereço e tente novamente.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-[var(--menu-secondary)]"
          style={{ backgroundColor: "var(--menu-primary)" }}
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
