import { draftMode } from "next/headers";

/**
 * Turns draft mode back off.
 *
 * Draft mode is a cookie, so someone who previews once keeps seeing
 * unpublished content on the real domain until it's cleared — easy to mistake
 * for "the site is showing the wrong thing". This gives them a way out that
 * doesn't involve clearing site data.
 */
export async function GET(request: Request): Promise<Response> {
  const draft = await draftMode();
  draft.disable();

  // Send them back where they came from, or home.
  const referer = request.headers.get("referer");
  const url = new URL(referer ?? "/", request.url);
  return Response.redirect(url, 307);
}
