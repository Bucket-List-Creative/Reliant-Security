import { type SchemaTypeDefinition } from "sanity";

// Objects
import { blockContent } from "./objects/blockContent";

// Documents
import { author } from "./documents/author";
import { category } from "./documents/category";
import { post } from "./documents/post";
import { service } from "./documents/service";
import { industry } from "./documents/industry";
import { caseStudy } from "./documents/caseStudy";
import { plan } from "./documents/plan";
import { testimonial } from "./documents/testimonial";
import { partner } from "./documents/partner";
import { faq } from "./documents/faq";
import { stat } from "./documents/stat";
import { siteSettings } from "./documents/siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Objects
    blockContent,
    // Documents
    service,
    industry,
    caseStudy,
    plan,
    testimonial,
    partner,
    faq,
    stat,
    post,
    author,
    category,
    siteSettings,
  ],
};
