This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment variables

Set these in `.env.local` (git-ignored) and in the host's environment for
deploys.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | Sanity project the site reads content from. |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | Sanity dataset, e.g. `production`. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | yes | Service-area map. Browser-exposed by design — restrict it by HTTP referrer. |
| `GOOGLE_PLACES_API_KEY` | no | Live Google reviews. Without it the reviews section falls back (see below). |
| `GOOGLE_PLACE_ID` | no | Which business's reviews to show. |
| `SANITY_API_READ_TOKEN` | no | Viewer token. Enables draft preview; without it the site serves published content only. |
| `SANITY_REVALIDATE_SECRET` | no | Shared secret for the Sanity revalidation webhook. |
| `NEXT_PUBLIC_SITE_URL` | prod | Canonical origin. Without it, Vercel builds fall back to the deployment hostname and canonical/OG URLs point at the preview URL. |

### Live Google reviews

`src/lib/googleReviews.ts` pulls reviews from the Places API (New) and feeds
the testimonials section on the home and About pages. To switch it on:

1. In the Google Cloud project, enable **Places API (New)**.
2. Create a **new** API key — do not reuse `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
   That one ships to the browser, and a key with Places enabled is billable, so
   exposing it hands anyone a metered credential. Restrict the new key to the
   Places API. It is called server-side, so an HTTP-referrer restriction will
   *not* work — use an IP restriction if the host has stable egress IPs.
3. Find the business's Place ID with Google's Place ID Finder and set
   `GOOGLE_PLACE_ID`.

The API key and the business need not belong to the same party: Place Details
is public read-only data, so an agency's key can read a client's listing.
Billing follows the key.

**Known limits.** The Places API returns **at most five reviews**, chosen by
Google — there is no paging and no way to select which ones. Showing every
review, or replying to them, requires the Business Profile API: a separate
product needing a manual access request to Google and OAuth against an account
with access to the profile. `googleReviews.ts` is the only module that knows
where reviews come from, so that swap stays contained.

Responses are cached for six hours (`force-cache` + `revalidate`). This is not
optional — `fetch` is uncached by default in this version of Next, and
`reviews` is a per-request billed SKU, so an uncached call would bill on every
render.

**Fallback order** when reviews are unavailable: Sanity `testimonial`
documents, then — in development only — built-in placeholders. In production
with neither, the section renders nothing. It will never show invented quotes.

## Draft preview

Editors can see unpublished changes before publishing, via the Studio's
**Presentation** tab (`/studio` → Presentation), which renders the real site
beside the form with click-to-edit.

1. In manage.sanity.io → API → Tokens, create a token with **Viewer**
   permissions and set it as `SANITY_API_READ_TOKEN`.
2. That's it — `presentationTool` is already configured, and it derives its
   preview origin from wherever the Studio is served, so localhost and
   production both work with no extra configuration.

Without the token, `/api/draft-mode/enable` returns 404 rather than half-
working: enabling draft mode with no token would set the cookie and still
render published content, which looks like a broken preview instead of a
missing setting.

The token is server-only and must never gain a `NEXT_PUBLIC_` prefix — it can
read every unpublished document in the dataset. `browserToken` is deliberately
left unset for the same reason; Presentation only needs the server token.

Draft mode is a cookie, so a "Previewing drafts · exit" banner appears while
it's on, linking to `/api/draft-mode/disable`.

## Revalidation webhook

`<SanityLive />` already refreshes content, but it is browser-driven: a
connected client receives the live event and triggers revalidation. Almost
every route here is prerendered with no revalidation window, so a missed event
would leave pages stale until the next deploy. The webhook is the server-side
safety net.

1. Set `SANITY_REVALIDATE_SECRET` to a random string (both locally and on the
   host).
2. In manage.sanity.io → API → Webhooks, create a webhook:
   - **URL** `https://secure-reliant.com/api/revalidate`
   - **Dataset** `production`, **Trigger on** create / update / delete
   - **HTTP method** `POST`, **API version** `v2021-03-25` or later
   - **Secret** the same value as `SANITY_REVALIDATE_SECRET`

Requests without a valid `sanity-webhook-signature` are rejected with 401.

The route calls `revalidatePath("/", "layout")` rather than `revalidateTag`.
Sanity reads go through `defineLive`'s `sanityFetch`, which owns its cache tags
internally — there is no stable per-type tag to target, so tag-based
invalidation would silently do nothing. Pages regenerate lazily on next visit.
