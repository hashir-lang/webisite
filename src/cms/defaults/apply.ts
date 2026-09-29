/**
 * Editable copy for the enquiry / application form (src/pages/Apply.tsx,
 * useContent("apply")). Every string here can be changed or blanked at
 * /admin/pages/apply.
 *
 * The form always has three steps (details → programme → review); the
 * `steps.items` list only names them, so keep three entries. The programme
 * picker's options come from the courses data, not from here. The
 * qualification and intake lists are the exact values sent with an enquiry.
 */
export const APPLY_DEFAULTS = {
  hero: {
    eyebrow: "Chapter 07 / Admissions",
    eyebrowRight: "Apply",
    title: "Start Your",
    titleAccent: "Application",
    intro:
      "A few short steps. No fees to apply, and a dedicated advisor to guide you from enquiry to enrolment.",
  },
  steps: {
    eyebrow: "Application",
    stepLabel: "Step",
    items: [
      { label: "Your details" },
      { label: "Your programme" },
      { label: "Review & submit" },
    ],
    resumeBefore: "Already started? Email",
    resumeEmail: "info@uecampus.com",
    resumeAfter: "and we’ll pick up where you left off.",
  },
  form: {
    eyebrow: "Application",
    details: {
      title: "Tell us about you.",
      hint: "The basics so an advisor can reach you.",
      firstNameLabel: "First name",
      lastNameLabel: "Last name",
      emailLabel: "Email address",
      phoneLabel: "Phone",
      countryLabel: "Country of residence",
    },
    programme: {
      title: "Choose your programme.",
      hint: "Pick a course and tell us about your background.",
      programmeLabel: "Programme",
      programmePlaceholder: "Select a programme",
      qualificationLabel: "Highest qualification",
      intakeLabel: "Preferred intake",
      selectPlaceholder: "Select one",
      qualifications: [
        "High school / Secondary",
        "Diploma / Certificate",
        "Bachelor's degree",
        "Master's degree",
        "Doctorate",
        "Professional qualification",
        "Other",
      ],
      intakes: ["September 2026", "March 2026", "January 2027", "Not sure yet"],
      notesLabel: "Anything we should know? (optional)",
      notesPlaceholder: "Questions, background, or anything relevant to your application.",
    },
    review: {
      title: "Review your application.",
      hint: "Check everything looks right before you submit.",
      nameLabel: "Name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      countryLabel: "Country",
      programmeLabel: "Programme",
      qualificationLabel: "Qualification",
      intakeLabel: "Intake",
      notesLabel: "Notes",
      emptyValue: "—",
      consentText:
        "I agree to UeCampus contacting me about my application and consent to my details being processed for admissions purposes.",
      consentError: "Please confirm to submit your application.",
    },
    errors: {
      required: "This field is required",
      email: "Enter a valid email address",
      select: "Please make a selection",
    },
    backLabel: "Back",
    continueLabel: "Continue",
    submitLabel: "Submit application",
    submittingLabel: "Submitting…",
    talkPrompt: "Prefer to talk first?",
    talkLink: "Contact admissions",
  },
  messages: {
    errorTitle: "Something went wrong",
    errorDescription:
      "We couldn't submit your application just now. Please try again, or email info@uecampus.com.",
  },
};
