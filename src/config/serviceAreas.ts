/**
 * Service-area map data + configuration.
 *
 * The map (see `src/components/ui/ServiceAreaMap.tsx`) uses the Google Maps
 * JavaScript API. To add a new
 * community, just append an entry to `RAW_LOCATIONS` below — the map, search,
 * region filter, and service-area boundary all update automatically.
 */

export type ServiceRegion =
  | "St. Louis County"
  | "St. Louis City"
  | "St. Charles County"
  | "Jefferson County"
  | "Lincoln County"
  | "Franklin County"
  | "Warren County";

export type ServiceLocation = {
  name: string;
  lat: number;
  lng: number;
  region: ServiceRegion;
  /** Optionally emphasise a location (e.g. HQ) in future. */
  featured?: boolean;
};

/* ------------------------------------------------------------------ */
/*  Map appearance & tiles                                             */
/* ------------------------------------------------------------------ */

export const MAP_CONFIG = {
  colors: {
    primary: "#008c58", // brand green (matches --color-brand)
    dark: "#00734a", // brand-press
    accent: "#6EE16E",
    boundary: "#00734a", // service-area outline
    boundaryFill: "rgba(0,140,88,0.10)",
  },
  maxZoom: 18,
  /** Fallback view if the boundary can't be computed. */
  defaultCenter: [38.72, -90.55] as [number, number],
  defaultZoom: 9,
} as const;

/**
 * ── Google Maps API key ─────────────────────────────────────────────
 * Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...` to `.env.local` and to the hosting
 * provider's build environment.
 * Because it ships to the browser it is a PUBLIC key — lock it down with an
 * HTTP-referrer restriction in the Google Cloud console.
 */
export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/* ------------------------------------------------------------------ */
/*  Locations                                                          */
/*  Region defaults to "St. Louis County"; overrides below cover the   */
/*  outlying counties. Edit REGION_OVERRIDES to re-file a community.    */
/* ------------------------------------------------------------------ */

const REGION_OVERRIDES: Record<string, ServiceRegion> = {
  "St. Louis": "St. Louis City",

  // St. Charles County
  "Lake St. Louis": "St. Charles County",
  "Dardenne Prairie": "St. Charles County",
  Foristell: "St. Charles County",
  "Weldon Spring": "St. Charles County",
  "Weldon Spring Heights": "St. Charles County",
  Josephville: "St. Charles County",
  "St. Paul": "St. Charles County",
  Cottleville: "St. Charles County",
  "New Melle": "St. Charles County",
  Defiance: "St. Charles County",
  Augusta: "St. Charles County",
  "Portage Des Sioux": "St. Charles County",
  "West Alton": "St. Charles County",
  "Flint Hill": "St. Charles County",

  // Lincoln County
  Foley: "Lincoln County",
  "Fountain N' Lakes": "Lincoln County",
  "Old Monroe": "Lincoln County",
  "Hawk Point": "Lincoln County",
  "Chain Rocks": "Lincoln County",
  "Moscow Mills": "Lincoln County",
  Troy: "Lincoln County",
  Elsberry: "Lincoln County",
  Winfield: "Lincoln County",
  Whiteside: "Lincoln County",
  Truxton: "Lincoln County",
  Ashley: "Lincoln County",
  "St. Clement": "Lincoln County",

  // Warren County
  Innsbrook: "Warren County",
  Pendleton: "Warren County",

  // Franklin County
  Washington: "Franklin County",
  Union: "Franklin County",
  Pacific: "Franklin County",
  "New Haven": "Franklin County",
  Leslie: "Franklin County",
  "St. Clair": "Franklin County",
  "Villa Ridge": "Franklin County",

  // Jefferson County
  Arnold: "Jefferson County",
  Herculaneum: "Jefferson County",
  Imperial: "Jefferson County",
  "High Ridge": "Jefferson County",
  Festus: "Jefferson County",
  "Crystal City": "Jefferson County",
  Pevely: "Jefferson County",
  "De Soto": "Jefferson County",
  Hillsboro: "Jefferson County",
  "Byrnes Mill": "Jefferson County",
  Murphy: "Jefferson County",
  "Cedar Hill Lakes": "Jefferson County",
  "Cedar Hill": "Jefferson County",
  Barnhart: "Jefferson County",
  Charmwood: "Jefferson County",
};

