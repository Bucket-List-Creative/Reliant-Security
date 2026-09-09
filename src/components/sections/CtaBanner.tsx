import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";
import { Button } from "@/components/ui/Button";

/**
 * The banner image is read here rather than passed in. `CtaBanner` is rendered
 * from ten different pages, three of which fetch no site settings at all, so
 * threading a prop through every call site would mean the client's uploaded
 * image silently missing from whichever page someone forgot. The settings
 * query is already fetched on most requests and is deduped by `sanityFetch`.
 */
export async function CtaBanner({
  heading = "Get a same-day quote",
  subheading = "Tell us about your project and we'll put together a detailed proposal. No obligation, no pressure — just a straight answer on what it will cost.",
  phone,
}: {
  heading?: string;
  subheading?: string;
  phone?: string;
}) {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  const image = (data as SiteSettings | null)?.ctaImage;

  return (
    <section className="sfc-section">
      <Container>
        {/* The wrapper exists so the truck can hang above the band: `.sfc-band`
            carries `overflow: hidden` for its gradient, which would crop a
            vehicle parked on its roof. */}
        <div className="sfc-cta-park">
          {/* `ImagePlaceholder` gives the Sanity upload priority over the
              bundled file, so the client can swap the vehicle without a
              deploy. The aspect ratio is pinned to the artwork's own 1000×547
              — the CSS lifts the image by its full height to stand it on the
              band, so a differently-shaped upload would float or sink. */}
          <ImagePlaceholder
            image={image}
            src="/Images/photos/reliant-truck.webp"
            alt=""
            ratio="1000 / 547"
            className="sfc-cta-park__truck"
            width={1000}
            height={547}
            sizes="(min-width: 1024px) 304px, 30vw"
          />
          {/* Dark band, matching the stat bar — the page opens and closes on the
            brand colour, with the pale card sections between them. */}
          <div
            className="sfc-band px-6 py-14 text-center sm:px-8 sm:py-16"
            style={{ boxShadow: "var(--shadow-overlay)" }}
          >
            <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {subheading}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/contact" variant="cta">
                Get a Same-Day Quote
              </Button>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="sfc-btn border-white/35 bg-transparent text-white hover:bg-white/10"
                  style={{ boxShadow: "none" }}
                >
                  Call {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
