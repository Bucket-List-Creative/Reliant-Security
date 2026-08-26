import { Container } from "@/components/ui/Container";
import { SanityImage } from "@/components/ui/SanityImage";
import type { Partner } from "@/sanity/lib/types";

/**
 * ⚠️ UNCONFIRMED — Reliant must review this list before launch.
 *
 * These are placeholder manufacturers, not a verified account of what Reliant
 * actually deploys. Replace them with the real partner list (ideally as
 * `partner` documents in Sanity, with logos).
 *
 * Hikvision was removed deliberately and must not be re-added: it is
 * prohibited under NDAA Section 889, and the site advertises NDAA/TAA-
 * compliant equipment for Government/DoD work. Listing a covered manufacturer
 * as a technology partner would undercut that claim with the exact buyers it
 * is meant to reassure. The same applies to Dahua and their OEM brands.
 */
const FALLBACK: Partner[] = [
  { _id: "pt1", name: "Alarm.com" },
  { _id: "pt2", name: "Axis Communications" },
  { _id: "pt3", name: "Verkada" },
  { _id: "pt4", name: "Genetec" },
  { _id: "pt5", name: "Honeywell" },
  { _id: "pt6", name: "Ubiquiti" },
  { _id: "pt7", name: "2N" },
  { _id: "pt8", name: "Bosch Security" },
];

function Tile({ partner }: { partner: Partner }) {
  const inner = partner.logo?.asset ? (
    <SanityImage
      value={partner.logo}
      width={200}
      height={80}
      className="max-h-12 w-auto object-contain"
    />
  ) : (
    <span className="font-display font-semibold text-n-700">
      {partner.name}
    </span>
  );

  const cls =
    "flex h-24 items-center justify-center rounded-[var(--radius-md)] bg-surface-raised px-6 text-center transition-shadow";

  return partner.url ? (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      style={{ boxShadow: "var(--shadow-soft-2)" }}
      aria-label={`Visit ${partner.name}`}
    >
      {inner}
    </a>
  ) : (
    <div className={cls} style={{ boxShadow: "var(--shadow-soft-2)" }}>
      {inner}
    </div>
  );
}

export function PartnerGrid({
  partners,
  heading = "Technology partners",
  subheading = "Reliant isn't tied to one manufacturer or proprietary platform. We design around what each project actually needs — including NDAA/TAA-compliant equipment where it's required.",
  withContainer = true,
}: {
  partners?: Partner[];
  heading?: string;
  subheading?: string;
  withContainer?: boolean;
}) {
  const items = partners?.length ? partners : FALLBACK;

  const grid = (
    <>
      {(heading || subheading) && (
        <div className="mb-10 max-w-2xl">
          {heading && (
            <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
          )}
          {subheading && <p className="mt-4 text-lg text-n-700">{subheading}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <Tile key={p._id} partner={p} />
        ))}
      </div>
    </>
  );

  if (!withContainer) return grid;

  return (
    <section className="sfc-section" id="partners">
      <Container>{grid}</Container>
    </section>
  );
}
