/**
 * Site-wide overlays: the welcome sign-in popup, the cookie banner and the
 * support chatbot — including its whole FAQ knowledge base. Rendered by
 * src/components/SignInPopup.tsx, CookieConsent.tsx and Chatbot.tsx via
 * useContent("overlays"). Editable at /admin/pages/overlays.
 */
import { FAQ_DATA } from "@/chatbot/faqData";

export const OVERLAYS_DEFAULTS = {
  popup: {
    eyebrow: "Welcome to UeCampus",
    title: "Get the latest from",
    titleAccent: "UeCampus",
    body:
      "Get programmes, fees, payment plans and scholarships straight to your inbox, plus a programme spotlight every other day.",
    nameLabel: "Full name",
    emailLabel: "Email address",
    phoneLabel: "Phone number",
    phonePlaceholder: "+1 555 123 4567",
    nameError: "Please enter your name",
    emailError: "Enter a valid email address",
    phoneError: "Enter a valid phone number",
    submitError: "We couldn’t save your details just now. Please try again.",
    button: "Continue",
    buttonBusy: "Submitting…",
  },
  cookies: {
    eyebrow: "Your privacy",
    title: "We use cookies",
    body:
      "We use cookies to run this site, remember your preferences, and understand how it’s used so we can improve it. You can accept all cookies or continue with only the essential ones.",
    learnMore: "Learn more",
    accept: "Accept all cookies",
    decline: "Essential only",
  },
  chat: {
    launcher: "Chat with us",
    title: "Support",
    status: "Typically replies instantly",
    placeholder: "Ask about programmes, fees…",
    welcome:
      "Hi there! 👋 Welcome to <strong>UeCampus</strong> support. I can help with our programmes, fees, accreditation, and admissions. How can I help you today?",
    welcomeSuggestions: [
      "What programmes do you offer?",
      "What are the course fees?",
      "Are your degrees accredited?",
      "How do I apply?",
    ],
    noAnswer:
      "I couldn't find a specific answer for that. Try rephrasing, or reach our team directly:<br><br>📧 <a href='mailto:Info@uecampus.com'>Info@uecampus.com</a><br>📞 <a href='tel:+447586797014'>+44 7586 797014</a>",
    noAnswerSuggestions: ["What programmes do you offer?", "What are the course fees?", "How do I apply?"],
    unsure: "I'm not entirely sure I understood. Did you mean one of these?",
    greeting:
      "Hello! 👋 How can I help you today? Ask me anything about UeCampus — programmes, admissions, fees, or accreditation.",
    thanks: "You're welcome! 😊 If you have any more questions, feel free to ask — we're here to help.",
    goodbye: "Goodbye! 👋 Thank you for chatting with us. We're always here if you need help. Have a great day!",
    // The knowledge base the chatbot answers from. Keywords help it match a
    // question phrased differently from the entry.
    faqs: FAQ_DATA.map((f) => ({
      category: f.category,
      question: f.question,
      answer: f.answer,
      keywords: [...(f.keywords ?? [])],
    })),
  },
};

export const OVERLAYS_LABELS: Record<string, string> = {
  popup: "Welcome sign-in popup",
  cookies: "Cookie banner",
  chat: "Support chatbot",
  "chat.welcome": "Welcome message (HTML allowed)",
  "chat.noAnswer": "Reply when nothing matches (HTML allowed)",
  "chat.unsure": "Reply when the match is weak",
  "chat.welcomeSuggestions": "Suggested questions under the welcome",
  "chat.noAnswerSuggestions": "Suggested questions under the no-match reply",
  "chat.faqs": "FAQ knowledge base (question, answer, keywords)",
  "chat.faqs.keywords": "Keywords — extra words that should match this answer",
};

export const OVERLAYS_TEMPLATES = {
  "chat.faqs": { category: "General", question: "", answer: "", keywords: [] },
  "chat.faqs.keywords": "",
  "chat.welcomeSuggestions": "",
  "chat.noAnswerSuggestions": "",
};
