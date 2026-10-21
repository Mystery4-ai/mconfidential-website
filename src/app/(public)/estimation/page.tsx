import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/property/contact-form";
import { Input, Label, Select } from "@/components/ui/field";
import { propertyTypeLabels } from "@/lib/labels";
import { valuationAction } from "./actions";

export const metadata: Metadata = {
  title: "Estimation de votre bien",
  description:
    "Demandez une estimation précise de votre bien immobilier à Casablanca ou Dar Bouazza avec M. Confidential.",
  alternates: { canonical: "/estimation" },
};

export default function EstimationPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl">Estimez votre bien</h1>
        <p className="mt-3 text-charcoal-soft">
          Vous envisagez de vendre ou de louer votre bien ? Décrivez-le ci-dessous, un consultant
          M. Confidential réalise une estimation précise et vous recontacte sous peu.
        </p>

        <div className="mt-10">
          <ContactForm
            action={valuationAction}
            messageLabel="Précisions sur le bien (facultatif)"
            successMessage="Votre demande d’estimation a été envoyée. Un consultant vous recontactera rapidement."
            submitLabel="Demander une estimation"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="address">Adresse / quartier du bien</Label>
                <Input id="address" name="address" />
              </div>
              <div>
                <Label htmlFor="propertyType">Type de bien</Label>
                <Select id="propertyType" name="propertyType" defaultValue="">
                  <option value="">Sélectionner</option>
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <option key={value} value={label}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </ContactForm>
        </div>
      </div>
    </Container>
  );
}
