"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, Label } from "@/components/ui/field";
import { availabilityLabels } from "@/lib/labels";
import { useSaveToast } from "@/components/ui/save-toast";
import { Availability, PropertyStatus } from "@prisma/client";
import {
  submitForApproval,
  publishProperty,
  rejectProperty,
  unpublishProperty,
  archiveProperty,
  setAvailability,
} from "../../actions";

export function StatusActions({
  propertyId,
  status,
  availability,
  isAdmin,
}: {
  propertyId: string;
  status: PropertyStatus;
  availability: Availability;
  isAdmin: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const notifySaved = useSaveToast();

  function run(action: () => Promise<void>, message: string) {
    startTransition(async () => {
      await action();
      notifySaved(message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(status === "DRAFT" || status === "UNPUBLISHED") && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => run(() => submitForApproval(propertyId), "Annonce soumise pour approbation.")}
          >
            Soumettre pour approbation
          </Button>
        )}

        {isAdmin && status !== "PUBLISHED" && (
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() => run(() => publishProperty(propertyId), "Annonce publiée.")}
          >
            Publier
          </Button>
        )}

        {isAdmin && status === "PENDING_APPROVAL" && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => run(() => rejectProperty(propertyId), "Annonce renvoyée en brouillon.")}
          >
            Rejeter (renvoyer en brouillon)
          </Button>
        )}

        {status === "PUBLISHED" && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => run(() => unpublishProperty(propertyId), "Annonce dépubliée.")}
          >
            Dépublier
          </Button>
        )}

        {status !== "ARCHIVED" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => run(() => archiveProperty(propertyId), "Annonce archivée.")}
          >
            Archiver
          </Button>
        )}

        {isAdmin && status === "ARCHIVED" && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => run(() => rejectProperty(propertyId), "Annonce restaurée en brouillon.")}
          >
            Restaurer en brouillon
          </Button>
        )}
      </div>

      <div className="max-w-xs">
        <Label htmlFor="availability">Disponibilité</Label>
        <Select
          id="availability"
          defaultValue={availability}
          disabled={isPending}
          onChange={(e) => run(() => setAvailability(propertyId, e.target.value), "Disponibilité mise à jour.")}
        >
          {Object.entries(availabilityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
