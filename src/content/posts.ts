/**
 * Blog posts carried over from the previous WordPress site.
 *
 * These exist so the blog isn't empty on launch and so the old post URLs keep
 * working. They are a fallback only: as soon as a `post` document with the same
 * slug exists in Sanity, the CMS version wins everywhere — see the merge in
 * `src/app/(site)/blog`. New posts should be written in Sanity, not here.
 *
 * `body` is a deliberately small block format rather than Portable Text; these
 * are static, and mirroring the CMS shape for six legacy posts would be more
 * machinery than it's worth. Sanity posts render through `PortableTextContent`.
 */

export type LocalPostBlock = {
  kind: "h2" | "h3" | "p" | "li";
  text: string;
};

export type LocalPost = {
  slug: string;
  title: string;
  /**
   * Shorter title for the <title> tag and social cards. Several carried-over
   * headlines run past 100 characters, which truncates in results once the
   * site name is appended. The on-page heading still uses `title`.
   */
  seoTitle?: string;
  /** ISO timestamp, as published on the previous site. */
  publishedAt: string;
  author: string;
  category: string;
  excerpt: string;
  body: LocalPostBlock[];
};

/** Categories used by the carried-over posts. */
export const POST_CATEGORIES = [
  "Choosing a Security System",
  "Home Security Tips",
] as const;

