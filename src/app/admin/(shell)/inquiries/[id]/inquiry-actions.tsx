"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select, Label, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { inquiryStatusLabels } from "@/lib/labels";
import { updateInquiryStatus, updateInquiryNotes, reassignInquiry } from "../actions";

export function InquiryStatusSelect({ inquiryId, status }: { inquiryId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="max-w-xs">
      <Label htmlFor="status">Statut</Label>
      <Select
        id="status"
        defaultValue={status}
        disabled={isPending}
        onChange={(e) =>
          startTransition(async () => {
            await updateInquiryStatus(inquiryId, e.target.value);
            router.refresh();
          })
        }
      >
        {Object.entries(inquiryStatusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}

export function InquiryNotes({ inquiryId, notes }: { inquiryId: string; notes: string }) {
  const [value, setValue] = useState(notes);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <Label htmlFor="notes">Notes internes</Label>
      <Textarea
        id="notes"
        rows={5}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
      />
      <div className="mt-2 flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await updateInquiryNotes(inquiryId, value);
              setSaved(true);
            })
          }
        >
          {isPending ? "Enregistrement…" : "Enregistrer les notes"}
        </Button>
        {saved && <span className="text-xs text-status-published">Enregistré</span>}
      </div>
    </div>
  );
}

export function ReassignSelect({
  inquiryId,
  consultants,
  currentId,
}: {
  inquiryId: string;
  consultants: { id: string; name: string }[];
  currentId: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="max-w-xs">
      <Label htmlFor="consultant">Consultant assigné</Label>
      <Select
        id="consultant"
        defaultValue={currentId ?? ""}
        disabled={isPending}
        onChange={(e) =>
          startTransition(async () => {
            await reassignInquiry(inquiryId, e.target.value);
            router.refresh();
          })
        }
      >
        <option value="">Non assigné</option>
        {consultants.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
