import { z } from "zod";

export const propertyFormSchema = z.object({
  title: z.string().trim().min(5, "Le titre doit contenir au moins 5 caractères.").max(200),
  description: z.string().trim().min(20, "La description doit contenir au moins 20 caractères."),
  transactionType: z.enum(["SALE", "RENT"]),
  propertyType: z.enum([
    "APARTMENT",
    "HOUSE",
    "VILLA",
    "RIAD",
    "LAND",
    "OFFICE",
    "COMMERCIAL",
    "BUILDING",
  ]),
  price: z.coerce.number().int().positive("Le prix doit être un nombre positif."),
  city: z.string().trim().min(2, "La ville est requise."),
  neighborhood: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  features: z.string().trim().optional().or(z.literal("")),
  consultantId: z.string().trim().optional().or(z.literal("")),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

/** Parses an optional numeric field from FormData — empty string becomes undefined. */
export function numOrUndefined(value: FormDataEntryValue | null): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
