import { defineType, defineField, defineArrayMember } from "sanity";
import { LockIcon } from "@sanity/icons";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  icon: LockIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Which services group this appears under on the site.",
      options: {
        list: [
          { title: "Alarm Systems", value: "alarm-systems" },
          { title: "Video & Surveillance", value: "video-surveillance" },
          { title: "Structured Cabling, Fiber & AV", value: "infrastructure" },
          { title: "Smart Home & Access", value: "smart-access" },
          { title: "Additional Services", value: "additional-services" },
        ],
      },
      initialValue: "alarm-systems",
    }),
    defineField({
      name: "iconKey",
      title: "Icon (line SVG)",
      type: "string",
      description:
        "Preferred: pick a built-in line icon that matches the design system.",
      options: {
        list: [
          { title: "Shield (check)", value: "shield-check" },
          { title: "Smartphone", value: "smartphone" },
          { title: "Heart / wellness", value: "heart-pulse" },
          { title: "Wrench / install", value: "wrench" },
          { title: "CCTV camera", value: "cctv" },
          { title: "Wireless / Wi-Fi", value: "wifi" },
          { title: "Home", value: "home" },
          { title: "Key / access", value: "key" },
          { title: "Network", value: "network" },
          { title: "Speaker / AV", value: "speaker" },
          { title: "Cyber / shield-lock", value: "cyber" },
          { title: "Server / IT", value: "server" },
          { title: "Grid / more", value: "grid" },
          { title: "Commercial building", value: "building" },
          { title: "Industrial / factory", value: "factory" },
          { title: "Government", value: "government" },
        ],
      },
    }),
    defineField({
      name: "icon",
      title: "Icon (emoji fallback)",
      type: "string",
      description:
        "Optional emoji fallback used only when no line icon is selected, e.g. 🛡️ or 📹",
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "heroImage",
      title: "Image",
      type: "image",
      description: "Shown on the service card and detail view.",
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
      description: "Short description shown on service cards.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "features",
      title: "Key features",
      description: "Scannable “what's included” bullets.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "benefits",
      title: "Benefits",
      description: "Value props shown as a grid on the service detail page.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "benefit",
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
      name: "faqs",
      title: "FAQs",
      description:
        "Question & answer pairs. Rendered on the page and emitted as FAQ structured data for SEO.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({
              name: "question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Detail copy",
      description:
        "Optional rich content shown below the overview on the detail page.",
      type: "blockContent",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
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
    select: { title: "title", subtitle: "summary", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: icon ? `${icon} ${title}` : title, subtitle };
    },
  },
});
