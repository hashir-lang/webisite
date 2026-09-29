/**
 * Editable copy for the FAQs page (src/pages/FAQs.tsx, useContent("faqs")).
 * Every string here can be changed or blanked at /admin/pages/faqs. Topics
 * (categories) and the questions inside each can be added to, removed and
 * reordered; the numbering on the page is computed from the order.
 *
 * Every question and answer is also emitted as FAQPage structured data, so
 * search engines can show them as rich results.
 */
export const FAQS_DEFAULTS = {
  hero: {
    eyebrow: "Help Centre",
    eyebrowRight: "FAQs",
    title: "Frequently Asked",
    titleAccent: "Questions",
    intro:
      "Everything you need to know about studying with UeCampus, from admissions and fees to how your qualification is recognised worldwide.",
  },
  browse: {
    eyebrow: "Browse by topic",
    categories: [
      {
        label: "General",
        items: [
          { question: "What is UeCampus?", answer: "UeCampus is an online platform offering a wide range of internationally recognised courses and degrees, delivered in partnership with leading universities and awarding bodies, to help you advance your career from anywhere in the world." },
          { question: "Where is UeCampus based?", answer: "Our head office is in Hatfield, Hertfordshire, UK. We support students remotely in more than 90 countries." },
          { question: "How is UeCampus different from a traditional university?", answer: "We deliver fully online, flexible programmes in partnership with recognised universities and awarding bodies, at a fraction of the cost of traditional study, with no need to relocate." },
        ],
      },
      {
        label: "Admissions",
        items: [
          { question: "How do I enrol in a course?", answer: "You can enrol in any course directly from our website by creating an account, choosing your programme, and completing the application. Our admissions team will guide you through every step." },
          { question: "Can I transfer credit hours from another institution?", answer: "Yes. We allow credit-hour transfers, subject to an evaluation of your prior qualifications by the awarding body." },
          { question: "Do I need to take an English proficiency test?", answer: "This depends on the programme and partner institution. Some require IELTS or TOEFL; others accept alternative qualifications or prior study in English." },
          { question: "When can I start?", answer: "Most programmes have flexible intakes, you can apply at any time and start as soon as your enrolment is confirmed." },
        ],
      },
      {
        label: "Fees & Scholarships",
        items: [
          { question: "How much do courses cost?", answer: "Fees vary by programme and partner institution. Tuition is published on each course page, and payment plans are available." },
          { question: "What financial aid or scholarships are available?", answer: "UeCampus offers a range of scholarships, discounts, and promotional tuition offers. Full details are on our Scholarships page." },
          { question: "Can I pay in instalments?", answer: "Yes. Most programmes support monthly or term-based instalment plans, speak to our admissions team for options." },
        ],
      },
      {
        label: "Learning Experience",
        items: [
          { question: "Is there a mobile app for studying?", answer: "Yes. UeCampus offers a mobile app so you can attend classes, track progress, and stay in touch with tutors on the go." },
          { question: "How are classes delivered?", answer: "Programmes are delivered fully online through a mix of live sessions, recorded lectures, guided readings, and interactive assessments." },
          { question: "Will I have tutor support?", answer: "Yes. Every programme includes academic tutors, a dedicated student success manager, and peer study groups." },
        ],
      },
      {
        label: "Recognition",
        items: [
          { question: "Are the degrees recognised globally?", answer: "Yes. All qualifications are delivered with accredited universities or regulated awarding bodies, so they are recognised by employers and institutions internationally." },
          { question: "Can I use a UeCampus qualification to apply for further study?", answer: "Absolutely. Our diplomas ladder into bachelor's and master's degrees, and our degrees are accepted for postgraduate progression worldwide." },
        ],
      },
      {
        label: "Privacy & Support",
        items: [
          { question: "How do I contact support?", answer: "You can reach us at info@uecampus.com, on +44 7586 797014, or via the WhatsApp button on every page." },
          { question: "How is my data handled?", answer: "Your data is processed in line with our Privacy Policy and UK GDPR. You can request data deletion at any time from our Data Deletion page." },
        ],
      },
    ],
  },
  cta: {
    eyebrow: "Beyond the FAQ",
    title: "Still have",
    titleAccent: "questions",
    body:
      "Our admissions team is happy to help. Reach out by email, phone or WhatsApp, we’ll get back to you within one working day.",
    contactLabel: "Contact us",
    email: "info@uecampus.com",
  },
};
