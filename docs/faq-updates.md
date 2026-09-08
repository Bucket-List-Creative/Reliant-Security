# Reliant FAQ workbook integration

Source: `Reliant_Website_FAQ_Updates.xlsx`, supplied September 8, 2026.
Website copy lives in `src/content/faqs.ts`. The original workbook is unchanged.

## Workbook coverage

- **Project Checklist:** implemented copy replacement, new FAQ placement, and FAQ structured data. Internal task owners and statuses are not website copy.
- **FAQ Copy Updates:** applied the corrected “Reliant FAQs” heading, all ten question-specific service/home replacements, and the partner-delivered service wording to cybersecurity and managed IT FAQs. Related FAQ answers were qualified where they would otherwise contradict the supplied copy.
- **New FAQs:** included all ten entries with actual answers. Service area and consultation questions appear on Contact; licensing appears on About. Pricing, warranty, and unmonitored-system questions appear on Security Alarm and Security System Installation. The three camera questions appear on both surveillance pages. The quote-process question appears on every service page. Pricing also reuses the relevant pricing, consultation, agreement, warranty, and quote-process answers.
- **Page Layout:** Home retains the six specified highlights and links to services and contact FAQs. Alarm pages contain 5–8 questions, both video pages contain seven, Access Control contains six, and Cabling & Fiber contains six. FAQ buttons use the supplied page-specific calls to action. The optional comprehensive FAQ page was not added.

## Content precedence

For the twelve built-in service slugs, the workbook-backed FAQ lists take precedence over legacy Sanity FAQ arrays. CMS-only service pages still use their Sanity FAQs. Home, Contact, About, and Pricing use their curated page lists. Other CMS content retains its existing behavior. No remote Sanity documents were changed.

The displayed accordion and its FAQ structured data use the same list on each page. Empty FAQ lists do not produce FAQ markup.

## Outstanding source items

The financing entry (`New FAQs`, row 8) contains only an internal instruction to confirm the active program, not a customer-facing answer. It is intentionally absent from public content until actual terms and wording are supplied.

The workbook also lists pre-launch confirmation of the Becklar statistic, partner service scope, and warranty terms. Their supplied wording is implemented locally; this code change does not establish those confirmations or publish the website.
