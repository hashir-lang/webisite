// Partner / awarding-body directory. Drives the partner detail pages
// (/partners/<slug>), the homepage "In partnership with" marquee, and the
// footer links. Each partner's `universityPattern` matches the `university`
// field on courses in src/data/courses.ts, so a partner page can list the
// programmes delivered with that institution without duplicating any data.

import eieLogo     from "@/assets/partner-eie-exact.jpg";
import ppaLogo     from "@/assets/partner-ppa-exact-cropped.png";
import walshLogo   from "@/assets/partner-walsh.png";
import qualifiLogo from "@/assets/partner-qualifi-exact.png";
import eduqualLogo from "@/assets/partner-eduqual-exact.png";

export type Partner = {
  slug: string;
  /** Full display name. */
  name: string;
  /** Short label used in tight spaces (marquee caption, breadcrumbs). */
  shortName: string;
  logo: string;
  /** How much vertical room the logo needs on the detail page. */
  logoClass: string;
  place: string;
  tagline: string;
  /** One-line summary used for listings and meta descriptions. */
  summary: string;
  /** Full description, one entry per paragraph. */
  about: string[];
  /** Short factual highlights shown as a bulleted list. */
  highlights: string[];
  /** Label/value facts shown in the side panel. */
  facts: { label: string; value: string }[];
  /** Accreditation, regulation and recognition points shown in their own section. */
  recognition: { title: string; detail: string }[];
  /**
   * Awarding-body filter values (each matches a Course.universityShort). Used
   * to list this partner's programmes on the detail page AND to deep-link into
   * /programmes?uni=… with the partner pre-selected in the filters. An empty
   * array means no catalogue entries yet (e.g. EduQual).
   */
  programmeFilter: string[];
  /**
   * Public URL for this partner's detail page. Defaults to /partners/<slug>;
   * set only when a partner has a custom canonical path (e.g. EIE).
   */
  url?: string;
};

