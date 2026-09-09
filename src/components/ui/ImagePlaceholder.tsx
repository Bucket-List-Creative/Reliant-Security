import Image from "next/image";
import { IconPhoto } from "@tabler/icons-react";
import { SanityImage } from "@/components/ui/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

type Props = {
  /** When set (with an asset), the real image is rendered instead of the well. */
  image?: SanityImageType | null;
  /**
   * Local photography under `public/`, used when Sanity has no image yet.
   * Callers gate this on `publicAssetOrUndefined` so a missing file falls back
   * to the well rather than rendering broken.
   */
  src?: string;
  /** Alt text for `src`. Left empty the image is treated as decorative. */
  alt?: string;
  label?: string;
  className?: string;
  /** Aspect ratio for the frame, e.g. "16 / 10". */
  ratio?: string;
  /**
   * Tailwind aspect utilities, e.g. `"aspect-[16/10] lg:aspect-[4/3]"`.
   * Takes precedence over `ratio` — use it where the framing should change
   * between breakpoints, so a portrait crop doesn't run half a phone screen
   * tall while still filling its column on a desktop.
   */
  aspectClassName?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

/**
 * Renders a Sanity image when one is provided, then local photography, and
 * otherwise a neumorphic inset "well" marking where an image belongs — so the
 * layout reads as finished even before photography is added.
 *
 * The frame keeps `ratio` in every case, so a row of cards stays aligned no
 * matter which of the three states each one lands in.
 */
export function ImagePlaceholder({
  image,
  src,
  alt = "",
  label = "Image coming soon",
  className,
  ratio = "16 / 10",
  aspectClassName,
  width = 800,
  height = 500,
  sizes,
  priority,
}: Props) {
  const frameClass = [
    "overflow-hidden rounded-[var(--radius-md)]",
    aspectClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // A Tailwind class wins over the inline ratio so responsive variants apply.
  const frameStyle = aspectClassName ? undefined : { aspectRatio: ratio };

  if (image?.asset) {
    return (
      <div className={frameClass} style={frameStyle}>
        <SanityImage
          value={image}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (src) {
    return (
      <div className={frameClass} style={frameStyle}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={[
        "flex items-center justify-center rounded-[var(--radius-md)] bg-surface text-n-500",
        aspectClassName,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...frameStyle, boxShadow: "var(--shadow-soft-in-sm)" }}
      aria-hidden="true"
    >
      <span className="flex flex-col items-center gap-2 text-center">
        <IconPhoto size={26} stroke={1.6} />
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </span>
    </div>
  );
}
