import { SERVICE_FAQS } from "@/content/faqs";
import type { ServiceIconKey } from "@/components/ui/ServiceIcon";

/**
 * Service taxonomy — the single source of truth for the Services index groups,
 * the individual /services/[slug] detail pages, and the navbar mega-menu.
 *
 * Category order is deliberate: Alarm Systems, Video & Surveillance,
 * Infrastructure, Smart Home & Access, Additional Services. Infrastructure
 * (structured cabling & fiber) sits third rather than fourth because it is a
 * core commercial and industrial capability, not an afterthought — don't
 * demote it back down without a reason.
 *
 * Copy must serve both residential and commercial readers. Reliant runs
 * everything from single-family alarms to large industrial and government
 * projects, so service copy that only speaks to homeowners misrepresents the
 * company.
 *
 * Copy here is the built-in default. When matching `service` documents exist in
 * Sanity (matched by `slug`), the pages prefer the CMS values — see the merge
 * logic in the services pages.
 */

export type ServiceBenefit = { title: string; description: string };
export type ServiceFaq = { question: string; answer: string };

export type TaxonomyService = {
  slug: string;
  title: string;
  iconKey: ServiceIconKey;
  /** Short line used in the nav dropdown and card. */
  tagline: string;
  /** Card/section description and default meta description. */
  summary: string;
  /** Scannable "what's included" bullets. */
  features: string[];
  /** 1–2 unique paragraphs for the detail page (SEO body copy). */
  overview: string[];
  /** Value props rendered as a benefits grid. */
  benefits: ServiceBenefit[];
  /** Unique Q&A — powers the on-page FAQ and FAQPage JSON-LD (AEO). */
  faqs: ServiceFaq[];
  /** Optional override for the <meta name="description">. */
  metaDescription?: string;
};

