import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { getAgencySettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default async function PrivacyPolicyPage() {
  const settings = await getAgencySettings();

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-charcoal-soft">Dernière mise à jour : à compléter.</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-charcoal-soft">
          <section>
            <h2 className="font-serif text-lg text-charcoal">Données collectées</h2>
            <p className="mt-2">
              Lorsque vous utilisez les formulaires de ce site (contact, demande de visite,
              demande d’estimation), nous collectons les informations que vous nous transmettez
              volontairement : nom, email, téléphone, et le cas échéant le message et les dates de
              visite souhaitées.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Finalité du traitement</h2>
            <p className="mt-2">
              Ces données sont utilisées exclusivement par {settings.agencyName} pour traiter
              votre demande : vous recontacter, organiser une visite, ou réaliser une estimation.
              Elles sont transmises au consultant en charge du bien concerné ou de votre demande.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Conservation des données</h2>
            <p className="mt-2">
              Vos données sont conservées pendant la durée nécessaire au traitement de votre
              demande, puis archivées ou supprimées conformément à nos obligations légales.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Cookies et mesure d’audience</h2>
            <p className="mt-2">
              Ce site peut utiliser des cookies techniques nécessaires à son fonctionnement, ainsi
              que des cookies de mesure d’audience ou liés à des campagnes publicitaires (par
              exemple Meta/Google Ads), destinés à mesurer l’efficacité de nos communications. Vous
              pouvez configurer votre navigateur pour refuser ces cookies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Partage des données</h2>
            <p className="mt-2">
              Vos données ne sont ni vendues ni cédées à des tiers. Elles peuvent être partagées
              avec nos prestataires techniques (hébergement, outils de communication) dans la
              stricte mesure nécessaire au fonctionnement du site et au traitement de votre
              demande.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-charcoal">Vos droits</h2>
            <p className="mt-2">
              Conformément à la loi 09-08 relative à la protection des personnes physiques à
              l’égard du traitement des données à caractère personnel, vous disposez d’un droit
              d’accès, de rectification et de suppression de vos données. Pour exercer ces droits,
              contactez-nous à{" "}
              {settings.email || "l’adresse indiquée sur la page Contact"}.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
