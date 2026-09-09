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
    </div>
  );
}
