/**
 * Editable copy shared by every partner page (/partners/<slug>,
 * src/pages/PartnerDetail.tsx, useContent("partnerDetail")). Editable at
 * /admin/pages/partnerDetail.
 *
 * Only the page's own wording lives here. Each partner's name, summary,
 * paragraphs, highlights and facts come from src/data/partners.ts; the related
 * programmes come from src/data/courses.ts.
 *
 * Tokens replaced in code:
 *   `{name}`      the partner's full name
 *   `{shortName}` the partner's short name (e.g. "Walsh")
 *   `{shown}`     how many related programmes are listed on the page
 *   `{total}`     how many programmes the partner delivers in all
 */
export const PARTNER_DETAIL_DEFAULTS = {
  hero: {
    backLink: "Accreditation & Partners",
    logoAlt: "{name} logo",
  },
  about: {
    eyebrow: "About the partner",
  },
  related: {
    eyebrow: "Study with {shortName}",
    title: "Programmes delivered",
    /** Followed by the partner's short name in italics, then a full stop. */
    titleLine2: "with",
    /** Shown when every related programme fits on the page. */
    introAll: "Accredited programmes offered in partnership with {name}.",
    /** Shown when only the first few related programmes are listed. */
    introSome: "Showing {shown} of {total} accredited programmes offered in partnership with {name}.",
    cardLink: "View programme",
    showAllButton: "View {shortName} in the programme finder",
    showMoreButton: "Show more — all {total} {shortName} programmes",
  },
  cta: {
    eyebrow: "Take the next step",
    title: "A qualification",
    titleAccent: "that opens doors",
    button: "Enquire now",
  },
  notFound: {
    eyebrow: "404",
    title: "Partner not found",
    body: "We couldn’t find the partner you were looking for.",
    backLink: "Back to all partners",
  },
};
