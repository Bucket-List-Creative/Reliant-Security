import { SERVICE_CATEGORIES } from "@/content/services";

const FORM_ID = "262504892326056";

const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY ?? "";

/**
 * Verify the hCaptcha token with hCaptcha directly.
 *
 * This route is the actual attack surface: the browser form posts here, and
 * this handler then posts server-to-server to Jotform. A captcha configured on
 * the Jotform form protects Jotform's own hosted page, which nobody on this
 * site ever loads — a bot would hit `/api/contact`, which only this check
 * defends. That is why verification lives here rather than being forwarded.
 *
 * `remoteip` is deliberately not sent. Behind a CDN the address we observe is
 * often an edge node rather than the visitor, and a mismatch makes hCaptcha
 * reject tokens that are perfectly valid.
 */
async function captchaAccepted(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: HCAPTCHA_SECRET, response: token }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      console.warn("[contact] captcha rejected:", data["error-codes"]);
    }
    return data.success === true;
  } catch (error) {
    // Fail closed. A verification outage must not become an open relay.
    console.error("[contact] captcha verification failed:", error);
    return false;
  }
}
const services = new Set([
  ...SERVICE_CATEGORIES.flatMap((category) => category.services.map((service) => service.title)),
  "Not sure yet",
  "",
]);

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }

  const read = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const name = read("name");
  const email = read("email");
  const phone = read("phone");
  const service = read("service");
  const property = read("propertyType");
  const message = read("message");

  if (HCAPTCHA_SITE_KEY) {
    // The widget is live for visitors, so a token is required. Missing secret
    // is a deploy mistake, not a visitor problem — refuse rather than wave
    // everything through while the form appears to be protected.
    if (!HCAPTCHA_SECRET) {
      console.error(
        "[contact] NEXT_PUBLIC_HCAPTCHA_SITE_KEY is set but HCAPTCHA_SECRET_KEY is missing; refusing submissions.",
      );
      return Response.json({ success: false }, { status: 500 });
    }
    if (!(await captchaAccepted(read("hcaptchaToken")))) {
      return Response.json({ success: false }, { status: 400 });
    }
  }

  if (
    read("website") || !name || name.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    phone.length > 50 || !services.has(service) ||
    !["Home", "Business"].includes(property) || !message || message.length > 10000
  ) {
    return Response.json({ success: false }, { status: 400 });
  }

  // Keep the site's single name input; Jotform stores first/last separately.
  const [first, ...last] = name.split(/\s+/);
  const payload = new URLSearchParams({
    formID: FORM_ID,
    simple_spc: `${FORM_ID}-${FORM_ID}`,
    "q3_fullName[first]": first,
    "q3_fullName[last]": last.join(" "),
    q4_email: email,
    "q5_phoneNumber[full]": phone,
    q6_serviceOf: service,
    q7_propertyType: property,
    q8_howCan: message,
    website: "",
  });

  try {
    const response = await fetch(`https://submit.jotform.com/submit/${FORM_ID}`, {
      method: "POST",
      body: payload,
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    const html = await response.text();
    // Jotform can return a validation/error page with HTTP 200. Require its
    // thank-you page rather than treating any completed request as delivery.
    const confirmed = response.ok && /class=["'][^"']*\bthankyou-wrapper\b/i.test(html);
    return Response.json({ success: confirmed }, { status: confirmed ? 200 : 502 });
  } catch {
    // Do not retry automatically: a timeout may happen after Jotform saved it.
    return Response.json({ success: false }, { status: 502 });
  }
}
