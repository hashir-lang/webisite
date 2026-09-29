import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===== Load FAQ Data dynamically from faq-data.js =====
let FAQ_DATA = [];
let FAQ_CATEGORIES = [];

try {
  const faqPath = path.resolve("./faq-data.js");
  const fileContent = fs.readFileSync(faqPath, "utf8");
  // Safely evaluate the static JS file to extract data structures
  const extractData = new Function(
    fileContent + "\nreturn { FAQ_DATA, FAQ_CATEGORIES };"
  );
  const data = extractData();
  FAQ_DATA = data.FAQ_DATA;
  FAQ_CATEGORIES = data.FAQ_CATEGORIES;
  console.log(`Successfully loaded ${FAQ_DATA.length} FAQ entries from faq-data.js`);
} catch (error) {
  console.error("Failed to load faq-data.js:", error);
}

// ===== Tokenizer & Synonym mapping (same as script.js) =====
const SYNONYMS = {
  "fee": ["cost", "price", "tuition", "payment", "installment", "pay", "pricing", "budget"],
  "cost": ["fee", "fees", "price", "tuition", "payment", "pay", "pricing"],
  "price": ["fee", "fees", "cost", "tuition", "payment", "pay", "pricing"],
  "tuition": ["fee", "fees", "cost", "price", "payment", "pay"],
  "payment": ["fee", "fees", "cost", "price", "tuition", "pay", "installment", "monthly", "emi"],
  "pay": ["fee", "fees", "cost", "price", "tuition", "payment", "installment"],
  "installment": ["emi", "monthly", "quarterly", "parts", "split"],
  "bsc": ["bachelor", "bachelors", "undergrad", "undergraduate", "degree"],
  "bachelor": ["bsc", "bba", "ba", "degree", "undergraduate"],
  "undergraduate": ["bsc", "bba", "ba", "bachelor", "degree"],
  "mba": ["master", "masters", "postgrad", "postgraduate", "msc", "degree"],
  "msc": ["master", "masters", "postgrad", "postgraduate", "mba", "degree"],
  "master": ["mba", "msc", "postgraduate", "degree"],
  "postgraduate": ["mba", "msc", "master", "degree"],
  "phd": ["doctorate", "dba", "doctor", "doctoral"],
  "dba": ["phd", "doctorate", "doctor", "doctoral"],
  "doctorate": ["phd", "dba", "doctor", "doctoral"],
  "accredited": ["accreditation", "valid", "official", "legit", "recognition", "recognized", "ofqual", "hlc", "mfhea"],
  "accreditation": ["accredited", "valid", "official", "legit", "recognition", "recognized", "ofqual", "hlc", "mfhea"],
  "legit": ["accredited", "accreditation", "real", "fake", "trust", "scam", "recognized"],
  "apply": ["application", "enroll", "enrol", "admission", "register", "signup", "join"],
  "enroll": ["apply", "application", "enrol", "admission", "register", "signup", "join"],
  "admission": ["apply", "application", "enroll", "enrol", "register", "signup", "join"],
  "contact": ["reach", "phone", "email", "call", "support", "whatsapp", "talk", "address"],
  "support": ["contact", "phone", "email", "call", "whatsapp"]
};

function tokenize(text) {
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "and", "but", "or", "not", "no", "if",
    "this", "that", "there", "their", "they", "them", "i", "me", "my",
    "you", "your", "we", "our", "he", "she", "his", "her", "its",
    "what", "which", "who", "whom", "how", "when", "where", "why",
    "all", "each", "every", "any", "few", "more", "most", "other",
    "some", "such", "than", "too", "very", "just", "about", "also",
    "so", "up", "out", "am", "please", "tell", "know", "want", "need",
    "get", "give", "let", "like"
  ]);

  const rawWords = text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
    
  const tokens = [...rawWords];
  rawWords.forEach(w => {
    if (SYNONYMS[w]) {
      SYNONYMS[w].forEach(syn => {
        if (!tokens.includes(syn)) tokens.push(syn);
      });
    }
  });
  
  return tokens;
}

