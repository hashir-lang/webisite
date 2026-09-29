/**
 * Editable copy shared by every programme page (/programmes/<slug>,
 * src/pages/CourseDetail.tsx, useContent("courseDetail")). Editable at
 * /admin/pages/courseDetail.
 *
 * Only the page's own wording lives here. Each programme's title, overview,
 * modules, entry requirements, career outcomes, fees and so on come from
 * src/data/courses.ts (and src/data/course-units.json) and stay in code.
 *
 * `{name}` in a string is replaced with the programme's title.
 */
export const COURSE_DETAIL_DEFAULTS = {
  hero: {
    breadcrumbHome: "Home",
    breadcrumbProgrammes: "Programmes",
    eyebrowRight: "Brief",
    /** Muted suffix after the programme title in the headline. */
    titleSuffix: "(Online)",
    factDuration: "Duration",
    factLanguage: "Language",
    factQualification: "Qualification",
    factAccessibility: "Accessibility",
  },
  accreditation: {
    eyebrow: "Accredited by",
    note:
      "Take the first step towards a globally recognised qualification. Enquire now for personalised guidance, programme details, and admissions support from our team.",
    applyButton: "Apply now",
    contactButton: "Talk to admissions",
  },
  /** Tab labels. A blank label hides that tab. */
  tabs: {
    overview: "Overview",
    admissions: "Admissions",
    academics: "Units/Modules",
    careers: "Careers",
    payment: "Payment Plan",
  },
  overview: {
    eyebrow: "Overview",
    title: "What this programme is.",
    specialisationsEyebrow: "Specialisations",
    specialisationsTitle: "Pick a path within the programme.",
    gainsEyebrow: "What you’ll gain",
    gainsTitle: "Outcomes for graduates.",
  },
  admissions: {
    eyebrow: "Entry requirements",
    title: "How we assess applications.",
    intro: "We assess each application holistically. Below are the standard entry requirements for the {name}.",
    stepsEyebrow: "How to apply",
    stepsTitle: "Four steps from enquiry to enrolment.",
    /** The standard application steps; a programme with its own steps in the data overrides them. */
    steps: [
      { title: "Enquire",       desc: "Submit an enquiry so our admissions team can check your fit and answer your questions." },
      { title: "Apply",         desc: "Complete the short online application and upload your supporting documents." },
      { title: "Assessment",    desc: "An admissions advisor reviews your profile and confirms eligibility." },
      { title: "Offer & enrol", desc: "Accept your offer, select your intake, and activate your student portal access." },
    ],
    intakesEyebrow: "Intakes",
    intakesTitle: "When you can start.",
  },
  academics: {
    eyebrow: "Curriculum",
    title: "Programme structure.",
    intro:
      "The {name} is structured to build your expertise progressively, from foundations through to advanced application and capstone work.",
  },
  careers: {
    eyebrow: "Careers",
    title: "Where this programme can take you.",
    /** The standard careers paragraph; a programme with its own careers text in the data overrides it. */
    intro:
      "Graduates of the {name} are prepared for a range of senior, specialist and leadership roles across industries. Our careers team supports you with CV coaching, interview prep, and employer introductions.",
  },
  payment: {
    eyebrow: "Payment plans",
    title: "Flexible ways to pay.",
    intro:
      "We keep tuition manageable. Choose to pay in full or spread the cost across instalments — annually, semi-annually, quarterly, or monthly — with employer sponsorship supported where available. Our admissions team will confirm the exact options and amounts for the {name}.",
    feesLink: "View tuition & fees",
    /** The standard payment plans; a programme with its own plans in the data overrides them. */
    plans: [
      { title: "Pay in full",             desc: "Settle your tuition upfront at enrolment for the simplest experience — often with a small early-payment discount." },
      { title: "Annual instalments",      desc: "Split the cost into one payment per academic year of study." },
      { title: "Semi-annual instalments", desc: "Pay in two instalments each year, aligned to your study terms." },
      { title: "Quarterly instalments",   desc: "Spread your tuition across four payments per year." },
      { title: "Monthly instalments",     desc: "Break tuition into smaller monthly payments aligned to your intake." },
    ],
    tuitionEyebrow: "Tuition",
    tuitionTitle: "What it costs.",
    /** Label before the programme's fee in the badge ("Tuition · £…"). */
    tuitionBadge: "Tuition",
    tuitionContactLink: "Talk to admissions about payment",
  },
  sidebar: {
    benefitsEyebrow: "Programme highlight",
    benefitsTitle: "Key benefits",
    helpEyebrow: "Need help deciding?",
    helpTitle: "Our advisors can confirm eligibility and plan your intake.",
    helpLink: "Talk to admissions",
  },
  related: {
    eyebrow: "Continue browsing",
    title: "Related programmes.",
    allLink: "All programmes",
  },
  notFound: {
    eyebrow: "404",
    title: "Course not found",
    body: "We couldn’t find the programme you were looking for.",
    backLink: "Back to all programmes",
  },
};
