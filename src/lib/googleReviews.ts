/**
 * Live Google reviews, via the Places API (New) Place Details endpoint.
 *
 * ── WHAT THIS CAN AND CANNOT DO ───────────────────────────────────────────
 *
 * The Places API returns **at most five reviews**, and Google chooses which
 * five. There is no paging and no way to ask for a specific review. Showing
 * every review, or replying to them, needs the Business Profile API instead —
 * a different product that requires a manual access request to Google plus
 * OAuth with a stored refresh token. This module is deliberately the only
 * thing that knows where reviews come from, so that swap stays contained.
 *
 * ── COST ──────────────────────────────────────────────────────────────────
 *
 * `reviews` sits in the most expensive Places SKU and is billed per request,
 * and `fetch` is NOT cached by default in this version of Next. The
 * `force-cache` + `revalidate` below is therefore load-bearing, not a
 * nice-to-have: without it every render of the home and About pages would be
 * a billable API call. Six hours is far more often than a small business
 * gains reviews, and works out to a handful of calls a day.
 *
 * ── WHOSE KEY, WHOSE BUSINESS ─────────────────────────────────────────────
 *
 * These are two different parties and that is fine. `GOOGLE_PLACE_ID`
 * identifies Reliant's listing; `GOOGLE_PLACES_API_KEY` belongs to the
 * agency's Google Cloud project. Place Details is public, read-only data, so
 * no ownership of the listing is needed to read it — and the billing lands on
 * whoever owns the key, which is why the cache above matters to the agency
 * rather than to the client.
 *
 * Ownership only starts to matter for the Business Profile API, which needs
 * OAuth as an account with access to the client's profile. If the site is ever
 * handed over, the key is the thing that has to be reissued; the Place ID
 * travels with the business.
 *
 * ── SERVER ONLY ───────────────────────────────────────────────────────────
 *
 * `GOOGLE_PLACES_API_KEY` has no `NEXT_PUBLIC_` prefix and must never gain
 * one: a key with Places enabled is a billable key, and shipping it to the
 * browser hands anyone a metered credential. Only ever call this from a
 * Server Component, the same rule `lib/publicAssets.ts` follows.
 *
 * ── TERMS ─────────────────────────────────────────────────────────────────
 *
 * Google requires that review content is shown unmodified and attributed to
 * its author. `Testimonials` renders the author's name, photo, and a link to
 * their Google profile, and clamps long quotes with CSS rather than by
 * truncating the string — the full text stays in the DOM either way.
 */

/** Six hours. Also the floor for the routes that render reviews. */
export const GOOGLE_REVIEWS_REVALIDATE = 60 * 60 * 6;

export type GoogleReview = {
  id: string;
  quote: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorProfileUrl?: string;
  rating: number;
  /** Google's own wording, e.g. "2 months ago" — safe to show verbatim. */
  relativeTime?: string;
};

export type GooglePlaceReviews = {
  reviews: GoogleReview[];
  /** Average rating across every review, not just the five returned. */
  rating?: number;
  /** Total review count, likewise across all of them. */
  totalReviewCount?: number;
  /** The public listing, for "read all reviews on Google". */
  googleMapsUri?: string;
};

type PlacesTextValue = { text?: string };

type PlacesReview = {
  name?: string;
  rating?: number;
  text?: PlacesTextValue;
  originalText?: PlacesTextValue;
  relativePublishTimeDescription?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type PlacesResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
};

const FIELD_MASK = ["rating", "userRatingCount", "googleMapsUri", "reviews"].join(
  ",",
);

/**
 * Reviews with no written text come back with an empty `text` — Google counts
 * a bare star rating as a review. Those are dropped: a card with stars and no
 * quote reads as a rendering bug.
 */
function normalize(review: PlacesReview, index: number): GoogleReview | null {
  const quote = review.text?.text?.trim() || review.originalText?.text?.trim();
  const authorName = review.authorAttribution?.displayName?.trim();
  if (!quote || !authorName) return null;

  return {
    id: review.name || `google-review-${index}`,
    quote,
    authorName,
    authorPhotoUrl: review.authorAttribution?.photoUri,
    authorProfileUrl: review.authorAttribution?.uri,
    rating: Math.round(review.rating ?? 5),
    relativeTime: review.relativePublishTimeDescription,
  };
}

/**
 * Returns `null` when reviews are unavailable for any reason — unconfigured,
 * rate-limited, Google erroring, network down. Callers fall back rather than
 * failing the page: a marketing site should not 500 because a third party is
 * having a bad afternoon.
 */
export async function getGoogleReviews(): Promise<GooglePlaceReviews | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        cache: "force-cache",
        next: {
          revalidate: GOOGLE_REVIEWS_REVALIDATE,
          // Lets a webhook or admin action refresh reviews on demand later
          // with `revalidateTag("google-reviews")`.
          tags: ["google-reviews"],
        },
      },
    );

    if (!res.ok) {
      // The body carries Google's own error message, which is the difference
      // between "wrong Place ID" and "Places API not enabled on this key" —
      // worth having in the server log rather than a bare status code.
      console.error(
        `[googleReviews] Places API ${res.status}: ${(await res.text()).slice(0, 500)}`,
      );
      return null;
    }

    const data = (await res.json()) as PlacesResponse;
    const reviews = (data.reviews ?? [])
      .map(normalize)
      .filter((r): r is GoogleReview => r !== null);

    return {
      reviews,
      rating: data.rating,
      totalReviewCount: data.userRatingCount,
      googleMapsUri: data.googleMapsUri,
    };
  } catch (error) {
    console.error("[googleReviews] request failed:", error);
    return null;
  }
}
