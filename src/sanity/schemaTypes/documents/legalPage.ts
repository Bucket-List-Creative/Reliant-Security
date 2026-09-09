import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

/**
 * Policy and notice pages — privacy policy, terms, accessibility statement.
 * The route is driven by the slug, so adding a document here publishes a page
 * at `/<slug>` without a code change.
 */
export const legalPage = defineType({
  name: "legalPage",
  title: "Policy page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description: 'e.g. "privacy-policy" publishes at /privacy-policy.',
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Standfirst",
      type: "text",
      rows: 3,
      description: "Optional single line shown under the heading.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "date",
      description: "Shown on the page so readers know how current it is.",
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
