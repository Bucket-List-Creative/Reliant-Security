"use client";

import { useState, type FormEvent } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SERVICE_CATEGORIES } from "@/content/services";

type Status = "idle" | "success";

/**
 * Contact / quote form with client-side validation.
 *
 * NOTE: submission is not wired to a backend yet. Plug in a route handler
 * (e.g. src/app/api/contact/route.ts) or a form service and replace the
 * simulated success below.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST to your contact endpoint / email service here.
    setStatus("success");
  }

  if (status === "success") {
    return (
      <Card className="text-center">
        <div className="sfc-card__icon mx-auto">
          <IconCheck size={26} stroke={2.5} />
        </div>
        <h2 className="mt-4 text-2xl font-semibold">
          Thanks — your quote is on the way
        </h2>
        <p className="mt-2 text-n-700">
          We&apos;ll review your project and send a detailed proposal, often the
          same day. No obligation, no pressure.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="not-sure">Not sure yet</option>
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
                  value={type.toLowerCase()}
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            Get my same-day quote
          </Button>
          <p className="text-xs text-n-500">
            We respect your privacy — your details are only used to reply to your
            request.
          </p>
        </div>
      </form>
    </Card>
  );
}
