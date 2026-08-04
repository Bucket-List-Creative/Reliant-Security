import { IconStarFilled } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SanityImage } from "@/components/ui/SanityImage";
import type { Testimonial } from "@/sanity/lib/types";

const FALLBACK: Testimonial[] = [
  {
    _id: "t1",
    quote:
      "The install was spotless and the monitoring team caught an issue before we even noticed. Genuinely reassuring.",
    authorName: "Dana Whitfield",
    authorRole: "Homeowner, Austin",
    rating: 5,
  },
  {
    _id: "t2",
    quote:
      "We secured three retail locations in a week. Access control and cameras all run from one dashboard now.",
    authorName: "Marcus Lee",
    authorRole: "Operations Director, Northgate Retail",
    rating: 5,
  },
  {
    _id: "t3",
    quote:
      "Response time is exactly as promised. It's the first security company that actually feels premium.",
    authorName: "Priya Nair",
    authorRole: "Homeowner, Denver",
    rating: 5,
  },
];

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div
      className="mb-4 flex gap-0.5"
      aria-label={`${rating} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStarFilled
          key={i}
          size={16}
          className={i < rating ? "text-brand" : "text-n-300"}
        />
      ))}
    </div>
  );
}

export function Testimonials({
  testimonials,
  heading = "Trusted by homes and businesses",
}: {
  testimonials?: Testimonial[];
  heading?: string;
}) {
  const items = testimonials?.length ? testimonials : FALLBACK;

  return (
    <section className="sfc-section" id="testimonials">
      <Container>
        <h2 className="mb-12 max-w-2xl text-3xl font-bold sm:text-4xl">
          {heading}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <Card key={t._id} className="flex h-full flex-col">
              <Stars rating={t.rating ?? 5} />
              <blockquote className="flex-1 text-lg leading-relaxed">
                “{t.quote}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                {t.avatar?.asset && (
                  <SanityImage
                    value={t.avatar}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold">{t.authorName}</div>
                  {t.authorRole && (
                    <div className="text-sm text-n-500">{t.authorRole}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
