import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/live";
import { LEGAL_PAGE_QUERY } from "@/sanity/lib/queries";
import type { LegalPage } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { PRIVACY_POLICY } from "@/content/legal";

const SLUG = "privacy-policy";

export const metadata: Metadata = buildMetadata({
  title: PRIVACY_POLICY.title,
  description: PRIVACY_POLICY.intro,
  path: `/${SLUG}`,
});

/**
 * `updatedAt` is a Sanity `date` — a bare "YYYY-MM-DD", which `Date` parses as
 * UTC midnight. Formatting that in a US timezone rolls it back a day, so pin
 * the formatter to UTC and the date reads as written.
 */
function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Sanity wins when a `legalPage` with this slug exists; otherwise the copy
 * carried over from the previous site renders. Either way the page is live.
 */
export default async function PrivacyPolicyPage() {
  const { data } = await sanityFetch({
    query: LEGAL_PAGE_QUERY,
    params: { slug: SLUG },
  });
  const cms = data as LegalPage | null;

  const title = cms?.title ?? PRIVACY_POLICY.title;
  const intro = cms?.intro ?? PRIVACY_POLICY.intro;
  const updatedAt = cms?.updatedAt ?? PRIVACY_POLICY.updatedAt;

  return (
    <section className="sfc-section pt-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Badge className="mb-5">Legal</Badge>
          <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
          {intro && <p className="mt-5 text-lg text-n-700">{intro}</p>}
          {updatedAt && (
            <p className="mt-3 text-sm text-n-500">
              Last updated {formatDate(updatedAt)}
            </p>
          )}

          <div className="sfc-prose mt-10">
            {cms?.body?.length ? (
              <PortableTextContent value={cms.body} />
            ) : (
              PRIVACY_POLICY.body.map((p) => <p key={p.slice(0, 40)}>{p}</p>)
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
