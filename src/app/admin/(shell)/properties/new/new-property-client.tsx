"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { PropertyForm } from "../property-form";
import { createProperty, uploadImages } from "../actions";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";
import { isHeic, shrinkImage } from "@/lib/shrink-image";

type Consultant = { id: string; name: string };

export function NewPropertyClient({
  isAdmin,
  consultants,
}: {
  isAdmin: boolean;
  consultants?: Consultant[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  // Once the property is created we stop rendering the form (it would allow
  // a second, duplicate submission while photos are still uploading) and
  // show upload progress instead, until the redirect to the edit page.
  const [created, setCreated] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleCreated(propertyId: string) {
    setCreated(true);
    if (files.length === 0) {
      router.push(`/admin/properties/${propertyId}/edit`);
      return;
    }
    for (let i = 0; i < files.length; i++) {
      setProgress(`Envoi de la photo ${i + 1} sur ${files.length}…`);
      const photo = await shrinkImage(files[i]);
      if (isHeic(photo) || photo.size > MAX_UPLOAD_BYTES) continue;
      const formData = new FormData();
      formData.append("images", photo);
      try {
        await uploadImages(propertyId, formData);
      } catch {
        // Property is already created; a failed photo can be retried on the edit page.
      }
    }
    router.push(`/admin/properties/${propertyId}/edit`);
  }

  if (created) {
    return (
      <div className="flex items-center gap-2 border border-border bg-white/40 p-5 text-sm text-charcoal-soft">
        <Loader2 size={16} className="animate-spin" />
        {progress || "Bien créé, redirection…"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-charcoal-soft">
            Photos (facultatif, vous pourrez en ajouter d’autres ensuite)
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="block w-full text-sm text-charcoal-soft file:mr-4 file:border-0 file:bg-charcoal file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory"
          />
        </label>
        {files.length > 0 && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-charcoal-soft">
            <ImagePlus size={14} /> {files.length} photo(s) seront envoyées dès la création du bien.
          </p>
        )}
      </div>

      <PropertyForm
        action={createProperty}
        isAdmin={isAdmin}
        consultants={consultants}
        submitLabel="Créer le brouillon"
        onCreated={handleCreated}
      />
    </div>
  );
}
