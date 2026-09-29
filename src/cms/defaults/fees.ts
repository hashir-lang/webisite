/**
 * Editable copy for the Tuition & Fees page (src/pages/Fees.tsx,
 * useContent("fees")). Every string here can be changed, blanked or — for the
 * lists — added to, removed and reordered at /admin/pages/fees.
 *
 * The fee tables are content too: each partner has its own rows, and each
 * row's `fee` is a plain number (formatted with `currency` and thousands
 * separators in code).
 */
export const FEES_DEFAULTS = {
  hero: {
    eyebrow: "Chapter 06 / Investment",
    eyebrowRight: "Tuition & Fees",
    title: "Tuition &",
    titleAccent: "Fees",
    intro:
      "Transparent, all-in programme fees across our partner institutions, no hidden costs, flexible payment plans available.",
  },
  tables: {
    eyebrow: "By partner institution",
    title: "What you’ll",
    titleAccent: "invest",
    intro:
      "Fees below are the full programme cost. Scholarships can reduce these substantially, speak with admissions to confirm eligibility.",
    currency: "£",
    programmeColumn: "Programme",
    awardColumn: "Award",
    feeColumn: "Fee",
    partners: [
      {
        name: "Walsh College",
        blurb: "US-accredited business degrees, delivered 100% online and on campus.",
        rows: [
          { level: "Bachelor’s", award: "Undergraduate degree", fee: 12000 },
          { level: "Master’s",   award: "Postgraduate degree",  fee: 8000 },
          { level: "PhD",        award: "Doctoral degree",      fee: 20000 },
        ],
      },
      {
        name: "eie",
        blurb: "European-accredited programmes with flexible entry.",
        rows: [
          { level: "Bachelor’s", award: "Undergraduate degree", fee: 6500 },
          { level: "Master’s",   award: "Postgraduate degree",  fee: 6000 },
        ],
      },
      {
        name: "PPA Business School",
        blurb: "French business school qualifications, online.",
        rows: [
          { level: "Bachelor’s", award: "Undergraduate degree", fee: 8000 },
          { level: "Master’s",   award: "Postgraduate degree",  fee: 6500 },
        ],
      },
    ],
  },
  cta: {
    title: "Questions about fees or",
    titleAccent: "payment plans",
    body:
      "Our admissions team can walk you through instalment options, scholarships and everything included in your programme fee.",
    primaryLink: "Enquire now",
    secondaryLink: "View scholarships",
  },
};
