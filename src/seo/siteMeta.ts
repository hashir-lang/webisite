// ============================================================================
//  Central SEO configuration for UeCampus.
//  All per-page <Seo> tags, JSON-LD structured data, and the sitemap generator
//  read from the constants and helpers defined here, so titles/descriptions
//  stay consistent and there is a single place to update the canonical domain.
// ============================================================================

import type { Course } from "@/data/courses";

/** Production origin — used to build absolute canonical + Open Graph URLs. No trailing slash. */
export const SITE_URL = "https://uecampus.com";

export const SITE_NAME = "UeCampus";

/** Default social share image. Replace with a dedicated 1200×630 OG image when available. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/uecampus-logo.png`;

export const DEFAULT_DESCRIPTION =
  "Flexible, internationally recognised online degrees from UeCampus. Study 100% online, advance your career, and earn globally recognised qualifications from UK, French, Maltese and US partner institutions.";

/**
 * Official social profiles for the Organization `sameAs` property, so Google
 * can connect the brand's knowledge panel. The same three are linked from the
 * footer (SOCIALS in src/components/layout/Footer.tsx) and its PHP mirror in
 * blog/_core.php, and listed by blog/index.php's publisher node — change them
 * together.
 */
export const SOCIAL_PROFILES: string[] = [
  "https://www.instagram.com/join_uecampus/",
  "https://www.facebook.com/p/UeCampus-61572906104101/",
  "https://uk.linkedin.com/company/uecampus",
];

/** Absolute URL for a given app path. */
export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || SITE_URL;

/** Site-wide Organization / EducationalOrganization schema (injected once, on the homepage). */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  alternateName: "UeCampus Online University",
  url: SITE_URL,
  logo: `${SITE_URL}/uecampus-logo.png`,
  description: DEFAULT_DESCRIPTION,
  email: "info@uecampus.com",
  telephone: "+44-7747-312812",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Office 249, Titan Court, 3 Bishop Square",
    addressLocality: "Hatfield",
    addressRegion: "Hertfordshire",
    postalCode: "AL10 9NA",
    addressCountry: "GB",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+44-7586-797014",
    email: "info@uecampus.com",
    contactType: "admissions",
    availableLanguage: ["English"],
  },
  ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
};

/** WebSite schema with a search action, so Google can surface a sitelinks search box. */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/programmes?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export type PageMeta = {
  title: string;
  description: string;
  keywords: string;
  /** Route path used for the canonical URL, e.g. "/about-us". */
  path: string;
};

/**
 * Per-route metadata for the static pages. `title` should stay under ~60 chars
 * and `description` under ~155 for clean SERP rendering.
 */
export const PAGE_META = {
  home: {
    title: "Online Degrees Without Barriers | Flexible & Affordable | UeCampus",
    description:
      "Study 100% online with UeCampus. Internationally recognised bachelors, masters, MBA, DBA & UK diplomas from partner institutions. Flexible fees. Sept 2026 intake open.",
    keywords:
      "online degrees, online university, affordable online degrees, distance learning degrees",
    path: "/",
  },
  about: {
    title: "About UeCampus | Online Higher Education Platform",
    description:
      "UeCampus delivers internationally recognised online degrees with partners across the USA, France, Europe and UK. Meet the team behind Degrees Without Barriers.",
    keywords:
      "about uecampus, uecampus reviews, uecampus online university",
    path: "/about-us",
  },
  programmes: {
    title: "All Programmes | Bachelors, Masters, MBA, DBA | UeCampus",
    description:
      "Full catalogue of internationally recognised online programmes from Walsh College, PPA Business School, eie and UK awarding bodies. Compare levels, fees and diplomas.",
    keywords:
      "online degree programmes, university programmes online, postgraduate programmes online",
    path: "/programmes",
  },
  courses: {
    title: "Online Degree Programmes & UK Diplomas | UeCampus",
    description:
      "Browse internationally recognised online programmes: BBA, BSc, MBA, DBA and UK Level 2-8 diplomas. Study anywhere, graduate with a recognised qualification.",
    keywords:
      "online courses and degree programmes, online degree programmes, recognised online courses",
    path: "/courses",
  },
  fees: {
    title: "Tuition & Fees | Online Degree Costs | UeCampus",
    description:
      "Transparent tuition fees for internationally recognised online degrees from Walsh College, eie and PPA Business School. Compare bachelor, master and PhD programme costs.",
    keywords:
      "online degree fees, tuition fees, walsh college fees, eie fees, ppa business school fees",
    path: "/fees",
  },
  scholarship: {
    title: "Scholarships for Online Students | UeCampus",
    description:
      "Apply for the Academic Excellence or Developing Country Scholarship and reduce the cost of your online degree with UeCampus.",
    keywords:
      "online degree scholarships, scholarships for online students, developing country scholarship",
    path: "/scholarship",
  },
  // No `blogs` entry: the journal is server-rendered by PHP at /blog and builds
  // its own <head> in blog/_core.php, so its SEO never passes through Helmet.
  contact: {
    title: "Contact UeCampus | Speak to an Admissions Advisor",
    description:
      "Talk to a UeCampus admissions advisor about programmes, fees and the September 2026 intake. WhatsApp, phone and email support.",
    keywords:
      "contact uecampus, uecampus whatsapp, uecampus admissions",
    path: "/contact-us",
  },
  apply: {
    title: "Enquire Now | Start Your Online Degree | UeCampus",
    description:
      "Request programme details, fees and entry requirements. An advisor responds within 24 hours. September 2026 intake - places limited.",
    keywords:
      "apply online degree, enrol online university, online degree application",
    path: "/enquire-now",
  },
  partners: {
    title: "Accreditation & University Partners | UeCampus",
    description:
      "How UeCampus programmes are accredited: Walsh College (HLC, ACBSP), PPA Business School, eie, Qualifi. Verify every credential on official registers.",
    keywords:
      "uecampus accreditation, is uecampus accredited, is uecampus legit, walsh college accreditation",
    path: "/accreditation-and-partners",
  },
  faqs: {
    title: "Online Degrees FAQ | Recognition, Fees & Study | UeCampus",
    description:
      "Answers to common questions about studying online with UeCampus: recognition, attestation, fees, assessments and graduation.",
    keywords:
      "online degree faq, how do online degrees work, are online degrees recognised",
    path: "/faqs",
  },
  team: {
    title: "Our Team | The People Behind UeCampus",
    description:
      "Meet the people behind UeCampus — the academics, advisors and support team helping students earn internationally recognised online degrees.",
    keywords:
      "uecampus team, uecampus staff, uecampus leadership, meet the team",
    path: "/team",
  },
  thankYou: {
    title: "Thank You | UeCampus",
    description:
      "Thank you for your enquiry. The UeCampus admissions team will be in touch shortly to help you take the next step towards your online degree.",
    keywords: "UeCampus, enquiry received, admissions",
    path: "/thank-you",
  },
  notFound: {
    title: "Page Not Found | UeCampus",
    description:
      "The page you were looking for could not be found. Explore UeCampus online programmes, accreditation and admissions instead.",
    keywords: "UeCampus, page not found",
    path: "/404",
  },
} satisfies Record<string, PageMeta>;

