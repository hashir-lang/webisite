// UeCampus chatbot search engine — TF-IDF cosine similarity over the FAQ
// knowledge base, ported from the standalone chatbot's script.js so the widget
// works fully offline (no server / API key required).
import { FAQ_DATA, type Faq } from "./faqData";

const SYNONYMS: Record<string, string[]> = {
  fee: ["cost", "price", "tuition", "payment", "installment", "pay", "pricing", "budget"],
  cost: ["fee", "fees", "price", "tuition", "payment", "pay", "pricing"],
  price: ["fee", "fees", "cost", "tuition", "payment", "pay", "pricing"],
  tuition: ["fee", "fees", "cost", "price", "payment", "pay"],
  payment: ["fee", "fees", "cost", "price", "tuition", "pay", "installment", "monthly", "emi"],
  pay: ["fee", "fees", "cost", "price", "tuition", "payment", "installment"],
  installment: ["emi", "monthly", "quarterly", "parts", "split"],
  bsc: ["bachelor", "bachelors", "undergrad", "undergraduate", "degree"],
  bachelor: ["bsc", "bba", "ba", "degree", "undergraduate"],
  undergraduate: ["bsc", "bba", "ba", "bachelor", "degree"],
  mba: ["master", "masters", "postgrad", "postgraduate", "msc", "degree"],
  msc: ["master", "masters", "postgrad", "postgraduate", "mba", "degree"],
  master: ["mba", "msc", "postgraduate", "degree"],
  postgraduate: ["mba", "msc", "master", "degree"],
  phd: ["doctorate", "dba", "doctor", "doctoral"],
  dba: ["phd", "doctorate", "doctor", "doctoral"],
  doctorate: ["phd", "dba", "doctor", "doctoral"],
  accredited: ["accreditation", "valid", "official", "legit", "recognition", "recognized", "ofqual", "hlc", "mfhea"],
  accreditation: ["accredited", "valid", "official", "legit", "recognition", "recognized", "ofqual", "hlc", "mfhea"],
  legit: ["accredited", "accreditation", "real", "fake", "trust", "scam", "recognized"],
  apply: ["application", "enroll", "enrol", "admission", "register", "signup", "join"],
  enroll: ["apply", "application", "enrol", "admission", "register", "signup", "join"],
  admission: ["apply", "application", "enroll", "enrol", "register", "signup", "join"],
  contact: ["reach", "phone", "email", "call", "support", "whatsapp", "talk", "address"],
  support: ["contact", "phone", "email", "call", "whatsapp"],
};

const STOP = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being", "have",
  "has", "had", "do", "does", "did", "will", "would", "could", "should", "may",
  "might", "shall", "can", "to", "of", "in", "for", "on", "with", "at", "by",
  "from", "as", "into", "through", "during", "before", "after", "and", "but",
  "or", "not", "no", "if", "this", "that", "there", "their", "they", "them",
  "i", "me", "my", "you", "your", "we", "our", "he", "she", "his", "her", "its",
  "what", "which", "who", "whom", "how", "when", "where", "why", "all", "each",
  "every", "any", "few", "more", "most", "other", "some", "such", "than", "too",
  "very", "just", "about", "also", "so", "up", "out", "am", "please", "tell",
  "know", "want", "need", "get", "give", "let", "like",
]);

function tokenize(text: string): string[] {
  const rawWords = text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));

  const tokens = [...rawWords];
  rawWords.forEach((w) => {
    if (SYNONYMS[w]) {
      SYNONYMS[w].forEach((syn) => {
        if (!tokens.includes(syn)) tokens.push(syn);
      });
    }
  });
  return tokens;
}

// ===== TF-IDF document vectors =====
// Built from whatever FAQ list the widget hands over — the CMS-edited one on
// the live site (src/cms/defaults/overlays.ts holds the compiled copy of
// FAQ_DATA) — so an admin can add, change or remove answers without a rebuild.
type DocVec = { faq: Faq; vector: Record<string, number>; length: number };

export type FaqIndex = { idf: Record<string, number>; docVectors: DocVec[] };

export function buildIndex(faqs: Faq[]): FaqIndex {
  const docFrequencies: Record<string, number> = {};
  const idf: Record<string, number> = {};
  const N = faqs.length;

  faqs.forEach((doc) => {
    const terms = new Set([
      ...tokenize(doc.question),
      ...(doc.keywords ? doc.keywords.flatMap((kw) => tokenize(kw)) : []),
      ...tokenize(doc.answer),
    ]);
    terms.forEach((t) => (docFrequencies[t] = (docFrequencies[t] || 0) + 1));
  });

  for (const term in docFrequencies) {
    idf[term] = Math.log(1 + N / docFrequencies[term]);
  }

  const docVectors: DocVec[] = faqs.map((doc) => {
    const qTokens = tokenize(doc.question);
    const kwTokens = doc.keywords ? doc.keywords.flatMap((kw) => tokenize(kw)) : [];
    const aTokens = tokenize(doc.answer);

    const counts: Record<string, number> = {};
    qTokens.forEach((t) => (counts[t] = (counts[t] || 0) + 3)); // question weighted 3x
    kwTokens.forEach((t) => (counts[t] = (counts[t] || 0) + 2)); // keywords 2x
    aTokens.forEach((t) => (counts[t] = (counts[t] || 0) + 1)); // answer 1x

    const vector: Record<string, number> = {};
    let lengthSq = 0;
    for (const term in counts) {
      const tfidf = counts[term] * (idf[term] || 0);
      vector[term] = tfidf;
      lengthSq += tfidf * tfidf;
    }
    return { faq: doc, vector, length: Math.sqrt(lengthSq) };
  });

  return { idf, docVectors };
}

