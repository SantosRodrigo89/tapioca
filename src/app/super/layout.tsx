import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { SuperShell } from "@/layouts/super-shell";

export default async function SuperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/auth/login?redirect=/super");
  }

  if (!isSuperAdmin(sessionUser)) {
    redirect("/dashboard");
  }

  return <SuperShell>{children}</SuperShell>;
}
