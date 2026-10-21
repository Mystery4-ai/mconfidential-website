"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea, FormError } from "@/components/ui/field";
import { propertyTypeLabels } from "@/lib/labels";
import { PropertyFormState } from "./actions";

type Consultant = { id: string; name: string };

export type PropertyInitialValues = {
  title: string;
  description: string;
  transactionType: string;
  propertyType: string;
  price: number;
  city: string;
  neighborhood: string | null;
  address: string | null;
  surfaceArea: number | null;
  landArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  yearBuilt: number | null;
  features: string[] | null;
  consultantId: string;
};

export function PropertyForm({
  action,
  initialValues,
  consultants,
  isAdmin,
  submitLabel = "Enregistrer",
}: {
  action: (state: PropertyFormState, formData: FormData) => Promise<PropertyFormState>;
  initialValues?: PropertyInitialValues;
  consultants?: Consultant[];
  isAdmin: boolean;
  submitLabel?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-8">
      <section>
        <h2 className="font-serif text-lg">Informations générales</h2>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="title">Titre de l’annonce</Label>
            <Input id="title" name="title" required defaultValue={initialValues?.title} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={8}
              required
              defaultValue={initialValues?.description}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg">Transaction</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="transactionType">Type de transaction</Label>
            <Select
              id="transactionType"
              name="transactionType"
              required
              defaultValue={initialValues?.transactionType ?? "SALE"}
            >
              <option value="SALE">Vente</option>
              <option value="RENT">Location</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="propertyType">Type de bien</Label>
            <Select
              id="propertyType"
              name="propertyType"
              required
              defaultValue={initialValues?.propertyType ?? "APARTMENT"}
            >
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Prix (MAD)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={1}
              required
              defaultValue={initialValues?.price}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg">Localisation</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" required defaultValue={initialValues?.city} />
          </div>
          <div>
            <Label htmlFor="neighborhood">Quartier</Label>
            <Input id="neighborhood" name="neighborhood" defaultValue={initialValues?.neighborhood ?? ""} />
          </div>
          <div>
            <Label htmlFor="address">Adresse (non publiée)</Label>
            <Input id="address" name="address" defaultValue={initialValues?.address ?? ""} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-lg">Caractéristiques</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <Label htmlFor="surfaceArea">Surface (m²)</Label>
            <Input id="surfaceArea" name="surfaceArea" type="number" min={0} defaultValue={initialValues?.surfaceArea ?? ""} />
          </div>
          <div>
            <Label htmlFor="landArea">Terrain (m²)</Label>
            <Input id="landArea" name="landArea" type="number" min={0} defaultValue={initialValues?.landArea ?? ""} />
          </div>
          <div>
            <Label htmlFor="bedrooms">Chambres</Label>
            <Input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={initialValues?.bedrooms ?? ""} />
          </div>
          <div>
            <Label htmlFor="bathrooms">Salles de bain</Label>
            <Input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={initialValues?.bathrooms ?? ""} />
          </div>
          <div>
            <Label htmlFor="parkingSpaces">Parking</Label>
            <Input id="parkingSpaces" name="parkingSpaces" type="number" min={0} defaultValue={initialValues?.parkingSpaces ?? ""} />
          </div>
          <div>
            <Label htmlFor="yearBuilt">Année construction</Label>
            <Input id="yearBuilt" name="yearBuilt" type="number" min={1900} max={2100} defaultValue={initialValues?.yearBuilt ?? ""} />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="features">Équipements (un par ligne ou séparés par une virgule)</Label>
          <Textarea
            id="features"
            name="features"
            rows={3}
            defaultValue={initialValues?.features?.join("\n") ?? ""}
          />
        </div>
      </section>

      {isAdmin && consultants && (
        <section>
          <h2 className="font-serif text-lg">Attribution</h2>
          <div className="mt-4 max-w-xs">
            <Label htmlFor="consultantId">Consultant responsable</Label>
            <Select id="consultantId" name="consultantId" defaultValue={initialValues?.consultantId ?? ""}>
              {consultants.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </section>
      )}

      <FormError>{state.error}</FormError>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement…" : submitLabel}
      </Button>
    </form>
  );
}
