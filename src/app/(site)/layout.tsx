import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const settings = data as SiteSettings | null;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar
        siteTitle={settings?.title ?? "Reliant Security"}
        emergencyPhone={settings?.emergencyPhone}
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      {/* Enables real-time content updates from Sanity across the site. */}
      <SanityLive />
    </div>
  );
}
