import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { getAgencySettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
  alternates: { canonical: "/mentions-legales" },
};

export default async function LegalNoticePage() {
  const settings = await getAgencySettings();

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl">Mentions légales</h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-charcoal-soft">
          <section>
            <h2 className="font-serif text-lg text-charcoal">Éditeur du site</h2>
            <p className="mt-2">
              Raison sociale : {settings.agencyName}
              <br />
              Forme juridique : à compléter
              <br />
              Registre du commerce (RC) : à compléter
              <br />
              Identifiant commun de l’entreprise (ICE) : à compléter
              <br />
              Siège social : {settings.address || "à compléter"}
              {settings.city ? `, ${settings.city}, Maroc` : ", Maroc"}
              <br />
              Téléphone : {settings.phone || "à compléter"}
              <br />
              Email : {settings.email || "à compléter"}
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Directeur de la publication</h2>
            <p className="mt-2">À compléter.</p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Hébergement</h2>
            <p className="mt-2">
              Ce site est hébergé par un prestataire d’hébergement web. Les coordonnées de
              l’hébergeur seront précisées ici une fois le déploiement en production finalisé.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Propriété intellectuelle</h2>
            <p className="mt-2">
              L’ensemble des contenus présents sur ce site (textes, photographies, logos) est la
              propriété de {settings.agencyName} ou de ses partenaires, sauf mention contraire.
              Toute reproduction, représentation ou diffusion, totale ou partielle, sans
              autorisation préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Responsabilité</h2>
            <p className="mt-2">
              {settings.agencyName} s’efforce d’assurer l’exactitude des informations publiées sur
              ce site, notamment les descriptifs et disponibilités des biens, et ne saurait être
              tenue responsable d’erreurs ou d’omissions. Les biens présentés sont soumis à
              disponibilité.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
