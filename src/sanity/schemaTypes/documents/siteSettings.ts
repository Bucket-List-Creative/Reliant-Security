import { defineType, defineField, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons";

/**
 * Singleton — one document per dataset, managed via Studio Structure.
 * Holds global contact + brand details used across the site chrome.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      initialValue: "Reliant Security",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      description: "Short strapline shown in the footer.",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "emergencyPhone",
      title: "24/7 emergency line",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "address",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "hours",
      title: "Business hours",
      type: "string",
      description: "e.g. “Mon – Sun: 9:00 AM – 9:00 PM”.",
    }),
    defineField({
      name: "aboutVideoUrl",
      title: "About video URL",
      type: "url",
      description: "A YouTube or Vimeo link — embedded on the About page.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "googleReviewsUrl",
      title: "Google reviews URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "bbbUrl",
      title: "BBB profile URL",
      type: "url",
      description: "Better Business Bureau profile (Reliant is A+ accredited).",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "angiesListUrl",
      title: "Angi / Angie's List URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "social",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: {
                list: ["Facebook", "Instagram", "LinkedIn", "X", "YouTube"],
              },
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site settings" };
    },
  },
});
