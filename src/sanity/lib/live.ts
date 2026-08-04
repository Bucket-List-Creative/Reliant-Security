// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'
import { sanityConfigured } from '../env'
import { fallbackSanityData } from './fallback'

const live = sanityConfigured ? defineLive({ client }) : null;

export const sanityFetch =
  live?.sanityFetch ?? (async ({ query }: { query?: unknown }) => ({ data: fallbackSanityData(query) }));

export const SanityLive = live?.SanityLive ?? function SanityLive() {
  return null;
};
