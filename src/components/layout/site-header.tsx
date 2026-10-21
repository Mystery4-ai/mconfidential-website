import Link from "next/link";
import { Container } from "./container";
import { navLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";

export function SiteHeader({ phone }: { phone?: string | null }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-ivory/95 backdrop-blur">
      <Container className="relative flex h-18 items-center justify-between py-4">
        <Link href="/" className="font-serif text-xl tracking-tight text-charcoal">
          M. Confidential
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-charcoal-soft transition-colors hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          {phone ? (
            <a href={`tel:${phone}`} className="text-sm font-medium text-charcoal">
              {phone}
            </a>
          ) : (
            <Link
              href="/contact"
              className="text-sm font-medium text-charcoal underline underline-offset-4"
            >
              Nous contacter
            </Link>
          )}
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
