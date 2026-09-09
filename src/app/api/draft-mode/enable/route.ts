import { createClient } from "next-sanity";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { apiVersion, dataset, projectId, readToken, draftPreviewEnabled } from "@/sanity/env";

/**
 * Turns on Next's draft mode so the site renders unpublished Sanity content.
 *
 * The Studio's Presentation tool calls this with a signed URL; `next-sanity`
 * validates that signature against the dataset before setting the cookie, so
 * the route can't be used to read drafts by guessing the URL.
 *
 * Without `SANITY_API_READ_TOKEN` the route 404s rather than half-working —
 * draft mode with no token would flip the cookie on and then still render
 * published content, which looks like a broken preview rather than a missing
 * configuration.
 */
const enable = draftPreviewEnabled
  ? defineEnableDraftMode({
      client: createClient({
        projectId,
        dataset,
        apiVersion,
        // Never `useCdn` here: the CDN serves published content, which is the
        // opposite of what a draft preview needs.
        useCdn: false,
        token: readToken,
      }),
    })
  : null;

export async function GET(request: Request): Promise<Response> {
  if (!enable) {
    return new Response(
      "Draft preview is not configured. Set SANITY_API_READ_TOKEN.",
      { status: 404 },
    );
  }
  return enable.GET(request);
}
