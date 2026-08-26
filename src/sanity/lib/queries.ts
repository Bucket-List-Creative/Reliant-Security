import { defineQuery } from "next-sanity";

/**
 * Shared image projection — always resolve the asset so we get a URL plus
 * LQIP + dimensions for blur placeholders. (LQIP is NOT automatic.)
 */
const imageFragment = /* groq */ `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions { width, height } }
  },
  alt,
  hotspot,
  crop
`;

/* ---- Site settings (singleton) ---- */
export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0]{
    title,
    tagline,
    phone,
    emergencyPhone,
    email,
    address,
    hours,
    aboutVideoUrl,
    googleReviewsUrl,
    bbbUrl,
    angiesListUrl,
    social[]{ _key, platform, url }
  }
`);

/* ---- Technology partners ---- */
export const PARTNERS_QUERY = defineQuery(/* groq */ `
  *[_type == "partner"] | order(order asc, name asc){
    _id,
    name,
    url,
    logo{ ${imageFragment} }
  }
`);

/* ---- Services ---- */
export const SERVICES_QUERY = defineQuery(/* groq */ `
  *[_type == "service"] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    category,
    iconKey,
    icon,
    summary,
    features,
    heroImage{ ${imageFragment} }
  }
`);

export const SERVICE_QUERY = defineQuery(/* groq */ `
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    category,
    iconKey,
    icon,
    summary,
    features,
    benefits[]{ _key, title, description },
    faqs[]{ _key, question, answer },
    heroImage{ ${imageFragment} },
    body
  }
`);

export const SERVICE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "service" && defined(slug.current)]{ "slug": slug.current }
`);

/* ---- Pricing plans ---- */
export const PLANS_QUERY = defineQuery(/* groq */ `
  *[_type == "plan"] | order(order asc){
    _id,
    name,
    "slug": slug.current,
    price,
    period,
    description,
    features,
    featured,
    ctaLabel
  }
`);

/* ---- Testimonials ---- */
export const TESTIMONIALS_QUERY = defineQuery(/* groq */ `
  *[_type == "testimonial"] | order(order asc){
    _id,
    quote,
    authorName,
    authorRole,
    rating,
    avatar{ ${imageFragment} }
  }
`);

/* ---- FAQs ---- */
export const FAQS_QUERY = defineQuery(/* groq */ `
  *[_type == "faq"] | order(order asc){
    _id,
    question,
    answer,
    category
  }
`);

/* ---- Stats ---- */
export const STATS_QUERY = defineQuery(/* groq */ `
  *[_type == "stat"] | order(order asc){
    _id,
    label,
    value
  }
`);

/* ---- Blog ---- */
export const POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage{ ${imageFragment} },
    author->{ name, "slug": slug.current },
    categories[]->{ _id, title, "slug": slug.current }
  }
`);

export const POST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);

export const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage{ ${imageFragment} },
    author->{ name, role, "slug": slug.current, image{ ${imageFragment} } },
    categories[]->{ _id, title, "slug": slug.current },
    body[]{
      ...,
      _type == "image" => { ${imageFragment} }
    }
  }
`);

/* ---- Projects ---- */
const projectCardProjection = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  client,
  industry,
  summary,
  segments,
  featured,
  publishedAt,
  heroImage{ ${imageFragment} }
`;

export const PROJECTS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]
  | order((featured == "featured") desc, order asc, publishedAt desc){
    ${projectCardProjection}
  }
`);

export const FEATURED_PROJECTS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]
  | order((featured == "featured") desc, order asc, publishedAt desc)[0...3]{
    ${projectCardProjection}
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`);

export const PROJECT_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    client,
    industry,
    location,
    summary,
    segments,
    equipment,
    publishedAt,
    heroImage{ ${imageFragment} },
    results[]{ _key, value, label },
    services[]->{ _id, title, "slug": slug.current, icon },
    gallery[]{ _key, ${imageFragment} },
    challenge[]{ ..., _type == "image" => { ${imageFragment} } },
    solution[]{ ..., _type == "image" => { ${imageFragment} } }
  }
`);

/* ---- Industries ---- */
export const INDUSTRIES_QUERY = defineQuery(/* groq */ `
  *[_type == "industry" && defined(slug.current)] | order(order asc, name asc){
    _id,
    name,
    "slug": slug.current,
    icon,
    summary,
    segments,
    featured,
    heroImage{ ${imageFragment} }
  }
`);

export const INDUSTRY_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "industry" && defined(slug.current)]{ "slug": slug.current }
`);

export const INDUSTRY_QUERY = defineQuery(/* groq */ `
  *[_type == "industry" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    icon,
    summary,
    segments,
    heroImage{ ${imageFragment} },
    threats[]{ _key, title, description },
    solutions[]{ _key, title, description },
    services[]->{ _id, title, "slug": slug.current, icon, summary }
  }
`);
