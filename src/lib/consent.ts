/**
 * Cookie consent, wired to Google Consent Mode v2.
 *
 * The banner is not decoration: GTM is loaded on every page, so without this
 * the container's tags would set cookies before anyone agreed to anything.
 * Consent Mode is the mechanism that makes the choice real — tags still load,
 * but Google's own tags withhold storage until `analytics_storage` and friends
 * are granted.
 *
 * ── ORDERING IS THE WHOLE TRICK ───────────────────────────────────────────
 *
 * `gtag('consent','default',…)` must execute *before* `gtm.js`, or tags can
 * fire once in a consented state before the default lands. That is why the
 * default call ships as a `beforeInteractive` inline script in the root
 * layout rather than from a React effect — effects run after hydration, which
 * is far too late.
 */

/** Bumping this re-asks everyone. Do that if the categories change. */
export const CONSENT_STORAGE_KEY = "reliant.cookie-consent.v1";

export type ConsentChoice = "granted" | "denied";

/**
 * Fired by the footer's "Cookie settings" control to reopen the banner.
 * Withdrawing consent has to be as easy as giving it, and a banner that can
 * only ever be answered once does not allow that.
 */
export const CONSENT_REOPEN_EVENT = "reliant:open-cookie-settings";

/**
 * The Consent Mode v2 signals this site actually has an opinion about.
 * `security_storage` is deliberately absent — it covers things like fraud
 * prevention, is always granted, and is set in the default script.
 */
export const CONSENT_SIGNALS = [
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
  "analytics_storage",
  "functionality_storage",
  "personalization_storage",
] as const;

/**
 * Inline JS for the `beforeInteractive` script.
 *
 * Reads any previous answer synchronously so a returning visitor who accepted
 * is not briefly defaulted to denied — that gap is exactly when the first
 * pageview fires, and it would be lost.
 *
 * `wait_for_update` gives the banner a moment to apply a stored choice before
 * tags decide, and everything is wrapped in try/catch because `localStorage`
 * throws outright in some privacy modes rather than returning null.
 */
export function consentDefaultScript(): string {
  // Each signal takes the value of the `stored` variable the script computes.
  const signals = CONSENT_SIGNALS.map((s) => `${s}: stored`).join(", ");
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var stored = 'denied';
try {
  if (window.localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}) === 'granted') {
    stored = 'granted';
  }
} catch (e) {}
gtag('consent', 'default', { ${signals}, security_storage: 'granted', wait_for_update: 500 });
`.trim();
}

type ConsentWindow = typeof window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/** Apply a choice to Consent Mode and let GTM triggers react to it. */
export function applyConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;

  const w = window as ConsentWindow;
  w.dataLayer = w.dataLayer || [];

  const update = Object.fromEntries(
    CONSENT_SIGNALS.map((signal) => [signal, choice]),
  );

  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", update);
  } else {
    // The default script defines `gtag` globally, so this is a safety net for
    // the case where it was blocked or stripped. It must push a genuine
    // Arguments object: `gtag()` pushes `arguments`, and GTM's consent API
    // recognises that shape specifically — a plain array is ignored, which
    // would silently leave consent denied forever.
    const asArguments = function (): IArguments {
      // eslint-disable-next-line prefer-rest-params
      return arguments;
    };
    w.dataLayer.push(
      (asArguments as (...args: unknown[]) => IArguments)(
        "consent",
        "update",
        update,
      ),
    );
  }

  w.dataLayer.push({
    event: "cookie_consent_update",
    cookie_consent: choice,
  });
}

export function readStoredConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Privacy mode, or storage disabled. Treat as "not yet asked" — the banner
    // reappears, which is the honest outcome when the answer can't be kept.
    return null;
  }
}

export function storeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Nothing to do: the choice still applies for this page view.
  }
  listeners.forEach((notify) => notify());
}

/* ------------------------------------------------------------------ */
/*  External store, so the banner can read stored consent without a    */
/*  setState-in-effect. `localStorage` genuinely is an external store, */
/*  which is what `useSyncExternalStore` exists for.                   */
/* ------------------------------------------------------------------ */

const listeners = new Set<() => void>();

export function subscribeConsent(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/**
 * `"unknown"` is what the server returns, and it is not the same as `null`.
 * `null` means "asked, no answer stored" — which shows the banner. The server
 * cannot know either way, so it must not render the banner and flash it at
 * every visitor who already answered.
 */
export type ConsentSnapshot = ConsentChoice | null | "unknown";

export function getConsentSnapshot(): ConsentSnapshot {
  return readStoredConsent();
}

export function getConsentServerSnapshot(): ConsentSnapshot {
  return "unknown";
}
