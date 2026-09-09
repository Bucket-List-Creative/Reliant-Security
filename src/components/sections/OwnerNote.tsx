import { IconQuote } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { OwnerNote as OwnerNoteType } from "@/sanity/lib/types";
import { PHOTOS } from "@/content/photos";
import { publicAssetOrUndefined } from "@/lib/publicAssets";

/**
 * A short signed note from Reliant on the About page — the one place on the
 * site that speaks in the first person rather than as the company.
 *
 * Everything is editable in Sanity under Site settings → "A note from
 * Reliant". The defaults below keep the section honest before it's edited:
 * they say only what we already say elsewhere on the site, and the signature
 * stays generic ("The Reliant team") rather than inventing a named person.
 */

const DEFAULT_NOTE: Required<Pick<OwnerNoteType, "heading" | "body">> & {
  authorName: string;
  authorRole: string;
} = {
  heading: "A note from Reliant",
  body: [
    "We started Reliant because too many people were being sold a system instead of a solution — a box on the wall, a long contract, and a call centre three states away when something went wrong.",
    "We do it differently. You get the same local team from the first walkthrough through to service years later. We design around what your building actually needs rather than what we happen to stock, and we explain the trade-offs in plain language so you can make the call yourself.",
    "That approach is why most of our work still comes from referrals, and why customers who start with us on a house come back when they open a business. If you're weighing up your options, call us — even if you don't end up choosing Reliant, you'll get a straight answer.",
  ],
  authorName: "The Reliant team",
  authorRole: "Reliant Security · O'Fallon, Missouri",
};

const DEFAULT_PHOTO = publicAssetOrUndefined(PHOTOS.ownerPortrait.src);

export function OwnerNote({ note }: { note?: OwnerNoteType | null }) {
  const heading = note?.heading || DEFAULT_NOTE.heading;
  const body = note?.body?.length ? note.body : DEFAULT_NOTE.body;
  const authorName = note?.authorName || DEFAULT_NOTE.authorName;
  const authorRole = note?.authorRole || DEFAULT_NOTE.authorRole;

  return (
    <section className="sfc-section pt-0" id="a-note-from-reliant">
      <Container>
        <div
          className="overflow-hidden rounded-[var(--radius-xl)] bg-surface-raised"
          style={{ boxShadow: "var(--shadow-soft-3)" }}
        >
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <ImagePlaceholder
              image={note?.photo}
              src={DEFAULT_PHOTO}
              alt={PHOTOS.ownerPortrait.alt}
              aspectClassName="aspect-[16/10] sm:aspect-[2/1] lg:aspect-auto lg:h-full"
              className="w-full rounded-none lg:min-h-[420px]"
              width={800}
              height={1000}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />

            <div className="px-7 py-9 sm:px-10 sm:py-12">
              <span className="sfc-card__icon" aria-hidden>
                <IconQuote size={24} stroke={1.8} />
              </span>
              <h2 className="mt-5 text-2xl font-bold sm:text-3xl">{heading}</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-n-700">
                {body.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
              <div className="mt-7 border-t border-brand/15 pt-5">
                <p className="font-semibold">{authorName}</p>
                {authorRole && (
                  <p className="text-sm text-n-500">{authorRole}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
