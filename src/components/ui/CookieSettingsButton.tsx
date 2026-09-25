"use client";

import { CONSENT_REOPEN_EVENT } from "@/lib/consent";

/**
 * Reopens the cookie banner so a choice can be changed or withdrawn.
 *
 * Its own component because the footer is a Server Component and this needs an
 * onClick; a custom window event keeps the two from having to share state
 * across that boundary.
 */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT))}
      className="underline underline-offset-2 transition-colors hover:text-ink"
    >
      Cookie settings
    </button>
  );
}
