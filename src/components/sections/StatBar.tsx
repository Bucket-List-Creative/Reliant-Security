import { Container } from "@/components/ui/Container";
import type { Stat } from "@/sanity/lib/types";

const FALLBACK: Stat[] = [
  { _id: "s1", value: "45s", label: "Avg. response time" },
  { _id: "s2", value: "12k+", label: "Homes protected" },
  { _id: "s3", value: "99.9%", label: "Monitoring uptime" },
  { _id: "s4", value: "24/7", label: "Live support" },
];

export function StatBar({ stats }: { stats?: Stat[] }) {
  const items = stats?.length ? stats : FALLBACK;

  return (
    <section className="sfc-section pt-0">
      <Container>
        <div
          className="grid grid-cols-2 gap-6 rounded-[var(--radius-xl)] bg-surface-raised px-8 py-10 lg:grid-cols-4"
          style={{ boxShadow: "var(--shadow-soft-3)" }}
        >
          {items.map((stat) => (
            <div key={stat._id} className="text-center">
              <div className="font-display text-4xl font-bold text-brand-press sm:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-n-700">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
