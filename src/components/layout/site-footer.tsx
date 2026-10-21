import Link from "next/link";
import { Container } from "./container";

type FooterSettings = {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  facebookUrl?: string | null;
};

export function SiteFooter({ settings }: { settings: FooterSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-ivory-dim">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div>
          <p className="font-serif text-lg text-charcoal">M. Confidential</p>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
            Agence immobilière à Casablanca &amp; Dar Bouazza.
          </p>
          {settings.facebookUrl && (
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm text-charcoal-soft underline underline-offset-4 hover:text-charcoal"
            >
              Facebook
            </a>
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

      <div className="border-t border-border py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-charcoal-soft md:flex-row">
          <p>© {year} M. Confidential. Tous droits réservés.</p>
          <p>Casablanca &amp; Dar Bouazza, Maroc</p>
        </Container>
      </div>
    </footer>
  );
}
