'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    /**
     * Side-by-side preview: the editor sees the real site next to the form and
     * can click an element to jump to the field behind it.
     *
     * `previewUrl.origin` is left to the browser's own origin, so the Studio
     * embedded at `/studio` previews whichever deployment it is served from —
     * localhost while developing, the live domain in production — with no
     * per-environment configuration to keep in sync.
     *
     * Needs `SANITY_API_READ_TOKEN` on the site for drafts to actually render;
     * without it `/api/draft-mode/enable` returns 404 and the preview pane
     * shows published content.
     */
    presentationTool({
      previewUrl: {
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
