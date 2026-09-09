import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { IconArrowRight, IconDownload, IconExternalLink } from "@tabler/icons-react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  RESOURCES_QUERY,
  POSTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  Resource,
  PostListItem,
  SiteSettings,
} from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardIcon } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PreferredSourceButton } from "@/components/sections/PreferredSourceButton";
import { POSTS, type LocalPost } from "@/content/posts";
import { HOME_FAQS } from "@/content/faqs";
import { SERVICE_CATEGORIES } from "@/content/services";
import { PHOTOS } from "@/content/photos";
import { publicAssetOrUndefined } from "@/lib/publicAssets";

export const metadata: Metadata = buildMetadata({
  title: "Resources",
  description:
    "Guides, buying advice, FAQs, and downloads on security, surveillance, access control, structured cabling, and monitoring — for homeowners, businesses, and facility managers.",
  path: "/resources",
});

const HERO_PHOTO = publicAssetOrUndefined(PHOTOS.installCommercial.src);

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const KIND_LABELS: Record<string, string> = {
  guide: "Guide",
  checklist: "Checklist",
  spec: "Spec sheet",
  faq: "FAQ",
  link: "Link",
};

function resourceHref(r: Resource): string | undefined {
  return r.fileUrl ?? r.url;
}

export default async function ResourcesPage() {
  const [{ data: resources }, { data: posts }, { data: settings }] =
    await Promise.all([
      sanityFetch({ query: RESOURCES_QUERY }),
      sanityFetch({ query: POSTS_QUERY }),
      sanityFetch({ query: SITE_SETTINGS_QUERY }),
    ]);

  const items = (resources as Resource[]) ?? [];
  const cmsPosts = (posts as PostListItem[]) ?? [];
  const phone = (settings as SiteSettings | null)?.phone;

  // Latest writing, from Sanity when it's there and the carried-over posts
  // otherwise, so this section is never empty.
  const latest: (PostListItem | LocalPost)[] = cmsPosts.length
    ? cmsPosts.slice(0, 3)
    : POSTS.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="sfc-section pt-12">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <Badge className="mb-5">Resources</Badge>
              <h1 className="text-4xl font-bold sm:text-5xl">
                Everything you need to choose well
              </h1>
              <p className="mt-5 text-lg text-n-700">
                Practical guidance on planning, specifying, and getting the most
                from a security system — whether you&apos;re protecting a family
                home or a multi-site estate. Start with our guides, browse the
                service explainers, or read the latest from our team.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/blog" variant="primary">
                  Read the blog
                </Button>
                <Button href="/contact" variant="outline">
                  Ask us a question
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
                <PreferredSourceButton />
                <p className="text-sm text-n-500">
                  See our guides first in Google Search and AI results.
                </p>
              </div>
            </div>

            <ImagePlaceholder
              src={HERO_PHOTO}
              alt={PHOTOS.installCommercial.alt}
              aspectClassName="aspect-[16/10] lg:aspect-[4/3]"
              className="w-full"
              width={960}
              height={720}
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>
        </Container>
      </section>

      {/* Downloads & guides — Sanity-managed */}
      {items.length > 0 && (
        <section className="sfc-section pt-0" id="guides">
          <Container>
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Guides &amp; downloads
              </h2>
              <p className="mt-4 text-lg text-n-700">
                Reference material you can keep — planning checklists, spec
                sheets, and buying guides.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((r) => {
                const href = resourceHref(r);
                const body = (
                  <Card
                    interactive={Boolean(href)}
                    className="flex h-full flex-col overflow-hidden"
                  >
                    {r.image?.asset && (
                      <div className="-mx-7 -mt-7 mb-5">
                        <ImagePlaceholder
                          image={r.image}
                          aspectClassName="aspect-[16/10]"
                          width={640}
                          height={400}
                          sizes="(min-width: 1024px) 380px, 100vw"
                        />
                      </div>
                    )}
                    <div className="mb-2">
                      <Badge>{KIND_LABELS[r.kind ?? "guide"] ?? "Guide"}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold">{r.title}</h3>
                    {r.summary && (
                      <p className="mt-2 flex-1 text-n-700">{r.summary}</p>
                    )}
                    {href && (
                      <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-brand-press">
                        {r.fileUrl ? "Download" : "Open"}
                        {r.fileUrl ? (
                          <IconDownload size={16} stroke={2} aria-hidden />
                        ) : (
                          <IconExternalLink size={16} stroke={2} aria-hidden />
                        )}
                      </span>
                    )}
                  </Card>
                );

                return href ? (
                  <a
                    key={r._id}
                    href={href}
                    className="block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {body}
                  </a>
                ) : (
                  <div key={r._id}>{body}</div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Service explainers */}
      <section className="sfc-section pt-0" id="explainers">
        <Container>
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Understand the systems
            </h2>
            <p className="mt-4 text-lg text-n-700">
              Every service has its own page explaining what it does, what&apos;s
              included, and the questions we get asked most.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/services#${cat.slug}`} className="block">
                <Card interactive className="sfc-card--tint flex h-full flex-col">
                  <CardIcon>
                    <ServiceIcon name={cat.iconKey} size={26} />
                  </CardIcon>
                  <h3 className="mt-5 text-lg font-semibold">{cat.title}</h3>
                  <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed">
                    {cat.blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 border-t border-brand/15 pt-4 text-sm font-semibold text-brand-press">
                    {cat.services.length} services
                    <IconArrowRight size={16} stroke={2} aria-hidden />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest from the blog */}
      <section className="sfc-section pt-0" id="latest">
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Latest from the blog
              </h2>
              <p className="mt-4 text-lg text-n-700">
                Security news, seasonal advice, and lessons from jobs we&apos;ve
                just finished.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-press"
            >
              All posts
              <IconArrowRight size={16} stroke={2} aria-hidden />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {latest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <Card interactive className="flex h-full flex-col">
                  <div className="mb-2 text-sm text-n-500">
                    {formatDate(post.publishedAt)}
                  </div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-n-700">
                      {post.excerpt}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <FaqAccordion faqs={HOME_FAQS} heading="Frequently asked" />
      <CtaBanner phone={phone} />
    </>
  );
}
