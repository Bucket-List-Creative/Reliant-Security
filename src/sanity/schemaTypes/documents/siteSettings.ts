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
      title: "24/7 monitoring line",
      description:
        "The monitoring centre line. Labelled 'monitoring', never 'emergency' — Reliant does not offer 24/7 emergency service or technical support, and the site must not imply it.",
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

    /* ---- Brand media ----
       These override the files committed under `public/Images/`. Left empty,
       the repo copies are used, so the site is never broken by an empty
       field — but nothing here can be changed without a developer until
       something is uploaded. */
    defineField({
      name: "logo",
      title: "Logo (light, for the dark navbar and footer)",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. Replaces the built-in Reliant logo in the navbar and footer. Use a transparent PNG or SVG that reads on a dark green background.",
    }),
    defineField({
      name: "ctaImage",
      title: "Quote-banner image",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional. The vehicle parked on the \u201cGet a same-day quote\u201d banner, which appears at the foot of most pages. Use a photo with a transparent background so it sits on the banner cleanly.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
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
