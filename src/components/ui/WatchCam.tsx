import Image from "next/image";

/**
 * A dome camera mounted on the bottom-right corner of the navbar, watching the
 * page below it.
 *
 * Rendered as a sibling *before* the navbar pill rather than inside it: both
 * are positioned with an auto z-index, so the pill — later in the DOM — paints
 * over the top of the housing. That tuck is what makes the camera read as
 * bolted to the bar instead of floating in front of it.
 *
 * Purely decorative: hidden from assistive tech, and `pointer-events: none` so
 * it can never swallow a click meant for the page underneath.
 */
export function WatchCam() {
  return (
    <span className="sfc-watchcam" aria-hidden>
      <span className="sfc-watchcam__beam" />
      <Image
        src="/Images/photos/security-camera-transparent.png"
        alt=""
        width={512}
        height={512}
        className="sfc-watchcam__img"
      />
      <span className="sfc-watchcam__lens" />
      <span className="sfc-watchcam__lamp" />
    </span>
  );
}
