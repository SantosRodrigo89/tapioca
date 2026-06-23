import Link from "next/link";

export default function MenuNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-3 max-w-sm">
        <h1 className="text-xl font-semibold">Cardápio não encontrado</h1>
        <p className="text-sm text-muted-foreground">
          Verifique o endereço e tente novamente.
        </p>
        <Link
          href="/"
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
