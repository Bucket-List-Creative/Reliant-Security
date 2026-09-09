import { defineType, defineField, defineArrayMember } from "sanity";
import { UsersIcon } from "@sanity/icons";

/**
 * Singleton — the About page.
 *
 * The two card grids ("What makes us different", "Who we serve") are arrays
 * here, so the owner can reword, reorder, add, or remove a card without a
 * deploy. Leaving an array empty keeps the built-in set.
 *
 * ⚠️ Several claims on this page are factual — BBB accreditation, the 9.4s
 * monitoring response, UL certification. Edit the wording freely, but don't
 * introduce new claims (licence numbers, founding year, staff counts) that
 * haven't been confirmed.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  icon: UsersIcon,
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "cards", title: "Card grids" },
    { name: "note", title: "Note from Reliant" },
  { name: "video", title: "Video" },
  ],
  fields: [
    /* ---- Intro ---- */
    defineField({ name: "badge", group: "intro", type: "string" }),
    defineField({
      name: "heading",
      title: "Headline",
      group: "intro",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Intro paragraphs",
      group: "intro",
      description: "One entry per paragraph.",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 5 })],
    }),
    defineField({
      name: "introImage",
      title: "Intro photo",
      group: "intro",
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

    /* ---- Card grids ---- */
    defineField({
      name: "differentiators",
      title: "What makes us different",
      group: "cards",
      type: "object",
      options: { collapsible: true, collapsed: false },
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
      name: "customers",
      title: "Who we serve",
      group: "cards",
      type: "object",
      options: { collapsible: true, collapsed: false },
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

    /* ---- Signed note ---- */
    defineField({
      name: "ownerNote",
      title: "A note from Reliant",
      group: "note",
      description:
        "A short signed note. Clear the paragraphs to hide the section entirely.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "heading",
          type: "string",
          initialValue: "A note from Reliant",
        }),
        defineField({
          name: "body",
          title: "Note",
          type: "array",
          of: [defineArrayMember({ type: "text", rows: 4 })],
          description: "One entry per paragraph.",
        }),
        defineField({ name: "authorName", title: "Signed by", type: "string" }),
        defineField({
          name: "authorRole",
          title: "Role",
          type: "string",
          description: 'e.g. "Owner, Reliant Security".',
        }),
        defineField({
          name: "photo",
          title: "Photo",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alternative text", type: "string" }),
          ],
        }),
      ],
    }),

    defineField({
      name: "videoUrl",
      title: "Video link (YouTube or Vimeo)",
      group: "video",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
      description:
        "Optional. Replaces the short clip in the \u201cWhat it looks like day to day\u201d section. Paste a YouTube or Vimeo link; leave empty to keep the bundled clip. Clearing the field reverts to the bundled clip rather than hiding the section.",
    }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
