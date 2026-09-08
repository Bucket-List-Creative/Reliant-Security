import { SERVICE_CATEGORIES } from "@/content/services";

const FORM_ID = "262504892326056";
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
