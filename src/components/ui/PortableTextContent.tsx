import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { SanityImage } from "@/components/ui/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageType & { caption?: string } }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <SanityImage
            value={value}
            width={960}
            className="w-full rounded-[var(--radius-lg)]"
            sizes="(min-width: 768px) 720px, 100vw"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-n-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = !href.startsWith("/");
      return (
        <a
          href={href}
          target={value?.openInNewTab ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableTextContent({
  value,
}: {
  value?: PortableTextBlock[] | null;
}) {
  if (!value?.length) return null;
  return (
    <div className="sfc-prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