const RAW_LOCATIONS: { name: string; lat: number; lng: number }[] = [
  { name: "Lake St. Louis", lat: 38.7850251, lng: -90.7935034 },
  { name: "Dardenne Prairie", lat: 38.7694969, lng: -90.7290157 },
  { name: "Town Country", lat: 38.6543918, lng: -90.3657367 },
  { name: "St. Clement", lat: 39.2833773, lng: -91.2093117 },
  { name: "Foristell", lat: 38.8150501, lng: -90.955972 },
  { name: "Kirkwood", lat: 38.5800713, lng: -90.4069177 },
  { name: "Des Peres", lat: 38.6049811, lng: -90.4426837 },
  { name: "Ladue", lat: 38.6497743, lng: -90.3806725 },
  { name: "Foley", lat: 39.0464386, lng: -90.742347 },
  { name: "Fountain N' Lakes", lat: 38.9689383, lng: -90.8501316 },
  { name: "Innsbrook", lat: 38.769216, lng: -91.0520884 },
  { name: "Weldon Spring", lat: 38.7169869, lng: -90.650724 },
  { name: "Truxton", lat: 39.0019868, lng: -91.2398745 },
  { name: "Bridgeton", lat: 38.7566055, lng: -90.42352 },
  { name: "Old Monroe", lat: 38.9317176, lng: -90.7467924 },
  { name: "Hawk Point", lat: 38.9708784, lng: -91.1312584 },
  { name: "Wildwood", lat: 38.5806948, lng: -90.6314374 },
  { name: "Chain Rocks", lat: 38.9150505, lng: -90.801518 },
  { name: "Black Jack", lat: 38.7933833, lng: -90.2673346 },
  { name: "Fenton", lat: 38.5131989, lng: -90.4400578 },
  { name: "Ellisville", lat: 38.5946373, lng: -90.584838 },
  { name: "Josephville", lat: 38.8270021, lng: -90.7855156 },
  { name: "Whiteside", lat: 39.185324, lng: -91.0168045 },
  { name: "Pendleton", lat: 38.8272674, lng: -91.2351535 },
  { name: "Creve Coeur", lat: 38.6613007, lng: -90.4423653 },
  { name: "Berkeley", lat: 38.7544952, lng: -90.3312256 },
  { name: "Richmond Heights", lat: 38.6282707, lng: -90.3191285 },
  { name: "Flint Hill", lat: 38.8550506, lng: -90.8612442 },
  { name: "University City", lat: 38.6569083, lng: -90.3103443 },
  { name: "Ferguson", lat: 38.744707, lng: -90.3038975 },
  { name: "Olivette", lat: 38.6653297, lng: -90.3759499 },
  { name: "Frontenac", lat: 38.6358442, lng: -90.4149786 },
  { name: "Clayton", lat: 38.6504352, lng: -90.3362473 },
  { name: "St. Paul", lat: 38.8619942, lng: -90.7419676 },
  { name: "Cottleville", lat: 38.7489107, lng: -90.6532316 },
  { name: "Arnold", lat: 38.4226711, lng: -90.3758287 },
  { name: "Sunset Hills", lat: 38.5389423, lng: -90.407341 },
  { name: "St. Ann", lat: 38.7281444, lng: -90.3879082 },
  { name: "Moscow Mills", lat: 38.9478267, lng: -90.9181916 },
  { name: "Troy", lat: 38.9794923, lng: -90.9806954 },
  { name: "Herculaneum", lat: 38.2683879, lng: -90.3801201 },
  { name: "Eureka", lat: 38.5025537, lng: -90.6279044 },
  { name: "Imperial", lat: 38.3652768, lng: -90.3770869 },
  { name: "High Ridge", lat: 38.459024, lng: -90.5341443 },
  { name: "Festus", lat: 38.2207112, lng: -90.3959504 },
  { name: "Charmwood", lat: 38.5638644, lng: -90.4310792 },
  { name: "Elsberry", lat: 39.1667151, lng: -90.7809598 },
  { name: "Winfield", lat: 38.9972723, lng: -90.738458 },
  { name: "St. George", lat: 38.53672, lng: -90.3148334 },
  { name: "Velda City", lat: 38.6940176, lng: -90.2954064 },
  { name: "Washington", lat: 37.9559513, lng: -90.879099 },
  { name: "Leslie", lat: 38.4178279, lng: -91.2320949 },
  { name: "Pacific", lat: 38.481809, lng: -90.7415865 },
  { name: "Old Jamestown", lat: 38.8404225, lng: -90.278034 },
  { name: "New Melle", lat: 38.7090342, lng: -90.8812787 },
  { name: "Wellston", lat: 38.6761876, lng: -90.2875157 },
  { name: "Glasgow Village", lat: 38.7589521, lng: -90.1995493 },
  { name: "Union", lat: 38.4443875, lng: -91.0082308 },
  { name: "Crystal Lake Park", lat: 38.6209224, lng: -90.4331001 },
  { name: "Concord", lat: 38.5164121, lng: -90.3550237 },
  { name: "Cedar Hill Lakes", lat: 38.3297759, lng: -90.6576279 },
  { name: "Mehlville", lat: 38.504944, lng: -90.3156373 },
  { name: "Affton", lat: 38.545831, lng: -90.3247272 },
  { name: "Huntleigh", lat: 38.6158859, lng: -90.4106738 },
  { name: "De Soto", lat: 38.1388113, lng: -90.5539205 },
  { name: "Hillsboro", lat: 38.2322766, lng: -90.5629034 },
  { name: "Byrnes Mill", lat: 38.4378319, lng: -90.581792 },
  { name: "Pevely", lat: 38.2833879, lng: -90.3951204 },
  { name: "Murphy", lat: 38.4902905, lng: -90.4868599 },
  { name: "Spanish Lake", lat: 38.793076, lng: -90.206779 },
  { name: "Crystal City", lat: 38.2211656, lng: -90.3790094 },
  { name: "Jennings", lat: 38.719184, lng: -90.2611199 },
  { name: "New Haven", lat: 38.6083822, lng: -91.2190416 },
  { name: "West Alton", lat: 38.8653432, lng: -90.2225438 },
  { name: "Oakville", lat: 38.4392708, lng: -90.3160071 },
  { name: "Twin Oaks", lat: 38.566873, lng: -90.4992354 },
  { name: "Oakland", lat: 38.5764418, lng: -90.3856733 },
  { name: "Normandy", lat: 38.7054848, lng: -90.3014077 },
  { name: "Chesterfield", lat: 38.6581764, lng: -90.5680617 },
  { name: "Green Park", lat: 38.5236642, lng: -90.33845 },
  { name: "Manchester", lat: 38.5925305, lng: -90.5107453 },
  { name: "Lemay", lat: 38.5298085, lng: -90.28194 },
  { name: "Norwood Court", lat: 38.7186606, lng: -90.2909663 },
  { name: "St. Clair", lat: 38.347512972695746, lng: -90.98294923943675 },
  { name: "Marlborough", lat: 38.5703304, lng: -90.3370606 },
  { name: "Crestwood", lat: 38.5587773, lng: -90.3835408 },
  { name: "Greendale", lat: 38.6953291, lng: -90.31317 },
  { name: "Warson Woods", lat: 38.6062824, lng: -90.3899744 },
  { name: "Edmundson", lat: 38.7358844, lng: -90.3640045 },
  { name: "Grantwood Village", lat: 38.5514665, lng: -90.351614 },
  { name: "Calverton Park", lat: 38.7647727, lng: -90.313725 },
  { name: "Brentwood", lat: 38.6175522, lng: -90.3492829 },
  { name: "Dellwood", lat: 38.749495, lng: -90.2856687 },
  { name: "Charlack", lat: 38.7055226, lng: -90.3424137 },
  { name: "Augusta", lat: 38.5725523, lng: -90.8820811 },
  { name: "Country Club Hills", lat: 38.7208841, lng: -90.2748352 },
  { name: "Kinloch", lat: 38.7406065, lng: -90.3253922 },
  { name: "Wilbur Park", lat: 38.5531082, lng: -90.3095599 },
  { name: "Pagedale", lat: 38.674973, lng: -90.3094257 },
  { name: "Sycamore Hills", lat: 38.7008847, lng: -90.3498377 },
  { name: "Hanley Hills", lat: 38.6858847, lng: -90.3237259 },
  { name: "Rock Hill", lat: 38.609008, lng: -90.3653224 },
  { name: "Bellerive Acres", lat: 38.71144, lng: -90.3140032 },
  { name: "Glendale", lat: 38.59565, lng: -90.3862576 },
  { name: "Woodson Terrace", lat: 38.7329689, lng: -90.3573974 },
  { name: "Westwood", lat: 38.6436636, lng: -90.439841 },
  { name: "Uplands Park", lat: 38.6931067, lng: -90.2823356 },
  { name: "Sappington", lat: 38.520607, lng: -90.3712075 },
  { name: "Valley Park", lat: 38.5493603, lng: -90.4912719 },
  { name: "Hazelwood", lat: 38.7761446, lng: -90.3715909 },
  { name: "Webster Groves", lat: 38.592339, lng: -90.3564329 },
  { name: "Villa Ridge", lat: 38.4630715, lng: -90.8791318 },
  { name: "Ballwin", lat: 38.5961694, lng: -90.5387318 },
  { name: "Clarkson Valley", lat: 38.6264278, lng: -90.5941313 },
  { name: "Breckenridge Hills", lat: 38.71978, lng: -90.367624 },
  { name: "Portage Des Sioux", lat: 38.9250486, lng: -90.3417806 },
  { name: "Maryland Heights", lat: 38.7150511, lng: -90.435999 },
  { name: "Weldon Spring Heights", lat: 38.7050946, lng: -90.6851812 },
  { name: "Glen Echo Park", lat: 38.7011622, lng: -90.2978917 },
  { name: "Shrewsbury", lat: 38.5867465, lng: -90.3269665 },
  { name: "Florissant", lat: 38.7919683, lng: -90.3227803 },
  { name: "St. John", lat: 38.710759, lng: -90.3499203 },
  { name: "Winchester", lat: 38.5903311, lng: -90.5279 },
  { name: "Bel-Ridge", lat: 38.7094956, lng: -90.3253924 },
  { name: "Maplewood", lat: 38.6125521, lng: -90.3245599 },
  { name: "Overland", lat: 38.7011626, lng: -90.3623381 },
  { name: "Flordell Hills", lat: 38.7175508, lng: -90.2656683 },
  { name: "Vinita Park", lat: 38.6938549, lng: -90.3347998 },
  { name: "Pine Lawn", lat: 38.6910057, lng: -90.2768905 },
  { name: "Lakeshire", lat: 38.538664, lng: -90.3351164 },
  { name: "Hillsdale", lat: 38.6833845, lng: -90.2840025 },
  { name: "Northwoods", lat: 38.7042177, lng: -90.2834467 },
  { name: "Moline Acres", lat: 38.7469948, lng: -90.2401117 },
  { name: "Riverview", lat: 38.7478279, lng: -90.2114995 },
  { name: "Bella Villa", lat: 38.5436313, lng: -90.285449 },
  { name: "Beverly Hills", lat: 38.6952766, lng: -90.2860179 },
  { name: "Cool Valley", lat: 38.725913, lng: -90.3059184 },
  { name: "Bel-Nor", lat: 38.7015285, lng: -90.3182753 },
  { name: "Pasadena Hills", lat: 38.7083843, lng: -90.2928914 },
  { name: "Pasadena Park", lat: 38.7106066, lng: -90.2981694 },
  { name: "Bellefontaine Neighbors", lat: 38.7403281, lng: -90.2265001 },
  { name: "Velda Village Hills", lat: 38.6906068, lng: -90.2873358 },
  { name: "Barnhart", lat: 38.3397205, lng: -90.4067425 },
  { name: "Defiance", lat: 38.6326337, lng: -90.7843343 },
  { name: "St. Louis", lat: 38.6254063, lng: -90.190009 },
  { name: "Cedar Hill", lat: 38.357791, lng: -90.6314344 },
  { name: "Ashley", lat: 39.2511547, lng: -91.2204236 },
];

/** Every service-area community, region-tagged and sorted alphabetically. */
export const SERVICE_LOCATIONS: ServiceLocation[] = RAW_LOCATIONS.map((p) => ({
  ...p,
  region: REGION_OVERRIDES[p.name] ?? "St. Louis County",
})).sort((a, b) => a.name.localeCompare(b.name));

/** Distinct regions present in the data, for the map's filter dropdown. */
export const SERVICE_REGIONS: ServiceRegion[] = Array.from(
  new Set(SERVICE_LOCATIONS.map((l) => l.region)),
).sort((a, b) => a.localeCompare(b)) as ServiceRegion[];

/**
 * Reliant's home location. The home-page map shows a clean service-area
 * outline with this single pin, rather than a pin on every community — the
 * dense pin cluster read as noise. The full searchable, per-community map is
 * still used on the Contact page.
 */
export const HOME_BASE: ServiceLocation = {
  name: "O'Fallon",
  lat: 38.8106,
  lng: -90.6998,
  region: "St. Charles County",
  featured: true,
};
