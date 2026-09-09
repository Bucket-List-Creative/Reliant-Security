import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

/**
 * Singleton — the home page's own copy.
 *
 * Every field is optional. Anything left empty falls back to the wording built
 * into the components, so an empty document renders exactly the site you have
 * today and the owner can override one line at a time.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
  ],
  fields: [
    /* ---- Hero ---- */
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      group: "hero",
      type: "string",
      description:
        'The small pill above the headline. "24/7" must refer to professional monitoring only — Reliant does not offer 24/7 service or support.',
    }),
    defineField({
      name: "title",
      title: "Headline",
      group: "hero",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Sub-headline",
      group: "hero",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "primaryCta",
      title: "Primary button",
      group: "hero",
      type: "ctaLink",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary button",
      group: "hero",
      type: "ctaLink",
    }),

    /* ---- Sections ---- */
    defineField({
      name: "capabilities",
      title: "What we do (scroll rail)",
      group: "sections",
      type: "object",
      options: { collapsible: true, collapsed: true },
      description:
        "This section exists to show Reliant's full range. Keep commercial, industrial, government, cabling, and AV represented — dropping them makes the site read residential-only.",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "subheading", type: "text", rows: 3 }),
        defineField({
          name: "items",
          title: "Cards",
          type: "array",
          of: [defineArrayMember({ type: "iconCard" })],
        }),
      ],
    }),
    defineField({
      name: "serviceDirectory",
      title: "Services section",
      group: "sections",
      type: "sectionHeading",
    }),
    defineField({
      name: "industries",
      title: "Industries section",
      group: "sections",
      type: "sectionHeading",
    }),
    defineField({
      name: "projects",
      title: "Projects section",
      group: "sections",
      type: "sectionHeading",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials section",
      group: "sections",
      type: "sectionHeading",
    }),
    defineField({
      name: "serviceArea",
      title: "Service area (map) section",
      group: "sections",
      type: "sectionHeading",
    }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
