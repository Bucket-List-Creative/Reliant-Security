import { defineType, defineField, defineArrayMember } from "sanity";
import { CreditCardIcon } from "@sanity/icons";

export const plan = defineType({
  name: "plan",
  title: "Pricing plan",
  type: "document",
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      type: "number",
      description: "Monthly price in USD. Leave empty for “Custom”.",
    }),
    defineField({
      name: "period",
      type: "string",
      description: "Billing period label, e.g. /mo",
      initialValue: "/mo",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "features",
      title: "Included features",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "featured",
      title: "Highlight this plan?",
      type: "string",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Featured", value: "featured" },
        ],
        layout: "radio",
      },
      initialValue: "standard",
    }),
    defineField({
      name: "ctaLabel",
      title: "Call to action label",
      type: "string",
      initialValue: "Get started",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", price: "price", featured: "featured" },
    prepare({ title, price, featured }) {
      const priceLabel = typeof price === "number" ? `$${price}` : "Custom";
      return {
        title,
        subtitle:
          featured === "featured" ? `${priceLabel} · Featured` : priceLabel,
      };
    },
  },
});
