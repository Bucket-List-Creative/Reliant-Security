import Image from "next/image";
import { IconStarFilled, IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SanityImage } from "@/components/ui/SanityImage";
import type { Testimonial } from "@/sanity/lib/types";
import type { GooglePlaceReviews } from "@/lib/googleReviews";

/**
 * ⚠️ PLACEHOLDER TESTIMONIALS — DEVELOPMENT ONLY.
 *
 * None of these are real Reliant customers. They exist so the section has
 * shape while working locally, and they are now **hard-gated to development**
 * (see `resolveItems`): in production the section renders nothing at all
 * rather than invented customer quotes. Publishing fabricated reviews is
 * misleading and, for reviews specifically, legally risky — so the failure
 * mode is an absent section, not a fake one.
 *
 * The real content comes from live Google reviews. See `lib/googleReviews.ts`.
 */
const FALLBACK: Testimonial[] = [
  {
    _id: "t1",
    quote:
      "The install was spotless and the monitoring team caught an issue before we even noticed. Genuinely reassuring.",
    authorName: "Sample review",
    authorRole: "Residential customer — placeholder, dev only",
    rating: 5,
  },
  {
    _id: "t2",
    quote:
      "They handled the cameras, the access control, and all the cabling. One team, one point of contact, no finger-pointing.",
    authorName: "Sample review",
    authorRole: "Commercial customer — placeholder, dev only",
    rating: 5,
  },
  {
    _id: "t3",
    quote:
      "They understood what a plant environment does to equipment and specified accordingly. It's held up.",
    authorName: "Sample review",
    authorRole: "Industrial customer — placeholder, dev only",
    rating: 5,
  },
];

/** The shape the grid actually renders, whatever the source was. */
type Item = {
  key: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  rating: number;
  avatar?: Testimonial["avatar"];
  photoUrl?: string;
  profileUrl?: string;
};

function fromGoogle(google: GooglePlaceReviews): Item[] {
  return google.reviews.map((r) => ({
    key: r.id,
    quote: r.quote,
    authorName: r.authorName,
    authorRole: r.relativeTime,
    rating: r.rating,
    photoUrl: r.authorPhotoUrl,
    profileUrl: r.authorProfileUrl,
  }));
}

function fromSanity(items: Testimonial[]): Item[] {
  return items.map((t) => ({
    key: t._id,
    quote: t.quote,
    authorName: t.authorName,
    authorRole: t.authorRole,
    rating: t.rating ?? 5,
    avatar: t.avatar,
  }));
}

/**
 * Live Google reviews win when there are any: they're real, attributed, and
 * verifiable against the public listing. Sanity `testimonial` documents are
 * the fallback for when Google is unconfigured or unreachable, so an editor
 * still has a way to put something real on the page. The invented placeholders
 * come last and never leave development.
 */
function resolveItems(
  google: GooglePlaceReviews | null | undefined,
  testimonials: Testimonial[] | undefined,
): Item[] {
  if (google?.reviews.length) return fromGoogle(google);
  if (testimonials?.length) return fromSanity(testimonials);
  return process.env.NODE_ENV === "development" ? fromSanity(FALLBACK) : [];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="mb-4 flex gap-0.5"
      aria-label={`${rating} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStarFilled
          key={i}
          size={16}
          className={i < rating ? "text-white" : "text-white/30"}
        />
      ))}
    </div>
  );
}

export function Testimonials({
  testimonials,
  google,
  heading = "Trusted by homes and businesses",
}: {
  testimonials?: Testimonial[];
  google?: GooglePlaceReviews | null;
  heading?: string;
}) {
  const items = resolveItems(google, testimonials);

  // Nothing real to show — render nothing rather than a heading over an empty
  // grid, or worse, invented quotes.
  if (!items.length) return null;

  const isGoogle = Boolean(google?.reviews.length);
  const ratingLabel =
    isGoogle && google?.rating
      ? `${google.rating.toFixed(1)} out of 5${
          google.totalReviewCount
            ? ` from ${google.totalReviewCount.toLocaleString()} Google reviews`
            : " on Google"
        }`
      : null;

  return (
    <section className="sfc-section" id="testimonials">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
              {heading}
            </h2>
            {ratingLabel && (
              <p className="mt-3 text-n-700">
                Rated <span className="font-semibold">{ratingLabel}</span>.
              </p>
            )}
          </div>

          {/* Google requires its data to be attributed where it's shown. This
              doubles as the way to reach the reviews the API won't return —
              it caps out at five. */}
          {isGoogle && google?.googleMapsUri && (
            <a
              href={google.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-press"
            >
              Read all reviews on Google
              <IconArrowRight size={16} stroke={2.2} aria-hidden />
            </a>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card
              key={t.key}
              className="sfc-card--solid relative flex h-full flex-col"
            >
              {/* Oversized quote mark, in white at low opacity so it reads as
                  relief on the green rather than as a second colour. */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-2 select-none font-display text-[5rem] leading-none text-white/15"
              >
                &rdquo;
              </span>
              <Stars rating={t.rating} />

              {/*
                Clamped with CSS, never by truncating the string. Google's terms
                require review text to be shown unmodified, and a line-clamp
                leaves the full quote in the DOM for screen readers and search
                engines while keeping the cards to a even height.
              */}
              <blockquote className="relative line-clamp-[10] flex-1 text-lg leading-relaxed">
                “{t.quote}”
              </blockquote>

              <div className="mt-6 flex items-center gap-3">
                {t.avatar?.asset ? (
                  <SanityImage
                    value={t.avatar}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  t.photoUrl && (
                    <Image
                      src={t.photoUrl}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 flex-none rounded-full object-cover"
                    />
                  )
                )}
                <div>
                  <div className="font-semibold text-white">
                    {t.profileUrl ? (
                      <a
                        href={t.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-white/30 underline-offset-2 hover:decoration-white"
                      >
                        {t.authorName}
                      </a>
                    ) : (
                      t.authorName
                    )}
                  </div>
                  {t.authorRole && (
                    <div className="text-sm text-white/65">{t.authorRole}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {isGoogle && (
          <p className="mt-6 text-sm text-n-500">
            Reviews from Google, shown as written by their authors.
          </p>
        )}
      </Container>
    </section>
  );
}
