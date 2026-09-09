import { defineType, defineField } from "sanity";
import { LockIcon } from "@sanity/icons";

/**
 * Singleton — the Services index page's own copy and hero image. The service
 * cards themselves come from the `service` documents, not from here.
 */
export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services page",
  type: "document",
  icon: LockIcon,
  fields: [
    defineField({ name: "badge", title: "Badge", type: "string" }),
    defineField({ name: "heading", title: "Headline", type: "string" }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      description: "Falls back to the built-in brand photo.",
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required().warning("Add alt text"),
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Services page" }) },
});
