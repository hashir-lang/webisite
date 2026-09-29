/**
 * Editable copy for the Programmes catalogue (src/pages/Programmes.tsx,
 * useContent("programmes")). The same component also renders /courses (via
 * src/pages/Courses.tsx), which swaps in the `coursesHero` fields.
 *
 * Only the page's own wording lives here. The programmes themselves, and the
 * filter options (study levels, subjects, awarding bodies) that match against
 * them, come from src/data/courses.ts and stay in code.
 *
 * `{count}` in a string is replaced with the number of matching courses;
 * `{date}` with the programme's next intake.
 */
export const PROGRAMMES_DEFAULTS = {
  hero: {
    eyebrow: "Chapter 03 / The catalogue",
    eyebrowRight: "Programmes",
    title: "Programme",
    titleAccent: "Catalogue",
    intro:
      "Explore our full catalogue of flexible, career-focused online programmes, awarded by partner institutions and awarding bodies.",
  },
  /** Overrides used when the catalogue is shown at /courses. */
  coursesHero: {
    eyebrowRight: "All Courses",
    title: "Explore Our Online",
    titleAccent: "Programmes",
  },
  filters: {
    heading: "Filter",
    clearAll: "Clear all",
    levelTitle: "Study Level",
    subjectTitle: "Subject",
    awardingTitle: "Awarding Bodies",
    mobileButton: "Filters",
    mobileHeading: "Filters",
    mobileClose: "Close filters",
    mobileShowResults: "Show {count} results",
  },
  search: {
    placeholder: "Find your course",
    countOne: "{count} course",
    countMany: "{count} courses",
  },
  list: {
    nextIntake: "Next intake · {date}",
    detailsLink: "Course details",
  },
  empty: {
    title: "No courses match.",
    body: "Try clearing some filters or adjusting your search.",
    button: "Clear all filters",
  },
};