/** Build the SEO title for a single course/programme page: "{title} | {partner} | UeCampus". */
export const buildCourseTitle = (course: Course): string => {
  const withPartner = `${course.title} | ${course.universityShort} | UeCampus`;
  return withPartner.length <= 62 ? withPartner : `${course.title} | UeCampus`;
};

/**
 * Build a concise, SEO-friendly meta description for a single course/programme page.
 *
 * Names the awarding partner rather than calling the course itself "accredited":
 * the recognition claim belongs to the partner institution, which is what
 * `course.accreditedBy` records.
 */
export const buildCourseDescription = (course: Course): string => {
  const base = `${course.title} delivered 100% online through ${course.accreditedBy}. Flexible, affordable and globally recognised. Sept 2026 intake.`;
  return base.length > 158 ? `${base.slice(0, 155).trimEnd()}…` : base;
};

/** Build a keyword string for a single course/programme page. */
export const buildCourseKeywords = (course: Course): string =>
  [
    course.title,
    `online ${course.title}`,
    `${course.levelGroup} online`,
    course.accreditedBy,
    ...course.categories,
    "recognised online degree",
    "UeCampus",
  ]
    .filter(Boolean)
    .join(", ");

/** Course schema (schema.org/Course) for a single programme page. */
export const buildCourseSchema = (course: Course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: course.title,
  description: course.overview,
  url: absoluteUrl(`/programmes/${course.slug}`),
  provider: {
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  ...(course.img ? { image: course.img } : {}),
  educationalCredentialAwarded: course.qualification,
  inLanguage: "en",
  offers: {
    "@type": "Offer",
    category: "Paid",
    availability: "https://schema.org/InStock",
  },
  hasCourseInstance: (course.intakes ?? []).slice(0, 3).map((intake) => ({
    "@type": "CourseInstance",
    courseMode: "online",
    name: `${course.title} — ${intake} intake`,
    courseWorkload: course.duration,
    ...(parseIntakeDate(intake) ? { startDate: parseIntakeDate(intake) } : {}),
  })),
});

/** Turn an intake label like "September 2026" into an ISO date "2026-09-01". */
function parseIntakeDate(intake: string): string | null {
  const months: Record<string, string> = {
    january: "01", february: "02", march: "03", april: "04",
    may: "05", june: "06", july: "07", august: "08",
    september: "09", october: "10", november: "11", december: "12",
  };
  const m = /([a-z]+)\s+(\d{4})/i.exec(intake.trim());
  if (!m) return null;
  const mm = months[m[1].toLowerCase()];
  return mm ? `${m[2]}-${mm}-01` : null;
}

/** BreadcrumbList schema for a programme detail page. */
export const buildCourseBreadcrumb = (course: Course) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Programmes", item: absoluteUrl("/programmes") },
    { "@type": "ListItem", position: 3, name: course.title, item: absoluteUrl(`/programmes/${course.slug}`) },
  ],
});
