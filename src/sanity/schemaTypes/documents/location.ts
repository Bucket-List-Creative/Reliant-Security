import { defineType, defineField } from "sanity";
import { PinIcon } from "@sanity/icons";

/**
 * An "areas we serve" page. The site ships a built-in list of cities with a
 * shared copy template (see `src/content/locations.ts`), so a `location`
 * document is only needed when the owner wants one city to read differently —
 * a local headline, its own intro, its own photo, extra body copy.
 *
 * Any field left empty falls back to the template, so a document can override
 * as little as the heading.
 */
export const location = defineType({
  name: "location",
  title: "Service area page",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "city",
      title: "City",
      type: "string",
      description: 'City name as it should read in copy, e.g. "St. Charles".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description:
        'Must match the built-in page, e.g. "st-charles-mo". Changing this creates a new URL and drops the old one — add a redirect first.',
      options: { source: "city", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Page heading (H1)",
      type: "string",
      description: "Leave empty to use the shared template heading.",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "blockContent",
      description: "Replaces the opening paragraphs when set.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description:
        "Replaces the main body section when set. Leave empty for the shared copy.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
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
      name: "metaTitle",
      title: "SEO title",
      type: "string",
      validation: (rule) =>
        rule.max(60).warning("Titles over 60 characters get truncated"),
    }),
    defineField({
      name: "metaDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning("Descriptions over 160 characters get truncated"),
    }),
  ],
  preview: {
    select: { title: "city", subtitle: "slug.current", media: "heroImage" },
  },
});
