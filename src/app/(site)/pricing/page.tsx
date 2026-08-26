import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { PLANS_QUERY, FAQS_QUERY } from "@/sanity/lib/queries";
import type { Plan, Faq } from "@/sanity/lib/types";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PricingTable } from "@/components/sections/PricingTable";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Straightforward professional monitoring plans for homes and small businesses, plus custom-designed systems for commercial, industrial, and government facilities.",
};

export default async function PricingPage() {
  const [{ data: plans }, { data: faqs }] = await Promise.all([
    sanityFetch({ query: PLANS_QUERY }),
    sanityFetch({ query: FAQS_QUERY }),
  ]);

  return (
    <>
      <section className="sfc-section pt-12">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge className="mb-5">Pricing</Badge>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Plans that scale with your peace of mind
            </h1>
            <p className="mt-5 text-lg text-n-700">
              Transparent monthly pricing on professionally monitored plans —
              with custom design and quoting for larger commercial, industrial,
              and government systems.
            </p>
          </div>
          <PricingTable plans={plans as Plan[]} />

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-n-500">
            Monitored plans typically begin with a 36-month monitoring
            agreement. Month-to-month options are available in certain
            situations — ask us and we&apos;ll walk you through what fits.
            Equipment, service plans, and package inclusions are confirmed in
            writing before installation.
          </p>
        </Container>
      </section>

      <FaqAccordion faqs={faqs as Faq[]} heading="Pricing questions" />
    </>
  );
}
