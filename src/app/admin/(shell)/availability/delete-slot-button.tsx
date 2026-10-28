"use client";

import { useTransition } from "react";
import { deleteSlot } from "./actions";

export function DeleteSlotButton({ slotId }: { slotId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => deleteSlot(slotId))}
      className="text-xs text-charcoal-soft underline underline-offset-4 hover:text-status-sold disabled:opacity-50"
    >
      Supprimer
    </button>
  );
}