// ===== Advanced Keyword Search for context retrieval (RAG) =====
function getRelevantContext(query) {
  const queryWords = tokenize(query);
  if (queryWords.length === 0) return [];

  const scored = FAQ_DATA.map((faq) => {
    let score = 0;
    const question = faq.question.toLowerCase();
    const answer = faq.answer.toLowerCase();
    
    // Check match in title
    const qTokens = tokenize(faq.question);
    const commonTokens = queryWords.filter(qw => qTokens.includes(qw));
    score += commonTokens.length * 3;
    
    // Check match in keywords
    if (faq.keywords) {
      const kwTokens = faq.keywords.flatMap(kw => tokenize(kw));
      const commonKws = queryWords.filter(qw => kwTokens.includes(qw));
      score += commonKws.length * 2;
    }
    
    // Check match in answer
    const aTokens = tokenize(faq.answer);
    const commonAns = queryWords.filter(qw => aTokens.includes(qw));
    score += commonAns.length * 1;
    
    return { faq, score };
  });

  // Sort and filter top 5 matching FAQs
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.faq);
}

// ===== API Chat Endpoint =====
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || req.headers["x-gemini-key"];

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Retrieve relevant FAQs
  const relevantFAQs = getRelevantContext(message);
  
  // Format Context String
  const contextStr = relevantFAQs.map((faq, index) => {
    return `FAQ #${index + 1}:
Question: ${faq.question}
Answer: ${faq.answer}
Category: ${faq.category}
Keywords: ${faq.keywords ? faq.keywords.join(", ") : ""}`;
  }).join("\n\n");

  // Construct standard history
  const formattedHistory = [];
  if (history && Array.isArray(history)) {
    // Take the last 6 messages to keep context short and relevant
    history.slice(-6).forEach(msg => {
      formattedHistory.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      });
    });
  }

  // Append user's current message
  formattedHistory.push({
    role: "user",
    parts: [{ text: message }]
  });

  // System Instructions
  const systemInstruction = `You are "UeCampus Support Bot", an extremely intelligent, polite, and helpful AI assistant for UeCampus (website: www.uecampus.com).
UeCampus is a UK-based online education provider. It offers flexible, 100% online diplomas and degrees (BSc, BBA, MBA, MSc, PhD) in partnership with recognized institutions:
- Walsh College (USA - HLC & ACBSP accredited)
- PPA / Pole Paris Alternance (France)
- eie European Business School (Malta - MFHEA accredited)
- Qualifi (UK - Ofqual-regulated awarding body)

IMPORTANT GUIDELINES:
1. Base your answer PRIMARILY on the provided FAQ Context below.
2. If the user asks about specific details (fees, durations, requirements) not present in the FAQ context, use your general knowledge or politely explain that you don't have the exact detail and provide the support details:
   - Email: Info@uecampus.com
   - Phone/WhatsApp: +44 7586 797014
   - Link: https://uecampus.com/contact-us
3. Output rules: You MUST format your answer in raw HTML (using <ul>, <li>, <strong>, <p>, <a>, etc.) for structured elements. Do NOT output markdown (like **, * or #). Keep paragraphs wrapped in <p> tags.
4. Highlight fees using <span class="fee">£X,XXX</span> and durations with <span class="duration">(X months)</span> where applicable, matching the website style.
5. Hyperlink any URLs mentioned: e.g. use <a href="https://uecampus.com/courses" target="_blank">uecampus.com/courses</a>.
6. Address the user directly in a professional and warm tone. Keep answers concise, clear, and easy to read.

---
FAQ Reference Context:
${contextStr || "No specific FAQ matches found. Use general knowledge about UeCampus."}
---`;

  try {
    const activeApiKey = apiKey;
    if (!activeApiKey) {
      return res.status(400).json({ 
        error: "Gemini API key is missing. Please set GEMINI_API_KEY in the server .env or provide it in the chat settings." 
      });
    }

    // Prepare request payload for Gemini API
    const payload = {
      contents: formattedHistory,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.3, // Low temperature for high factual accuracy
        maxOutputTokens: 1000
      }
    };

    // Try Gemini 2.5 Flash, fallback to 1.5 Flash if needed
    let model = "gemini-2.5-flash";
    let apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeApiKey}`;
    
    let response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`Model ${model} failed, trying gemini-1.5-flash fallback...`);
      model = "gemini-1.5-flash";
      apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeApiKey}`;
      response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const resData = await response.json();
    const botReply = resData.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I could not generate a response. Please contact support.";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    res.status(500).json({ error: "Failed to connect to AI service. " + error.message });
  }
});

// Serve static app files for hosting convenience if needed
app.use(express.static(path.resolve(".")));

app.listen(PORT, () => {
  console.log(`UeCampus AI Proxy Server is running on http://localhost:${PORT}`);
});
