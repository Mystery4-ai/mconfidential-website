import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/property/contact-form";
import { Input, Label, Select } from "@/components/ui/field";
import { propertyTypeLabels } from "@/lib/labels";
import { jsonLdScript, faqJsonLd } from "@/lib/json-ld";
import { valuationAction } from "./actions";

export const metadata: Metadata = {
  title: "Estimation de votre bien",
  description:
    "Demandez une estimation précise de votre bien immobilier à Casablanca ou Dar Bouazza avec M. Confidential.",
  alternates: { canonical: "/estimation" },
};

const faqs = [
  {
    question: "Comment M. Confidential estime-t-elle un bien ?",
    answer:
      "L’estimation s’appuie sur la localisation, la superficie, l’état et les prestations du bien, comparés aux transactions récentes du même secteur. Un consultant affine ensuite cette première évaluation lors d’un échange avec vous.",
  },
  {
    question: "L’estimation est-elle gratuite et sans engagement ?",
    answer:
      "Oui. La demande d’estimation ne vous engage à rien : elle vous donne une fourchette de valeur réaliste pour décider sereinement de la suite, que vous souhaitiez vendre, louer ou simplement vous situer sur le marché.",
  },
  {
    question: "Sous combien de temps reçois-je une réponse ?",
    answer:
      "Un consultant M. Confidential vous recontacte rapidement après votre demande pour affiner les détails du bien et vous communiquer une estimation précise.",
  },
  {
    question: "Dois-je être présent pour l’estimation ?",
    answer:
      "Une première estimation peut être réalisée à distance sur la base des informations fournies. Une visite du bien permet ensuite d’affiner l’évaluation si vous envisagez une mise en vente ou en location.",
  },
];

export default function EstimationPage() {
  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd(faqs)) }}
      />

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

        <div className="mt-16 border-t border-border pt-10">
          <h2 className="font-serif text-xl">Questions fréquentes</h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-charcoal">{faq.question}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Container>
  );
}
