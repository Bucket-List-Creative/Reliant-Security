import { Container } from "@/components/ui/Container";
import type { Stat } from "@/sanity/lib/types";

/**
 * Monitoring-network statistics.
 *
 * These figures describe the Becklar professional monitoring network that
 * watches Reliant customers' systems — they are NOT Reliant's own subscriber
 * or headcount numbers. The attribution caption below the grid is therefore
 * required, not decorative: presenting these as Reliant's own metrics would
 * misrepresent the company.
 */
const FALLBACK: Stat[] = [
  { _id: "s1", value: "9.4s", label: "Average alarm response time" },
  { _id: "s2", value: "2.5M+", label: "Subscribers monitored" },
  { _id: "s3", value: "6", label: "Monitoring stations across North America" },
  { _id: "s4", value: "40+", label: "Years of monitoring experience" },
  { _id: "s5", value: "865M+", label: "Signals received" },
  { _id: "s6", value: "22K+", label: "Alarm events handled per day" },
  { _id: "s7", value: "UL", label: "Certified, fully redundant infrastructure" },
  { _id: "s8", value: "24/7", label: "Professional monitoring, every day" },
];

const DEFAULT_CAPTION =
  "Figures reflect the Becklar professional monitoring network — the UL-certified, fully redundant central-station infrastructure that monitors Reliant customers' systems.";

export function StatBar({
  stats,
  heading = "Backed by a nationwide professional monitoring network",
  caption = DEFAULT_CAPTION,
}: {
  stats?: Stat[];
  heading?: string;
  caption?: string;
}) {
  const items = stats?.length ? stats : FALLBACK;

  return (
    <section className="sfc-section pt-0" id="monitoring-network">
      <Container>
        {/* Dark band: the page runs long on pale cards, and this is the first
            thing after the hero — it needs to land. */}
        <div
          className="sfc-band px-6 py-10 sm:px-10 sm:py-12"
          style={{ boxShadow: "var(--shadow-soft-4)" }}
        >
          {heading && (
            <h2 className="mx-auto mb-10 max-w-2xl text-center font-display text-2xl font-bold sm:text-3xl">
              {heading}
            </h2>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-4">
            {items.map((stat) => (
              <div key={stat._id} className="text-center">
                <div className="font-display text-[2.15rem] font-bold leading-none tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mx-auto mt-2.5 max-w-[16ch] text-xs font-medium leading-snug text-white/70 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {caption && (
            <p className="mx-auto mt-10 max-w-3xl border-t border-white/15 pt-6 text-center text-xs leading-relaxed text-white/60 sm:text-sm">
              {caption}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
