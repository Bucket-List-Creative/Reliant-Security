"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IconChevronDown, IconMenu2, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { ServiceIcon, type ServiceIconKey } from "@/components/ui/ServiceIcon";
import { SERVICE_CATEGORIES } from "@/content/services";

/**
 * Dropdown entries use the shared line-icon set (Tabler, MIT-licensed) rather
 * than emoji. Emoji render differently on every OS, don't inherit `currentColor`
 * so they can't be tinted to the navbar's white-on-green, and sit visually
 * heavier than the Services mega-menu icons alongside them.
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

  const activeItem = NAV.find(
    (i) => i.label === active && (i.children || i.columns),
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="sfc-container pt-4" onMouseLeave={() => setActive(null)}>
        {/* Floating green pill */}
        <div
          className="overflow-hidden rounded-[var(--radius-xl)] bg-brand-press"
          style={{ boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}
        >
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label={siteTitle}
              onMouseEnter={() => setActive(null)}
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
            <ul className="hidden items-center gap-1 md:flex">
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
                        className={`${base} text-white/90 hover:bg-white/10 hover:text-white`}
                        onMouseEnter={() => setActive(null)}
                        onFocus={() => setActive(null)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`${base} ${
                        isOpen
                          ? "bg-white/15 text-white"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                      aria-expanded={isOpen}
                      onMouseEnter={() => setActive(item.label)}
                      onFocus={() => setActive(item.label)}
                      onClick={() => setActive(isOpen ? null : item.label)}
                    >
                      {item.label}
                      <Chevron
                        className={`mt-0.5 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden md:block">
              <Button
                href={emergencyPhone ? `tel:${emergencyPhone}` : "/contact"}
                variant="cta"
                onMouseEnter={() => setActive(null)}
              >
                {emergencyPhone ? `Call ${emergencyPhone}` : "Get a Free Quote"}
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              className="grid size-11 place-items-center rounded-[var(--radius-sm)] text-white transition-colors hover:bg-white/10 md:hidden"
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

          {/* Desktop expanding mega-menu — the pill grows to reveal it */}
          <div
            className="hidden grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out md:grid"
            style={{ gridTemplateRows: activeItem ? "1fr" : "0fr" }}
          >
            <div className="min-h-0">
              <div className="border-t border-white/15 px-5">
                <div
                  className={`py-6 transition-opacity duration-300 ${
                    activeItem ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {activeItem?.columns ? (
                    <div
                      className="grid gap-x-8 gap-y-7"
                      style={{
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(190px, 1fr))",
                      }}
                    >
                      {activeItem.columns.map((col) => (
                        <div key={col.title}>
                          <Link
                            href={col.href}
                            className="mb-3 flex items-center gap-2.5 text-white"
                          >
                            <span
                              aria-hidden
                              className="grid size-8 flex-none place-items-center rounded-[var(--radius-sm)] bg-white/15"
                            >
                              <ServiceIcon name={col.iconKey} size={18} />
                            </span>
                            <span className="font-semibold tracking-tight">
                              {col.title}
                            </span>
                          </Link>
                          <ul className="space-y-0.5">
                            {col.items.map((it) => (
                              <li key={it.label}>
                                <Link
                                  href={it.href}
                                  className="block rounded-[var(--radius-sm)] px-2.5 py-1.5 transition-colors hover:bg-white/10"
                                >
                                  <span className="block text-sm font-medium text-white">
                                    {it.label}
                                  </span>
                                  {it.desc && (
                                    <span className="block text-xs text-white/60">
                                      {it.desc}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {activeItem?.children?.map((c) => (
                        <Link
                          key={c.label}
                          href={c.href}
                          className="flex min-w-[220px] flex-1 items-start gap-3 rounded-[var(--radius-md)] bg-white/10 p-4 transition-colors hover:bg-white/20"
                        >
                          {c.iconKey && (
                            <span
                              aria-hidden
                              className="grid size-10 flex-none place-items-center rounded-[var(--radius-sm)] bg-white/15 text-white"
                            >
                              <ServiceIcon name={c.iconKey} size={20} />
                            </span>
                          )}
                          <span>
                            <span className="block font-semibold text-white">
                              {c.label}
                            </span>
                            {c.desc && (
                              <span className="mt-0.5 block text-sm text-white/70">
                                {c.desc}
                              </span>
                            )}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            id="mobile-menu"
            className="mt-2 rounded-[var(--radius-lg)] bg-surface-raised p-3 md:hidden"
            style={{ boxShadow: "var(--shadow-soft-3)" }}
          >
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => {
                const hasMenu = Boolean(item.children || item.columns);
                return (
                  <li key={item.label}>
                    {hasMenu ? (
                      <>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-[var(--radius-sm)] px-4 py-3 text-left font-medium text-ink"
                          aria-expanded={openSection === item.label}
                          onClick={() =>
                            setOpenSection((s) =>
                              s === item.label ? null : item.label,
                            )
                          }
                        >
                          {item.label}
                          <Chevron
                            className={`text-brand-press transition-transform ${
                              openSection === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {openSection === item.label &&
                          (item.columns ? (
                            <div className="mb-1 ml-2 border-l-2 border-n-200 pl-3">
                              {item.columns.map((col) => (
                                <div key={col.title} className="py-1">
                                  <Link
                                    href={col.href}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-ink"
                                    onClick={() => setOpen(false)}
                                  >
                                    <span className="text-brand-press">
                                      <ServiceIcon
                                        name={col.iconKey}
                                        size={16}
                                      />
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
                            <ul className="mb-1 ml-4 border-l-2 border-n-200 pl-2">
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
                                        <ServiceIcon
                                          name={c.iconKey}
                                          size={18}
                                        />
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
                        className="block rounded-[var(--radius-sm)] px-4 py-3 font-medium text-ink"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
              <li className="mt-2">
                <Button
                  href={emergencyPhone ? `tel:${emergencyPhone}` : "/contact"}
                  variant="cta"
                  className="w-full"
                >
                  {emergencyPhone ? `Call ${emergencyPhone}` : "Get a Free Quote"}
                </Button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
