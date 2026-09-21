"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HCaptchaField } from "@/components/ui/HCaptchaField";
import { SERVICE_CATEGORIES } from "@/content/services";

type Status = "idle" | "sending" | "success" | "error" | "captcha";

/**
 * Inlined at build time. Empty means captcha is switched off entirely and the
 * form behaves exactly as it did before — the safe default, so a missing env
 * var can never lock visitors out of the only lead form on the site.
 */
const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? "";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const submitting = useRef(false);

  const handleCaptcha = useCallback((token: string | null) => {
    setCaptchaToken(token);
    // Clear a "please verify" warning the moment they actually do.
    setStatus((current) => (current === "captcha" && token ? "idle" : current));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;

    if (HCAPTCHA_SITE_KEY && !captchaToken) {
      setStatus("captcha");
      return;
    }

    submitting.current = true;
    setStatus("sending");

    const body = new FormData(e.currentTarget);
    if (captchaToken) body.set("hcaptchaToken", captchaToken);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body,
      });
      const result = await response.json();
      const ok = response.ok && result.success === true;
      setStatus(ok ? "success" : "error");
      if (!ok) {
        // hCaptcha tokens are single-use, and the server has now spent this
        // one. Without a reset the visitor's retry fails verification rather
        // than reaching Jotform, which looks like the form is simply broken.
        setCaptchaToken(null);
        setCaptchaReset((n) => n + 1);
      }
    } catch {
      setStatus("error");
      setCaptchaToken(null);
      setCaptchaReset((n) => n + 1);
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <Card className="text-center">
        <div role="status" aria-live="polite">
          <div className="sfc-card__icon mx-auto">
            <IconCheck size={26} stroke={2.5} />
          </div>
          <h2 className="mt-4 text-2xl font-semibold">
            Thank you for trusting Reliant Security
          </h2>
          <p className="mt-2 text-n-700">
            Your request has been received. Our team will review your needs and
            reach out to help protect what matters most to you.
            No obligation, no pressure.
          </p>
        </div>
        <Button href="/" variant="primary" className="mt-6">
          Back to home
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5" aria-busy={status === "sending"}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" hidden aria-hidden="true" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Full name" name="name" autoComplete="name" required />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            hint="Optional — for a faster callback."
          />
          <div>
            <label className="sfc-label" htmlFor="service">
              Service of interest
            </label>
            <select
              id="service"
              name="service"
              className="sfc-select"
              defaultValue=""
            >
              <option value="">Select a service…</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <optgroup key={cat.slug} label={cat.title}>
                  {cat.services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="sfc-label">Property type</legend>
          <div className="flex flex-wrap gap-3">
            {["Home", "Business"].map((type, i) => (
              <label
                key={type}
                className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] bg-surface px-4 py-2 text-sm font-medium text-n-700"
                style={{ boxShadow: "var(--shadow-soft-in-sm)" }}
              >
                <input
                  type="radio"
                  name="propertyType"
                  value={type}
                  defaultChecked={i === 0}
                  className="accent-brand"
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <Textarea
          label="How can we help?"
          name="message"
          required
          placeholder="Tell us about your home or business and what you'd like to protect."
        />

        {HCAPTCHA_SITE_KEY && (
          <HCaptchaField
            sitekey={HCAPTCHA_SITE_KEY}
            onChange={handleCaptcha}
            resetSignal={captchaReset}
          />
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={status === "sending"}>
            {status === "sending" ? "Sending your request…" : "Get my same-day quote"}
          </Button>
          <p className="text-xs text-n-500">
            We respect your privacy — your details are only used to reply to your
            request.
          </p>
        </div>
        {status === "captcha" && (
          <p role="alert" className="text-sm text-n-700">
            Please complete the verification above so we know you&apos;re not a
            bot, then submit again.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-sm text-n-700">
            We couldn&apos;t confirm your request was received. Your details are
            still here. Please try again, or contact us using the phone or email
            listed on this page.
          </p>
        )}
      </form>
    </Card>
  );
}
