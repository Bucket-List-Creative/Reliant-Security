import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, sanityConfigured } from '../env'

type QueryClient = {
  fetch: <T = unknown>() => Promise<T>
  withConfig: () => QueryClient
}

const emptyClient: QueryClient = {
  async fetch<T>() {
    return null as T
  },
  withConfig() {
    return this
  },
}

export const client = sanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
    })
  : (emptyClient as unknown as ReturnType<typeof createClient>)
