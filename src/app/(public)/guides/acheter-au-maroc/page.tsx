import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Acheter un bien immobilier au Maroc",
  description:
    "Les grandes étapes d’un achat immobilier au Maroc : recherche, offre, compromis, financement et signature chez le notaire.",
  alternates: { canonical: "/guides/acheter-au-maroc" },
};

export default function BuyingGuidePage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-serif text-3xl">Acheter un bien immobilier au Maroc</h1>

        <div className="mt-8 space-y-6 leading-relaxed text-charcoal-soft">
          <p>
            Un achat immobilier suit généralement un parcours en plusieurs étapes. Le connaître à
            l’avance permet d’aborder la transaction avec plus de sérénité.
          </p>

          <div>
            <h2 className="font-serif text-xl text-charcoal">1. Définir son projet</h2>
            <p className="mt-2">
              Budget, localisation, type de bien, usage (résidence principale, secondaire ou
              investissement locatif) : clarifier ces critères en amont permet de cibler une
              recherche efficace et d’échanger plus précisément avec votre consultant.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-charcoal">2. Visiter et comparer</h2>
            <p className="mt-2">
              Au-delà du coup de cœur, il est utile de comparer plusieurs biens similaires pour
              évaluer la cohérence du prix demandé avec l’état du bien, son emplacement et le
              marché local.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-charcoal">3. Faire une offre</h2>
            <p className="mt-2">
              Une fois le bien choisi, une offre d’achat est généralement formulée. Si elle est
              acceptée par le vendeur, les deux parties s’accordent sur les conditions de la
              transaction.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-charcoal">4. Financement</h2>
            <p className="mt-2">
              Si l’acquisition nécessite un financement bancaire, il est recommandé d’obtenir un
              accord de principe de votre banque le plus tôt possible, afin de sécuriser les
              délais de la transaction.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl text-charcoal">5. Compromis et signature</h2>
            <p className="mt-2">
              La vente d’un bien immobilier au Maroc est formalisée par un acte notarié. Le
              notaire vérifie la situation juridique du bien (titre foncier, absence
              d’hypothèques ou de litiges) avant la signature définitive et l’enregistrement de
              la propriété.
            </p>
          </div>

          <p className="text-sm italic">
            Ce guide présente les grandes lignes du processus à titre indicatif. Les démarches,
            frais et délais précis dépendent de chaque situation : votre consultant M. Confidential
            et votre notaire sont les mieux placés pour vous accompagner dans le détail.
          </p>
        </div>

        <div className="mt-10">
          <LinkButton href="/biens?transaction=SALE">Voir les biens à vendre</LinkButton>
        </div>
      </div>
    </Container>
  );
}
