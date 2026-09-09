export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-07-17'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ''

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

export const sanityConfigured = Boolean(projectId && dataset)

/**
 * Viewer token used to read drafts. Server-only — it must never gain a
 * `NEXT_PUBLIC_` prefix, because a token that can read drafts can read
 * unpublished content for the whole dataset.
 *
 * Optional: without it the site simply serves published content, which is the
 * correct behaviour for a normal visitor. Draft preview is the only thing that
 * needs it.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN || "";

/** Draft preview only works when both the project and a token are present. */
export const draftPreviewEnabled = Boolean(sanityConfigured && readToken);

/**
 * Shared secret for the Sanity webhook that revalidates the site. Set the same
 * value here and in the webhook definition in manage.sanity.io.
 */
export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET || "";
