import Link from "next/link";
import { Container } from "./container";
import { Logo } from "./logo";
import { FacebookIcon, InstagramIcon } from "@/components/ui/social-icons";

type FooterSettings = {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
};

export function SiteFooter({
  settings,
  cities = [],
}: {
  settings: FooterSettings;
  cities?: string[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-ivory-dim">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-5">
        <div>
          <Link href="/" className="text-charcoal">
            <Logo />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-soft">
            Agence immobilière Maroc — Casablanca &amp; Dar Bouazza.
          </p>
          {(settings.facebookUrl || settings.instagramUrl) && (
            <div className="mt-4 flex items-center gap-3">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="M. Confidential sur Facebook"
                  className="text-charcoal-soft transition-colors hover:text-charcoal"
                >
                  <FacebookIcon size={18} />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="M. Confidential sur Instagram"
                  className="text-charcoal-soft transition-colors hover:text-charcoal"
                >
                  <InstagramIcon size={18} />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">Biens</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/biens?transaction=SALE" className="text-charcoal-soft hover:text-charcoal">Acheter</Link></li>
            <li><Link href="/biens?transaction=RENT" className="text-charcoal-soft hover:text-charcoal">Louer</Link></li>
            <li><Link href="/estimation" className="text-charcoal-soft hover:text-charcoal">Estimer un bien</Link></li>
          </ul>
        </div>

        {cities.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">Villes</p>
            <ul className="mt-3 space-y-2 text-sm">
              {cities.map((city) => (
                <li key={city}>
                  <Link
                    href={`/villes/${encodeURIComponent(city)}`}
                    className="text-charcoal-soft hover:text-charcoal"
                  >
                    Immobilier à {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">Agence</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/agence" className="text-charcoal-soft hover:text-charcoal">À propos</Link></li>
            <li><Link href="/guides" className="text-charcoal-soft hover:text-charcoal">Guides</Link></li>
            <li><Link href="/contact" className="text-charcoal-soft hover:text-charcoal">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-charcoal-soft">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-charcoal-soft">
            {settings.phone && <li>{settings.phone}</li>}
            {settings.email && <li>{settings.email}</li>}
            {settings.address && <li>{settings.address}</li>}
            {!settings.phone && !settings.email && (
              <li>
                <Link href="/contact" className="underline underline-offset-4 hover:text-charcoal">
                  Formulaire de contact
                </Link>
              </li>
            )}
          </ul>
        </div>
      </Container>

      <div className="border-t border-border py-6 pb-20 md:pb-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-charcoal-soft md:flex-row">
          <p>© {year} M. Confidential — Agence immobilière Maroc. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="/mentions-legales" className="hover:text-charcoal">
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-charcoal">
              Politique de confidentialité
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
