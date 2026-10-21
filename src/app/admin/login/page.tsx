import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-serif text-2xl text-charcoal">M. Confidential</p>
          <p className="mt-1 text-sm text-charcoal-soft">Espace consultants</p>
        </div>
        <div className="border border-border bg-white/40 p-8">
          <LoginForm callbackUrl={callbackUrl || "/admin"} />
        </div>
      </div>
    </div>
  );
}
