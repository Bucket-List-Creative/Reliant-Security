import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECTS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { ProjectListItem, SiteSettings } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PROJECTS } from "@/content/projects";
import { SEGMENT_LABELS, type IndustrySegment } from "@/content/industries";
import { publicAssetOrUndefined } from "@/lib/publicAssets";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Real installations delivered by Reliant Security — video surveillance, access control, structured cabling and fiber across industrial, commercial, multi-family, and residential sites.",
  path: "/projects",
});

const FILTERS: { label: string; value: "" | IndustrySegment }[] = [
  { label: "All", value: "" },
  { label: SEGMENT_LABELS.residential, value: "residential" },
  { label: SEGMENT_LABELS.commercial, value: "commercial" },
  { label: SEGMENT_LABELS.industrial, value: "industrial" },
  { label: SEGMENT_LABELS.government, value: "government" },
];

const VALID_SEGMENTS = new Set<string>(Object.keys(SEGMENT_LABELS));

/** Taxonomy defaults, shown until matching `project` documents exist. */
const TAXONOMY_ITEMS: ProjectListItem[] = PROJECTS.map((p) => ({
  _id: `taxonomy-${p.slug}`,
  slug: p.slug,
  title: p.title,
  client: p.client,
  industry: p.industry,
  summary: p.summary,
  segments: p.segments,
  featured: p.featured ? "featured" : "standard",
  publishedAt: "",
}));

const LOCAL_IMAGE_BY_SLUG = new Map(
  PROJECTS.map((p) => [p.slug, publicAssetOrUndefined(p.image)]),
);

/**
 * CMS documents override the taxonomy by slug, and taxonomy entries with no
 * document yet are kept rather than dropped — the same contract the services
 * index and the project detail page already follow, and the one
 * `src/content/projects.ts` documents at the top of the file.
 *
 * This used to be `cms?.length ? cms : TAXONOMY_ITEMS`, which meant a single
 * `project` document in Sanity hid every taxonomy default. Anything added to
 * the taxonomy simply never appeared on this page, while its detail route at
 * /projects/[slug] rendered fine — so the entry existed but was unreachable.
 *
 * CMS order comes first because that ordering is editor-controlled (featured,
 * then `order`, then date). Taxonomy-only entries follow in taxonomy order.
 */
function mergeProjects(cms: ProjectListItem[] | null): ProjectListItem[] {
  if (!cms?.length) return TAXONOMY_ITEMS;
  const fromCms = new Set(cms.map((p) => p.slug));
  return [...cms, ...TAXONOMY_ITEMS.filter((p) => !fromCms.has(p.slug))];
}

type Props = { searchParams: Promise<{ segment?: string }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const { segment = "" } = await searchParams;
  const [{ data: projects }, { data: settings }] = await Promise.all([
    sanityFetch({ query: PROJECTS_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ]);

  const all = mergeProjects(projects as ProjectListItem[] | null);
  const items = VALID_SEGMENTS.has(segment)
    ? all.filter((p) => p.segments?.includes(segment as IndustrySegment))
    : all;
  const phone = (settings as SiteSettings | null)?.phone;

  const activeLabel = VALID_SEGMENTS.has(segment)
    ? SEGMENT_LABELS[segment as IndustrySegment]
    : "";

  return (
    <>
      <section className="sfc-section pt-12">
        <Container>
          <div className="max-w-3xl">
            <Badge className="mb-5">Projects</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Security we&apos;ve delivered in the field
            </h1>
            <p className="mt-5 text-lg text-n-700">
              A look at real Reliant installations — what the customer needed,
              what we designed, and the systems that went in. We add new
              projects as they wrap, across residential, custom homes,
              multi-family, commercial, industrial, and government work.
            </p>
          </div>

          <div className="mt-8 sfc-tabs__list w-fit">
            {FILTERS.map((f) => {
              const isActive = (f.value || "") === segment;
              return (
                <Link
                  key={f.label}
                  href={f.value ? `/projects?segment=${f.value}` : "/projects"}
                  className={["sfc-tab", isActive && "is-active"]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="sfc-section pt-0">
        <Container>
          {items.length === 0 ? (
            <p className="text-n-700">
              No {activeLabel.toLowerCase()} projects published yet — more are
              on the way.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ProjectCard
                  key={item._id}
                  item={item}
                  localImage={LOCAL_IMAGE_BY_SLUG.get(item.slug)}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      <CtaBanner phone={phone} />
    </>
  );
}
