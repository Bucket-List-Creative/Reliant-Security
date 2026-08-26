"use client";

import Script from "next/script";
import { SITE_URL } from "@/config/site";

/**
 * Google "Preferred Sources" button.
 *
 * A reader who clicks this adds Reliant as a preferred source in their own
 * Google account. Google then shows this site to THAT READER more often in
 * Top Stories, AI Mode, and AI Overviews.
 *
 * Worth being precise about what it is and isn't:
 *   • It is a per-user preference, not a ranking boost. Its value scales with
 *     how many readers actually click it — it does nothing on its own.
 *   • Eligibility is decided automatically by Google and tracks closely with
 *     whether the domain surfaces in Top Stories. Google's guidance is that
 *     sites publishing fresh content qualify, so this only starts earning its
 *     place once the Resources section is publishing regularly.
 *   • Only domain and subdomain level sites are eligible — not subdirectories.
 *
 * Implementation follows Google's documented embed: their publisher.js script
 * hydrates any element carrying the `google-add-preferred-source-btn`
 * attribute. The attribute has no value, and React needs it spread in rather
 * than written as a JSX prop.
 *
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
export function PreferredSourceButton({
  theme = "light",
  className,
}: {
  theme?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={className}>
      {/*
        afterInteractive matches the `async` in Google's own snippet: it loads
        once hydration is done, without blocking the page. `lazyOnload` waits
        for every image too, which left the button visibly popping in well
        after the rest of the page had settled.

        The component renders in both the footer and the Resources page;
        next/script dedupes by src, so the script is still fetched only once.
      */}
      <Script
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="afterInteractive"
      />
      {/* min-height reserves the button's footprint so hydration doesn't shift
          the surrounding layout. */}
      <div
        className="min-h-10"
        data-theme={theme}
        data-lang="en"
        {...{ "google-add-preferred-source-btn": "" }}
      />
      {/*
        Fallback for anyone with the script blocked: Google's deeplink to the
        same source-preferences entry. Hidden once the button hydrates, so the
        two are never both visible.
      */}
      <noscript>
        <a
          href={`https://www.google.com/preferences/source?q=${encodeURIComponent(
            SITE_URL.replace(/^https?:\/\//, ""),
          )}`}
          className="text-sm font-semibold text-brand-press hover:underline"
        >
          Add Reliant Security as a preferred source on Google
        </a>
      </noscript>
    </div>
  );
}
