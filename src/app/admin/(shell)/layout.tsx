import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";
import { AdminNav } from "@/components/layout/admin-nav";
import { LogoutButton } from "@/components/layout/logout-button";

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen bg-ivory">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-white/40 md:flex md:flex-col">
        <div className="border-b border-border px-5 py-5">
          <Link href="/admin" className="font-serif text-lg text-charcoal">
            M. Confidential
          </Link>
          <p className="mt-0.5 text-xs text-charcoal-soft">Backoffice</p>
        </div>
        <div className="flex-1 p-3">
          <AdminNav isAdmin={user.role === "ADMIN"} />
        </div>
        <div className="border-t border-border p-4">
          <p className="truncate text-sm text-charcoal">{user.name}</p>
          <p className="text-xs text-charcoal-soft">
            {user.role === "ADMIN" ? "Administrateur" : "Consultant"}
          </p>
          <div className="mt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-white/40 px-5 py-3 md:hidden">
          <Link href="/admin" className="font-serif text-lg text-charcoal">
            M. Confidential
          </Link>
          <LogoutButton />
        </header>
        <div className="border-b border-border px-5 py-2 md:hidden">
          <AdminNav isAdmin={user.role === "ADMIN"} />
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
