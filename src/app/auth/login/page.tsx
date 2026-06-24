import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Logo size="md" href="/" priority />
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
          <p className="text-sm text-muted-foreground">
            Acesse o painel do seu restaurante
          </p>
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
