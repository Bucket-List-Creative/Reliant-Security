"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { Card, CardIcon } from "@/components/ui/Card";
import { ServiceIcon, type ServiceIconKey } from "@/components/ui/ServiceIcon";

/**
 * "Who we are / what we do" — sits high on the home page so a visitor sees the
 * full scope of Reliant immediately.
 *
 * This section exists specifically to stop the site reading as residential-
 * only. Keep commercial, industrial, government, cabling/fiber, and AV on it:
 * dropping any of them re-introduces exactly the problem it was added to fix.
 *
 * Presented as a horizontal scroll rail. Eight cards stacked two rows deep ate
 * a screen and a half of vertical space this high up the page; a rail keeps the
 * whole range visible in one band and lets the reveal animation carry the
 * motion. See `.sfc-rail` in globals.css for why this is a native scroll
 * container rather than a scroll-jacked carousel.
 */
type Capability = {
  title: string;
  description: string;
  iconKey: ServiceIconKey;
  href: string;
};

const CAPABILITIES: Capability[] = [
  {
    title: "Residential Security",
    description:
      "Monitored alarms, cameras, and smart control for single-family homes, custom homes, and multi-family properties.",
    iconKey: "home",
    href: "/industries?segment=residential",
  },
  {
    title: "Commercial Security",
    description:
      "Offices, retail, healthcare, and warehousing — systems designed around how the building is actually used.",
    iconKey: "building",
    href: "/industries?segment=commercial",
  },
  {
    title: "Industrial & Government",
    description:
      "Large plants, manufacturing sites, and Federal, State, Municipal, and DoD facilities — including NDAA/TAA-compliant equipment.",
    iconKey: "factory",
    href: "/industries?segment=industrial",
  },
  {
    title: "Video Surveillance",
    description:
      "Hardwired and wireless camera systems, from a single doorbell to site-wide industrial coverage.",
    iconKey: "cctv",
    href: "/services/cctv-surveillance",
  },
  {
    title: "Access Control",
    description:
      "Keyless entry, mobile credentials, role-based permissions, and a full audit trail on every door.",
    iconKey: "key",
    href: "/services/access-control",
  },
  {
    title: "Structured Cabling & Fiber",
    description:
      "Cat6/Cat6A, fiber, racks, and pathways — certified, labeled, and documented infrastructure.",
    iconKey: "network",
    href: "/services/network-cabling",
  },
  {
    title: "Audio/Video",
    description:
      "Distributed audio, displays, and conference-room AV for homes and businesses alike.",
    iconKey: "speaker",
    href: "/services/audio-video",
  },
  {
    title: "24/7 Professional Monitoring",
    description:
      "UL-certified central-station monitoring for intrusion, smoke, and carbon monoxide, every hour of the year.",
    iconKey: "shield-check",
    href: "/pricing",
  },
];

export function CapabilitiesGrid() {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // 1px of tolerance: sub-pixel layout means scrollLeft rarely lands exactly
    // on the maximum, which would otherwise leave the next arrow enabled at
    // the very end of the rail.
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    // The rail's overflow depends on its width, so recheck on resize.
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const page = useCallback((direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Advance by whole cards so snap points always line up.
    const card = el.querySelector<HTMLElement>(".sfc-rail__item");
    const step = card
      ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "20")
      : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return (
    <section className="sfc-section" id="what-we-do">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              One local team, from a single home to a full industrial site
            </h2>
            <p className="mt-4 text-lg text-n-700">
              Reliant Security is a locally owned security and low-voltage
              integrator. We design, install, and service everything here — so
              whether you need an alarm on a house or surveillance, access
              control, and fiber across a manufacturing plant, it&apos;s the
              same team and the same standard.
            </p>
          </div>

          {/* Arrows are supplementary — the rail is fully usable by swipe,
              trackpad, and keyboard without them, so they're hidden from
              assistive tech rather than duplicating the same navigation. */}
          <div className="hidden gap-2 sm:flex" aria-hidden>
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              tabIndex={-1}
              aria-label="Scroll left"
              className="grid size-11 place-items-center rounded-[var(--radius-pill)] bg-surface-raised text-brand-press transition-opacity disabled:pointer-events-none disabled:opacity-35"
              style={{ boxShadow: "var(--shadow-soft-2)" }}
            >
              <IconArrowLeft size={20} stroke={2} />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              tabIndex={-1}
              aria-label="Scroll right"
              className="grid size-11 place-items-center rounded-[var(--radius-pill)] bg-surface-raised text-brand-press transition-opacity disabled:pointer-events-none disabled:opacity-35"
              style={{ boxShadow: "var(--shadow-soft-2)" }}
            >
              <IconArrowRight size={20} stroke={2} />
            </button>
          </div>
        </div>

        <div className="sfc-rail-mask">
          {/*
            tabIndex on a scroll container is deliberate: it makes the rail
            focusable so keyboard users can pan it with the arrow keys, which
            browsers otherwise only allow on focusable scrollers.
          */}
          <ul
            ref={railRef}
            tabIndex={0}
            aria-label="What we do"
            className="sfc-rail -mx-6 px-6"
          >
            {CAPABILITIES.map((c) => (
              <li key={c.title} className="sfc-rail__item">
                <Link href={c.href} className="block h-full">
                  <Card
                    interactive
                    className="sfc-card--tint flex h-full flex-col items-center text-center"
                  >
                    <CardIcon>
                      <ServiceIcon name={c.iconKey} size={26} />
                    </CardIcon>
                    <h3 className="mt-5 text-[1.05rem] font-semibold leading-snug">
                      {c.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed">
                      {c.description}
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
