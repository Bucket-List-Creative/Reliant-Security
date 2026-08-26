import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/sections/ProjectCard";
import type { ProjectListItem } from "@/sanity/lib/types";
import { PROJECTS } from "@/content/projects";

/**
 * Defaults come from the real project taxonomy — featured entries first — so
 * the home page never shows invented client names.
 */
const FALLBACK: ProjectListItem[] = [...PROJECTS]
  .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  .map((p) => ({
    _id: `taxonomy-${p.slug}`,
    slug: p.slug,
    title: p.title,
    client: p.client,
    industry: p.industry,
    summary: p.summary,
    segments: p.segments,
    publishedAt: "",
  }));

export function ProjectsStrip({
  projects,
  heading = "Proven on real projects",
  subheading = "From industrial plants to commercial buildings and homes — see what we design, install, and stand behind.",
  localImageBySlug,
}: {
  projects?: ProjectListItem[];
  heading?: string;
  subheading?: string;
  /** Optional map of slug → /public image path, for taxonomy-sourced items. */
  localImageBySlug?: Map<string, string | undefined>;
}) {
  const items = (projects?.length ? projects : FALLBACK).slice(0, 3);

  return (
    <section className="sfc-section" id="projects">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">{heading}</h2>
            <p className="mt-4 text-lg text-n-700">{subheading}</p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 font-semibold text-brand-press hover:underline"
          >
            All projects
            <IconArrowRight size={16} stroke={2} aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <ProjectCard
              key={item._id}
              item={item}
              localImage={localImageBySlug?.get(item.slug)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
