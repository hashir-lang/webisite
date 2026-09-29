/**
 * Editable copy for the 404 page (src/pages/NotFound.tsx, useContent("notFound")).
 * Every string here can be changed or blanked — and the suggested links added
 * to, removed and reordered — at /admin/pages/notFound.
 *
 * The body reads "<bodyBefore> <the missing path> <bodyAfter>"; the path
 * itself is filled in by the page.
 */
export const NOT_FOUND_DEFAULTS = {
  hero: {
    eyebrow: "Error 404 / The blank page",
    title: "We couldn’t",
    titleAccent: "find that page",
    bodyBefore: "The page at",
    bodyAfter: "didn’t exist, or has moved. A few places you might go next.",
  },
  links: {
    items: [
      { label: "Home",                     to: "/" },
      { label: "Programmes & Diplomas",    to: "/programmes" },
      { label: "Accreditation & Partners", to: "/accreditation-and-partners" },
      { label: "About UeCampus",           to: "/about-us" },
      { label: "Contact",                  to: "/contact-us" },
    ],
    returnLabel: "Return home",
  },
};
