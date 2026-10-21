import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Louer un bien immobilier au Maroc",
  description:
    "Ce qu’il faut savoir avant de louer un bien au Maroc : visite, dossier, bail et dépôt de garantie.",
  alternates: { canonical: "/guides/louer-au-maroc" },
};

export default function RentingGuidePage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl">Louer un bien immobilier au Maroc</h1>

        <div className="mt-8 space-y-6 leading-relaxed text-charcoal-soft">
          <p>
            Que vous soyez locataire à la recherche d’un bien ou propriétaire souhaitant louer
            votre bien, quelques repères facilitent une mise en location sereine.
          </p>

          <div>
            <h2 className="font-serif text-xl text-charcoal">Pour le locataire</h2>
            <p className="mt-2">
              Un dossier de location comprend généralement une pièce d’identité, un justificatif
              de revenus et parfois une caution ou un garant selon le profil. Préparer ces
              éléments en amont accélère le traitement de votre candidature.
            </p>
            <p className="mt-2">
              Avant la signature du bail, il est recommandé de vérifier l’état des lieux, les
              équipements inclus, et les conditions de renouvellement ou de résiliation prévues
              au contrat.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-charcoal">Pour le propriétaire</h2>
            <p className="mt-2">
              Une présentation soignée du bien (photos, description précise, disponibilité claire)
              facilite une mise en location rapide auprès de locataires qualifiés.
            </p>
            <p className="mt-2">
              Un dépôt de garantie est généralement demandé à la signature, destiné à couvrir
              d’éventuels manquements constatés à la sortie des lieux.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-charcoal">Le bail</h2>
            <p className="mt-2">
              Le contrat de location précise la durée, le loyer, les charges, et les obligations
              respectives des deux parties. Il est conseillé de le faire relire attentivement
              avant signature.
            </p>
          </div>

          <p className="text-sm italic">
            Ce guide présente des repères généraux. Pour toute question spécifique à votre
            situation, votre consultant M. Confidential vous accompagne dans les démarches.
          </p>
        </div>

        <div className="mt-10">
          <LinkButton href="/biens?transaction=RENT">Voir les biens à louer</LinkButton>
        </div>
      </div>
    </Container>
  );
}
