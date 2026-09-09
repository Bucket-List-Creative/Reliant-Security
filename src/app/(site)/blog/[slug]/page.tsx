import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/schema";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { SITE_URL, SITE_NAME } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SanityImage } from "@/components/ui/SanityImage";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  findPost,
  POSTS,
  RETIRED_POST_SLUGS,
  type LocalPost,
} from "@/content/posts";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  // Use the API directly (no CDN) so freshly published slugs are included.
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch<{ slug: string }[]>(POST_SLUGS_QUERY)
    .catch(() => [] as { slug: string }[]);

  // Posts carried over from the previous site keep their URLs even before
  // they're re-created in Sanity.
  const all = new Set(POSTS.map((p) => p.slug));
  for (const { slug } of slugs) if (slug) all.add(slug);
  return [...all]
    .filter((slug) => !RETIRED_POST_SLUGS.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    stega: false,
  });
  const cms = data as Post | null;
  const local = findPost(slug);
  if (!cms && !local) return {};

  const title = cms?.title ?? local!.title;
  const description = cms?.excerpt ?? local?.excerpt;
  // The page heading keeps the full headline; only the <title> is shortened.
  const seoTitle = cms?.seoTitle || local?.seoTitle || title;

  return buildMetadata({
    title: seoTitle,
    description,
    path: `/blog/${slug}`,
    type: "article",
  });
}

/** Render the small block format used by the carried-over posts. */
function LocalPostBody({ post }: { post: LocalPost }) {
  const nodes: React.ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: string) => {
    if (!list.length) return;
    nodes.push(
      <ul key={`ul-${key}`}>
        {list.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  post.body.forEach((b, i) => {
    if (b.kind === "li") {
      list.push(b.text);
      return;
    }
    flush(String(i));
    if (b.kind === "h2") nodes.push(<h2 key={i}>{b.text}</h2>);
    else if (b.kind === "h3") nodes.push(<h3 key={i}>{b.text}</h3>);
    else nodes.push(<p key={i}>{b.text}</p>);
  });
  flush("end");

  return <>{nodes}</>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: POST_QUERY, params: { slug } });
  const cms = data as Post | null;
  const local = findPost(slug);

  if (!cms && !local) notFound();

  const title = cms?.title ?? local!.title;
  const publishedAt = cms?.publishedAt ?? local?.publishedAt;
  const authorName = cms?.author?.name ?? local?.author;
  const categories = cms?.categories?.length
    ? cms.categories.map((c) => ({ id: c._id, title: c.title }))
    : local?.category
      ? [{ id: local.category, title: local.category }]
      : [];

  const POSTING_NODE = {
        "@type": "BlogPosting",
    headline: title,
    datePublished: publishedAt,
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  };

  const jsonLd = jsonLdGraph(
    POSTING_NODE,
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: title, path: `/blog/${slug}` },
    ]),
  );


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="sfc-section pt-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="text-sm text-n-500 transition-colors hover:text-ink"
            >
              ← Back to blog
            </Link>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Badge key={c.id}>{c.title}</Badge>
              ))}
            </div>

            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{title}</h1>

            <div className="mt-4 flex items-center gap-3 text-n-500">
              {cms?.author?.image?.asset && (
                <SanityImage
                  value={cms.author.image}
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
              )}
              <span>
                {authorName ? `${authorName} · ` : ""}
                {formatDate(publishedAt)}
              </span>
            </div>

            {cms?.mainImage?.asset && (
              <div className="mt-8 overflow-hidden rounded-[var(--radius-xl)]">
                <SanityImage
                  value={cms.mainImage}
                  width={1024}
                  height={560}
                  priority
                  className="aspect-[16/9] w-full object-cover"
                  sizes="(min-width: 768px) 768px, 100vw"
                />
              </div>
            )}

            <div className="sfc-prose mt-10">
              {cms?.body?.length ? (
                <PortableTextContent value={cms.body} />
              ) : (
                local && <LocalPostBody post={local} />
              )}
            </div>
          </div>
        </Container>
      </article>

      <CtaBanner />
    </>
  );
}
