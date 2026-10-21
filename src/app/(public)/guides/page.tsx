import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Guides immobilier",
  description: "Guides pratiques pour acheter ou louer un bien immobilier au Maroc avec M. Confidential.",
  alternates: { canonical: "/guides" },
};

const guides = [
  {
    href: "/guides/acheter-au-maroc",
    title: "Acheter un bien immobilier au Maroc",
    excerpt: "Les grandes étapes d’un achat immobilier, du compromis à la signature chez le notaire.",
  },
  {
    href: "/guides/louer-au-maroc",
    title: "Louer un bien immobilier au Maroc",
    excerpt: "Ce qu’il faut savoir avant de signer un bail, côté locataire comme côté propriétaire.",
  },
];

export default function GuidesPage() {
  return (
    <Container className="py-16">
      <h1 className="font-serif text-3xl">Guides</h1>
      <p className="mt-3 max-w-2xl text-charcoal-soft">
        Des repères pratiques pour avancer sereinement dans votre projet immobilier.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="block border border-border p-6 transition-colors hover:border-charcoal"
          >
            <p className="font-serif text-xl">{g.title}</p>
            <p className="mt-2 text-sm text-charcoal-soft">{g.excerpt}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
