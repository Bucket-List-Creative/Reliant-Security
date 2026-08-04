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
    slug: "essential",
    name: "Essential",
    price: 29,
    period: "/mo",
    description: "Core protection for apartments and small homes.",
    features: ["Alarm system", "2 cameras", "Mobile app", "Email alerts"],
    featured: "standard",
    ctaLabel: "Get started",
  },
  {
    _id: "p2",
    slug: "protect",
    name: "Protect",
    price: 59,
    period: "/mo",
    description: "24/7 monitored security for the whole home.",
    features: [
      "Everything in Essential",
      "Pro monitoring",
      "5 cameras",
      "Rapid dispatch",
      "Cloud recording",
    ],
    featured: "featured",
    ctaLabel: "Get started",
  },
  {
    _id: "p3",
    slug: "business",
    name: "Business",
    description: "Multi-site access control and surveillance.",
    features: [
      "Everything in Protect",
      "Access control",
      "Unlimited cameras",
      "Dedicated account manager",
    ],
    featured: "standard",
    ctaLabel: "Talk to sales",
  },
];

// Annual billing applies a 2-month discount (pay for 10).
const ANNUAL_FACTOR = 10 / 12;

function priceLabel(plan: Plan, annual: boolean) {
  if (typeof plan.price !== "number") return { amount: "Custom", per: "" };
  const monthly = annual ? plan.price * ANNUAL_FACTOR : plan.price;
  return {
    amount: `$${Math.round(monthly)}`,
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
