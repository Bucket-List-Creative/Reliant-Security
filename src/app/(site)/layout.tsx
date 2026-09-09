import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, NAVIGATION_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings, NavigationContent } from "@/sanity/lib/types";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ data }, { data: navData }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: NAVIGATION_QUERY }),
  ]);
  const settings = data as SiteSettings | null;
  const navigation = navData as NavigationContent | null;
  const { isEnabled: isDraft } = await draftMode();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar
        siteTitle={settings?.title ?? "Reliant Security"}
        emergencyPhone={settings?.emergencyPhone}
        navigation={navigation}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} navigation={navigation} />
      {/* Enables real-time content updates from Sanity across the site. */}
      <SanityLive />

      {/* Draft preview only. `VisualEditing` wires the click-to-edit overlay
          the Studio's Presentation tool uses; the banner is the way out, since
          draft mode is a cookie and would otherwise follow an editor around
          the live site looking like the site is showing the wrong content. */}
      {isDraft && (
        <>
          <VisualEditing />
          {/* Deliberately a plain anchor: this endpoint clears the draft-mode
              cookie and redirects. A client-side <Link> navigation would fetch
              the RSC payload instead of performing the document request that
              applies the cleared cookie, so the banner would stay. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/draft-mode/disable"
            className="fixed bottom-4 left-4 rounded-[var(--radius-pill)] bg-ink px-4 py-2 text-sm font-semibold text-white"
            style={{
              zIndex: "var(--z-overlay)",
              boxShadow: "var(--shadow-overlay)",
            }}
          >
            Previewing drafts · exit
          </a>
        </>
      )}
    </div>
  );
}
