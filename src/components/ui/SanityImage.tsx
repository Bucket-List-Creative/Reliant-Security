import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

type Props = {
  value?: SanityImageType | null;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Wraps next/image with the Sanity URL builder. Uses the queried LQIP as a
 * blur placeholder when available. Renders nothing without an asset.
 */
export function SanityImage({
  value,
  width = 800,
  height,
  className,
  sizes,
  priority,
}: Props) {
  if (!value?.asset) return null;

  const h = height ?? Math.round(width / 1.5);
  const lqip = value.asset.metadata?.lqip;

  return (
    <Image
      className={className}
      src={urlFor(value).width(width).height(h).fit("crop").auto("format").url()}
      alt={value.alt ?? ""}
      width={width}
      height={h}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
    />
  );
}
