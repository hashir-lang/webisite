// ===== UeCampus Chatbot Engine (Advanced Edition) =====

// UI Elements
const messagesEl = document.getElementById("chat-messages");
const inputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("chat-send");
const toggleBtn = document.getElementById("chat-toggle");
const widget = document.getElementById("chat-widget");
const iconOpen = document.getElementById("chat-icon-open");
const iconClose = document.getElementById("chat-icon-close");
const toggleBadge = document.getElementById("chat-badge");
const suggestionsEl = document.getElementById("autocomplete-suggestions");

// Settings Elements
const settingsBtn = document.getElementById("chat-settings-btn");
const settingsPanel = document.getElementById("settings-panel");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const aiModeToggle = document.getElementById("ai-mode-toggle");
const apiKeyInput = document.getElementById("api-key-input");
const apiKeyContainer = document.getElementById("api-key-container");
const proxyStatusEl = document.getElementById("proxy-status");

// Chatbot State
let isOpen = false;
let conversationStarted = false;
let proxyAvailable = false;
let activeSessionHistory = [];

const context = {
  lastFAQ: null
};

// Synonym Dictionary for advanced client-side search matching
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
  "accrediting": ["accredited", "accreditation"],
  
  "apply": ["application", "enroll", "enrol", "admission", "register", "signup", "join"],
  "enroll": ["apply", "application", "enrol", "admission", "register", "signup", "join"],
  "admission": ["apply", "application", "enroll", "enrol", "register", "signup", "join"],
  
  "contact": ["reach", "phone", "email", "call", "support", "whatsapp", "talk", "address"],
  "support": ["contact", "phone", "email", "call", "whatsapp"]
};

// TF-IDF Search Engine Variables
let docVectors = [];
let idf = {};
let docFrequencies = {};
const N = FAQ_DATA.length;

// ===== Initialization =====
document.addEventListener("DOMContentLoaded", () => {
  initSearchEngine();
  loadConfigurations();
  checkBackendProxy();
  
  // Show unread notification badge after 4 seconds
  setTimeout(() => {
    if (!isOpen && !conversationStarted) {
      toggleBadge.classList.remove("hidden");
    }
  }, 4000);
});

// ===== Toggle Chat =====
toggleBtn.addEventListener("click", () => {
  isOpen = !isOpen;
  widget.classList.toggle("hidden", !isOpen);
  iconOpen.style.display = isOpen ? "none" : "block";
  iconClose.style.display = isOpen ? "block" : "none";
  toggleBadge.classList.add("hidden"); // Clear notification badge

  if (isOpen && !conversationStarted) {
    conversationStarted = true;
    showWelcomeScreen();
  }
});

// ===== Toggle Settings Panel =====
settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
  checkBackendProxy();
});

saveSettingsBtn.addEventListener("click", () => {
  localStorage.setItem("uecampus_chatbot_ai_mode", aiModeToggle.checked);
  localStorage.setItem("uecampus_chatbot_api_key", apiKeyInput.value.trim());
  settingsPanel.classList.add("hidden");
});

aiModeToggle.addEventListener("change", () => {
  apiKeyContainer.classList.toggle("hidden", !aiModeToggle.checked);
});

function loadConfigurations() {
  const savedAiMode = localStorage.getItem("uecampus_chatbot_ai_mode") === "true";
  const savedApiKey = localStorage.getItem("uecampus_chatbot_api_key") || "";
  
  aiModeToggle.checked = savedAiMode;
  apiKeyInput.value = savedApiKey;
  apiKeyContainer.classList.toggle("hidden", !savedAiMode);
}

async function checkBackendProxy() {
  try {
    const res = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "ping" })
    });
    if (res.status !== 400) { // Since message "ping" is fine, we look for running status
      proxyAvailable = true;
      proxyStatusEl.innerHTML = "<span style='color: #2ecc71; font-weight:600;'>Online (Ready)</span>";
    } else {
      proxyAvailable = true;
      proxyStatusEl.innerHTML = "<span style='color: #2ecc71; font-weight:600;'>Online</span>";
    }
  } catch (e) {
    proxyAvailable = false;
    proxyStatusEl.innerHTML = "<span style='color: #888;'>Offline (Using Local Search)</span>";
  }
}

// ===== Send Message =====
sendBtn.addEventListener("click", handleUserInput);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleUserInput();
  }
});

