import { defineType, defineField, defineArrayMember } from "sanity";
import { ComponentIcon } from "@sanity/icons";

/**
 * An industry Reliant serves (Retail, Warehousing, Healthcare, …). Each
 * outlines the sector's threats and how Reliant solves them — a B2B entry
 * point that mirrors the "Industries" pattern on competitor sites.
 */
export const industry = defineType({
  name: "industry",
  title: "Industry",
  type: "document",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      description: "e.g. Retail, Warehousing, Healthcare, Property Management.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "iconKey",
      title: "Icon",
      type: "string",
      description:
        "Line icon shown on the industry card. Emoji were removed — they render differently per OS and can't be tinted to the card's accent colour.",
      options: {
        list: [
          { title: "Home / residential", value: "home" },
          { title: "Custom home", value: "custom-home" },
          { title: "Multi-family", value: "multi-family" },
          { title: "Commercial building", value: "building" },
          { title: "Industrial / factory", value: "factory" },
          { title: "Government", value: "government" },
          { title: "Retail store", value: "store" },
          { title: "Warehouse", value: "warehouse" },
          { title: "Healthcare", value: "healthcare" },
          { title: "Property management", value: "property" },
        ],
      },
      initialValue: "building",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (rule) => rule.required().warning("Add alt text"),
        }),
      ],
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      description: "Short description shown on cards and the industry hero.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "segments",
      title: "Segments",
      type: "array",
      description:
        "Which markets does this industry belong to? Several may apply — multi-family is both residential and commercial, for example.",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Residential", value: "residential" },
          { title: "Commercial", value: "commercial" },
          { title: "Industrial", value: "industrial" },
          { title: "Government", value: "government" },
        ],
      },
      validation: (rule) => rule.min(1),
      initialValue: ["commercial"],
    }),
    defineField({
      name: "threats",
      title: "Threats & risks",
      type: "array",
      description: "The security challenges this industry faces.",
      of: [
        defineArrayMember({
          type: "object",
          name: "threat",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "solutions",
      title: "How we solve it",
      type: "array",
      description: "Reliant's approach for this industry.",
      of: [
        defineArrayMember({
          type: "object",
          name: "solution",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),
    defineField({
      name: "services",
      title: "Related services",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({
      name: "featured",
      title: "Feature on home page?",
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
    select: { title: "name", subtitle: "summary" },
  },
});
