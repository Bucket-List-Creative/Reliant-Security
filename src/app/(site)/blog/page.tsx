import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import type { PostListItem } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SanityImage } from "@/components/ui/SanityImage";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Buyer's guides, security tips, and product updates from the Reliant Security team.",
};

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
  const posts = (data as PostListItem[]) ?? [];

  return (
    <section className="sfc-section pt-12">
      <Container>
        <div className="mb-12 max-w-2xl">
          <Badge className="mb-5">Learn</Badge>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Buyer&apos;s guides &amp; security insights
          </h1>
          <p className="mt-5 text-lg text-n-700">
            Practical guidance to help you choose, plan, and get the most from
            your security — plus product news and safety tips from our team.
          </p>
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
              <Link key={post._id} href={`/blog/${post.slug}`} className="block">
                <Card interactive className="flex h-full flex-col overflow-hidden">
                  {post.mainImage?.asset && (
                    <div className="-mx-7 -mt-7 mb-5">
                      <SanityImage
                        value={post.mainImage}
                        width={640}
                        height={380}
                        className="h-48 w-full object-cover"
                        sizes="(min-width: 1024px) 380px, 100vw"
                      />
                    </div>
                  )}
                  <div className="mb-2 text-sm text-n-500">
                    {formatDate(post.publishedAt)}
                    {post.author?.name ? ` · ${post.author.name}` : ""}
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
