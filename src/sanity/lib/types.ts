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
  googleReviewsUrl?: string;
  bbbUrl?: string;
  angiesListUrl?: string;
  social?: SocialLink[];
  /** Override for the built-in logo used in the navbar and footer. */
  logo?: SanityImage;
  /** Override for the vehicle on the "Get a same-day quote" banner. */
  ctaImage?: SanityImage;
};

/** A short signed note from Reliant, shown on the About page. */
export type OwnerNote = {
  heading?: string;
  body?: string[];
  authorName?: string;
  authorRole?: string;
  photo?: SanityImage;
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
  seoTitle?: string;
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
  /** Line-icon key matching `ServiceIconKey`. */
  iconKey?: string;
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

export type Resource = {
  _id: string;
  title: string;
  slug: string;
  kind?: "guide" | "checklist" | "spec" | "faq" | "link";
  summary?: string;
  url?: string;
  fileUrl?: string;
  image?: SanityImage;
};

export type LocationDoc = {
  _id: string;
  city: string;
  slug: string;
  heading?: string;
  intro?: Post["body"];
  body?: Post["body"];
  metaTitle?: string;
  metaDescription?: string;
  heroImage?: SanityImage;
};

export type LegalPage = {
  _id: string;
  title: string;
  slug: string;
  intro?: string;
  body?: Post["body"];
  updatedAt?: string;
};

/* ---- Page copy singletons ---- */

export type CtaLink = { label?: string; href?: string };

export type SectionHeading = { heading?: string; subheading?: string };

export type IconCard = {
  _key?: string;
  title?: string;
  description?: string;
  iconKey?: string;
  href?: string;
};

export type HomePageContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  capabilities?: SectionHeading & { items?: IconCard[] };
  serviceDirectory?: SectionHeading;
  industries?: SectionHeading;
  projects?: SectionHeading;
  testimonials?: SectionHeading;
  serviceArea?: SectionHeading;
};

export type AboutPageContent = {
  badge?: string;
  heading?: string;
  intro?: string[];
  introImage?: SanityImage;
  differentiators?: SectionHeading & { items?: IconCard[] };
  customers?: SectionHeading & { items?: IconCard[] };
  ownerNote?: OwnerNote;
  /** YouTube/Vimeo link that replaces the bundled clip. */
  videoUrl?: string;
};

export type ServicesPageContent = {
  badge?: string;
  heading?: string;
  intro?: string;
  heroImage?: SanityImage;
};

export type NavChild = {
  _key?: string;
  label: string;
  href: string;
  desc?: string;
  iconKey?: string;
};

export type NavigationContent = {
  ctaLabel?: string;
  primary?: { _key?: string; label: string; href: string; children?: NavChild[] }[];
  footerLinks?: { _key?: string; label: string; href: string }[];
};
