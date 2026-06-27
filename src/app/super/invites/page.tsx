import type { Metadata } from "next";
import { listInvitesServer } from "@/lib/repositories/server/platform/invite.server";
import { resolveInviteExpiry } from "@/services/platform/invite.service";
import { InvitesPage } from "@/features/super/invites/invites-page";
import { serializeInviteForClient } from "@/features/super/invites/invite-types";

export const metadata: Metadata = { title: "Convites — Super Admin" };

export default async function SuperInvitesRoute() {
  const invites = await listInvitesServer();
  const resolved = await Promise.all(invites.map(resolveInviteExpiry));

  return (
    <InvitesPage
      initialInvites={resolved.map(serializeInviteForClient)}
    />
  );
}
