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
    "Simple, flexible monitoring plans for homes and businesses. No long contracts required.",
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
              Transparent monthly pricing. Cancel anytime — no long contracts.
            </p>
          </div>
          <PricingTable plans={plans as Plan[]} />
        </Container>
      </section>

      <FaqAccordion faqs={faqs as Faq[]} heading="Pricing questions" />
    </>
  );
}
