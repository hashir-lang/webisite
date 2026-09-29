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
    title: "What you'll",
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
          { level: "Bachelor's", award: "Undergraduate degree", fee: 12000 },
          { level: "Master's",   award: "Postgraduate degree",  fee: 8000 },
          { level: "PhD",        award: "Doctoral degree",      fee: 20000 },
        ],
      },
      {
        name: "eie",
        blurb: "European-accredited programmes with flexible entry.",
        rows: [
          { level: "Bachelor's", award: "Undergraduate degree", fee: 6500 },
          { level: "Master's",   award: "Postgraduate degree",  fee: 6000 },
        ],
      },
      {
        name: "PPA Business School",
        blurb: "French business school qualifications, online.",
        rows: [
          { level: "Bachelor's", award: "Undergraduate degree", fee: 8000 },
          { level: "Master's",   award: "Postgraduate degree",  fee: 6500 },
        ],
      },
    ],
  },
  comparison: {
    eyebrow: "Programme overview",
    title: "Compare",
    titleAccent: "programmes",
    intro:
      "Total programme costs in GBP, inclusive of tuition, study materials, and platform access. All programmes are delivered 100% online.",
    browseLink: "Browse all programmes",
    headers: {
      programme: "Programme",
      duration: "Duration",
      totalFee: "Total Fee",
      perModule: "Per Module",
      awardingBody: "Awarding Body",
    },
    rows: [
      {
        programme: "BSc Cyber Security",
        duration: "3 years",
        totalFee: 6500,
        perModule: 500,
        awardingBody: "eie",
      },
      {
        programme: "BSc Business & Management",
        duration: "3 years",
        totalFee: 12000,
        perModule: 923,
        awardingBody: "Walsh College",
      },
      {
        programme: "MBA International Business",
        duration: "18 months",
        totalFee: 8000,
        perModule: 1000,
        awardingBody: "PPA Business School",
      },
      {
        programme: "MSc Data Science & AI",
        duration: "18 months",
        totalFee: 8000,
        perModule: 1000,
        awardingBody: "Walsh College",
      },
      {
        programme: "PhD Business Leadership",
        duration: "3–4 years",
        totalFee: 20000,
        perModule: 2500,
        awardingBody: "Walsh College",
      },
    ],
  },
  whatIsIncluded: {
    eyebrow: "Your fee covers",
    title: "What's",
    titleAccent: "included",
    intro:
      "Every UeCampus programme fee is all-inclusive — there are no surprise extras once you enrol.",
    items: [
      {
        heading: "Full platform access",
        body: "Unlimited access to the UeCampus learning environment, including lecture recordings, live session replays, and collaborative tools, for the full duration of your programme.",
      },
      {
        heading: "Digital study materials",
        body: "All required textbooks, case studies, and reading packs are provided in digital format — no additional textbook costs.",
      },
      {
        heading: "Tutor & academic support",
        body: "Dedicated academic tutors offer weekly live sessions, asynchronous Q&A, and assignment feedback throughout each module.",
      },
      {
        heading: "Assessment & certification",
        body: "Examination registration, marking, and the final award certificate from the awarding institution are all included in your programme fee.",
      },
    ],
  },
  howToPay: {
    eyebrow: "Payment options",
    title: "How to",
    titleAccent: "pay",
    intro:
      "We offer flexible payment plans to make your degree as accessible as possible.",
    options: [
      {
        heading: "Pay in full",
        body: "Pay the complete programme fee upfront and receive a 5% early-payment discount. Ideal for employer-sponsored students.",
      },
      {
        heading: "Per-module instalments",
        body: "Pay module-by-module as you progress. Payments are due 14 days before each module begins. No interest, no credit checks required.",
      },
      {
        heading: "Monthly payment plan",
        body: "Spread the cost over the full programme duration in equal monthly payments. Available for programmes of 18 months or longer.",
      },
      {
        heading: "Employer sponsorship",
        body: "We invoice corporate sponsors directly and can provide a sponsorship letter template on request. Contact admissions with your employer's details to arrange an agreement.",
      },
    ],
    note:
      "Payments are accepted in GBP, USD, and EUR. Merit-based scholarships of up to 30% are available for eligible students.",
    scholarshipLink: "View scholarships",
  },
  whyCompetitive: {
    eyebrow: "Value for money",
    title: "Why our fees are",
    titleAccent: "competitive",
    body:
      "According to HESA 2023/24 data, the average postgraduate taught fee in the UK is £9,000–£14,000 per year. UeCampus master's programmes start from £6,000 total — making them among the most affordable internationally accredited online degrees available to UK and international students.",
    stats: [
      {
        figure: "Up to 60% less",
        description:
          "Online degrees from UeCampus cost up to 60% less than equivalent on-campus programmes in the UK, based on HESA 2023/24 average tuition fee data.",
      },
      {
        figure: "No campus overhead",
        description:
          "100% online delivery eliminates accommodation, commuting, and on-campus service fees — costs that typically add thousands to a traditional degree.",
      },
      {
        figure: "Same credential",
        description:
          "Awards are conferred by the same internationally recognised institutions whether you study online or on campus. You graduate with an identical qualification.",
      },
    ],
  },
  faq: {
    eyebrow: "Common questions",
    title: "Fees",
    titleAccent: "FAQ",
    items: [
      {
        question: "Can I pay in instalments?",
        answer:
          "Yes. You can pay module-by-module as you progress, or set up a monthly payment plan for the full programme duration. There is no interest and no credit check required for either option.",
      },
      {
        question: "What is the refund policy if I withdraw?",
        answer:
          "You may withdraw within 14 days of enrolment for a full refund under the cooling-off period. After that, fees already paid for completed modules are non-refundable, but any future module fees will not be charged.",
      },
      {
        question: "Can I pay in a currency other than GBP?",
        answer:
          "Yes. Payments are accepted in GBP, USD, and EUR. Exchange rates are locked at the date of invoice. Bank transfer, credit card, and debit card are all accepted.",
      },
      {
        question: "Can my employer pay on my behalf?",
        answer:
          "Yes. We can invoice your employer directly and agree a payment schedule that fits their procurement cycle. Contact admissions with your employer's details to arrange a corporate sponsorship agreement.",
      },
      {
        question: "Are scholarships available to reduce my fees?",
        answer:
          "Yes. Merit-based and needs-based scholarships of up to 30% are available for eligible students. Visit our scholarships page to check your eligibility and submit an application before enrolment.",
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
