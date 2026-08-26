"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type * as Leaflet from "leaflet";
import { IconSearch, IconX, IconChevronRight } from "@tabler/icons-react";
import {
  SERVICE_LOCATIONS,
  SERVICE_REGIONS,
  MAP_CONFIG,
  HOME_BASE,
  type ServiceLocation,
  type ServiceRegion,
} from "@/config/serviceAreas";

const LOGO_SRC = "/Images/Logo/logo-icon.png";

type Props = {
  locations?: ServiceLocation[];
  /** Map height in px. Defaults to 520. */
  height?: number;
  showSearch?: boolean;
  showFilter?: boolean;
  showSidebar?: boolean;
  showBoundary?: boolean;
  /**
   * `"all"` drops a pin on every community. `"home"` draws the same
   * service-area outline but marks only Reliant's O'Fallon home location —
   * a cleaner read for the home page, where the dense pin cluster was noise.
   */
  pins?: "all" | "home";
  className?: string;
};

/** Convex hull (Andrew's monotone chain) → ordered [lat,lng] ring. */
function convexHull(pts: ServiceLocation[]): [number, number][] {
  if (pts.length < 3) return [];
  const xy = pts
    .map((p) => [p.lng, p.lat] as [number, number])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (
    o: [number, number],
    a: [number, number],
    b: [number, number],
  ) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of xy) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
    )
      lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = xy.length - 1; i >= 0; i--) {
    const p = xy[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
    )
      upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper).map(([lng, lat]) => [lat, lng] as [number, number]);
}

/** Shorten a county name for a filter pill, e.g. "St. Charles County" → "St. Charles Co." */
function shortRegion(r: ServiceRegion): string {
  return r.replace(/ County$/, " Co.");
}

