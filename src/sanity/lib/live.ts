// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'
import { readToken, sanityConfigured } from '../env'
import { fallbackSanityData } from './fallback'

/**
 * `serverToken` lets `sanityFetch` read drafts when Next's draft mode is on,
 * so the client can preview edits before publishing. Queries using it run on
 * the server only, so the token is never exposed.
 *
 * `browserToken` is deliberately NOT set. It would ship a draft-reading token
 * to the browser, which is only needed for live draft updates *outside* the
 * Presentation tool. Previewing through Presentation (the Studio's own preview
 * tab) works with the server token alone, so the extra exposure buys nothing
 * here.
 *
 * With no token configured the behaviour is exactly as before: published
 * content only.
 */
const live = sanityConfigured
  ? defineLive({ client, serverToken: readToken || false, browserToken: false })
  : null;

export const sanityFetch =
  live?.sanityFetch ?? (async ({ query }: { query?: unknown }) => ({ data: fallbackSanityData(query) }));

export const SanityLive = live?.SanityLive ?? function SanityLive() {
  return null;
};
