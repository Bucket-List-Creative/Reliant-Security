import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

import { revalidateSecret } from "@/sanity/env";

/**
 * Sanity webhook → rebuild the affected pages.
 *
 * ── WHY THIS EXISTS ALONGSIDE `<SanityLive />` ────────────────────────────
 *
 * `SanityLive` already refreshes content, but it is driven from the browser:
 * a connected client receives the live event and calls a server action that
 * revalidates. That covers the normal case and nothing more — it is not a
 * server-to-server guarantee.
 *
 * Nearly every route here is prerendered at build time with no revalidation
 * window (see the build output: `○ Static`, blank Revalidate column). So if a
 * live event is ever missed, those pages have no time-based safety net and sit
 * frozen until the next deploy. This webhook is that safety net.
 *
 * ── WHY revalidatePath, NOT revalidateTag ─────────────────────────────────
 *
 * `revalidateTag` only invalidates data that was fetched with a matching
 * `next.tags`. Our Sanity reads go through `defineLive`'s `sanityFetch`, which
 * owns its own cache tags internally — there is no stable per-document-type
 * tag for us to target, so tag-based invalidation here would silently do
 * nothing. Revalidating the root layout invalidates every page beneath it,
 * which is the honest thing to do for a site this size: the pages regenerate
 * lazily on next visit, so this is not a thundering-herd rebuild.
 */
export async function POST(request: NextRequest): Promise<Response> {
  if (!revalidateSecret) {
    return Response.json(
      { message: "SANITY_REVALIDATE_SECRET is not set." },
      { status: 500 },
    );
  }

  try {
    // Verifies the `sanity-webhook-signature` header against the shared
    // secret. An unsigned or wrongly-signed request never gets past this.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      revalidateSecret,
    );

    if (!isValidSignature) {
      return Response.json({ message: "Invalid signature" }, { status: 401 });
    }

    revalidatePath("/", "layout");

    return Response.json({
      revalidated: true,
      type: body?._type ?? "unknown",
      now: Date.now(),
    });
  } catch (error) {
    console.error("[revalidate] webhook failed:", error);
    return Response.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
