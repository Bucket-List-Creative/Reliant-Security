"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconChevronDown,
  IconMenu2,
  IconX,
  IconArrowRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { ServiceIcon, type ServiceIconKey } from "@/components/ui/ServiceIcon";
import { SERVICE_CATEGORIES } from "@/content/services";

/**
 * Dropdown entries use the shared line-icon set (Tabler, MIT-licensed) rather
 * than emoji. Emoji render differently on every OS, don't inherit `currentColor`
 * so they can't be tinted, and sit visually heavier than the icons beside them.
 */
type NavLeaf = {
  label: string;
  href: string;
  desc?: string;
  iconKey?: ServiceIconKey;
};
type NavColumn = {
  title: string;
  href: string;
  iconKey: ServiceIconKey;
  items: { label: string; href: string; desc?: string }[];
};
type NavItem = {
  label: string;
  href: string;
  children?: NavLeaf[];
  /** Grouped mega-menu (used by Services). */
  columns?: NavColumn[];
};

// Services mega-menu is generated from the shared taxonomy so the navbar and the
// /services page never drift apart.
const SERVICES_COLUMNS: NavColumn[] = SERVICE_CATEGORIES.map((cat) => ({
  title: cat.title,
  href: `/services#${cat.slug}`,
  iconKey: cat.iconKey,
  items: cat.services.map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
    desc: s.tagline,
  })),
}));

