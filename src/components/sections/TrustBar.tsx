import type { ReactNode } from "react";
import { IconStarFilled } from "@tabler/icons-react";

type BadgeProps = {
  href?: string;
  title: string;
  detail: string;
  glyph: ReactNode;
  /** Accent class from globals.css — tints the glyph tile. */
  accent: string;
};

function TrustBadge({ href, title, detail, glyph, accent }: BadgeProps) {
  const inner = (
    <>
      <span
        aria-hidden
        className="grid size-12 flex-none place-items-center rounded-[var(--radius-md)]"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
      >
        {glyph}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-n-500">{detail}</span>
      </span>
    </>
  );

  const cls = `${accent} flex items-center gap-3 rounded-[var(--radius-lg)] bg-surface-raised px-5 py-4 transition-shadow`;
  const style = { boxShadow: "var(--shadow-soft-2)" };

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
      {inner}
    </a>
  ) : (
    <div className={cls} style={style}>
      {inner}
    </div>
  );
}

/** Trust signals — BBB A+, Google reviews, Angi. Links render when provided. */
export function TrustBar({
  bbbUrl,
  googleReviewsUrl,
  angiesListUrl,
}: {
  bbbUrl?: string;
  googleReviewsUrl?: string;
  angiesListUrl?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <TrustBadge
        href={bbbUrl}
        glyph={<span className="font-display text-lg font-bold">A+</span>}
        title="BBB Accredited"
        detail="A+ rating"
        accent="sfc-accent-blue"
      />
      <TrustBadge
        href={googleReviewsUrl}
        glyph={<IconStarFilled size={20} />}
        title="Google Reviews"
        detail="Rated by our customers"
        accent="sfc-accent-amber"
      />
      <TrustBadge
        href={angiesListUrl}
        glyph={<span className="font-display text-lg font-bold">A</span>}
        title="Angi Certified"
        detail="Verified reviews"
        accent="sfc-accent-rose"
      />
    </div>
  );
}
