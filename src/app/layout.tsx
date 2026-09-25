import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { SITE_URL } from "@/config/site";
import "./globals.css";

/**
 * Google Tag Manager container. Everything else — GA4, conversion tags, the
 * rest — is configured inside GTM rather than added to this file, which is the
 * point of using a container at all.
 *
 * This also satisfies Google Search Console's "Google Tag Manager"
 * verification method. It does NOT place a `google-site-verification` meta
 * tag; if that method is wanted instead, add the content value to
 * `metadata.verification.google` below — Next renders the tag from there.
 *
 * Hardcoded rather than an env var: a container ID is public (it ships in the
 * page source on every request) and must be identical across environments for
 * GTM's own environment and hostname rules to work.
 */
const GTM_CONTAINER_ID = "GTM-P58JD797";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Reliant Security — Security & low-voltage integration",
    template: "%s · Reliant Security",
  },
  description:
    "Locally owned security and low-voltage integrator serving homes, custom homes, multi-family, commercial, industrial, and government facilities — video surveillance, access control, structured cabling and fiber, audio/video, and 24/7 professional monitoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      {/* Loads after hydration, so the container never blocks first paint. */}
      <GoogleTagManager gtmId={GTM_CONTAINER_ID} />
      <body className="min-h-full">
        {/*
          Google's companion tag for visitors with JavaScript disabled. The
          `GoogleTagManager` component does not render it, and Google's own
          install instructions put it immediately after the opening <body>.
        */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
