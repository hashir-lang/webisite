/**
 * Editable copy for the post-enquiry Thank-you page (src/pages/ThankYou.tsx,
 * useContent("thankYou")). Every string here can be changed or blanked — and
 * the "what happens next" steps added to, removed and reordered — at
 * /admin/pages/thankYou.
 *
 * The headline gets the applicant's first name appended in code
 * ("Thank you, Amira") when the form passed one along.
 */
export const THANK_YOU_DEFAULTS = {
  hero: {
    eyebrow: "Chapter 07 / Admissions",
    eyebrowRight: "Received",
    logoAlt: "UeCampus",
    title: "Thank you",
    intro:
      "Your enquiry has reached our admissions team. A dedicated advisor will be in touch within one working day to guide you through the next steps.",
  },
  next: {
    eyebrow: "What happens next",
    items: [
      { title: "We review your enquiry", desc: "An admissions advisor checks your details and chosen programme." },
      { title: "We reach out",           desc: "Expect a call or email within one working day to discuss your goals." },
      { title: "You enrol",              desc: "Once everything's confirmed, you'll get access to the student portal." },
    ],
    homeLabel: "Back to home",
    programmesLabel: "Explore programmes",
    undoBefore: "Didn’t mean to submit? Email",
    undoEmail: "info@uecampus.com",
    undoAfter: "and we’ll help.",
  },
};
