/**
 * Editable copy for the Contact page (src/pages/Contact.tsx, useContent("contact")).
 * Every string here can be changed or blanked — and the lists added to,
 * removed and reordered — at /admin/pages/contact.
 *
 * The contact channel cards keep their link (`href`) alongside the wording;
 * the icon on each card is picked in code from that link (mailto → envelope,
 * tel → phone, WhatsApp → chat bubble, maps → pin).
 */
export const CONTACT_DEFAULTS = {
  hero: {
    eyebrow: "Chapter 06 / Get in touch",
    eyebrowRight: "Contact",
    title: "Contact Our Admissions",
    titleAccent: "Team",
    intro:
      "Questions about courses, admissions, scholarships, or current studies? The UeCampus team is ready to help.",
  },
  channels: {
    items: [
      {
        label: "Email",
        primary: "info@uecampus.com",
        note: "General enquiries · admissions · support",
        href: "mailto:info@uecampus.com",
      },
      {
        label: "Phone",
        primary: "+44 7586 797014",
        note: "Mon - Fri · 9:00 to 18:00 (GMT)",
        href: "tel:+447586797014",
      },
      {
        label: "WhatsApp",
        primary: "Open chat",
        note: "Real-time replies within working hours",
        href: "https://wa.me/447586797014",
      },
      {
        label: "Mailing address",
        primary: "Hatfield, UK",
        note: "Office 249, Titan Court · AL10 9NA",
        href: "https://www.google.com/maps/search/?api=1&query=Office+249%2C+Titan+Court%2C+3+Bishop+Square%2C+Hatfield",
      },
    ],
  },
  note: {
    eyebrow: "A note from us",
    title: "We answer",
    titleAccent: "every note",
    body:
      "No bots, no autoresponders that pretend to be people. Just our admissions team, with answers, usually within one working day, often sooner.",
    addressLines: ["Office 249, Titan Court", "3 Bishop Square, Hatfield", "Hertfordshire, AL10 9NA, UK"],
  },
  form: {
    eyebrow: "Write to us",
    title: "Tell us what you’re thinking.",
    nameLabel: "Full name",
    emailLabel: "Email address",
    phoneLabel: "Phone (optional)",
    subjectLabel: "Subject",
    messageLabel: "Message",
    requiredError: "This field is required",
    emailError: "Enter a valid email address",
    phoneError: "Enter a valid phone number",
    messageError: "Please write your message",
    submitLabel: "Send message",
    submittingLabel: "Sending…",
  },
  messages: {
    sentTitle: "Message sent",
    sentDescription: "Our admissions team will get back to you shortly.",
    duplicateTitle: "We already have this message",
    duplicateDescription: "You've sent this once already — no need to resend. We'll be in touch shortly.",
    errorTitle: "Something went wrong",
    errorDescription: "We couldn't send your message just now. Please try again, or email info@uecampus.com.",
  },
};
