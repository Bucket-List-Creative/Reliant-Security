import { defineType, defineField, defineArrayMember } from "sanity";
import { MenuIcon } from "@sanity/icons";

/**
 * Singleton — header and footer navigation.
 *
 * Leave `primary` empty and the site uses its built-in nav. Fill it in and it
 * replaces the whole top-level list, so add every item you want, not just the
 * changed one.
 *
 * The "Services" item is special: whatever children it has here, the header
 * renders the mega-menu generated from the service taxonomy so the menu can
 * never drift out of step with the services that actually exist.
 */
export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "primary",
      title: "Header navigation",
      type: "array",
      of: [defineArrayMember({ type: "navItem" })],
    }),
    defineField({
      name: "ctaLabel",
      title: "Header button label",
      type: "string",
      description: 'The green button in the header, e.g. "Get a Free Quote".',
    }),
    defineField({
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      of: [defineArrayMember({ type: "ctaLink" })],
    }),
  ],
  preview: { prepare: () => ({ title: "Navigation" }) },
});
