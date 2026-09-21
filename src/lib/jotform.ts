/**
 * Jotform is the backend for the contact form; the UI is ours.
 *
 * Everything Jotform needs to recognise a submission lives here, in one place,
 * because the browser and the server must produce byte-identical bodies.
 *
 * ── THE CAPTCHA ───────────────────────────────────────────────────────────
 *
 * The Jotform form carries a required captcha field, so a submission with no
 * token is refused. The token is solved in the visitor's browser using
 * Jotform's own site key and forwarded verbatim — **we never verify it
 * ourselves**. hCaptcha tokens are single-use: calling `siteverify` would
 * consume the token and Jotform's own check would then fail on a token that
 * had already been spent. Jotform holds the matching secret; verification is
 * theirs to do.
 *
 * The site key is not a secret — it is published in Jotform's own page source,
 * so it is hardcoded rather than kept in an env var. Re-copy it from
 * `https://form.jotform.com/<FORM_ID>` (the `data-sitekey` on the captcha div)
 * if Jotform ever rotates it.
 */

export const JOTFORM_FORM_ID = "262504892326056";
export const JOTFORM_SUBMIT_URL = `https://submit.jotform.com/submit/${JOTFORM_FORM_ID}`;
export const JOTFORM_HCAPTCHA_SITEKEY = "772f4a50-7161-425e-8cd5-4d7e361ab765";

export type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  service: string;
  propertyType: string;
  message: string;
  /** Single-use, and expires a couple of minutes after hCaptcha issues it. */
  captchaToken?: string | null;
};

/**
 * Jotform stores first and last separately; the site asks for one name. Any
 * middle names ride along with the surname rather than being dropped.
 */
export function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first: "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export function toJotformBody(input: ContactSubmission): URLSearchParams {
  const { first, last } = splitName(input.name);
  const captchaToken = (input.captchaToken ?? "").trim();

  return new URLSearchParams({
    formID: JOTFORM_FORM_ID,
    // Jotform's anti-spam field, expected in this exact `<id>-<id>` shape.
    simple_spc: `${JOTFORM_FORM_ID}-${JOTFORM_FORM_ID}`,

    "q3_fullName[first]": first,
    "q3_fullName[last]": last,
    q4_email: input.email,
    "q5_phoneNumber[full]": input.phone,
    q6_serviceOf: input.service,
    q7_propertyType: input.propertyType,
    q8_howCan: input.message,

    // The captcha is two fields. `h-captcha-response` is hCaptcha's token;
    // `hcaptcha_visible` is the hidden input Jotform's own solve-callback sets
    // to satisfy the field's `validate[required]`. The flag is derived from the
    // token rather than hardcoded — sending it alone would assert a check that
    // never happened.
    "h-captcha-response": captchaToken,
    hcaptcha_visible: captchaToken ? "1" : "",

    // Jotform's honeypot. Must arrive empty.
    website: "",
  });
}

/**
 * Whether Jotform accepted the submission.
 *
 * Jotform answers a *rejection* with `HTTP 200` and an HTML page, so a bare
 * 200 means nothing. Acceptance is a redirect to the thank-you page, which is
 * why the caller must use `redirect: "manual"` — following it would collapse
 * the signal into another 200. A 200 is only treated as delivery when the body
 * is recognisably the thank-you page rather than the "Please Complete"
 * captcha interstitial.
 */
export function jotformAccepted(status: number, body: string): boolean {
  if (status >= 300 && status < 400) return true;
  if (status !== 200) return false;
  return /class=["'][^"']*\bthankyou-wrapper\b/i.test(body);
}
