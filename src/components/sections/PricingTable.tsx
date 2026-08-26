"use client";

import { useState } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import type { Plan } from "@/sanity/lib/types";

const FALLBACK: Plan[] = [
  {
    _id: "p1",
    slug: "core-protection",
    name: "Core Protection",
    price: 49.99,
    period: "/mo",
    description:
      "Monitored alarm and life-safety protection for homes and small businesses.",
    features: [
      "Alarm system",
      "24/7 professional monitoring",
      "Remote app access",
      "Smart device control",
      "24/7 smoke detection",
      "24/7 carbon monoxide detection",
      "Service plan",
    ],
    featured: "standard",
    ctaLabel: "Get started",
  },
  {
    _id: "p2",
    slug: "pro-protection",
    name: "Pro Protection",
    price: 59.99,
    period: "/mo",
    description: "Security + Video. Complete Protection.",
    features: [
      "Everything in Core Protection",
      "Doorbell camera",
      "Wi-Fi cameras",
      "Active deterrence",
      "Cloud recording",
      "24/7 on-device recording",
    ],
    featured: "featured",
    ctaLabel: "Get started",
  },
  {
    _id: "p3",
    slug: "business",
    name: "Business",
    description:
      "Custom-designed systems for commercial, industrial, and government facilities.",
    features: [
      "Everything in Pro Protection",
      "Access control & credentialing",
      "Unlimited commercial-grade cameras",
      "Structured cabling & fiber",
      "NDAA/TAA-compliant equipment available",
      "Dedicated account manager",
    ],
    featured: "standard",
    ctaLabel: "Request a design",
  },
];

// Annual billing applies a 2-month discount (pay for 10).
const ANNUAL_FACTOR = 10 / 12;

/**
 * Format a monthly figure as currency. Plans are priced with cents
 * ($49.99), so rounding to whole dollars would misstate the price —
 * show cents whenever the amount isn't a round dollar.
 */
function formatPrice(amount: number) {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return `$${amount.toFixed(hasCents ? 2 : 0)}`;
}

function priceLabel(plan: Plan, annual: boolean) {
  if (typeof plan.price !== "number") return { amount: "Custom", per: "" };
  const monthly = annual ? plan.price * ANNUAL_FACTOR : plan.price;
  return {
    amount: formatPrice(monthly),
    per: plan.period ?? "/mo",
  };
}

export function PricingTable({ plans }: { plans?: Plan[] }) {
  const [annual, setAnnual] = useState(false);
  const items = plans?.length ? plans : FALLBACK;

  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-4">
        <span className={annual ? "text-n-500" : "font-semibold"}>Monthly</span>
        <Toggle
          checked={annual}
          onChange={setAnnual}
          label="Toggle annual billing"
        />
        <span className={annual ? "font-semibold" : "text-n-500"}>
          Annual{" "}
          <span className="text-sm text-brand-press">(save ~17%)</span>
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((plan) => {
          const { amount, per } = priceLabel(plan, annual);
          const featured = plan.featured === "featured";
          return (
            <Card
              key={plan._id}
              interactive
              className={[
                "flex h-full flex-col",
                featured && "ring-2 ring-brand",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                {featured && <Badge>Most popular</Badge>}
              </div>
              {plan.description && (
                <p className="mt-2 text-n-700">{plan.description}</p>
              )}
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-4xl font-bold">{amount}</span>
                {per && <span className="mb-1 text-n-500">{per}</span>}
              </div>

              <ul className="mt-6 flex-1 space-y-2 text-n-700">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <IconCheck
                      size={18}
                      stroke={2.5}
                      aria-hidden
                      className="mt-0.5 flex-none text-brand"
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  href="/contact"
                  variant={featured ? "primary" : "outline"}
                  className="w-full"
                >
                  {plan.ctaLabel ?? "Get started"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
