import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SanityImage } from "@/components/ui/SanityImage";
import { PortableTextContent } from "@/components/ui/PortableTextContent";

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
    .fetch<{ slug: string }[]>(POST_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    stega: false,
  });
  const post = data as Post | null;
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { data } = await sanityFetch({ query: POST_QUERY, params: { slug } });
  const post = data as Post | null;

  if (!post) notFound();

  return (
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
            {post.categories?.map((c) => (
              <Badge key={c._id}>{c.title}</Badge>
            ))}
          </div>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{post.title}</h1>

          <div className="mt-4 flex items-center gap-3 text-n-500">
            {post.author?.image?.asset && (
              <SanityImage
                value={post.author.image}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover"
              />
            )}
            <span>
              {post.author?.name ? `${post.author.name} · ` : ""}
              {formatDate(post.publishedAt)}
            </span>
          </div>

          {post.mainImage?.asset && (
            <div className="mt-8">
              <SanityImage
                value={post.mainImage}
                width={1024}
                height={560}
                priority
                className="w-full rounded-[var(--radius-xl)] object-cover"
                sizes="(min-width: 768px) 768px, 100vw"
              />
            </div>
          )}

          <div className="mt-10">
            <PortableTextContent value={post.body} />
          </div>
        </div>
      </Container>
    </article>
  );
}
