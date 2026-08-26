import type { PortableTextBlock } from "next-sanity";

/**
 * Hand-written shapes matching the projections in `queries.ts`.
 * When Sanity TypeGen is wired up (`sanity typegen generate`), these can be
 * replaced by the generated `sanity.types.ts`.
 */

export type SanityImage = {
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type SocialLink = {
  _key: string;
  platform?: string;
  url?: string;
};

export type SiteSettings = {
  title?: string;
  tagline?: string;
  phone?: string;
  emergencyPhone?: string;
  email?: string;
  address?: string;
  hours?: string;
  aboutVideoUrl?: string;
  googleReviewsUrl?: string;
  bbbUrl?: string;
  angiesListUrl?: string;
  social?: SocialLink[];
};

export type Partner = {
  _id: string;
  name: string;
  url?: string;
  logo?: SanityImage;
};

export type ServiceCategorySlug =
  | "alarm-systems"
  | "video-surveillance"
  | "smart-access"
  | "infrastructure"
  | "additional-services";

export type ServiceBenefit = {
  _key?: string;
  title: string;
  description?: string;
};

export type ServiceFaqItem = {
  _key?: string;
  question: string;
  answer: string;
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  category?: ServiceCategorySlug;
  /** Line-icon key matching `ServiceIconKey`. */
  iconKey?: string;
  /** Emoji fallback. */
  icon?: string;
  summary: string;
  features?: string[];
  benefits?: ServiceBenefit[];
  faqs?: ServiceFaqItem[];
  heroImage?: SanityImage;
  body?: PortableTextBlock[];
};

export type Plan = {
  _id: string;
  name: string;
  slug: string;
  price?: number;
  period?: string;
  description?: string;
  features: string[];
  featured?: "standard" | "featured";
  ctaLabel?: string;
};

export type Testimonial = {
  _id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  rating?: number;
  avatar?: SanityImage;
};

export type Faq = {
  _id: string;
  question: string;
  answer: string;
  category?: string;
};

export type Stat = {
  _id: string;
  label: string;
  value: string;
};

export type PostAuthor = {
  name: string;
  role?: string;
  slug?: string;
  image?: SanityImage;
};

export type PostCategory = {
  _id: string;
  title: string;
  slug: string;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  mainImage?: SanityImage;
  author?: Pick<PostAuthor, "name" | "slug">;
  categories?: PostCategory[];
};

export type Post = PostListItem & {
  author?: PostAuthor;
  body?: PortableTextBlock[];
};

export type ProjectResult = {
  _key: string;
  value: string;
  label: string;
};

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  industry?: string;
  summary: string;
  segments?: IndustrySegment[];
  featured?: "standard" | "featured";
  publishedAt: string;
  heroImage?: SanityImage;
};

export type Project = ProjectListItem & {
  /** General location only (city, state) — never a street address. */
  location?: string;
  equipment?: string[];
  results?: ProjectResult[];
  services?: Pick<Service, "_id" | "title" | "slug" | "icon">[];
  gallery?: (SanityImage & { _key: string })[];
  challenge?: PortableTextBlock[];
  solution?: PortableTextBlock[];
};

export type IndustryPoint = {
  _key: string;
  title: string;
  description?: string;
};

export type IndustrySegment =
  | "residential"
  | "commercial"
  | "industrial"
  | "government";

export type IndustryListItem = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  summary: string;
  /** An industry can belong to more than one segment (e.g. multi-family). */
  segments?: IndustrySegment[];
  featured?: "standard" | "featured";
  heroImage?: SanityImage;
};

export type Industry = IndustryListItem & {
  threats?: IndustryPoint[];
  solutions?: IndustryPoint[];
  services?: Pick<Service, "_id" | "title" | "slug" | "icon" | "summary">[];
};
