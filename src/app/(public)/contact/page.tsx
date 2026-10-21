import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/property/contact-form";
import { contactAction } from "./actions";
import { getAgencySettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez M. Confidential, agence immobilière premium à Casablanca et Dar Bouazza, pour toute question sur un bien ou votre projet immobilier.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getAgencySettings();

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl">Contact</h1>
        <p className="mt-3 text-charcoal-soft">
          Une question, un projet d’achat, de vente ou de location ? Écrivez-nous, un consultant
          M. Confidential vous répond rapidement.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
              Coordonnées
            </p>
            <div className="mt-3 space-y-2 text-sm text-charcoal-soft">
              {settings.phone && <p>{settings.phone}</p>}
              {settings.email && <p>{settings.email}</p>}
              {settings.address && <p>{settings.address}</p>}
              {settings.city && <p>{settings.city}, Maroc</p>}
              {!settings.phone && !settings.email && !settings.address && (
                <p>Utilisez le formulaire ci-contre, un consultant vous recontactera.</p>
              )}
            </div>

            <p className="mt-8 text-xs font-medium uppercase tracking-wide text-charcoal-soft">
              Confidentialité
            </p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
              Les informations transmises via ce formulaire sont utilisées exclusivement par
              M. Confidential pour traiter votre demande et ne sont jamais cédées à des tiers.
            </p>
          </div>

          <div className="md:col-span-3">
            <ContactForm action={contactAction} />
          </div>
        </div>
      </div>
    </Container>
  );
}
