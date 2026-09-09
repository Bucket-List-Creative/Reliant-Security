/**
 * Reliant's own photography, held in `public/Images/site/` as web-sized WebP
 * crops of the originals under `public/Images/About Us`, `Alarm Systems`, and
 * `Services`. The originals are 10–17 MB camera files and must never be linked
 * directly — `next.config.ts` sets `images.unoptimized`, so whatever path we
 * reference is what the browser downloads.
 *
 * Six originals were cut into 1500×1000 (3:2) frames so service cards get
 * their own image rather than the same photo repeated down the page.
 * A 3:2 source covers both the 16/10 card frame and the 4/3 hero frame without
 * further loss — regenerate at that size with `sharp` if a crop is reworked.
 */

export type Photo = { src: string; alt: string };

export const PHOTOS = {
  /* --- About Us / About_us_Reliant-Security-15.jpg --- */
  ownerPortrait: {
    src: "/Images/site/owner-portrait.webp",
    alt: "A Reliant Security technician standing in front of a branded Reliant service truck.",
  },
  ownerTruck: {
    src: "/Images/site/owner-truck.webp",
    alt: "A Reliant Security technician beside a branded service truck loaded with ladders.",
  },

  /* --- About Us / TruckWide.jpg --- */
  truckWide: {
    src: "/Images/site/truck-wide.webp",
    alt: "A branded Reliant Security service truck parked on a street in the St. Louis metro.",
  },
  truckDecal: {
    src: "/Images/site/truck-decal.webp",
    alt: "Reliant Security truck lettering listing monitored alarms, smart automation, video surveillance, card access, and structured cabling.",
  },

  /* --- About Us / ReliantPH-10.jpg --- */
  installCommercial: {
    src: "/Images/site/install-commercial.webp",
    alt: "A Reliant technician on a ladder installing a low-voltage device in a commercial space.",
  },
  installDetail: {
    src: "/Images/site/install-detail.webp",
    alt: "A Reliant technician mounting a device to an interior wall during an installation.",
  },
  /* --- Alarm Systems / Alarm_system_Reliant-Security-07.jpg --- */
  cameraIndoor: {
    src: "/Images/site/camera-indoor.webp",
    alt: "An indoor surveillance camera mounted at a ceiling line.",
  },
  cameraCeilingDetail: {
    src: "/Images/site/camera-ceiling-detail.webp",
    alt: "Close-up of an indoor surveillance camera mounted to a ceiling.",
  },

  /* --- Alarm Systems / Alarm_system_Reliant-Security-03.jpg --- */
  cameraRestrictedArea: {
    src: "/Images/site/camera-restricted-area.webp",
    alt: "A surveillance camera covering a restricted-area entrance marked 'Employees Only'.",
  },
  cameraDoorDetail: {
    src: "/Images/site/camera-door-detail.webp",
    alt: "Close-up of a weatherproof security camera mounted beside an industrial doorway.",
  },

  /* --- Services / 26.07.23_Reliant-Security-02.jpg --- */
  cameraWirelessLink: {
    src: "/Images/site/camera-wireless-link.webp",
    alt: "An exterior camera and wireless link antenna mounted on a metal industrial building.",
  },
  wirelessDish: {
    src: "/Images/site/wireless-dish.webp",
    alt: "A wireless link antenna mounted on the exterior of a metal industrial building.",
  },
} as const satisfies Record<string, Photo>;

/**
 * Service slug → local hero photo, used when the matching Sanity `service`
 * document has no `heroImage`.
 *
 * Every service in the taxonomy is covered so no card falls back to the
 * placeholder well. Reliant's shoot covers alarms, cameras, and install work,
 * so the services with no literal subject in the library (interactive alarm,
 * wellness monitoring, cyber security, managed IT) carry brand and crew
 * photography instead — generic, but true to the company. Swap those first
 * when new photography arrives.
 *
 * Two images are used twice — `ownerTruck` and `truckWide` — on services in
 * different categories, so the repeats never land next to each other. That is
 * the cost of covering twelve services from one photo shoot.
 */
export const SERVICE_PHOTOS: Record<string, Photo> = {
  // Alarm Systems
  "security-alarm": PHOTOS.cameraDoorDetail,
  "interactive-alarm": PHOTOS.cameraIndoor,
  "wellness-safety-monitoring": PHOTOS.ownerTruck,
  "security-system-installation": PHOTOS.installCommercial,

  // Video & Surveillance
  "cctv-surveillance": PHOTOS.cameraCeilingDetail,
  "wireless-video": PHOTOS.cameraWirelessLink,

  // Infrastructure
  "network-cabling": PHOTOS.wirelessDish,
  "audio-video": PHOTOS.installDetail,

  // Smart Home & Access
  "smart-automation": PHOTOS.truckDecal,
  "access-control": PHOTOS.cameraRestrictedArea,

  // Additional Services
  "cyber-security": PHOTOS.ownerTruck,
  "managed-it": PHOTOS.truckWide,
};

/**
 * Fallback for any service that exists only in Sanity and so isn't in the
 * taxonomy above — keeps the placeholder well off the page entirely.
 */
export const DEFAULT_SERVICE_PHOTO: Photo = PHOTOS.truckDecal;
