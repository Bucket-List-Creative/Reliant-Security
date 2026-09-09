import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import type { PostListItem } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SanityImage } from "@/components/ui/SanityImage";
import { PreferredSourceButton } from "@/components/sections/PreferredSourceButton";
import { POSTS, RETIRED_POST_SLUGS } from "@/content/posts";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Guides, buying advice, and industry insight on security, surveillance, access control, structured cabling, and monitoring — for homeowners, businesses, and facility managers.",
  path: "/blog",
});

/**
 * A card's worth of post, from either source. Posts carried over from the
 * previous site fill the list until the same slug exists in Sanity, at which
 * point the CMS version replaces it.
 */
type Entry = {
  key: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  authorName?: string;
  category?: string;
  image?: PostListItem["mainImage"];
};

function mergePosts(cms: PostListItem[]): Entry[] {
  const bySlug = new Map<string, Entry>();

  for (const p of POSTS) {
    bySlug.set(p.slug, {
      key: p.slug,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      publishedAt: p.publishedAt,
      authorName: p.author,
      category: p.category,
    });
  }

  for (const p of cms) {
    bySlug.set(p.slug, {
      key: p._id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      publishedAt: p.publishedAt,
      authorName: p.author?.name,
      image: p.mainImage,
    });
  }

  for (const slug of RETIRED_POST_SLUGS) bySlug.delete(slug);

  return [...bySlug.values()].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
}

function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const { data } = await sanityFetch({ query: POSTS_QUERY });
  const posts = mergePosts((data as PostListItem[]) ?? []);

  return (
    <section className="sfc-section pt-12">
      <Container>
        <div className="mb-12 max-w-2xl">
          <Badge className="mb-5">Blog</Badge>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Guides &amp; security insights
          </h1>
          <p className="mt-5 text-lg text-n-700">
            Practical guidance on choosing, planning, and getting the most from
            your security — for homeowners, business owners, and facility
            managers alike. We cover surveillance, access control, structured
            cabling and fiber, monitoring, and the compliance questions that
            come up on commercial and government work.
          </p>

          {/* The most contextually honest place for this: readers who want
              more of our writing are the ones worth asking to follow us. */}
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
            <PreferredSourceButton />
            <p className="text-sm text-n-500">
              See our guides first in Google Search and AI results.
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <Card className="text-center">
            <p className="text-n-700">
              No posts published yet. Add a{" "}
              <Link href="/studio" className="text-brand-press underline">
                blog post in the Studio
              </Link>{" "}
              to see it here.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.key} href={`/blog/${post.slug}`} className="block">
                <Card interactive className="flex h-full flex-col overflow-hidden">
                  {post.image?.asset && (
                    <div className="-mx-7 -mt-7 mb-5">
                      <SanityImage
                        value={post.image}
                        width={640}
                        height={400}
                        className="aspect-[16/10] w-full object-cover"
                        sizes="(min-width: 1024px) 380px, 100vw"
                      />
                    </div>
                  )}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {post.category && <Badge>{post.category}</Badge>}
                  </div>
                  <div className="mb-2 text-sm text-n-500">
                    {formatDate(post.publishedAt)}
                    {post.authorName ? ` · ${post.authorName}` : ""}
                  </div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-n-700">{post.excerpt}</p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