export const POSTS: LocalPost[] = [
  {
    slug: "professional-installation",
    seoTitle: "Why Professional Install Beats DIY",
    title: "How Professional Installation Saves You Time and Keeps Your Home Safer",
    publishedAt: "2025-10-31T16:37:16",
    author: "Mahaboob Pasha Mohammad",
    category: "Home Security Tips",
    excerpt: "When it comes to protecting your home and family, the setup matters just as much as the equipment itself. While DIY systems may sound simple, many homeowners quickly realize that a “quick…",
    body: [
      { kind: "p", text: "When it comes to protecting your home and family, the setup matters just as much as the equipment itself. While DIY systems may sound simple, many homeowners quickly realize that a “quick setup” can turn into hours of frustration—and an unreliable system. That’s where Reliant’s professional installation makes all the difference." },
      { kind: "h2", text: "1. Save Time and Skip the Hassle" },
      { kind: "p", text: "Between work, family, and school schedules, time is valuable. Professional installation takes the guesswork out of setup so you can relax knowing it’s done right the first time. Reliant’s trained technicians handle everything—from mounting your cameras and syncing devices to walking you through the app—so you’re fully connected before they leave." },
      { kind: "h2", text: "2. Ensure Everything Works Together Seamlessly" },
      { kind: "p", text: "Smart home security is only as strong as its connections. Mixing multiple devices or apps can lead to blind spots or notifications that never arrive. With Reliant, your system is custom-configured so your doorbell camera, smart lock, thermostat, and sensors all communicate perfectly within one app." },
      { kind: "h2", text: "3. Maximize Your Home’s Safety" },
      { kind: "p", text: "A professional installer knows exactly where to place sensors and cameras for maximum coverage. They’ll spot weak entry points and help you secure them before they become an issue. This not only improves protection—it ensures every alert and recording is accurate when you need it most." },
      { kind: "h2", text: "4. Enjoy Personalized Training and Support" },
      { kind: "p", text: "DIY setups leave you on your own. Reliant’s professional installers make sure you’re confident using your system before they go. You’ll learn how to:" },
      { kind: "li", text: "Arm and disarm remotely" },
      { kind: "li", text: "Set up notifications for family arrivals" },
      { kind: "li", text: "Adjust schedules for work and school hours" },
      { kind: "li", text: "Integrate new devices as your needs grow" },
      { kind: "p", text: "And if you ever need help later, our local support team is just a call away." },
      { kind: "h2", text: "5. Protect Your Investment" },
      { kind: "p", text: "Professional installation isn’t just convenient—it protects your equipment warranty and ensures everything is set up according to manufacturer standards. That means fewer issues down the road and more long-term peace of mind." },
      { kind: "h3", text: "Experience the Reliant Difference" },
      { kind: "p", text: "Reliant makes smart home security easy, reliable, and built around you. With professional installation, you’ll save time, eliminate setup stress, and enjoy a safer, more connected home from day one." },
    ],
  },
  {
    slug: "top-5-reasons-to-upgrade-to-a-smart-home-security-system-in-greater-st-louis",
    seoTitle: "5 Reasons to Upgrade to Smart Security",
    title: "Top 5 Reasons to Upgrade to a Smart Home Security System in Greater St. Louis",
    publishedAt: "2025-09-30T14:09:53",
    author: "Mahaboob Pasha Mohammad",
    category: "Choosing a Security System",
    excerpt: "If you’re a homeowner in the Greater St. Louis area, upgrading to a smart home security system may be one of the best investments you can make. With rising break-in rates, evolving…",
    body: [
      { kind: "p", text: "If you’re a homeowner in the Greater St. Louis area, upgrading to a smart home security system may be one of the best investments you can make. With rising break-in rates, evolving technology, and more people working remotely, protecting your home is more important than ever." },
      { kind: "p", text: "At Reliant Security, we provide professionally installed smart security systems tailored to homeowners across St. Louis County, St. Charles County, and surrounding communities. Here’s why now is the perfect time to upgrade your security setup." },
      { kind: "h3", text: "1. 24/7 Monitoring for Total Peace of Mind" },
      { kind: "p", text: "Our smart security systems offer around-the-clock monitoring, ensuring your home is protected day and night. Whether you’re asleep or on vacation, you’ll always know your home is being watched by professionals ready to respond." },
      { kind: "h3", text: "2. Instant Mobile Alerts and Remote Access" },
      { kind: "p", text: "Monitor live camera feeds, lock or unlock doors, and receive real-time alerts—all from your smartphone. You stay in control of your home, no matter where you are." },
      { kind: "h3", text: "3. Insurance Benefits" },
      { kind: "p", text: "Many homeowners insurance companies offer discounts for professionally monitored alarm systems. We also provide official monitoring certificates to help you qualify for savings." },
      { kind: "h3", text: "4. Enhanced Protection with Smart Devices" },
      { kind: "p", text: "From glass break sensors and doorbell cameras to smart smoke detectors and garage door controllers, our systems are built to cover every entry point and emergency scenario." },
      { kind: "h3", text: "5. Local Support from a Trusted Installer" },
      { kind: "p", text: "Reliant Security is locally owned and operated. With over 16 years of experience, we understand the unique needs of homeowners throughout the Greater St. Louis region. We provide personal service, fast response times, and clean, professional installations." },
      { kind: "h3", text: "Serving Greater St. Louis and Surrounding Communities" },
      { kind: "p", text: "We proudly serve homeowners in St. Louis, St. Charles, Chesterfield, Ballwin, Wildwood, Kirkwood, St. Peters, Wentzville, O’Fallon, and nearby areas. Our team is committed to delivering smart, secure, and reliable solutions for every home." },
      { kind: "p", text: "Ready to take the next step? Call us at (636) 294-5645 or visit our website to schedule your FREE security assessment today." },
    ],
  },
  {
    slug: "why-every-st-louis-business-needs-a-smart-security-system",
    seoTitle: "Why St. Louis Businesses Need Smart Security",
    title: "Why Every St. Louis Business Needs a Smart Security System",
    publishedAt: "2025-09-17T17:54:49",
    author: "Mahaboob Pasha Mohammad",
    category: "Choosing a Security System",
    excerpt: "As a local business owner, protecting your property, employees, and customers should be at the top of your priority list. With rising security concerns and an increasing number of break-ins…",
    body: [
      { kind: "h2", text: "Why Every Local Business Needs a Smart Security System in 2025" },
      { kind: "p", text: "As a local business owner, protecting your property, employees, and customers should be at the top of your priority list. With rising security concerns and an increasing number of break-ins and thefts targeting small businesses, having a smart security system isn’t just a luxury—it’s a necessity." },
      { kind: "p", text: "At Reliant Security, we specialize in protecting businesses across O’Fallon, St. Louis County, and the surrounding areas. With over 16 years of experience, our locally owned and operated team understands the unique challenges business owners face in our community." },
      { kind: "h3", text: "What Makes Smart Security Essential for Businesses?" },
      { kind: "li", text: "24/7 Monitoring : Rest easy knowing your property is monitored day and night, even when you’re not there." },
      { kind: "li", text: "Remote Access : Check camera feeds, control locks, or monitor sensors right from your phone." },
      { kind: "li", text: "Instant Alerts : Receive real-time notifications for any suspicious activity or system breach." },
      { kind: "li", text: "Insurance Benefits : Many insurers offer discounts for professionally monitored systems." },
      { kind: "li", text: "Employee & Customer Safety : Create a secure environment that builds trust and reduces liability." },
      { kind: "h3", text: "Custom Solutions for Every Business Type" },
      { kind: "p", text: "No two businesses are the same. That’s why we offer tailored solutions for:" },
      { kind: "li", text: "Retail stores" },
      { kind: "li", text: "Restaurants" },
      { kind: "li", text: "Warehouses and storage facilities" },
      { kind: "li", text: "Offices and professional services" },
      { kind: "li", text: "Multi-unit commercial properties" },
      { kind: "p", text: "Our systems include door and window sensors, HD surveillance cameras, smart locks, glass break sensors, and fire/smoke monitoring—all managed through a single, easy-to-use app." },
      { kind: "h3", text: "Why Local Matters" },
      { kind: "p", text: "We’re not a national chain—we’re your neighbors. When you work with Reliant Security, you get:" },
      { kind: "li", text: "Fast response times" },
      { kind: "li", text: "Local support and service" },
      { kind: "li", text: "Technicians who understand the area" },
      { kind: "li", text: "A partner invested in your community’s safety" },
      { kind: "h3", text: "Let’s Secure Your Business—Together" },
      { kind: "p", text: "If you’re a business owner in O’Fallon, St. Charles, St. Louis County, or surrounding areas, let’s talk. We offer free security assessments and flexible installation options to fit your schedule and budget." },
      { kind: "p", text: "Call us at (636) 294-5645 or visit our website to schedule your consultation today." },
      { kind: "p", text: "Invest in protection now—because peace of mind is good for business." },
    ],
  },
  {
    slug: "back-to-school-home-security-tips-for-parents",
    seoTitle: "Back-to-School Home Security Tips",
    title: "Back to School Home Security Tips for Parents",
    publishedAt: "2025-08-22T14:35:54",
    author: "Mahaboob Pasha Mohammad",
    category: "Home Security Tips",
    excerpt: "As the school year kicks off, it’s the perfect time to reassess your home’s security. Whether your kids are walking home, getting dropped off, or arriving before you return from work, peace…",
    body: [
      { kind: "h3", text: "Protect Your Business During Peak Hours" },
      { kind: "p", text: "Back-to-school means more foot traffic and potential security risks for local businesses. Professional-grade surveillance cameras and access control keep an eye on entrances and stockrooms through the busiest weeks of the year, and let you review what happened without being on site." },
      { kind: "p", text: "As the school year kicks off, it’s the perfect time to reassess your home’s security. Whether your kids are walking home, getting dropped off, or arriving before you return from work, peace of mind starts with smart protection." },
      { kind: "p", text: "At Reliant Security , we’re helping families in O’Fallon, MO and surrounding areas take control of their safety with our Back to School, Back to Safety promotion — including FREE installation and your choice of 2 FREE smart upgrades ." },
      { kind: "p", text: "Let’s break down the top home security tips for the back-to-school season, and how our exclusive offer can help." },
      { kind: "h3", text: "1. Install a Doorbell Camera" },
      { kind: "p", text: "When your kids get home, do you know who walked in with them? A smart doorbell camera lets you:" },
      { kind: "li", text: "Receive instant alerts when someone is at the door" },
      { kind: "li", text: "Watch live video from your phone" },
      { kind: "li", text: "Make sure it’s your kids — and only your kids — entering your home" },
      { kind: "p", text: "Bonus: It’s one of the free upgrades you can choose in our current promotion!" },
      { kind: "h3", text: "2. Secure Entrances with a Smart Deadbolt" },
      { kind: "p", text: "Kids tend to forget keys — but smart locks don’t need them. A smart deadbolt gives you:" },
      { kind: "li", text: "Keyless entry with secure access codes" },
      { kind: "li", text: "Full control over who can enter and when" },
      { kind: "li", text: "Activity logs so you know exactly when the door was unlocked" },
      { kind: "p", text: "Perfect for after-school access without compromising safety." },
      { kind: "h3", text: "3. Manage Your Home Environment with a Smart Thermostat" },
      { kind: "p", text: "With everyone at school or work during the day, energy use doesn’t have to stay high. A smart thermostat helps you:" },
      { kind: "li", text: "Save on your energy bills" },
      { kind: "li", text: "Control heating/cooling remotely" },
      { kind: "li", text: "Keep your home comfortable when the kids return" },
      { kind: "h3", text: "4. Don’t Forget the Garage Door!" },
      { kind: "p", text: "The garage is often a forgotten entry point — and one of the easiest to leave open. With a smart garage door controller , you can:" },
      { kind: "li", text: "Check if the door is open from your phone" },
      { kind: "li", text: "Close it remotely if it was left open" },
      { kind: "li", text: "Get alerts any time it opens during the day" },
      { kind: "h3", text: "Take Advantage of Our Back to School, Back to Safety Promotion 🎉" },
      { kind: "p", text: "For a limited time, we’re offering:" },
      { kind: "li", text: "FREE Installation" },
      { kind: "li", text: "Choose 2 Smart Upgrades:" },
      { kind: "li", text: "Doorbell Camera" },
      { kind: "li", text: "Smart Deadbolt" },
      { kind: "li", text: "Smart Thermostat" },
      { kind: "li", text: "Garage Door Controller" },
      { kind: "p", text: "📍 Available for homes in O’Fallon, MO and surrounding communities" },
      { kind: "p", text: "📞 Call us today at (636) 294-5645 to schedule your FREE security assessment and claim your offer." },
      { kind: "p", text: "Make this school year the safest one yet — with Reliant Security by your side." },
    ],
  },
  {
    slug: "5-things-to-look-for-in-a-security-camera-installer-in-st-louis-and-what-sets-reliant-llc-apart",
    seoTitle: "5 Things to Look for in a Camera Installer",
    title: "5 Things to Look for in a Security Camera Installer in St. Louis (and What Sets Reliant LLC Apart)",
    publishedAt: "2025-07-30T13:21:22",
    author: "Mahaboob Pasha Mohammad",
    category: "Choosing a Security System",
    excerpt: "Choosing the right security camera installer is a big decision. Whether you’re protecting your home or business, a reliable and professional installer makes all the difference in how well…",
    body: [
      { kind: "p", text: "Choosing the right security camera installer is a big decision. Whether you’re protecting your home or business, a reliable and professional installer makes all the difference in how well your system performs over time. If you’re in St. Louis, MO or the surrounding areas, here are five key things to look for when selecting a security camera installation company—and how Reliant LLC checks all the boxes." },
      { kind: "h2", text: "1. Local Experience and Reputation" },
      { kind: "p", text: "Security needs can vary greatly depending on your location. A local company understands the specific challenges in your area and offers customized solutions. Reliant LLC has built a strong reputation in the St. Louis region by serving homes and businesses throughout St. Louis, Chesterfield , Wildwood , and beyond. Their local expertise ensures you’re getting service tailored to your neighborhood—not a one-size-fits-all system." },
      { kind: "h2", text: "2. Licensing and Certifications" },
      { kind: "p", text: "Before hiring any installer, confirm that they are licensed and meet state and industry requirements. This ensures your system will be up to code and installed safely. Reliant LLC is a licensed and insured installer, meaning you can trust their team to deliver quality and compliance every step of the way." },
      { kind: "h2", text: "3. Modern Technology and Integration" },
      { kind: "p", text: "From smart home features to cloud-based video storage, security camera technology is evolving fast. A quality installer should offer cutting-edge options that integrate seamlessly with your devices. Reliant LLC provides smart security solutions that connect with your phone, tablet, or voice assistant—so you’re always in control." },
      { kind: "h2", text: "4. Transparent Pricing and Custom Quotes" },
      { kind: "p", text: "No one wants surprise fees when it comes to security. Look for a company that provides honest pricing and customized recommendations. Reliant LLC offers free consultations and tailored system designs so you only pay for what you truly need—nothing more, nothing less." },
      { kind: "h2", text: "5. Ongoing Support and Maintenance" },
      { kind: "p", text: "Installation is just the beginning. Great security companies stick with you long after the cameras are up. Reliant LLC offers responsive customer support, troubleshooting, and optional maintenance to keep your system running smoothly year-round." },
      { kind: "h2", text: "Why Choose Reliant LLC?" },
      { kind: "p", text: "Reliant LLC isn’t just another security installer—they’re a trusted partner in protecting what matters most. With a combination of local expertise, industry certifications, and a customer-first mindset, they’ve earned their place as one of the top choices for security camera installation in St. Louis and surrounding areas ." },
      { kind: "p", text: "Ready to upgrade your security? Visit the official Reliant LLC website to learn more or request a free quote." },
    ],
  },];

/**
 * Post slugs that must never be rendered or listed again.
 *
 * These were merged into another post and are permanently redirected in
 * `next.config.ts`. They're filtered out of `generateStaticParams` and the
 * sitemap as well, so a stale document left in Sanity can't resurrect a URL
 * that now 301s — which would put the site in conflict with its own redirect.
 */
export const RETIRED_POST_SLUGS = new Set([
  "back-to-school-security-tips-keep-your-st-louis-home-and-business-safe-this-fall",
]);

export const POST_SLUGS = POSTS.map((p) => p.slug);

export function findPost(slug: string): LocalPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
