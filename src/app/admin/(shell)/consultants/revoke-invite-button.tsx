"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { revokeInvite } from "./invite-actions";

export function RevokeInviteButton({ inviteId }: { inviteId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => revokeInvite(inviteId))}
      className="flex items-center gap-1 text-xs text-charcoal-soft hover:text-status-sold disabled:opacity-50"
    >
      <X size={13} strokeWidth={1.5} /> Révoquer
    </button>
  );
}