export type ServiceCategory = {
  slug: string;
  title: string;
  iconKey: ServiceIconKey;
  blurb: string;
  services: TaxonomyService[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "alarm-systems",
    title: "Alarm Systems",
    iconKey: "shield-check",
    blurb:
      "Professionally monitored intrusion, fire, and life-safety alarms that alert the right people the moment something is wrong.",
    services: [
      {
        slug: "security-alarm",
        title: "Security Alarm",
        iconKey: "shield-check",
        tagline: "Monitored intrusion & burglary protection",
        summary:
          "Perimeter and interior alarm systems with 24/7 central-station monitoring, so a break-in triggers an immediate response day or night.",
        features: [
          "Door, window & motion sensors",
          "24/7 central-station monitoring",
          "Glass-break & shock detection",
          "Cellular & battery backup",
        ],
        overview: [
          "A professionally monitored security alarm is the foundation of any protection plan. Reliant designs intrusion systems around your building's real entry points — doors, windows, and open interior spaces — so an unauthorized entry is detected the instant it happens and verified by our monitoring center.",
          "Every system is backed by cellular and battery communication, so it keeps reporting even if a burglar cuts the power or phone line. When an alarm is confirmed, we dispatch the right responders immediately, day or night.",
        ],
        benefits: [
          {
            title: "Around-the-clock monitoring",
            description:
              "Trained operators watch your system 24/7 and dispatch police or fire the moment an alarm is verified.",
          },
          {
            title: "Layered detection",
            description:
              "Entry, motion, and glass-break sensors work together so intrusions are caught at the perimeter and inside.",
          },
          {
            title: "Tamper-resistant",
            description:
              "Cellular and battery backup keep the system online through power and phone-line failures.",
          },
        ],
        faqs: SERVICE_FAQS["security-alarm"],
      },
      {
        slug: "interactive-alarm",
        title: "Interactive Alarm",
        iconKey: "smartphone",
        tagline: "Arm, disarm & control from your phone",
        summary:
          "Smart, app-connected alarm systems that let you arm and disarm remotely, receive instant alerts, and see exactly what happened from anywhere.",
        features: [
          "Mobile app arm / disarm",
          "Real-time push & text alerts",
          "Custom automation scenes",
          "Activity history & notifications",
        ],
        overview: [
          "An interactive alarm puts your whole system in your pocket. Arm and disarm from your phone, get instant alerts the moment a door opens, and check your system's status whether you're in the next room or another state.",
          "Beyond convenience, interactive systems give you a live record of what's happening at your property — who came and went, when the system was armed, and which sensors triggered — all from a single app.",
        ],
        benefits: [
          {
            title: "Remote control",
            description:
              "Arm, disarm, and manage users from anywhere with the mobile app.",
          },
          {
            title: "Real-time awareness",
            description:
              "Push and text notifications tell you exactly what happened and when.",
          },
          {
            title: "Smart automation",
            description:
              "Trigger lights, locks, and thermostats automatically when you arm or disarm.",
          },
        ],
        faqs: SERVICE_FAQS["interactive-alarm"],
      },
      {
        slug: "wellness-safety-monitoring",
        title: "Wellness & Safety Monitoring",
        iconKey: "heart-pulse",
        tagline: "Life-safety & independent-living support",
        summary:
          "Environmental and personal-safety monitoring — smoke, CO, flood, and medical alerts — that protects people as well as property.",
        features: [
          "Smoke & carbon-monoxide alerts",
          "Flood & temperature sensors",
          "Medical & panic pendants",
          "Aging-in-place check-ins",
        ],
        overview: [
          "Security isn't only about intruders. Wellness and safety monitoring watches for the environmental and personal emergencies that can be just as dangerous — smoke, carbon monoxide, water leaks, extreme temperatures, and medical events.",
          "These systems are ideal for families with aging relatives, or anyone who wants peace of mind that help is on the way even when they can't call for it themselves. A single button — or an automatic sensor — brings a fast, monitored response.",
        ],
        benefits: [
          {
            title: "Life-safety detection",
            description:
              "Monitored smoke, CO, and heat sensors summon the fire department automatically.",
          },
          {
            title: "Independent living",
            description:
              "Medical pendants and panic buttons let loved ones get help with one press.",
          },
          {
            title: "Property protection",
            description:
              "Flood and temperature sensors catch leaks and freezes before they cause costly damage.",
          },
        ],
        faqs: SERVICE_FAQS["wellness-safety-monitoring"],
      },
      {
        slug: "security-system-installation",
        title: "Security System Installation",
        iconKey: "wrench",
        tagline: "Professional design & installation",
        summary:
          "Certified technicians design, install, and configure your complete system, then walk you through every feature before they leave.",
        features: [
          "On-site assessment & design",
          "Clean, code-compliant install",
          "System programming & testing",
          "Hands-on customer training",
        ],
        overview: [
          "A security system is only as good as its installation. Reliant's certified technicians survey your property, design a layout that eliminates blind spots, and install every component cleanly and to code.",
          "Before we leave, we test every sensor, program your preferences, and walk you through exactly how the system works — so you're confident using it from day one.",
        ],
        benefits: [
          {
            title: "Expert design",
            description:
              "We assess your property in person and engineer coverage around your specific risks.",
          },
          {
            title: "Clean, code-compliant work",
            description:
              "Neat, professional installation that meets local requirements and passes inspection.",
          },
          {
            title: "Done-right handoff",
            description:
              "Full testing and hands-on training so nothing is left to guesswork.",
          },
        ],
        faqs: SERVICE_FAQS["security-system-installation"],
      },
    ],
  },
  {
    slug: "video-surveillance",
    title: "Video & Surveillance",
    iconKey: "cctv",
    blurb:
      "High-definition cameras and recording that let you see what's happening on your property in real time — and review it later.",
    services: [
      {
        slug: "cctv-surveillance",
        title: "CCTV & Hardwired Surveillance",
        iconKey: "cctv",
        tagline: "Reliable hardwired camera systems",
        summary:
          "Hardwired CCTV built for continuous, high-resolution coverage of entrances, parking, and interiors, with local and cloud recording options.",
        features: [
          "4K / HD hardwired cameras",
          "Continuous & event recording",
          "Remote live-view & playback",
          "NVR / DVR storage",
        ],
        overview: [
          "Hardwired CCTV delivers the most reliable, highest-quality video coverage available. Because cameras are wired directly for power and data, you get continuous recording and consistent image quality without worrying about batteries or Wi-Fi range.",
          "Reliant designs camera layouts that cover entrances, parking areas, hallways, and other key points, with local and cloud storage options so footage is always there when you need it.",
        ],
        benefits: [
          {
            title: "Continuous, reliable recording",
            description:
              "Wired cameras run 24/7 without dropouts or dead batteries.",
          },
          {
            title: "Evidence-grade video",
            description:
              "4K and HD resolution capture the detail that matters for identification.",
          },
          {
            title: "Flexible storage",
            description:
              "Keep footage on-site, in the cloud, or both, with retention that fits your needs.",
          },
        ],
        faqs: SERVICE_FAQS["cctv-surveillance"],
      },
      {
        slug: "wireless-video",
        title: "Wireless Video Surveillance",
        iconKey: "wifi",
        tagline: "Flexible wireless & smart cameras",
        summary:
          "Wireless and smart cameras — including doorbell and mobile-app cameras — for fast, low-disruption coverage where running cable isn't practical.",
        features: [
          "Wireless & doorbell cameras",
          "AI motion & person detection",
          "Cloud clip storage",
          "Night vision & two-way audio",
        ],
        overview: [
          "Wireless and smart cameras make it easy to add coverage where running cable isn't practical — rental properties, historic buildings, or spots you want to monitor today, not next week.",
          "From video doorbells to app-connected outdoor cameras, wireless systems bring AI motion detection, two-way audio, and cloud clip storage together in a package that's fast to deploy and simple to use.",
        ],
        benefits: [
          {
            title: "Fast, low-disruption install",
            description:
              "No cable runs means coverage in hours, not days.",
          },
          {
            title: "Smart alerts",
            description:
              "AI motion and person detection notify you only about what matters.",
          },
          {
            title: "Two-way communication",
            description:
              "Talk to visitors or deter intruders straight from your phone.",
          },
        ],
        faqs: SERVICE_FAQS["wireless-video"],
      },
    ],
  },
  {
    slug: "infrastructure",
    title: "Structured Cabling, Fiber & AV",
    iconKey: "network",
    blurb:
      "The backbone everything else runs on — certified Cat6/Cat6A and fiber, racks and pathways, network infrastructure, and distributed audio/video for commercial, industrial, and residential sites alike.",
    services: [
      {
        slug: "network-cabling",
        title: "Structured Cabling & Fiber",
        iconKey: "network",
        tagline: "Cat6/Cat6A, fiber, racks & pathways",
        summary:
          "Certified Cat6/Cat6A copper and single- and multi-mode fiber — plus racks, pathways, and network infrastructure — engineered, tested, labeled, and documented.",
        features: [
          "Cat6 / Cat6A structured cabling",
          "Single & multi-mode fiber",
          "Racks, pathways & cable management",
          "Certified, tested & labeled runs",
          "Switching, Wi-Fi & network setup",
          "As-built documentation",
        ],
        overview: [
          "Structured cabling is the backbone every other system rides on — cameras, access control, Wi-Fi, phones, and the business applications behind them. Reliant designs and installs certified Cat6 and Cat6A copper alongside single- and multi-mode fiber, sized for the bandwidth a site needs now and the growth it hasn't planned for yet.",
          "This is core commercial and industrial work for us, not an add-on. We handle the full scope: pathway and rack design, cable runs across separated buildings, terminations, certification testing, labeling, and as-built documentation. On government and public-sector projects we deliver to the written specification, including submittals and test results.",
          "Because the same team also installs the surveillance, access control, and AV that ride on the cabling, there's no gap between the infrastructure contractor and the systems integrator — and no argument about whose problem it is when something needs attention.",
        ],
        benefits: [
          {
            title: "Certified & tested",
            description:
              "Cat6/Cat6A and fiber runs terminated to standard and certification-tested, with results documented.",
          },
          {
            title: "Built for distance",
            description:
              "Fiber backbones tie separated buildings, plants, and outbuildings into one reliable network.",
          },
          {
            title: "Future-ready capacity",
            description:
              "Infrastructure sized with headroom so you're not rewiring when the camera count doubles.",
          },
          {
            title: "Organized & documented",
            description:
              "Labeled runs, tidy racks, and as-builts that make support and expansion straightforward.",
          },
        ],
        faqs: SERVICE_FAQS["network-cabling"],
      },
      {
        slug: "audio-video",
        title: "Audio & Video",
        iconKey: "speaker",
        tagline: "Distributed AV & sound",
        summary:
          "Distributed audio, video displays, and conferencing for homes and businesses — clean installs with intuitive, one-touch control.",
        features: [
          "Whole-property audio",
          "TV & display mounting",
          "Conference-room AV",
          "Single-remote control",
        ],
        overview: [
          "Great audio and video make a space more enjoyable and more productive. Reliant designs and installs distributed sound, television displays, and conferencing systems for homes and businesses alike.",
          "From whole-property music to a boardroom that's ready for a video call at the touch of a button, we handle the design, wiring, and setup — and make it simple to control.",
        ],
        benefits: [
          {
            title: "Seamless experiences",
            description:
              "Audio and video that just work, controlled from one remote or app.",
          },
          {
            title: "Clean installations",
            description:
              "Mounted displays and concealed wiring for a polished, professional look.",
          },
          {
            title: "Built for the room",
            description:
              "Systems tuned to the space, whether it's a patio, showroom, or conference room.",
          },
        ],
        faqs: SERVICE_FAQS["audio-video"],
      },
    ],
  },
  {
    slug: "smart-access",
    title: "Smart Home & Access",
    iconKey: "home",
    blurb:
      "Automation and access control that make your home or business more convenient, efficient, and secure — all from one app.",
    services: [
      {
        slug: "smart-automation",
        title: "Smart Home & Business Automation",
        iconKey: "home",
        tagline: "Lights, locks, thermostats & scenes",
        summary:
          "Unify lighting, locks, thermostats, cameras, and more into one intelligent system you control by app, schedule, or voice.",
        features: [
          "Lighting & thermostat control",
          "Smart locks & garage control",
          "Voice-assistant integration",
          "Schedules & automation scenes",
        ],
        overview: [
          "Automation ties your lights, locks, thermostats, cameras, and shades into one system that works the way you do. Set a scene, schedule a routine, or control everything by voice or a single app.",
          "For businesses, automation means lights and HVAC that follow your hours, doors that lock themselves, and one dashboard for the whole building. For homes, it means comfort, energy savings, and security that runs on autopilot.",
        ],
        benefits: [
          {
            title: "One app for everything",
            description:
              "Control lights, locks, climate, and cameras from a single interface.",
          },
          {
            title: "Energy savings",
            description:
              "Schedules and sensors cut waste by running systems only when needed.",
          },
          {
            title: "Effortless routines",
            description:
              "Scenes and automations handle everyday tasks so you don't have to.",
          },
        ],
        faqs: SERVICE_FAQS["smart-automation"],
      },
      {
        slug: "access-control",
        title: "Access Control",
        iconKey: "key",
        tagline: "Keyless entry & permissions",
        summary:
          "Keyless entry, keypads, fobs, and mobile credentials with role-based permissions and a full audit trail of every door event.",
        features: [
          "Keypad, fob & mobile credentials",
          "Role-based permissions",
          "Entry audit logs",
          "Remote lock / unlock",
        ],
        overview: [
          "Access control replaces keys with credentials you manage — keypads, fobs, cards, or mobile phones — so you decide exactly who can open which doors and when.",
          "Every entry is logged, so you always have a record of who came and went. When someone leaves the company or loses a credential, you revoke access instantly instead of rekeying locks.",
        ],
        benefits: [
          {
            title: "Keys you can't lose",
            description:
              "Credentials are issued and revoked in software, never rekeyed.",
          },
          {
            title: "Granular permissions",
            description:
              "Grant access by door, person, and schedule down to the hour.",
          },
          {
            title: "Full audit trail",
            description:
              "Every unlock is time-stamped for accountability and investigations.",
          },
        ],
        faqs: SERVICE_FAQS["access-control"],
      },
    ],
  },
  {
    slug: "additional-services",
    title: "Additional Services",
    iconKey: "grid",
    blurb:
      "Round out your protection with cyber security and managed IT, delivered through our trusted technology partner alongside the systems we install.",
    services: [
      {
        slug: "cyber-security",
        title: "Cyber Security",
        iconKey: "cyber",
        tagline: "Protect your network & data",
        summary:
          "Firewalls, endpoint protection, and monitoring that defend your network and data from the digital threats physical security can't stop.",
        features: [
          "Firewall & network hardening",
          "Endpoint & email protection",
          "Threat monitoring",
          "Security assessments",
        ],
        overview: [
          "Physical security keeps intruders out of your building; cyber security keeps them out of your network. As cameras, access control, and business systems move online, protecting that digital layer is no longer optional.",
          "Reliant delivers cyber security through a trusted technology partner, coordinated alongside the systems we install — firewall and network hardening, endpoint and email protection, and ongoing threat monitoring. You get specialist capability without having to manage a separate vendor relationship yourself.",
        ],
        benefits: [
          {
            title: "Network defense",
            description:
              "Firewalls and hardening block intrusions before they reach your systems.",
          },
          {
            title: "Endpoint & email protection",
            description:
              "Stop the malware and phishing that target your people directly.",
          },
          {
            title: "Ongoing monitoring",
            description:
              "Continuous watch for threats so issues are caught early, not after damage is done.",
          },
        ],
        faqs: SERVICE_FAQS["cyber-security"],
      },
      {
        slug: "managed-it",
        title: "Managed IT",
        iconKey: "server",
        tagline: "Proactive IT support & management",
        summary:
          "Proactive IT management — updates, backups, and help-desk support — that keeps your business running while you focus on your work.",
        features: [
          "Proactive monitoring & updates",
          "Backup & disaster recovery",
          "Help-desk support",
          "Hardware & software management",
        ],
        overview: [
          "Managed IT keeps your technology running so you can focus on your business. Instead of reacting to problems, the service proactively monitors, updates, and maintains your systems to prevent them.",
          "Reliant provides managed IT through a trusted technology partner, covering patching, backups, help-desk support, and hardware management. We coordinate it alongside the security and network infrastructure we install, so your technology and your protection stay joined up.",
        ],
        benefits: [
          {
            title: "Proactive maintenance",
            description:
              "Monitoring and updates prevent problems before they cause downtime.",
          },
          {
            title: "Reliable backups",
            description:
              "Automated backup and recovery keep your data safe and restorable.",
          },
          {
            title: "Responsive support",
            description:
              "A help desk that answers when you need it, from a team that knows your setup.",
          },
        ],
        faqs: SERVICE_FAQS["managed-it"],
      },
    ],
  },
];

/** Flat list of every taxonomy service, in display order. */
export const ALL_TAXONOMY_SERVICES: TaxonomyService[] =
  SERVICE_CATEGORIES.flatMap((c) => c.services);

/** Every service slug — used for static generation. */
export const ALL_SERVICE_SLUGS: string[] = ALL_TAXONOMY_SERVICES.map(
  (s) => s.slug,
);

/** Find a service (and its category) by slug. */
export function findServiceBySlug(
  slug: string,
): { service: TaxonomyService; category: ServiceCategory } | undefined {
  for (const category of SERVICE_CATEGORIES) {
    const service = category.services.find((s) => s.slug === slug);
    if (service) return { service, category };
  }
  return undefined;
}

/**
 * Related services for the detail page — same-category siblings first, then
 * filled from other categories, up to `count`.
 */
export function getRelatedServices(
  slug: string,
  count = 3,
): TaxonomyService[] {
  const match = findServiceBySlug(slug);
  const siblings = match
    ? match.category.services.filter((s) => s.slug !== slug)
    : [];
  const others = ALL_TAXONOMY_SERVICES.filter(
    (s) => s.slug !== slug && !siblings.some((sib) => sib.slug === s.slug),
  );
  return [...siblings, ...others].slice(0, count);
}
