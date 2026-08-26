import type { ReactNode } from "react";
import { IconStarFilled } from "@tabler/icons-react";

type BadgeProps = {
  href?: string;
  title: string;
  detail: string;
  glyph: ReactNode;
};

function TrustBadge({ href, title, detail, glyph }: BadgeProps) {
  const inner = (
    <>
      <span
        aria-hidden
        className="grid size-12 flex-none place-items-center rounded-[var(--radius-md)] bg-brand text-white"
      >
        {glyph}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-n-500">{detail}</span>
      </span>
    </>
  );

  const cls =
    "sfc-card--tint flex items-center gap-3 rounded-[var(--radius-lg)] px-5 py-4";

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>
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
      />
      <TrustBadge
        href={googleReviewsUrl}
        glyph={<IconStarFilled size={20} />}
        title="Google Reviews"
        detail="Rated by our customers"
      />
      <TrustBadge
        href={angiesListUrl}
        glyph={<span className="font-display text-lg font-bold">A</span>}
        title="Angi Certified"
        detail="Verified reviews"
      />
    </div>
  );
}
