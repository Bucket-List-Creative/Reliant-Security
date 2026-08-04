import { defineType, defineField } from "sanity";
import { PlugIcon } from "@sanity/icons";

/**
 * A technology partner / integration whose logo links out to their site —
 * "does some of the selling for us."
 */
export const partner = defineType({
  name: "partner",
  title: "Technology partner",
  type: "document",
  icon: PlugIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      type: "image",
      description: "Prefer a transparent PNG or SVG.",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          initialValue: "",
        }),
      ],
    }),
    defineField({
      name: "url",
      title: "Website",
      type: "url",
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
    select: { title: "name", subtitle: "url", media: "logo" },
  },
});
