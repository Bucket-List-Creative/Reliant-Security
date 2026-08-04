import { defineType, defineField } from "sanity";
import { TrendUpwardIcon } from "@sanity/icons";

export const stat = defineType({
  name: "stat",
  title: "Stat",
  type: "document",
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: "label",
      type: "string",
      description: "e.g. Response time, Homes protected",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      type: "string",
      description: "The headline figure, e.g. 45s, 12k+, 99.9%",
      validation: (rule) => rule.required(),
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
    select: { title: "value", subtitle: "label" },
  },
});
