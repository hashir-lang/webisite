/**
 * Site-wide copy: the header (contact strip, navigation, buttons) and the
 * footer (headline, closer, columns, address, legal links, social profiles).
 * Rendered by src/components/layout/Header.tsx and Footer.tsx via
 * useContent("site"). Editable at /admin/pages/site.
 */
export const SITE_DEFAULTS = {
  contact: {
    email: "info@uecampus.com",
    phone: "+44 7747 312812",
  },
  nav: {
    items: [
      {
        label: "About Us",
        to: "/about-us",
        children: [
          { label: "About UeCampus",           to: "/about-us",                   desc: "Who we are and what we stand for." },
          { label: "Accreditation & Partners", to: "/accreditation-and-partners", desc: "Awarding bodies and partner institutions." },
          { label: "FAQs",                     to: "/faqs",                       desc: "Admissions, fees, recognition, support." },
        ],
      },
      { label: "Programmes",  to: "/programmes", children: [] as { label: string; to: string; desc: string }[] },
      { label: "Scholarship", to: "/scholarship", children: [] as { label: string; to: string; desc: string }[] },
      { label: "Contact Us",  to: "/contact-us",  children: [] as { label: string; to: string; desc: string }[] },
    ],
  },
  header: {
    portalLabel: "Student Portal",
    portalUrl: "https://studyportal.uecampus.com/",
    applyLabel: "Apply",
    applyLabelMobile: "Apply now",
    menuEyebrow: "Navigate",
  },
  footer: {
    videoHeadline: "Education that",
    videoHeadlineAccent: "travels with you",
    closerEyebrow: "Start your application",
    closerTitle: "A higher education,",
    closerAccent: "anywhere you choose",
    applyLabel: "Apply now",
    speakLabel: "Speak with admissions",
    blurb:
      "An online higher-education provider delivering internationally recognised degrees and diplomas, in partnership with established institutions across the UK, France, the United States and Malta.",
    platformHeading: "Platform",
    platformLinks: [
      { label: "About UeCampus", to: "/about-us",                   hard: false },
      { label: "Accreditation",  to: "/accreditation-and-partners", hard: false },
      { label: "Scholarships",   to: "/scholarship",                hard: false },
      // The journal is server-rendered by PHP at /blog (not a React route), so
      // it must be a hard link — a client-side <Link> would hit the SPA 404.
      { label: "Journal",        to: "/blog",                       hard: true },
      { label: "FAQs",           to: "/faqs",                       hard: false },
      { label: "Contact",        to: "/contact-us",                 hard: false },
    ],
    programmesHeading: "Programmes",
    programmeLinks: [
      { label: "Programmes & Diplomas",         to: "/programmes",                            hard: false },
      { label: "All Courses",                   to: "/courses",                               hard: false },
      { label: "Walsh College",                 to: "/partners/walsh-college",                hard: false },
      { label: "PPA Business School",           to: "/partners/ppa-business-school",          hard: false },
      { label: "eie European Business School",  to: "/program/european-business-school-eie", hard: false },
      { label: "Qualifi Diplomas",              to: "/partners/qualifi",                      hard: false },
    ],
    infoHeading: "Information",
    addressLines: ["Office 249, Titan Court", "3 Bishop Square, Hatfield", "Hertfordshire, AL10 9NA"],
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/join_uecampus/" },
      { label: "Facebook",  href: "https://www.facebook.com/p/UeCampus-61572906104101/" },
      { label: "LinkedIn",  href: "https://uk.linkedin.com/company/uecampus" },
    ],
    copyright: "UeCampus Ltd. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy",   to: "#" },
      { label: "Terms of Service", to: "#" },
      { label: "Cookies",          to: "#" },
      { label: "Data Deletion",    to: "#" },
    ],
  },
};

/** Blank items the editor inserts for "Add" on lists whose default is empty. */
export const SITE_TEMPLATES = {
  "nav.items":          { label: "", to: "", children: [] },
  "nav.items.children": { label: "", to: "", desc: "" },
  "footer.socials":     { label: "", href: "" },
};

export const SITE_LABELS: Record<string, string> = {
  "nav.items":       "Menu items",
  "nav.items.to":    "Link (path)",
  "header.portalUrl": "Student Portal URL",
  "footer.platformLinks": "Platform column links",
  "footer.programmeLinks": "Programmes column links",
  "footer.addressLines": "Address (one line per entry)",
  "footer.socials": "Social profiles (icon picked by name: Instagram, Facebook, LinkedIn, X, YouTube, TikTok)",
  hard: "Full page load (for pages outside the app, e.g. /blog)",
};
