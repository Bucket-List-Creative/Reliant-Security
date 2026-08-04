import { IconPhoto } from "@tabler/icons-react";
import { SanityImage } from "@/components/ui/SanityImage";
import type { SanityImage as SanityImageType } from "@/sanity/lib/types";

type Props = {
  /** When set (with an asset), the real image is rendered instead of the well. */
  image?: SanityImageType | null;
  label?: string;
  className?: string;
  /** Aspect ratio for the well, e.g. "16 / 10". Ignored when an image renders. */
  ratio?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
};

/**
 * Renders a Sanity image when one is provided, otherwise a neumorphic inset
 * "well" marking where an image belongs — so the layout reads as finished even
 * before photography is added.
 */
export function ImagePlaceholder({
  image,
  label = "Image coming soon",
  className,
  ratio = "16 / 10",
  width = 800,
  height = 500,
  sizes,
  priority,
}: Props) {
  if (image?.asset) {
    return (
      <div
        className={[
          "overflow-hidden rounded-[var(--radius-md)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
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

  return (
    <div
      className={[
        "flex items-center justify-center rounded-[var(--radius-md)] bg-surface text-n-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: ratio, boxShadow: "var(--shadow-soft-in-sm)" }}
      aria-hidden="true"
    >
      <span className="flex flex-col items-center gap-2 text-center">
        <IconPhoto size={26} stroke={1.6} />
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </span>
    </div>
  );
}
