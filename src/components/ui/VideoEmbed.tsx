/**
 * Embeds a YouTube or Vimeo video from a share URL. Renders a placeholder
 * when no (recognized) URL is provided.
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
  title = "Video",
}: {
  url?: string;
  title?: string;
}) {
  const embed = toEmbedUrl(url);

  if (!embed) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-[var(--radius-xl)] bg-surface-raised text-center"
        style={{ boxShadow: "var(--shadow-soft-in)" }}
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

  return (
    <div
      className="aspect-video w-full overflow-hidden rounded-[var(--radius-xl)]"
      style={{ boxShadow: "var(--shadow-soft-3)" }}
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
