/**
 * Editable copy for the Scholarship page (src/pages/Scholarship.tsx,
 * useContent("scholarship")). Every string here can be changed, blanked or —
 * for the lists — added to, removed and reordered at /admin/pages/scholarship.
 */
export const SCHOLARSHIP_DEFAULTS = {
  hero: {
    eyebrow: "Chapter 05 / Financial aid",
    eyebrowRight: "Scholarships",
    title: "Scholarships & Financial",
    titleAccent: "Support",
    intro:
      "Financial aid options designed to help motivated students access world-class education, without the world-class debt.",
  },
  stats: {
    items: [
      { num: "36+",  title: "Total programmes" },
      { num: "4.9",  title: "Course rating" },
      { num: "100+", title: "Students" },
    ],
  },
  awards: {
    eyebrow: "Two pathways",
    title: "Awards,",
    titleAccent: "explained simply",
    intro:
      "Speak with admissions to confirm eligibility. Awards are subject to evaluation and limited each intake, apply early.",
    awardLabel: "Award",
    applyLink: "Apply now",
    items: [
      {
        title: "Academic Excellence",
        eligibility: "Open to high-performing secondary school graduates and top-ranking university students.",
        desc: "Awarded to outstanding students who demonstrate exceptional academic achievement. Eligible applicants may receive partial or full tuition support based on their academic performance and qualifications.",
        award: "Up to 50% tuition",
      },
      {
        title: "Residents of Developing Countries",
        eligibility: "For residents of regions with limited access to higher education.",
        desc: "Designed to support residents of developing countries with substantial tuition reductions. The award aims to empower talented individuals who are eager to advance their education and make a positive impact in their communities.",
        award: "Substantial tuition reduction",
      },
    ],
  },
};
