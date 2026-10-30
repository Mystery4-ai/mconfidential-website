"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type NavLink = { href: string; label: string; exact?: boolean };

const baseLinks: NavLink[] = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/properties", label: "Biens" },
  { href: "/admin/availability", label: "Disponibilités" },
  { href: "/admin/inquiries", label: "Demandes" },
  { href: "/admin/profile", label: "Mon profil" },
];

const adminOnlyLinks: NavLink[] = [
  { href: "/admin/consultants", label: "Consultants" },
  { href: "/admin/settings", label: "Paramètres" },
];

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const links = isAdmin ? [...baseLinks, ...adminOnlyLinks] : baseLinks;

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 text-sm transition-colors",
              active
                ? "bg-charcoal text-ivory"
                : "text-charcoal-soft hover:bg-ivory-dim hover:text-charcoal"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