/** The compiled knowledge base, for callers that have no CMS list to hand. */
export const DEFAULT_INDEX: FaqIndex = buildIndex(FAQ_DATA);

export type Scored = { faq: Faq; score: number };

/** The canned replies for small talk; the widget passes the CMS-edited ones. */
export type QuickReplies = { greeting: string; thanks: string; goodbye: string };

export const DEFAULT_REPLIES: QuickReplies = {
  greeting: "Hello! 👋 How can I help you today? Ask me anything about UeCampus — programmes, admissions, fees, or accreditation.",
  thanks: "You're welcome! 😊 If you have any more questions, feel free to ask — we're here to help.",
  goodbye: "Goodbye! 👋 Thank you for chatting with us. We're always here if you need help. Have a great day!",
};

const GREETINGS = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy", "sup", "yo", "hiya"];

function quickFaq(answer: string): Scored {
  return { faq: { id: 0, category: "General", question: "", answer }, score: 1 };
}

export function searchFAQ(query: string, index: FaqIndex = DEFAULT_INDEX, replies: QuickReplies = DEFAULT_REPLIES): Scored[] {
  const { idf, docVectors } = index;
  const q = query.toLowerCase().trim();
  const words = q.replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
  const wordSet = new Set(words);

  // Whole-word matching so e.g. "types" never triggers the "ty" thanks reply.
  if (GREETINGS.includes(q) || (words.length <= 2 && words.some((w) => GREETINGS.includes(w)))) {
    return [quickFaq(replies.greeting)];
  }
  if (q === "thank you" || ["thank", "thanks", "thankyou", "thx", "ty", "appreciate"].some((t) => wordSet.has(t))) {
    return [quickFaq(replies.thanks)];
  }
  if (q === "see you" || q === "take care" || ["bye", "goodbye", "ciao"].some((b) => wordSet.has(b))) {
    return [quickFaq(replies.goodbye)];
  }

  const normQuery = q.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const counts: Record<string, number> = {};
  tokens.forEach((t) => (counts[t] = (counts[t] || 0) + 1));

  const queryVector: Record<string, number> = {};
  let queryLenSq = 0;
  for (const term in counts) {
    const tfidf = counts[term] * (idf[term] || 0);
    queryVector[term] = tfidf;
    queryLenSq += tfidf * tfidf;
  }
  const queryLen = Math.sqrt(queryLenSq);
  if (queryLen === 0) return [];

  const costQuery = ["cost", "fee", "fees", "price", "how much", "tuition", "payment", "pay"].some((k) => q.includes(k));

  const scored = docVectors.map((dv) => {
    let dot = 0;
    for (const term in queryVector) {
      if (dv.vector[term]) dot += queryVector[term] * dv.vector[term];
    }
    let score = queryLen > 0 && dv.length > 0 ? dot / (queryLen * dv.length) : 0;
    if (costQuery && (dv.faq.category === "Course Fees" || dv.faq.category === "Fees & Payment")) {
      score += 0.15;
    }
    // Strong boost when the query matches the FAQ question itself — fixes
    // brand-only queries like "what is uecampus" and clicked suggestions.
    const normQ = dv.faq.question.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
    if (normQ && normQ === normQuery) score += 1.0;
    else if (normQ && normQuery.length > 4 && (normQ.includes(normQuery) || normQuery.includes(normQ))) score += 0.45;
    return { faq: dv.faq, score };
  });

  return scored.filter((s) => s.score > 0.05).sort((a, b) => b.score - a.score);
}

// Remove all pricing (£ amounts) from an answer while keeping durations and
// payment-plan messaging intact, and tidying the leftover sentence fragments.
function stripPricing(html: string): string {
  const FEE = "<span class=['\"]fee['\"]>[^<]*<\\/span>";
  let s = html;
  // "From £X to £Y" catalogue ranges → payment-plan phrasing
  s = s.replace(new RegExp(`From\\s*${FEE}\\s*to\\s*${FEE}`, "gi"), "Flexible payment plans available");
  // "costs £X (to/– £Y) and …" → drop the price clause, keep the rest of the sentence
  s = s.replace(new RegExp(`\\bcosts?\\b\\s*${FEE}(?:\\s*(?:to|–|-)\\s*${FEE})?\\s*and\\s*`, "gi"), "");
  // "costs £X" with no trailing "and" → neutral phrasing
  s = s.replace(new RegExp(`\\bcosts?\\b\\s*${FEE}(?:\\s*(?:to|–|-)\\s*${FEE})?`, "gi"), "is available");
  // " — £X" list rows → drop the price, keep the duration that follows
  s = s.replace(new RegExp(`\\s*(?:—|–|-)\\s*${FEE}`, "gi"), "");
  // any remaining fee spans
  s = s.replace(new RegExp(FEE, "gi"), "");
  // raw £ amounts safety net
  s = s.replace(/£\s?[\d,]+(?:\s?[–-]\s?£?\s?[\d,]+)?/g, "");
  // tidy empty bullets and stray whitespace/punctuation
  s = s.replace(/<li>\s*<\/li>/gi, "");
  s = s.replace(/\s{2,}/g, " ").replace(/\s+([.,])/g, "$1");
  return s;
}

// Linkify contact details and UeCampus paths inside an FAQ answer.
export function formatAnswer(answer: string): string {
  let html = stripPricing(answer);
  html = html.replace(/Info@uecampus\.com/gi, "<a href='mailto:Info@uecampus.com'>Info@uecampus.com</a>");
  html = html.replace(/\+44\s*7586\s*797014/g, "<a href='tel:+447586797014'>+44 7586 797014</a>");
  html = html.replace(/uecampus\.com\/([a-zA-Z0-9_-]+)/g, "<a href='https://uecampus.com/$1' target='_blank' rel='noreferrer'>uecampus.com/$1</a>");
  return html;
}
