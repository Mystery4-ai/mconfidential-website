import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";
import { getAgencySettings } from "@/lib/settings";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "L’agence",
  description:
    "M. Confidential, agence immobilière premium à Casablanca et Dar Bouazza. Découvrez notre approche et notre équipe de consultants.",
  alternates: { canonical: "/agence" },
};

export default async function AgencyPage() {
  const [settings, consultants] = await Promise.all([
    getAgencySettings(),
    db.user.findMany({
      where: { active: true },
      select: { id: true, name: true, title: true, photoUrl: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <>
      <Container className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">
            L’agence
          </p>
          <h1 className="mt-2 font-serif text-4xl">{settings.agencyName}</h1>
          {settings.aboutText && (
            <div className="mt-8 space-y-4 text-left leading-relaxed text-charcoal-soft">
              {settings.aboutText.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </div>
      </Container>

      {consultants.length > 0 && (
        <Container className="border-t border-border py-16">
          <h2 className="font-serif text-2xl">Nos consultants</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {consultants.map((c) => (
              <div key={c.id} className="border border-border p-5">
                <p className="font-serif text-lg">{c.name}</p>
                {c.title && <p className="text-sm text-charcoal-soft">{c.title}</p>}
              </div>
            ))}
          </div>
        </Container>
      )}

      <Container className="border-t border-border py-16 text-center">
        <h2 className="font-serif text-2xl">Un projet immobilier ?</h2>
        <p className="mx-auto mt-3 max-w-md text-charcoal-soft">
          Parlons de votre recherche ou de votre bien à vendre ou à louer.
        </p>
        <div className="mt-6">
          <LinkButton href="/contact">Nous contacter</LinkButton>
        </div>
      </Container>
    </>
  );
}
