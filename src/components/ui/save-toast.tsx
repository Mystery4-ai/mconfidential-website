"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

const noop = () => {};
const SaveToastContext = createContext<(message: string) => void>(noop);

// No-op outside a provider (e.g. the property-creation page, which redirects
// on success and has nothing to show a toast about) so callers don't need to
// guard every call site.
export function useSaveToast() {
  return useContext(SaveToastContext);
}

// One banner shared by every edit-page widget (photos, brochure, floor
// plans, lots, status) so there is a single, consistent place to look for
// save confirmation instead of a different message under each section.
export function SaveToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    timeoutRef.current = setTimeout(() => setMessage(null), 3000);
  }, []);

  return (
    <SaveToastContext.Provider value={notify}>
      {children}
      {message && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <div className="flex items-center gap-2 rounded-sm bg-charcoal px-4 py-2.5 text-sm text-ivory shadow-lg">
            <CheckCircle2 size={16} className="text-status-published" />
            {message}
          </div>
        </div>
      )}
    </SaveToastContext.Provider>
  );
}
