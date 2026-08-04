import { defineType, defineField, defineArrayMember } from "sanity";
import { CaseIcon } from "@sanity/icons";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Project title, e.g. “Multi-site retail surveillance rollout”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      description: "Company or client name (or “Confidential”).",
    }),
    defineField({
      name: "industry",
      type: "string",
      description: "e.g. Retail, Warehousing, Healthcare, Property Management.",
    }),
    defineField({
      name: "location",
      type: "string",
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
      description: "Short teaser shown on cards and listings.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "challenge",
      title: "The challenge",
      type: "blockContent",
    }),
    defineField({
      name: "solution",
      title: "Our solution",
      type: "blockContent",
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "array",
      description: "Outcome metrics, e.g. “Response time → 38s”.",
      of: [
        defineArrayMember({
          type: "object",
          name: "result",
          fields: [
            defineField({
              name: "value",
              type: "string",
              description: "Headline figure, e.g. 38s, 100%, 6 sites",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
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
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        defineArrayMember({
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
      ],
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
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
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
    {
      title: "Published, newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "heroImage" },
  },
});
