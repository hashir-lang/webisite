/**
 * Editable copy for the Accreditation & Partners page
 * (src/pages/Partners.tsx, useContent("partners")). Editable at
 * /admin/pages/partners.
 *
 * Only the page's own wording lives here. The partner profiles themselves
 * (names, places, taglines, descriptions and logos) are records kept in code,
 * and their links resolve through src/data/partners.ts.
 *
 * `{name}` in a string is replaced with the partner's name.
 */
export const PARTNERS_DEFAULTS = {
  hero: {
    eyebrow: "Chapter 04 / On accreditation",
    eyebrowRight: "Partners",
    title: "Our Accreditation &",
    titleAccent: "Partners",
    intro:
      "UeCampus partners with regulated awarding bodies and accredited universities to deliver degrees and diplomas recognised across the UK, Europe, and beyond.",
  },
  pillars: {
    eyebrow: "Why it matters",
    title: "Accreditation",
    titleLine2: "you can",
    titleAccent: "trust",
    intro:
      "Behind every UeCampus award is a regulated awarding body or accredited university. That’s the floor, not the ceiling.",
    items: [
      { title: "Regulated partners",   desc: "Every programme is delivered with a regulated awarding body or accredited higher-education institution." },
      { title: "Globally recognised",  desc: "Qualifications respected by employers, universities, and professional bodies worldwide." },
      { title: "Progression pathways", desc: "Our diplomas lead into full bachelor’s and master’s degrees, so you can build credentials step by step." },
      { title: "Quality assured",      desc: "Rigorous academic oversight, external examiners, and regular reviews ensure the integrity of every award." },
    ],
  },
  profiles: {
    eyebrow: "The partners",
    title: "Four institutions,",
    titleAccent: "one promise",
    intro:
      "Each partner was selected for its academic rigour, industry relevance, and commitment to inclusive, flexible online learning.",
    logoAlt: "{name} logo",
    logoLinkLabel: "{name} — partner details",
    viewLink: "View partner",
  },
  cta: {
    eyebrow: "Closing remarks",
    title: "A qualification",
    titleAccent: "that opens doors",
    link: "View programmes",
  },
};