function handleUserInput() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, "user");
  inputEl.value = "";
  suggestionsEl.classList.add("hidden");

  // Show typing indicator then respond
  showTyping();
  
  const startTime = Date.now();
  
  respondToUser(text).then(replyHtml => {
    const elapsedTime = Date.now() - startTime;
    const delay = Math.max(500, 1000 - elapsedTime); // natural typing delay

    setTimeout(() => {
      removeTyping();
      addMessage(replyHtml, "bot");
    }, delay);
  });
}

// ===== Core Response Router (Local vs AI Mode) =====
async function respondToUser(query) {
  const isAiEnabled = aiModeToggle.checked;
  const localApiKey = apiKeyInput.value.trim();

  // 1. Log query to history
  activeSessionHistory.push({ role: "user", content: query });

  // 2. Decide routing
  if (isAiEnabled) {
    // A. Use local Express proxy if available
    if (proxyAvailable) {
      try {
        const response = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, history: activeSessionHistory })
        });
        if (!response.ok) throw new Error("Backend response error");
        const data = await response.json();
        activeSessionHistory.push({ role: "model", content: data.reply });
        return data.reply;
      } catch (error) {
        console.warn("Express proxy error, falling back to client-side AI direct call...", error);
      }
    }

    // B. Direct client-side Gemini API call if key is saved locally
    if (localApiKey) {
      try {
        const results = searchFAQ(query);
        const contextStr = results.slice(0, 3).map(r => `Question: ${r.faq.question}\nAnswer: ${r.faq.answer}`).join("\n\n");
        
        const payload = {
          contents: [{
            parts: [{ text: `You are UeCampus Support Bot. Answer user's question politely using the context below. Format in raw HTML. Do not output Markdown. If not in context, answer using general knowledge but direct to support: Info@uecampus.com / +44 7586 797014.
            
            FAQ Context:
            ${contextStr}
            
            User Question: ${query}` }]
          }]
        };

        const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${localApiKey}`;
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          const resData = await response.json();
          const reply = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          activeSessionHistory.push({ role: "model", content: reply });
          return reply;
        }
      } catch (error) {
        console.error("Direct client Gemini call failed:", error);
      }
    }
  }

  // C. Fallback to Local Search (TF-IDF Search Engine)
  const results = searchFAQ(query);

  if (results.length === 0) {
    return `I'm sorry, I couldn't find a specific answer for that. You can try rephrasing your question, or contact our support team directly:
    <br><br>
    📧 <a href="mailto:Info@uecampus.com">Info@uecampus.com</a><br>
    📞 <a href="tel:+447586797014">+44 7586 797014</a><br>
    🟢 WhatsApp: <a href="https://wa.me/447586797014" target="_blank">+44 7586 797014</a>
    <br><br>
    Or select a topic below to browse:
    ${getTopicButtonsHtml()}`;
  }

  const best = results[0];
  context.lastFAQ = best.faq; // Save context

  // Check confidence levels
  if (best.score >= 0.25) {
    // High & Medium confidence
    let reply = formatFaqAnswer(best.faq);
    
    // Append related suggestions if we have secondary matches
    const related = results.slice(1, 4);
    if (related.length > 0) {
      reply += `<div class="related-questions">
        <div style="font-weight:600; margin-top:8px; font-size:12.5px; color:#4A1A6B;">Related questions:</div>
        ${related.map(r => `<button class="related-btn" onclick="askSuggestedQuestion('${r.faq.question.replace(/'/g, "\\'")}')">${r.faq.question}</button>`).join("")}
      </div>`;
    }
    
    activeSessionHistory.push({ role: "model", content: reply });
    return reply;
  } else {
    // Low confidence - show suggestions list
    const suggestions = results.slice(0, 4);
    let reply = `I'm not entirely sure I understood. Did you mean one of these?
    <div class="related-questions" style="margin-top:8px;">
      ${suggestions.map(s => `<button class="related-btn" onclick="askSuggestedQuestion('${s.faq.question.replace(/'/g, "\\'")}')">${s.faq.question}</button>`).join("")}
      <button class="related-btn" style="border-color:#C9A6DB;" onclick="showBrowseTopics()">Browse all topics...</button>
    </div>`;
    
    activeSessionHistory.push({ role: "model", content: reply });
    return reply;
  }
}

// Global click handler helper for suggestions
window.askSuggestedQuestion = function(questionText) {
  inputEl.value = questionText;
  handleUserInput();
};

window.showBrowseTopics = function() {
  addMessage("Browse all topics", "user");
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(`Here are UeCampus FAQ categories you can explore: ${getTopicButtonsHtml()}`, "bot");
  }, 400);
};

// ===== Show Premium Welcome Screen =====
function showWelcomeScreen() {
  const container = document.createElement("div");
  container.className = "welcome-container";

  const intro = document.createElement("div");
  intro.className = "welcome-intro";
  intro.innerHTML = `Hi there! 👋 Welcome to <strong>UeCampus</strong> support. 
  Earn your UK, US, or European degree completely online. 
  <br><br>
  I can answer details about our programmes, accreditation, fees, and admissions. How can I help you today?`;
  container.appendChild(intro);

  const cardsContainer = document.createElement("div");
  cardsContainer.className = "welcome-cards";

  const cards = [
    { icon: "🎓", title: "Programmes", desc: "View BSc, MBA, PhD programs", query: "What programmes do you offer?" },
    { icon: "💸", title: "Tuition & Fees", desc: "Pricing and installments", query: "What are the course fees?" },
    { icon: "📜", title: "Accreditation", desc: "Walsh, PPA, Ofqual validity", query: "Are your degrees accredited?" },
    { icon: "📝", title: "How to Apply", desc: "Simple 3-step admission", query: "How do I apply?" }
  ];

  cards.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "welcome-card";
    cardEl.innerHTML = `
      <div class="welcome-card-icon">${card.icon}</div>
      <div class="welcome-card-title">${card.title}</div>
      <div class="welcome-card-desc">${card.desc}</div>
    `;
    cardEl.addEventListener("click", () => {
      inputEl.value = card.query;
      handleUserInput();
    });
    cardsContainer.appendChild(cardEl);
  });

  container.appendChild(cardsContainer);
  messagesEl.appendChild(container);
  scrollToBottom();
}

function getTopicButtonsHtml() {
  return `<div class="category-buttons">
    ${FAQ_CATEGORIES.map(cat => `<button class="category-btn" onclick="handleCategoryClick('${cat}')">${cat}</button>`).join("")}
  </div>`;
}

window.handleCategoryClick = function(category) {
  addMessage(category, "user");
  showTyping();
  setTimeout(() => {
    removeTyping();
    const questions = FAQ_DATA.filter((f) => f.category === category).slice(0, 5);
    
    let html = `Here are common questions about <strong>${category}</strong>:
    <div class="related-questions" style="margin-top:8px;">
      ${questions.map(q => `<button class="related-btn" onclick="askSuggestedQuestion('${q.question.replace(/'/g, "\\'")}')">${q.question}</button>`).join("")}
      <button class="related-btn" style="border-color:#C9A6DB;" onclick="showBrowseTopics()">Back to all topics</button>
    </div>`;
    
    addMessage(html, "bot");
  }, 400);
};

// ===== TF-IDF Engine Precomputations =====
function initSearchEngine() {
  // 1. Document Frequencies
  FAQ_DATA.forEach(doc => {
    const qTokens = tokenize(doc.question);
    const kwTokens = doc.keywords ? doc.keywords.flatMap(kw => tokenize(kw)) : [];
    const aTokens = tokenize(doc.answer);
    
    const uniqueTerms = new Set([...qTokens, ...kwTokens, ...aTokens]);
    uniqueTerms.forEach(term => {
      docFrequencies[term] = (docFrequencies[term] || 0) + 1;
    });
  });

  // 2. Compute IDF
  for (let term in docFrequencies) {
    idf[term] = Math.log(1 + (N / docFrequencies[term]));
  }

  // 3. Precompute document TF-IDF vectors
  docVectors = FAQ_DATA.map(doc => {
    const qTokens = tokenize(doc.question);
    const kwTokens = doc.keywords ? doc.keywords.flatMap(kw => tokenize(kw)) : [];
    const aTokens = tokenize(doc.answer);
    
    const termCounts = {};
    
    // Apply weights to fields: Question (3x), Keywords (2x), Answer (1x)
    qTokens.forEach(t => termCounts[t] = (termCounts[t] || 0) + 3);
    kwTokens.forEach(t => termCounts[t] = (termCounts[t] || 0) + 2);
    aTokens.forEach(t => termCounts[t] = (termCounts[t] || 0) + 1);
    
    const vector = {};
    let lengthSq = 0;
    
    for (let term in termCounts) {
      const tf = termCounts[term];
      const termIdf = idf[term] || 0;
      const tfidf = tf * termIdf;
      vector[term] = tfidf;
      lengthSq += tfidf * tfidf;
    }
    
    return {
      faq: doc,
      vector: vector,
      length: Math.sqrt(lengthSq)
    };
  });
}

// Tokenize text into lowercase keywords and inject synonym mappings
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
  
  // Inject synonyms as additional matching tokens
  rawWords.forEach(w => {
    if (SYNONYMS[w]) {
      SYNONYMS[w].forEach(syn => {
        if (!tokens.includes(syn)) tokens.push(syn);
      });
    }
  });
  
  return tokens;
}

// Search function using Vector Cosine Similarity on TF-IDF representation
function searchFAQ(query) {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Quick return mappings
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy", "sup", "yo", "hiya"];
  if (greetings.some((g) => normalizedQuery === g || normalizedQuery === g + "!")) {
    return [{
      faq: {
        id: 0,
        category: "General",
        question: "Greeting",
        answer: "Hello! 👋 How can I help you today? Feel free to ask me anything about UeCampus — programmes, admissions, fees, accreditation, or anything else!"
      },
      score: 1.0
    }];
  }

  const thanks = ["thank", "thanks", "thank you", "thx", "ty", "appreciate"];
  if (thanks.some((t) => normalizedQuery.includes(t))) {
    return [{
      faq: {
        id: 0,
        category: "General",
        question: "Thanks",
        answer: "You're welcome! 😊 If you have any more questions, feel free to ask. We're here to help!"
      },
      score: 1.0
    }];
  }

  const byes = ["bye", "goodbye", "see you", "take care", "ciao"];
  if (byes.some((b) => normalizedQuery.includes(b))) {
    return [{
      faq: {
        id: 0,
        category: "General",
        question: "Bye",
        answer: "Goodbye! 👋 Thank you for chatting with us. If you need help in the future, we're always here. Have a great day!"
      },
      score: 1.0
    }];
  }

  // 1. Context Enhancement for short query follow-ups
  let searchTokens = tokenize(query);

  const costKeywords = ["cost", "fee", "fees", "price", "how much", "tuition", "payment", "pay", "cheap", "expensive"];
  const durationKeywords = ["long", "duration", "time", "length", "finish", "complete", "months", "years"];
  const requirementsKeywords = ["require", "requirements", "need", "criteria", "eligibility", "documents"];

  const isCostQuery = costKeywords.some(kw => normalizedQuery.includes(kw));
  const isDurationQuery = durationKeywords.some(kw => normalizedQuery.includes(kw));
  const isReqQuery = requirementsKeywords.some(kw => normalizedQuery.includes(kw));

  if ((isCostQuery || isDurationQuery || isReqQuery) && context.lastFAQ) {
    const lastQ = context.lastFAQ.question;
    const programMatch = lastQ.match(/(bsc|bba|ba|mba|msc|dba|phd|diploma|level \d)[^?]+/i);
    if (programMatch) {
      const programName = programMatch[0].trim();
      searchTokens = tokenize(`${query} ${programName}`);
    }
  }

  if (searchTokens.length === 0) return [];

  // 2. Compute query vector
  const queryCounts = {};
  searchTokens.forEach(t => queryCounts[t] = (queryCounts[t] || 0) + 1);

  const queryVector = {};
  let queryLengthSq = 0;
  for (let term in queryCounts) {
    const tf = queryCounts[term];
    const termIdf = idf[term] || 0;
    const tfidf = tf * termIdf;
    queryVector[term] = tfidf;
    queryLengthSq += tfidf * tfidf;
  }
  const queryLength = Math.sqrt(queryLengthSq);

  if (queryLength === 0) return [];

  // 3. Compute cosine similarity scores
  const scored = docVectors.map(docVec => {
    let dotProduct = 0;
    for (let term in queryVector) {
      if (docVec.vector[term]) {
        dotProduct += queryVector[term] * docVec.vector[term];
      }
    }
    
    let score = 0;
    if (queryLength > 0 && docVec.length > 0) {
      score = dotProduct / (queryLength * docVec.length);
    }
    
    // Intention Boost
    if (isCostQuery && (docVec.faq.category === "Course Fees" || docVec.faq.category === "Fees & Payment")) {
      score += 0.15;
    }
    
    return {
      faq: docVec.faq,
      score: score
    };
  });

  return scored
    .filter(s => s.score > 0.05)
    .sort((a, b) => b.score - a.score);
}

// ===== Autocomplete Suggestions Input Handler =====
inputEl.addEventListener("input", () => {
  const val = inputEl.value.trim();
  if (val.length < 2) {
    suggestionsEl.classList.add("hidden");
    return;
  }

  // Retrieve matches using local search engine (strictly scoring titles/questions)
  const matches = FAQ_DATA.filter(faq => 
    faq.question.toLowerCase().includes(val.toLowerCase())
  ).slice(0, 3);

  if (matches.length === 0) {
    suggestionsEl.classList.add("hidden");
    return;
  }

  // Render suggestion items
  suggestionsEl.innerHTML = matches.map(match => `
    <div class="suggestion-item" onclick="selectSuggestion('${match.question.replace(/'/g, "\\'")}')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span>${match.question}</span>
    </div>
  `).join("");

  suggestionsEl.classList.remove("hidden");
});

window.selectSuggestion = function(questionText) {
  inputEl.value = questionText;
  suggestionsEl.classList.add("hidden");
  handleUserInput();
};

// Auto-close suggestions list if user clicks outside
document.addEventListener("click", (e) => {
  if (!suggestionsEl.contains(e.target) && e.target !== inputEl) {
    suggestionsEl.classList.add("hidden");
  }
});

// ===== Helper Formatting Answers =====
function formatFaqAnswer(faq) {
  let html = faq.answer;

  // Add contact info anchor tags for redirect options
  if (faq.answer.includes("Info@uecampus.com")) {
    html = html.replace(/Info@uecampus\.com/gi, "<a href='mailto:Info@uecampus.com'>Info@uecampus.com</a>");
  }
  if (faq.answer.includes("+44 7586 797014")) {
    html = html.replace(/\+44\s*7586\s*797014/g, "<a href='tel:+447586797014'>+44 7586 797014</a>");
  }
  
  // Linkify uecampus paths
  html = html.replace(/uecampus\.com\/([a-zA-Z0-9_-]+)/g, "<a href='https://uecampus.com/$1' target='_blank'>uecampus.com/$1</a>");

  // Create standard text block
  return `<div>${html}</div>
  <div class="feedback-container">
    <button class="feedback-btn" title="Helpful" onclick="submitFeedback(this, 'up', ${faq.id})">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
    </button>
    <button class="feedback-btn" title="Not helpful" onclick="submitFeedback(this, 'down', ${faq.id})">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
      </svg>
    </button>
  </div>`;
}

// ===== Feedback Logger =====
window.submitFeedback = function(btn, type, faqId) {
  // Check if button is already active
  if (btn.classList.contains("active")) return;

  const parent = btn.parentElement;
  // Clear other active sibling buttons
  Array.from(parent.children).forEach(child => child.classList.remove("active"));
  
  btn.classList.add("active");
  console.log(`Feedback submitted: FAQ ID #${faqId} rated ${type === "up" ? "Helpful 👍" : "Unhelpful 👎"}`);
  
  // Save feedback log to local storage
  const feedbackLogs = JSON.parse(localStorage.getItem("uecampus_chatbot_feedback") || "[]");
  feedbackLogs.push({ faqId, type, timestamp: new Date().toISOString() });
  localStorage.setItem("uecampus_chatbot_feedback", JSON.stringify(feedbackLogs));

  if (type === "down") {
    // If not helpful, append a nice helpful fallback answer
    setTimeout(() => {
      addMessage(`I'm sorry that wasn't helpful. You can get in touch with our team for personalized support:
      <br><br>
      📧 <a href="mailto:Info@uecampus.com">Info@uecampus.com</a><br>
      📞 <a href="tel:+447586797014">+44 7586 797014</a>`, "bot");
    }, 400);
  }
};

// ===== UI Helpers =====
function addMessage(html, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  if (sender === "user") {
    div.textContent = html;
  } else {
    // Replace newline string indicators to HTML breaks
    div.innerHTML = html.replace(/\n/g, "<br>");
  }
  messagesEl.appendChild(div);
  scrollToBottom();
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "typing-indicator";
  div.id = "typing";
  div.innerHTML = "<span></span><span></span><span></span>";
  messagesEl.appendChild(div);
  scrollToBottom();
}

function removeTyping() {
  const el = document.getElementById("typing");
  if (el) el.remove();
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
