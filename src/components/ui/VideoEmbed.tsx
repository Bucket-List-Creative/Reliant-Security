/**
 * Renders a video in one of three ways, in this order:
 *
 *   1. `url` pointing at YouTube or Vimeo  → their iframe player;
 *   2. `file` pointing at something under `public/` → a self-hosted `<video>`;
 *   3. neither → a placeholder telling an editor where to add one.
 *
 * The iframe branch comes first so a link dropped into Sanity always wins over
 * the file committed to the repo.
 */
function toEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoEmbed({
  url,
  file,
  poster,
  title = "Video",
  /**
   * Frame shape. Hosted embeds are 16:9; a self-hosted clip should be given
   * its own ratio, or it gets cropped to fit a shape it was never cut for.
   */
  ratio = "16 / 9",
  className,
}: {
  url?: string;
  /** Path under `public/`, e.g. `/video/clip.mp4`. */
  file?: string;
  /** Poster image path — worth having, see the `preload` note below. */
  poster?: string;
  title?: string;
  ratio?: string;
  className?: string;
}) {
  const frameClass = [
    "w-full overflow-hidden rounded-[var(--radius-xl)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const embed = toEmbedUrl(url);

  if (embed) {
    return (
      <div
        className={frameClass}
        style={{ aspectRatio: ratio, boxShadow: "var(--shadow-soft-3)" }}
      >
        <iframe
          src={embed}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (file) {
    return (
      <div
        className={frameClass}
        style={{ aspectRatio: ratio, boxShadow: "var(--shadow-soft-3)" }}
      >
        {/*
          `preload="none"` is doing real work here: the clip is several
          megabytes, and without it every visitor pays for a video most of them
          never play. The poster is a still from the video, so the frame still
          looks like a video rather than an empty box.
        */}
        <video
          className="h-full w-full object-cover"
          poster={poster}
          controls
          playsInline
          preload="none"
          title={title}
        >
          <source src={file} type="video/mp4" />
          Your browser can&apos;t play this video.{" "}
          <a href={file}>Download it instead.</a>
        </video>
      </div>
    );
  }

  return (
    <div
      className={`${frameClass} flex items-center justify-center bg-surface-raised text-center`}
      style={{ aspectRatio: ratio, boxShadow: "var(--shadow-soft-in)" }}
    >
      <div className="px-6">
        <div className="sfc-card__icon mx-auto">▶</div>
        <p className="mt-3 text-n-500">
          Add a YouTube or Vimeo link in Site settings to feature a video here.
        </p>
      </div>
    </div>
  );
}
