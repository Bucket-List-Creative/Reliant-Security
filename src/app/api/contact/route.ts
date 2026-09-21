import { SERVICE_CATEGORIES } from "@/content/services";
import {
  JOTFORM_SUBMIT_URL,
  jotformAccepted,
  toJotformBody,
} from "@/lib/jotform";

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
  const captchaToken = read("hcaptchaToken");

  if (
    read("website") || !name || name.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
    phone.length > 50 || !services.has(service) ||
    !["Home", "Business"].includes(property) || !message || message.length > 10000
  ) {
    return Response.json({ success: false }, { status: 400 });
  }

  // Refuse a tokenless submission here rather than letting Jotform do it.
  // Jotform rejects with HTTP 200 and an HTML page, so bouncing it early is the
  // only way the browser gets a truthful answer. The token itself is NOT
  // verified — see the note in `lib/jotform.ts`: hCaptcha tokens are
  // single-use, and checking it here would spend it before Jotform can.
  if (!captchaToken) {
    return Response.json({ success: false, reason: "captcha" }, { status: 422 });
  }

  try {
    const response = await fetch(JOTFORM_SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: toJotformBody({
        name,
        email,
        phone,
        service,
        propertyType: property,
        message,
        captchaToken,
      }),
      // The redirect IS the success signal. Following it would turn Jotform's
      // one unambiguous "accepted" into another 200 that has to be sniffed.
      redirect: "manual",
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });

    // Only a 200 needs its body inspected; a redirect is already conclusive.
    const body = response.status === 200 ? await response.text() : "";
    const confirmed = jotformAccepted(response.status, body);

    if (!confirmed) {
      console.error(
        `[contact] Jotform did not accept the submission (status ${response.status}).`,
      );
    }
    return Response.json({ success: confirmed }, { status: confirmed ? 200 : 502 });
  } catch {
    // Do not retry automatically: a timeout may happen after Jotform saved it.
    return Response.json({ success: false }, { status: 502 });
  }
}
