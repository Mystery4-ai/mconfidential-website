"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * Last safety net of the backoffice: any action that throws lands here instead
 * of the browser's blank "Application error" page.
 */
export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md py-16">
      <h1 className="font-serif text-xl text-charcoal">Cette action n’a pas abouti</h1>
      <p className="mt-2 text-sm text-charcoal-soft">
        Le site n’a pas pu aller au bout. Si vous envoyiez un fichier, il pèse peut-être plus de
        4 Mo : réduisez-le puis réessayez.
      </p>
      <Button type="button" size="sm" onClick={() => retry()} className="mt-4">
        Réessayer
      </Button>
    </div>
  );
}
