import { describe, expect, it } from "vitest";
import { buildIndex, searchFAQ, DEFAULT_INDEX } from "./engine";

const FAQS = [
  { id: 1, category: "Course Fees", question: "What are the course fees?", answer: "Fees vary by programme; instalment plans are available.", keywords: ["cost", "price"] },
  { id: 2, category: "Admission", question: "How do I apply?", answer: "Use the Enquire Now form and an advisor will contact you.", keywords: ["enrol", "application"] },
  { id: 3, category: "General", question: "Where is UeCampus based?", answer: "UeCampus is a UK-based online provider.", keywords: ["location", "uk"] },
];

describe("chatbot engine with a CMS-supplied FAQ list", () => {
  const index = buildIndex(FAQS);

  it("answers from the list it was given", () => {
    const [best] = searchFAQ("how much does it cost", index);
    expect(best.faq.id).toBe(1);
    expect(searchFAQ("how do I enrol", index)[0].faq.id).toBe(2);
    expect(searchFAQ("what is your location", index)[0].faq.id).toBe(3);
  });

  it("reflects an edited answer without any rebuild", () => {
    const edited = buildIndex([{ ...FAQS[2], answer: "We are based in Hatfield, UK." }]);
    expect(searchFAQ("where is uecampus based", edited)[0].faq.answer).toBe("We are based in Hatfield, UK.");
  });

  it("uses the supplied small-talk replies", () => {
    const replies = { greeting: "G!", thanks: "T!", goodbye: "B!" };
    expect(searchFAQ("hello", index, replies)[0].faq.answer).toBe("G!");
    expect(searchFAQ("thanks", index, replies)[0].faq.answer).toBe("T!");
    expect(searchFAQ("bye", index, replies)[0].faq.answer).toBe("B!");
  });

  it("still ships a working default index for callers without a CMS list", () => {
    expect(DEFAULT_INDEX.docVectors.length).toBeGreaterThan(100);
    expect(searchFAQ("what is uecampus")[0].faq.question.toLowerCase()).toContain("uecampus");
  });
});
