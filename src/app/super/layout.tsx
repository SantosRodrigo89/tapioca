import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { isSuperAdmin } from "@/lib/auth/roles";
import { SuperHeader } from "@/components/super/super-header";

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

  return (
    <div className="flex min-h-screen flex-col">
      <SuperHeader />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
