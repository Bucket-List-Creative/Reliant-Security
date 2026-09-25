"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  CONSENT_REOPEN_EVENT,
  applyConsent,
  getConsentServerSnapshot,
  getConsentSnapshot,
  storeConsent,
  subscribeConsent,
  type ConsentChoice,
} from "@/lib/consent";

/**
 * Cookie consent banner, wired to Google Consent Mode v2.
 *
 * Two buttons, no pre-ticked boxes and no way to dismiss without answering:
 * a close button that silently leaves tracking on is the pattern regulators
 * actually fine people for, and "reject" has to be reachable in one click
 * rather than buried behind a settings screen.
 *
 * Consent is already denied by default before GTM loads (see the
 * `beforeInteractive` script in the root layout), so nothing is being stored
 * while this banner is on screen — the choice only ever loosens that.
 */
export function CookieBanner() {
  // Read straight from the store rather than copying it into state in an
  // effect. The server snapshot is "unknown", which renders nothing — it has
  // no way to know what this visitor chose, and guessing would flash the
  // banner at everyone who already answered.
  const stored = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  // Separate from `stored`, because reopening shows the banner to someone who
  // has already answered.
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const reopen = () => setReopened(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  const choose = useCallback((choice: ConsentChoice) => {
    applyConsent(choice);
    // Notifies the store, which re-renders this component with the new answer.
    storeConsent(choice);
    setReopened(false);
  }, []);

  if (stored === "unknown") return null;
  if (stored !== null && !reopened) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-heading"
      className="fixed inset-x-0 bottom-0 p-4 sm:p-6"
      style={{ zIndex: "var(--z-overlay)" }}
    >
      <div
        className="mx-auto flex max-w-[var(--container-site)] flex-col gap-4 rounded-[var(--radius-lg)] bg-surface-raised p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
        style={{ boxShadow: "var(--shadow-overlay)" }}
      >
        <div className="max-w-2xl">
          <h2
            id="cookie-banner-heading"
            className="text-base font-semibold text-ink"
          >
            Cookies on this site
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-n-700">
            We use cookies to understand how the site is used and to measure our
            advertising. Nothing is stored until you choose. See our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-brand-press underline underline-offset-2"
            >
              privacy policy
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-none flex-col gap-3 sm:flex-row">
          {/* Reject is listed first and styled with equal weight on purpose —
              making it harder to find than "accept" is the thing that turns a
              consent banner into a dark pattern. */}
          <button
            type="button"
            onClick={() => choose("denied")}
            className="sfc-btn sfc-btn--outline"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="sfc-btn sfc-btn--primary"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
