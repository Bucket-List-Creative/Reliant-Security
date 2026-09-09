/**
 * Built-in policy copy, carried over from the previous site so the pages are
 * live from day one. A `legalPage` document in Sanity with the matching slug
 * replaces this entirely — that is the route the owner should use to edit it,
 * since policy wording changes without a deploy.
 */

export type LegalCopy = {
  slug: string;
  title: string;
  intro?: string;
  /** Plain paragraphs. Portable Text from Sanity supersedes these. */
  body: string[];
  updatedAt: string;
};

export const PRIVACY_POLICY: LegalCopy = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  intro:
    "How Reliant Security collects, uses, and protects the information you share with us.",
  body: [
    "Reliant Security (“we,” “us,” or “our”) is committed to protecting your personal information. When you visit our website, request a quote, contact us, or use our security, CCTV, cabling, access control, or monitoring services, we may collect information such as your name, phone number, email address, property address, and project details. We also automatically collect device data such as IP address, browser type, and pages visited through cookies and analytics tools. This information is used to provide quotes, schedule service, communicate with you, improve our website, deliver marketing or follow-up messages, and support your ongoing service needs. We do not sell your information.",
    "We may share information with trusted third-party partners such as Alarm.com, monitoring centers, CRM systems, payment processors, and advertising platforms like Google for analytics and performance measurement. Your data is protected using industry-standard security measures, and you may request to update or delete your information at any time by contacting us at customercare@secure-reliant.com. By using our website, you consent to the collection and use of information as described in this policy. If we update our practices, the revised policy will be posted on this page.",
  ],
  updatedAt: "2026-09-08",
};

export const LEGAL_PAGES: LegalCopy[] = [PRIVACY_POLICY];

export function findLegalCopy(slug: string): LegalCopy | undefined {
  return LEGAL_PAGES.find((p) => p.slug === slug);
}
