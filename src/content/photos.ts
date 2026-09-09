/**
 * Reliant's own photography, held in `public/Images/site/` as web-sized WebP
 * crops of the originals under `public/Images/About Us`, `Alarm Systems`,
 * `Services`, and `New Services`. The originals are 0.5–17 MB camera files and
 * must never be linked directly — `next.config.ts` sets `images.unoptimized`,
 * so whatever path we reference is what the browser downloads.
 *
 * Everything here is a 1500×1000 (3:2) frame so service cards get their own
 * image rather than the same photo repeated down the page. A 3:2 source covers
 * both the 16/10 card frame and the 4/3 hero frame without further loss —
 * regenerate at that size with `sharp` if a crop is reworked.
 *
 * The `New Services` set is derived by `scripts/process-service-images.mjs`,
 * which also records the hand-picked crop for each source that isn't already
 * 3:2. Rerun it rather than re-cropping by hand.
 */

export type Photo = {
  src: string;
  alt: string;
  /**
   * `object-position` for the frames that crop this image, e.g. `"right"`.
   *
   * Only needed where the subject can't survive a centre crop. The service
   * hero is `aspect-[16/10] lg:aspect-[4/3]`, and 4:3 trims ~5.5% off each
   * side of a 3:2 source — enough to cut the edge off anything sitting hard
   * against one edge of the frame.
   */
  position?: string;
};

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

  /* --- New Services ---------------------------------------------------
     One image per service, shot or supplied for that service specifically.
     Two carry Reliant's logo and phone number burned into a corner; the
     crops in `scripts/process-service-images.mjs` are chosen to keep them
     whole, so don't re-crop these without checking the corner survives. */
  accessControlReader: {
    src: "/Images/site/access-control.webp",
    alt: "A person holding a keycard to a card reader beside a glass office entrance.",
  },
  cctvMonitorWall: {
    src: "/Images/site/cctv-monitor-wall.webp",
    alt: "A wall-mounted monitor showing a sixteen-camera surveillance grid covering a shop floor, offices, and parking areas.",
  },
  managedItRack: {
    src: "/Images/site/managed-it-rack.webp",
    alt: "A wall-mounted network cabinet of switches and patch panels with a laptop open on a fold-out shelf beside it.",
  },
  cyberSecurityDesk: {
    src: "/Images/site/cyber-security-noc.webp",
    alt: "A monitoring desk of dashboards and network maps beside a server rack patched with fibre.",
  },
  smartAutomationApp: {
    src: "/Images/site/smart-automation-app.webp",
    alt: "Three phone screens showing a smart security app: door status and thermostat, home and away scenes with the system armed, and a live camera view.",
  },
  wirelessVideoAerial: {
    src: "/Images/site/wireless-video-aerial.webp",
    alt: "An aerial view of a rural site with a pole-mounted wireless camera picked out in a highlighted circle.",
  },
  alarmPanel: {
    src: "/Images/site/alarm-panel.webp",
    alt: "A Reliant Security technician operating a wall-mounted alarm touchscreen panel inside a home.",
    // Reliant's logo and phone number are burned into the right of the frame,
    // and the alarm panel sits under them — there is no crop that keeps the
    // subject and drops the logo. Anchoring right means the 4:3 hero eats into
    // the technician's shoulder on the left instead of slicing the last letter
    // off "SECURITY".
    position: "right",
  },
  installExterior: {
    src: "/Images/site/install-exterior.webp",
    alt: "A Reliant Security technician on a ladder mounting a device under the eaves of a house.",
    // Same burned-in logo, bottom-right this time.
    position: "right",
  },
  structuredCablingRack: {
    src: "/Images/site/structured-cabling-rack.webp",
    alt: "A wall-mounted network enclosure with patch panels, blue network runs, and a UPS.",
  },
} as const satisfies Record<string, Photo>;

/**
 * Service slug → local hero photo, used when the matching Sanity `service`
 * document has no `heroImage`.
 *
 * Every service in the taxonomy is covered so no card falls back to the
 * placeholder well. Nine of the twelve now carry an image of the service
 * itself, from the `New Services` set.
 *
 * Three still borrow from the general library, because nothing in either shoot
 * shows them literally — swap these first when photography arrives:
 *   - `interactive-alarm`     (its own asset is a video, see the About page)
 *   - `wellness-safety-monitoring`
 *   - `audio-video`
 *
 * No image is used twice. Keep it that way: two services sharing a photo reads
 * as a stock page, and the repeat is always noticed on the services index
 * where the cards sit in one grid.
 */
export const SERVICE_PHOTOS: Record<string, Photo> = {
  // Alarm Systems
  "security-alarm": PHOTOS.alarmPanel,
  "interactive-alarm": PHOTOS.cameraIndoor,
  "wellness-safety-monitoring": PHOTOS.ownerTruck,
  "security-system-installation": PHOTOS.installExterior,

  // Video & Surveillance
  "cctv-surveillance": PHOTOS.cctvMonitorWall,
  "wireless-video": PHOTOS.wirelessVideoAerial,

  // Infrastructure
  "network-cabling": PHOTOS.structuredCablingRack,
  "audio-video": PHOTOS.installDetail,

  // Smart Home & Access
  "smart-automation": PHOTOS.smartAutomationApp,
  "access-control": PHOTOS.accessControlReader,

  // Additional Services
  "cyber-security": PHOTOS.cyberSecurityDesk,
  "managed-it": PHOTOS.managedItRack,
};

/**
 * Fallback for any service that exists only in Sanity and so isn't in the
 * taxonomy above — keeps the placeholder well off the page entirely.
 */
export const DEFAULT_SERVICE_PHOTO: Photo = PHOTOS.truckDecal;
