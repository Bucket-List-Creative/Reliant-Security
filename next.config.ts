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
    // Disabling optimization serves originals directly — and it costs us
    // nothing here: local logos are already sized, and Sanity images are
    // optimized by Sanity's CDN via the `urlFor()` builder.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
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
    ];
  },
};

export default nextConfig;
