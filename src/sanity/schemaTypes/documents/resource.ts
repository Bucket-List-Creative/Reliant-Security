import { defineType, defineField } from "sanity";
import { BookIcon } from "@sanity/icons";

/**
 * A downloadable or linked resource on /resources — a buyer's guide, checklist,
 * spec sheet, or an outbound link to something useful. Deliberately simple:
 * either attach a file or give a URL, and the card links to whichever is set.
 */
export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Guide", value: "guide" },
          { title: "Checklist", value: "checklist" },
          { title: "Spec sheet", value: "spec" },
          { title: "FAQ", value: "faq" },
          { title: "Link", value: "link" },
        ],
        layout: "radio",
      },
      initialValue: "guide",
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "image",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required().warning("Add alt text"),
        }),
      ],
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      description: "A PDF or document to download. Takes priority over a link.",
    }),
    defineField({
      name: "url",
      title: "External link",
      type: "url",
      description: "Used when no file is attached.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
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
    select: { title: "title", subtitle: "kind", media: "image" },
  },
});
