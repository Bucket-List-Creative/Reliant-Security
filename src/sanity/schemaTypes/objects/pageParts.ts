import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Small building blocks shared by the page-content singletons.
 *
 * These exist so the Studio shows the same shape wherever the site repeats a
 * pattern — a section heading, a link, a card with an icon — rather than each
 * page document inventing its own field names.
 */

/** Every icon the design system can render. Keep in sync with ServiceIcon. */
export const ICON_OPTIONS = [
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
  { title: "Team", value: "team" },
  { title: "Projects", value: "projects" },
  { title: "Resources", value: "resources" },
  { title: "Custom home", value: "custom-home" },
  { title: "Multi-family", value: "multi-family" },
  { title: "Retail / store", value: "store" },
  { title: "Warehouse", value: "warehouse" },
  { title: "Healthcare", value: "healthcare" },
  { title: "Property", value: "property" },
  { title: "Search", value: "search" },
];

/** A button or link: visible label plus where it points. */
export const ctaLink = defineType({
  name: "ctaLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Destination",
      type: "string",
      description: 'A path such as "/contact", or a full https:// URL.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

/** Heading + supporting line above a section. */
export const sectionHeading = defineType({
  name: "sectionHeading",
  title: "Section heading",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "heading", subtitle: "subheading" },
    prepare({ title, subtitle }) {
      return { title: title || "(default heading)", subtitle };
    },
  },
});

/** A card: icon, title, description, optional link. */
export const iconCard = defineType({
  name: "iconCard",
  title: "Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "iconKey",
      title: "Icon",
      type: "string",
      options: { list: ICON_OPTIONS },
      initialValue: "shield-check",
    }),
    defineField({
      name: "href",
      title: "Links to",
      type: "string",
      description: "Optional. Leave empty for a card that isn't clickable.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

/** One entry in the main navigation. */
export const navItem = defineType({
  name: "navItem",
  title: "Navigation item",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Destination",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "children",
      title: "Dropdown items",
      description:
        'Leave empty for a plain link. The "Services" item always shows the generated mega-menu regardless of what is set here.',
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "navChild",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "desc", title: "Description", type: "string" }),
            defineField({
              name: "iconKey",
              title: "Icon",
              type: "string",
              options: { list: ICON_OPTIONS },
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