export function ServiceAreaMap({
  locations = SERVICE_LOCATIONS,
  height = 520,
  showSearch = true,
  showFilter = true,
  showSidebar = true,
  showBoundary = true,
  pins = "all",
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const layerRef = useRef<Leaflet.LayerGroup | null>(null);
  const markerByName = useRef<Map<string, Leaflet.Marker>>(new Map());

  const [ready, setReady] = useState(false);
  const [region, setRegion] = useState<"all" | ServiceRegion>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  // Region-filtered set drives the map.
  const visible = useMemo(
    () =>
      region === "all"
        ? locations
        : locations.filter((l) => l.region === region),
    [locations, region],
  );

  // Region + text-search drives the sidebar list.
  const listed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? visible.filter((l) => l.name.toLowerCase().includes(q)) : visible;
  }, [visible, query]);

  // Group the listed locations by region for the sidebar.
  const grouped = useMemo(() => {
    const map = new Map<ServiceRegion, ServiceLocation[]>();
    for (const loc of listed) {
      const arr = map.get(loc.region) ?? [];
      arr.push(loc);
      map.set(loc.region, arr);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [listed]);

  const regionsInView = useMemo(
    () => [...new Set(visible.map((l) => l.region))].sort(),
    [visible],
  );
  const areaText =
    region !== "all"
      ? region
      : regionsInView.length <= 2
        ? regionsInView.join(" and ")
        : "the greater St. Louis area";

  // ---- Init map once ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import("leaflet");
      const L = (mod.default ?? mod) as typeof Leaflet;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        zoomControl: true,
      }).setView(MAP_CONFIG.defaultCenter, MAP_CONFIG.defaultZoom);

      L.tileLayer(MAP_CONFIG.tileUrl, {
        attribution: MAP_CONFIG.tileAttribution,
        maxZoom: MAP_CONFIG.maxZoom,
      }).addTo(map);

      LRef.current = L;
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      setReady(false);
    };
  }, []);

  // ---- (Re)draw markers + boundary when the visible set changes ----
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !L || !map || !layer) return;

    layer.clearLayers();
    markerByName.current.clear();

    // The boundary is always computed from every visible community; only the
    // pins differ between modes.
    const pinned = pins === "home" ? [HOME_BASE] : visible;

    pinned.forEach((loc) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="reliant-logo-pin"><img src="${LOGO_SRC}" alt="" /></div>`,
        iconSize: [40, 46],
        iconAnchor: [20, 46],
        tooltipAnchor: [0, -42],
      });
      const m = L.marker([loc.lat, loc.lng], { icon }).addTo(layer);
      m.bindTooltip(
        pins === "home" ? `Reliant Security — ${loc.name}, MO` : loc.name,
        { direction: "top", className: "reliant-map-tooltip" },
      );
      m.on("click", () => setSelected(loc.name));
      markerByName.current.set(loc.name, m);
    });

    let bounds: Leaflet.LatLngBounds | null = null;
    if (showBoundary) {
      const hull = convexHull(visible);
      if (hull.length >= 3) {
        L.polygon(hull, {
          color: MAP_CONFIG.colors.boundary,
          weight: 3,
          opacity: 0.9,
          fillColor: MAP_CONFIG.colors.primary,
          fillOpacity: 0.1,
          dashArray: "8,7",
          lineCap: "round",
          lineJoin: "round",
          interactive: false,
        }).addTo(layer);
        bounds = L.polygon(hull).getBounds();
      }
    }
    if (!bounds && visible.length) {
      bounds = L.latLngBounds(visible.map((l) => [l.lat, l.lng]));
    }
    if (bounds) map.fitBounds(bounds.pad(0.12));
  }, [ready, visible, showBoundary, pins]);

  // ---- Reflect the active selection on the marker ----
  useEffect(() => {
    markerByName.current.forEach((m, name) => {
      const el = m.getElement()?.querySelector(".reliant-logo-pin");
      el?.classList.toggle("is-active", name === selected);
    });
  }, [selected, visible]);

  function goTo(loc: ServiceLocation) {
    const map = mapRef.current;
    if (!map) return;
    setSelected(loc.name);
    map.flyTo([loc.lat, loc.lng], 12, { duration: 0.6 });
    markerByName.current.get(loc.name)?.openTooltip();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (listed.length) goTo(listed[0]);
  }

  const pills: Array<{ value: "all" | ServiceRegion; label: string }> = [
    { value: "all", label: "All areas" },
    ...SERVICE_REGIONS.map((r) => ({ value: r, label: shortRegion(r) })),
  ];

  return (
    <div className={className}>
      {/* Search + filter bar */}
      {(showSearch || showFilter) && (
        <div className="mb-4 flex flex-col gap-3">
          {showSearch && (
            <form
              onSubmit={onSubmit}
              className="flex w-full items-center gap-2 rounded-[var(--radius-pill)] bg-surface-raised py-2 pl-5 pr-2"
              style={{ boxShadow: "var(--shadow-soft-2)" }}
            >
              <IconSearch size={20} className="flex-none text-n-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your city or town…"
                aria-label="Search service-area communities"
                className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-n-500"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="flex-none text-n-500 hover:text-ink"
                >
                  <IconX size={18} />
                </button>
              )}
              <button type="submit" className="sfc-btn sfc-btn--primary flex-none">
                Search
              </button>
            </form>
          )}

          {showFilter && (
            <div className="flex flex-wrap gap-2">
              {pills.map((p) => {
                const active = region === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setRegion(p.value)}
                    aria-pressed={active}
                    className={`inline-flex items-center rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-brand-press text-white"
                        : "bg-surface-raised text-n-700 hover:text-ink"
                    }`}
                    style={
                      active ? undefined : { boxShadow: "var(--shadow-soft-1)" }
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Count line */}
      <p className="mb-4 text-n-700">
        Serving <span className="font-bold text-ink">{visible.length}</span>{" "}
        {region !== "all" ? "cities in" : "communities across"} {areaText}.
      </p>

      {/* Sidebar + map */}
      <div
        className={
          showSidebar
            ? "grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]"
            : undefined
        }
      >
        {showSidebar && (
          <aside
            className="order-2 flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-surface-raised lg:order-1"
            style={{ boxShadow: "var(--shadow-soft-3)", height }}
          >
            <div className="flex items-center justify-between gap-3 bg-brand-press px-5 py-4 text-white">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide">
                Service locations
              </h3>
              <span className="grid min-w-7 place-items-center rounded-[var(--radius-pill)] bg-white/20 px-2 py-0.5 text-sm font-bold">
                {listed.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {grouped.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-n-500">
                  No matching communities.
                </p>
              )}
              {grouped.map(([reg, locs]) => (
                <div key={reg} className="mb-2">
                  <p className="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-n-500">
                    {reg}
                  </p>
                  <ul>
                    {locs.map((loc) => {
                      const active = selected === loc.name;
                      return (
                        <li key={loc.name}>
                          <button
                            type="button"
                            onClick={() => goTo(loc)}
                            className={`flex w-full items-center gap-2 rounded-[var(--radius-sm)] border-l-2 px-3 py-2.5 text-left transition-colors ${
                              active
                                ? "border-brand bg-surface"
                                : "border-transparent hover:bg-surface"
                            }`}
                          >
                            <span className="flex-1">
                              <span className="block font-semibold text-ink">
                                {loc.name}, MO
                              </span>
                              <span className="block text-xs uppercase tracking-wide text-n-500">
                                {loc.region}
                              </span>
                            </span>
                            <IconChevronRight
                              size={16}
                              className="flex-none text-n-500"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        )}

        <div
          className="relative order-1 overflow-hidden rounded-[var(--radius-lg)] bg-surface-raised lg:order-2"
          style={{ boxShadow: "var(--shadow-soft-3)" }}
        >
          <div
            ref={containerRef}
            style={{ height }}
            className="w-full"
            role="application"
            aria-label="Map of Reliant Security service-area communities"
          />
        </div>
      </div>
    </div>
  );
}
