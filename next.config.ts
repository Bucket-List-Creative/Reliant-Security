import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project runs from an exFAT external drive, where macOS scatters
  // hidden `._*` files into every folder — including Turbopack's on-disk
  // cache, which then fails to reopen ("Failed to open database ...
  // invalid digit found in string"). Disabling the persistent dev cache keeps
  // Turbopack's in-memory speed while avoiding the corruption entirely.
  experimental: {
    turbopackFileSystemCacheForDev: false,
    // Tree-shake icon imports from the large Tabler barrel for faster builds.
    optimizePackageImports: ["@tabler/icons-react"],
  },
  images: {
    // Next's image optimizer caches optimized files under `.next/cache/images`.
    // On this exFAT drive, macOS drops `._*` AppleDouble sidecars there and the
    // optimizer reads them back instead of the real image, serving corrupt
    // bytes ("AppleDouble encoded Macintosh file") that browsers can't decode.
    //
    // That is a macOS-on-exFAT problem, not a production one: a Linux host
    // never writes those sidecars. Scoping the workaround to development means
    // local `public/` images are actually optimized in production instead of
    // being served at full size to phones.
    //
    // If a deploy ever serves corrupt images, set this back to `true` and the
    // originals are served directly again — nothing else depends on it.
    // Sanity images are unaffected either way: `SanityImage` marks them
    // `unoptimized` because Sanity's CDN has already done the work.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      // Google review authors' profile photos. Attribution is a condition of
      // showing Places data, and `unoptimized` above doesn't exempt a remote
      // host from this allowlist — without the entry, next/image throws
      // instead of rendering the avatar.
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  // Surface Sanity fetch cache HIT/MISS while developing.
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // The "Case studies" section was renamed to "Projects". Permanently redirect
  // the old paths so any existing links and bookmarks keep working.
  async redirects() {
    return [
      {
        source: "/case-studies",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/case-studies/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
      // Two back-to-school posts competed for the same query. The thinner one
      // was merged into the other; this preserves any link equity it had.
      {
        source:
          "/blog/back-to-school-security-tips-keep-your-st-louis-home-and-business-safe-this-fall",
        destination: "/blog/back-to-school-home-security-tips-for-parents",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