export const partners: Partner[] = [
  {
    slug: "eie",
    name: "eie European Business School",
    shortName: "eie",
    logo: eieLogo,
    logoClass: "max-h-16",
    place: "St Julian's, Malta",
    tagline: "European Institute of Executives",
    summary:
      "A Malta-based European business school delivering professionally-focused bachelor's, master's and MBA programmes designed around the skills employers demand.",
    about: [
      "eie European Business School is a European institution based in St Julian's, Malta, delivering career-focused higher education across business, management and finance. Its programmes are built around the practical skills employers look for, so graduates leave ready to contribute from day one.",
      "Through UeCampus, eie's bachelor's, master's and MBA programmes are available to study fully online, giving students across the world access to a European qualification without relocating.",
      "The school's teaching model blends academic rigour with applied, industry-relevant learning — case studies, real-world projects and assessment designed to mirror the demands of modern workplaces.",
    ],
    highlights: [
      "European business school based in Malta, EU",
      "Career-focused bachelor's, master's and MBA programmes",
      "Delivered fully online in partnership with UeCampus",
      "Applied, employer-aligned curriculum",
    ],
    facts: [
      { label: "Location", value: "St Julian's, Malta, EU" },
      { label: "Focus", value: "Business, management & finance" },
      { label: "Delivery", value: "100% online via UeCampus" },
      { label: "Awards", value: "Bachelor's, Master's, MBA" },
    ],
    recognition: [
      { title: "European higher education", detail: "A higher-education institution based in Malta, an EU member state, operating within the European higher-education area." },
      { title: "Career-focused awards", detail: "Confers bachelor's, master's and MBA awards designed around employer-relevant skills and recognised across Europe and beyond." },
      { title: "Quality-assured delivery", detail: "Programmes are delivered with academic oversight and external review to maintain the standard of every award." },
    ],
    programmeFilter: ["eie Business School"],
    url: "/program/european-business-school-eie",
  },
  {
    slug: "ppa-business-school",
    name: "PPA Business School",
    shortName: "PPA",
    logo: ppaLogo,
    logoClass: "max-h-20",
    place: "Paris, France",
    tagline: "La Grande École en Alternance",
    summary:
      "A Paris-based grande école offering work-integrated bachelor and master programmes across business, marketing and management.",
    about: [
      "PPA Business School (Pôle Paris Alternance) is a Paris-based grande école known for its work-integrated model that pairs academic study with real professional experience.",
      "Its bachelor and master programmes span business, marketing, management and related fields, all designed to keep students close to the realities of the industries they are preparing to enter.",
      "In partnership with UeCampus, PPA programmes are offered online, extending the school's applied, employability-first approach to students who study remotely.",
    ],
    highlights: [
      "Paris grande école with a work-integrated (alternance) model",
      "Bachelor and master programmes in business & management",
      "Strong emphasis on employability and applied learning",
      "Available online through UeCampus",
    ],
    facts: [
      { label: "Location", value: "Paris, France" },
      { label: "Focus", value: "Business, marketing & management" },
      { label: "Delivery", value: "100% online via UeCampus" },
      { label: "Awards", value: "Bachelor's, Master's" },
    ],
    recognition: [
      { title: "French grande école", detail: "A recognised Paris business school operating within the French higher-education system." },
      { title: "Professionally-registered titles", detail: "Many PPA titles are registered on France's national register of professional certifications (RNCP)." },
      { title: "Work-integrated model", detail: "Programmes follow the French 'alternance' model, pairing academic study with real professional placements." },
    ],
    programmeFilter: ["PPA"],
  },
  {
    slug: "walsh-college",
    name: "Walsh College",
    shortName: "Walsh",
    logo: walshLogo,
    logoClass: "max-h-14",
    place: "Michigan, United States",
    tagline: "Business-focused higher education",
    summary:
      "A US institution offering accredited business, technology and accounting degrees with a strong emphasis on applied learning and career outcomes.",
    about: [
      "Walsh College is a US higher-education institution based in Michigan, specialising in business, technology and accounting. It is known for practical, career-oriented degrees taught by faculty with real industry experience.",
      "Walsh is institutionally accredited by the Higher Learning Commission (HLC), and its business programmes are accredited by the Accreditation Council for Business Schools and Programs (ACBSP) — marks of quality recognised across the United States and internationally.",
      "Through UeCampus, Walsh College degrees are available to study online, giving international students access to an accredited American qualification with a strong focus on employability.",
    ],
    highlights: [
      "US institution based in Michigan",
      "Institutionally accredited by the Higher Learning Commission (HLC)",
      "Business programmes accredited by ACBSP",
      "Accredited online degrees via UeCampus",
    ],
    facts: [
      { label: "Location", value: "Michigan, United States" },
      { label: "Focus", value: "Business, technology & accounting" },
      { label: "Accreditation", value: "HLC · ACBSP" },
      { label: "Delivery", value: "100% online via UeCampus" },
    ],
    programmeFilter: ["Walsh College Direct", "Walsh College"],
  },
  {
    slug: "qualifi",
    name: "Qualifi",
    shortName: "Qualifi",
    logo: qualifiLogo,
    logoClass: "max-h-16",
    place: "Ofqual-regulated, UK",
    tagline: "UK awarding organisation",
    summary:
      "A UK awarding organisation regulated by Ofqual, offering Level 3-7 diplomas used as pathways to full undergraduate and postgraduate degrees.",
    about: [
      "Qualifi is a UK awarding organisation regulated by Ofqual, the Office of Qualifications and Examinations Regulation. It designs and awards vocational qualifications recognised across the UK and internationally.",
      "Qualifi's Level 2 to Level 7 diplomas are widely used as progression pathways: learners can build credentials step by step and use a diploma to enter — or gain advanced standing into — a full bachelor's or master's degree.",
      "Through UeCampus, Qualifi diplomas are delivered online, offering a flexible, affordable route into higher-level study and professional advancement.",
    ],
    highlights: [
      "UK awarding organisation regulated by Ofqual",
      "Level 2-7 diplomas across business, IT, cyber security and more",
      "Recognised progression pathways into degrees",
      "Delivered online through UeCampus",
    ],
    facts: [
      { label: "Regulator", value: "Ofqual (UK)" },
      { label: "Focus", value: "Vocational diplomas, Levels 2-7" },
      { label: "Use", value: "Pathways into degrees" },
      { label: "Delivery", value: "100% online via UeCampus" },
    ],
    programmeFilter: ["Qualifi"],
  },
  {
    slug: "eduqual",
    name: "EduQual",
    shortName: "EduQual",
    logo: eduqualLogo,
    logoClass: "max-h-16",
    place: "Scotland, UK",
    tagline: "Scottish awarding body",
    summary:
      "A UK awarding body offering regulated qualifications benchmarked to recognised credit frameworks, used as pathways into higher-level study.",
    about: [
      "EduQual is a UK awarding body that develops and awards regulated qualifications benchmarked against recognised credit and qualification frameworks.",
      "Its awards are designed as progression pathways, giving learners a structured route toward undergraduate and postgraduate study while building practical, employment-relevant skills.",
      "In partnership with UeCampus, EduQual qualifications are delivered online, providing a flexible and accessible entry point into higher education.",
    ],
    highlights: [
      "UK awarding body",
      "Regulated qualifications benchmarked to recognised frameworks",
      "Progression pathways into higher-level study",
      "Delivered online through UeCampus",
    ],
    facts: [
      { label: "Location", value: "Scotland, UK" },
      { label: "Focus", value: "Regulated qualifications & pathways" },
      { label: "Use", value: "Progression into degrees" },
      { label: "Delivery", value: "100% online via UeCampus" },
    ],
    programmeFilter: [],
  },
];

export const partnersBySlug: Record<string, Partner> = Object.fromEntries(
  partners.map((p) => [p.slug, p]),
);

/** Public URL for a partner's detail page (custom `url` or /partners/<slug>). */
export const partnerHref = (p: Partner): string => p.url ?? `/partners/${p.slug}`;