// Top-level nav is intentionally small. As new pages are built, add them to the
// most appropriate dropdown group below rather than adding new top-level links.
const NAV: NavItem[] = [
  { label: "Services", href: "/services", columns: SERVICES_COLUMNS },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Residential", href: "/industries?segment=residential", iconKey: "home", desc: "Homes, custom homes & multi-family" },
      { label: "Commercial", href: "/industries?segment=commercial", iconKey: "building", desc: "Offices, retail, healthcare & more" },
      { label: "Industrial", href: "/industries?segment=industrial", iconKey: "factory", desc: "Plants, manufacturing & logistics" },
      { label: "Government", href: "/industries?segment=government", iconKey: "government", desc: "Federal, State, Municipal & DoD" },
      { label: "All industries", href: "/industries", iconKey: "grid", desc: "Browse every sector" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", iconKey: "team", desc: "Our story, team & partners" },
      { label: "Projects", href: "/projects", iconKey: "projects", desc: "Real installations we've delivered" },
      { label: "Resources", href: "/blog", iconKey: "resources", desc: "Guides, insights & industry news" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

/** Grace period before a hover-opened menu closes, so a diagonal mouse path
 *  from the trigger to the panel doesn't dismiss it mid-move. */
const CLOSE_DELAY_MS = 180;

function Chevron({ className = "" }: { className?: string }) {
  return (
    <IconChevronDown className={className} size={14} stroke={2.5} aria-hidden />
  );
}

export function Navbar({
  siteTitle = "Reliant Security",
  emergencyPhone,
}: {
  siteTitle?: string;
  emergencyPhone?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (label: string | null) => {
      cancelClose();
      setActive(label);
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setActive(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => cancelClose, [cancelClose]);

  // Escape closes any open menu and returns focus behaviour to the page.
  useEffect(() => {
    if (!active && !open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActive(null);
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, open]);

  // Clicking or tabbing outside the nav dismisses the panel.
  useEffect(() => {
    if (!active) return;
    function onOutside(e: Event) {
      if (!navRef.current?.contains(e.target as Node)) setActive(null);
    }
    document.addEventListener("pointerdown", onOutside);
    document.addEventListener("focusin", onOutside);
    return () => {
      document.removeEventListener("pointerdown", onOutside);
      document.removeEventListener("focusin", onOutside);
    };
  }, [active]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const ctaHref = emergencyPhone ? `tel:${emergencyPhone}` : "/contact";
  const ctaLabel = emergencyPhone ? `Call ${emergencyPhone}` : "Get a Free Quote";

  return (
    <header
      ref={navRef}
      className="sticky top-0"
      style={{ zIndex: "var(--z-navbar)" }}
    >
      <div className="sfc-container pt-4">
        {/*
          The pill deliberately has NO `overflow: hidden`. The dropdowns are
          absolutely positioned panels anchored to their trigger, so they need
          to escape the pill's bounds — and because they're no longer inside
          it, they can carry their own max-height and scroll.
        */}
        <div
          className="relative rounded-[var(--radius-xl)] bg-brand-press"
          style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}
        >
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label={siteTitle}
              onMouseEnter={scheduleClose}
            >
              <Image
                src="/Images/Logo/logo-icon-white.png"
                alt=""
                width={158}
                height={231}
                priority
                className="h-9 w-auto"
              />
              <span className="hidden font-display text-lg font-bold tracking-tight text-white sm:inline">
                {siteTitle}
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 min-[880px]:flex">
              {NAV.map((item) => {
                const hasMenu = Boolean(item.children || item.columns);
                const isOpen = active === item.label;
                const base =
                  "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-3.5 py-2 text-[0.95rem] font-medium transition-colors";

                if (!hasMenu) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`${base} text-white/85 hover:bg-white/[0.07] hover:text-white`}
                        onMouseEnter={scheduleClose}
                        onFocus={() => openMenu(null)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                const panelId = `nav-panel-${item.label.toLowerCase()}`;

                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => openMenu(item.label)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={item.href}
                      className={`${base} ${
                        isOpen
                          ? "bg-white/[0.11] text-white"
                          : "text-white/85 hover:bg-white/[0.07] hover:text-white"
                      }`}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onFocus={() => openMenu(item.label)}
                      onClick={(e) => {
                        // First click reveals the menu; the label itself is
                        // still reachable via its own "View all" link inside.
                        if (!isOpen) {
                          e.preventDefault();
                          openMenu(item.label);
                        }
                      }}
                    >
                      {item.label}
                      <Chevron
                        className={`mt-0.5 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Link>

                    {/* Compact panels anchor to their own trigger. The wide
                        Services mega-menu is rendered at pill level instead —
                        centring an 896px panel on a nav item pushes it off the
                        side of the viewport. */}
                    {item.children && (
                      <DropdownPanel
                        id={panelId}
                        item={item}
                        isOpen={isOpen}
                        onNavigate={() => setActive(null)}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="hidden min-[880px]:block">
              <Button
                href={ctaHref}
                variant="cta"
                onMouseEnter={scheduleClose}
              >
                {ctaLabel}
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              className="grid size-11 place-items-center rounded-[var(--radius-sm)] text-white transition-colors hover:bg-white/[0.07] min-[880px]:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <IconX size={24} stroke={2} aria-hidden />
              ) : (
                <IconMenu2 size={24} stroke={2} aria-hidden />
              )}
            </button>
          </div>

          {/* Wide mega-menus span the pill, so they stay inside the viewport
              at every desktop width regardless of where their trigger sits. */}
          {NAV.filter((i) => i.columns).map((item) => (
            <DropdownPanel
              key={item.label}
              id={`nav-panel-${item.label.toLowerCase()}`}
              item={item}
              isOpen={active === item.label}
              onNavigate={() => setActive(null)}
              onMouseEnter={() => openMenu(item.label)}
              onMouseLeave={scheduleClose}
            />
          ))}
        </div>

        {/* Mobile sheet — capped and scrollable so long menus never trap the user */}
        {open && (
          <div
            id="mobile-menu"
            className="mt-2 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-[var(--radius-lg)] bg-surface-raised p-3 min-[880px]:hidden"
            style={{ boxShadow: "var(--shadow-overlay)" }}
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => {
                const hasMenu = Boolean(item.children || item.columns);
                const sectionOpen = openSection === item.label;
                return (
                  <li key={item.label}>
                    {hasMenu ? (
                      <>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-4 py-3 text-left font-semibold text-ink"
                          aria-expanded={sectionOpen}
                          onClick={() =>
                            setOpenSection((s) =>
                              s === item.label ? null : item.label,
                            )
                          }
                        >
                          {item.label}
                          <Chevron
                            className={`text-brand-press transition-transform ${
                              sectionOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {sectionOpen &&
                          (item.columns ? (
                            <div className="mb-2 ml-2 border-l-2 border-n-200 pl-3">
                              {item.columns.map((col) => (
                                <div key={col.title} className="py-1">
                                  <Link
                                    href={col.href}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-ink"
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="text-brand-press">
                                      <ServiceIcon name={col.iconKey} size={16} />
                                    </span>
                                    {col.title}
                                  </Link>
                                  <ul>
                                    {col.items.map((it) => (
                                      <li key={it.label}>
                                        <Link
                                          href={it.href}
                                          className="block rounded-[var(--radius-sm)] px-4 py-2 text-sm text-n-700"
                                          onClick={() => setOpen(false)}
                                        >
                                          {it.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <ul className="mb-2 ml-4 border-l-2 border-n-200 pl-2">
                              {item.children?.map((c) => (
                                <li key={c.label}>
                                  <Link
                                    href={c.href}
                                    className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-4 py-2 text-n-700"
                                    onClick={() => setOpen(false)}
                                  >
                                    {c.iconKey && (
                                      <span
                                        aria-hidden
                                        className="flex-none text-brand-press"
                                      >
                                        <ServiceIcon name={c.iconKey} size={18} />
                                      </span>
                                    )}
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ))}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block rounded-[var(--radius-sm)] px-4 py-3 font-semibold text-ink"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
              <li className="mt-2">
                <Button href={ctaHref} variant="cta" className="w-full">
                  {ctaLabel}
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Dropdown panel                                                     */
/* ------------------------------------------------------------------ */

/**
 * A floating panel anchored under its trigger.
 *
 * Two widths: the Services mega-menu is wide and column-based, while the
 * simple link groups get a compact single column anchored to their own item
 * rather than spanning the whole bar. Both cap their height and scroll
 * internally — the previous version grew the navbar pill itself, which had
 * `overflow: hidden`, so a long list simply ran off-screen with no way to
 * reach the rest.
 */
function DropdownPanel({
  id,
  item,
  isOpen,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: {
  id: string;
  item: NavItem;
  isOpen: boolean;
  onNavigate: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const wide = Boolean(item.columns);

  return (
    <div
      id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={[
        "absolute top-full pt-3 transition-all duration-200",
        // Wide panels span their positioned parent (the pill). Compact ones
        // centre on their trigger, which is safe at 22rem.
        wide
          ? "inset-x-0"
          : "left-1/2 w-[min(22rem,calc(100vw-3rem))] -translate-x-1/2",
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-1 opacity-0",
      ].join(" ")}
      // `inert` keeps the closed panel out of the tab order and the
      // accessibility tree without needing to unmount it.
      inert={!isOpen}
    >
      <div
        className="max-h-[min(70vh,32rem)] overflow-y-auto overscroll-contain rounded-[var(--radius-lg)] bg-surface-raised p-4"
        style={{ boxShadow: "var(--shadow-overlay)" }}
      >
        {item.columns ? (
          <>
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {item.columns.map((col) => (
                <div key={col.title}>
                  <Link
                    href={col.href}
                    onClick={onNavigate}
                    className="mb-1.5 flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-ink transition-colors hover:bg-surface"
                  >
                    <span
                      aria-hidden
                      className="grid size-7 flex-none place-items-center rounded-[var(--radius-xs)] bg-brand/10 text-brand-press"
                    >
                      <ServiceIcon name={col.iconKey} size={16} />
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      {col.title}
                    </span>
                  </Link>
                  <ul>
                    {col.items.map((it) => (
                      <li key={it.label}>
                        <Link
                          href={it.href}
                          onClick={onNavigate}
                          className="block rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm text-n-700 transition-colors hover:bg-surface hover:text-ink"
                        >
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-n-200 pt-3">
              <Link
                href={item.href}
                onClick={onNavigate}
                className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm font-semibold text-brand-press transition-colors hover:bg-surface"
              >
                View all {item.label.toLowerCase()}
                <IconArrowRight size={15} stroke={2.2} aria-hidden />
              </Link>
            </div>
          </>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {item.children?.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  onClick={onNavigate}
                  className="flex items-start gap-3 rounded-[var(--radius-sm)] p-2.5 transition-colors hover:bg-surface"
                >
                  {c.iconKey && (
                    <span
                      aria-hidden
                      className="grid size-9 flex-none place-items-center rounded-[var(--radius-sm)] bg-brand/10 text-brand-press"
                    >
                      <ServiceIcon name={c.iconKey} size={18} />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">
                      {c.label}
                    </span>
                    {c.desc && (
                      <span className="mt-0.5 block text-xs leading-snug text-n-500">
                        {c.desc}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
