import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  LockIcon,
  ComponentIcon,
  CaseIcon,
  CreditCardIcon,
  CommentIcon,
  PlugIcon,
  HelpCircleIcon,
  TrendUpwardIcon,
  DocumentTextIcon,
  UserIcon,
  TagIcon,
  BookIcon,
  PinIcon,
  DocumentIcon,
  HomeIcon,
  UsersIcon,
  MenuIcon,
} from "@sanity/icons";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton: one settings document, edited in place
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Navigation")
        .icon(MenuIcon)
        .id("navigation")
        .child(S.document().schemaType("navigation").documentId("navigation")),
      S.divider(),
      // Page copy — one singleton per page whose wording isn't driven by a
      // content type of its own.
      S.listItem()
        .title("Home page")
        .icon(HomeIcon)
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("About page")
        .icon(UsersIcon)
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Services page")
        .icon(LockIcon)
        .id("servicesPage")
        .child(
          S.document().schemaType("servicesPage").documentId("servicesPage"),
        ),
      S.divider(),
      S.documentTypeListItem("service").title("Services").icon(LockIcon),
      S.documentTypeListItem("industry").title("Industries").icon(ComponentIcon),
      S.documentTypeListItem("project").title("Projects").icon(CaseIcon),
      S.documentTypeListItem("plan").title("Pricing plans").icon(CreditCardIcon),
      S.documentTypeListItem("testimonial")
        .title("Testimonials")
        .icon(CommentIcon),
      S.documentTypeListItem("partner")
        .title("Technology partners")
        .icon(PlugIcon),
      S.documentTypeListItem("faq").title("FAQs").icon(HelpCircleIcon),
      S.documentTypeListItem("stat").title("Stats").icon(TrendUpwardIcon),
      S.divider(),
      S.documentTypeListItem("post").title("Blog posts").icon(DocumentTextIcon),
      S.documentTypeListItem("author").title("Authors").icon(UserIcon),
      S.documentTypeListItem("category").title("Categories").icon(TagIcon),
      S.documentTypeListItem("resource").title("Resources").icon(BookIcon),
      S.divider(),
      S.documentTypeListItem("location")
        .title("Service area pages")
        .icon(PinIcon),
      S.documentTypeListItem("legalPage")
        .title("Policy pages")
        .icon(DocumentIcon),
    ]);
