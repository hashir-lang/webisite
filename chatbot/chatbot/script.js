// ===== UeCampus Chatbot Engine =====

const messagesEl = document.getElementById("chat-messages");
const inputEl = document.getElementById("chat-input");
const sendBtn = document.getElementById("chat-send");
const toggleBtn = document.getElementById("chat-toggle");
const widget = document.getElementById("chat-widget");
const iconOpen = document.getElementById("chat-icon-open");
const iconClose = document.getElementById("chat-icon-close");
const quickEl = document.getElementById("quick-questions");

let isOpen = false;
let conversationStarted = false;

// ===== Toggle Chat =====
toggleBtn.addEventListener("click", () => {
  isOpen = !isOpen;
  widget.classList.toggle("hidden", !isOpen);
  iconOpen.style.display = isOpen ? "none" : "block";
  iconClose.style.display = isOpen ? "block" : "none";

  if (!conversationStarted) {
    conversationStarted = true;
    showWelcomeMessage();
  }
});

// ===== Send Message =====
sendBtn.addEventListener("click", handleUserInput);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserInput();
});

function handleUserInput() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, "user");
  inputEl.value = "";
  hideQuickQuestions();

  // Show typing indicator then respond
  showTyping();
  setTimeout(() => {
    removeTyping();
    processQuery(text);
  }, 600 + Math.random() * 400);
}

// ===== Welcome Message =====
function showWelcomeMessage() {
  addMessage(
    "Hi there! \ud83d\udc4b Welcome to <strong>UeCampus</strong> support. I can help you with information about our programmes, admissions, fees, accreditation, and more.\n\nYou can ask me a question or browse by category below.",
    "bot"
  );
  showCategories();
}

// ===== Show Category Buttons =====
function showCategories() {
  const wrapper = document.createElement("div");
  wrapper.className = "message bot";

  const label = document.createElement("div");
  label.textContent = "Browse by topic:";
  label.style.marginBottom = "8px";
  label.style.fontWeight = "600";
  wrapper.appendChild(label);

  const btnContainer = document.createElement("div");
  btnContainer.className = "category-buttons";

  FAQ_CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.textContent = cat;
    btn.addEventListener("click", () => handleCategoryClick(cat));
    btnContainer.appendChild(btn);
  });

  wrapper.appendChild(btnContainer);
  messagesEl.appendChild(wrapper);
  scrollToBottom();
}

// ===== Handle Category Click =====
function handleCategoryClick(category) {
  addMessage(category, "user");
  showTyping();

  setTimeout(() => {
    removeTyping();
    const questions = FAQ_DATA.filter((f) => f.category === category);

    const wrapper = document.createElement("div");
    wrapper.className = "message bot";

    const label = document.createElement("div");
    label.innerHTML = `Here are common questions about <strong>${category}</strong>:`;
    label.style.marginBottom = "8px";
    wrapper.appendChild(label);

    const relDiv = document.createElement("div");
    relDiv.className = "related-questions";

    questions.forEach((q) => {
      const btn = document.createElement("button");
      btn.className = "related-btn";
      btn.textContent = q.question;
      btn.addEventListener("click", () => {
        addMessage(q.question, "user");
        showTyping();
        setTimeout(() => {
          removeTyping();
          showAnswer(q);
        }, 500);
      });
      relDiv.appendChild(btn);
    });

    wrapper.appendChild(relDiv);
    messagesEl.appendChild(wrapper);
    scrollToBottom();
  }, 500);
}

// ===== Core Query Processing =====
function processQuery(query) {
  const results = searchFAQ(query);

  if (results.length === 0) {
    addMessage(
      "I'm sorry, I couldn't find a specific answer for that. You can try rephrasing your question, or contact us directly:\n\n\ud83d\udce7 <a href='mailto:Info@uecampus.com'>Info@uecampus.com</a>\n\ud83d\udcde <a href='tel:+447586797014'>+44 7586 797014</a>\n\n Or browse a topic below:",
      "bot"
    );
    showCategories();
    return;
  }

  // Best match
  const best = results[0];

  if (best.score >= 0.5) {
    // High confidence - show the answer directly
    showAnswer(best.faq, results.slice(1, 4));
  } else if (best.score >= 0.25) {
    // Medium confidence - show answer but flag uncertainty
    showAnswer(best.faq, results.slice(1, 4), true);
  } else {
    // Low confidence - show suggestions
    showSuggestions(results.slice(0, 5));
  }
}

// ===== Show Answer =====
function showAnswer(faq, related, uncertain) {
  let html = "";
  if (uncertain) {
    html += "<em>I think you're asking about this:</em>\n\n";
  }
  html += faq.answer;

  // Add contact info for common redirects
  if (faq.answer.includes("Info@uecampus.com")) {
    html = html.replace(
      /Info@uecampus\.com/g,
      "<a href='mailto:Info@uecampus.com'>Info@uecampus.com</a>"
    );
  }
  if (faq.answer.includes("+44 7586 797014")) {
    html = html.replace(
      /\+44 7586 797014/g,
      "<a href='tel:+447586797014'>+44 7586 797014</a>"
    );
  }
  // Linkify URLs
  html = html.replace(
    /uecampus\.com\/([a-z-]+)/g,
    "<a href='https://uecampus.com/$1' target='_blank'>uecampus.com/$1</a>"
  );

  const wrapper = document.createElement("div");
  wrapper.className = "message bot";
  wrapper.innerHTML = html;

  // Add related questions
  if (related && related.length > 0) {
    const relDiv = document.createElement("div");
    relDiv.className = "related-questions";

    const relLabel = document.createElement("div");
    relLabel.innerHTML = "<br><strong>Related questions:</strong>";
    relLabel.style.marginBottom = "4px";
    relDiv.appendChild(relLabel);

    related.forEach((r) => {
      const btn = document.createElement("button");
      btn.className = "related-btn";
      btn.textContent = r.faq.question;
      btn.addEventListener("click", () => {
        addMessage(r.faq.question, "user");
        showTyping();
        setTimeout(() => {
          removeTyping();
          showAnswer(r.faq);
        }, 500);
      });
      relDiv.appendChild(btn);
    });

    wrapper.appendChild(relDiv);
  }

  messagesEl.appendChild(wrapper);
  scrollToBottom();
}

// ===== Show Suggestions (low confidence) =====
function showSuggestions(results) {
  const wrapper = document.createElement("div");
  wrapper.className = "message bot";

  const label = document.createElement("div");
  label.innerHTML = "I'm not sure I understood. Did you mean one of these?";
  label.style.marginBottom = "8px";
  wrapper.appendChild(label);

  const relDiv = document.createElement("div");
  relDiv.className = "related-questions";

  results.forEach((r) => {
    const btn = document.createElement("button");
    btn.className = "related-btn";
    btn.textContent = r.faq.question;
    btn.addEventListener("click", () => {
      addMessage(r.faq.question, "user");
      showTyping();
      setTimeout(() => {
        removeTyping();
        showAnswer(r.faq);
      }, 500);
    });
    relDiv.appendChild(btn);
  });

  wrapper.appendChild(relDiv);
  messagesEl.appendChild(wrapper);
  scrollToBottom();
}

// ===== Search Engine =====
function searchFAQ(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = tokenize(normalizedQuery);

  // Check for greetings
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy", "sup", "yo", "hiya"];
  if (greetings.some((g) => normalizedQuery === g || normalizedQuery === g + "!")) {
    return [{
      faq: {
        id: 0,
        category: "General",
        question: "Greeting",
        answer: "Hello! \ud83d\udc4b How can I help you today? Feel free to ask me anything about UeCampus \u2014 programmes, admissions, fees, accreditation, or anything else!"
      },
      score: 1
    }];
  }

  // Check for thank you
  const thanks = ["thank", "thanks", "thank you", "thx", "ty", "appreciate"];
  if (thanks.some((t) => normalizedQuery.includes(t))) {
    return [{
      faq: {
        id: 0,
        category: "General",
        question: "Thanks",
        answer: "You're welcome! \ud83d\ude0a If you have any more questions, feel free to ask. We're here to help!"
      },
      score: 1
    }];
  }

  // Check for goodbye
  const byes = ["bye", "goodbye", "see you", "take care", "ciao"];
  if (byes.some((b) => normalizedQuery.includes(b))) {
    return [{
      faq: {
        id: 0,
        category: "General",
        question: "Bye",
        answer: "Goodbye! \ud83d\udc4b Thank you for chatting with us. If you need help in the future, we're always here. Have a great day!"
      },
      score: 1
    }];
  }

  // Detect fee/price intent
  const feeIntent = /fee|cost|price|how much|tuition|afford|expensive|cheap|pay|payment|£|\bpound/i.test(normalizedQuery);

  const scored = FAQ_DATA.map((faq) => {
    let score = 0;

    // 1. Exact question match
    const normalizedQ = faq.question.toLowerCase();
    if (normalizedQuery === normalizedQ) {
      return { faq, score: 1.0 };
    }

    // 2. Query is a substring of the question or vice versa
    if (normalizedQ.includes(normalizedQuery) || normalizedQuery.includes(normalizedQ)) {
      score += 0.6;
    }

    // 3. Keyword matching
    const keywordHits = faq.keywords.filter((kw) =>
      normalizedQuery.includes(kw) || queryWords.some((qw) => kw.includes(qw) || qw.includes(kw))
    );
    score += (keywordHits.length / Math.max(faq.keywords.length, 1)) * 0.5;

    // 4. Word overlap with question
    const questionWords = tokenize(normalizedQ);
    const commonWords = queryWords.filter((qw) =>
      questionWords.some((aw) => aw === qw || (aw.length > 3 && qw.length > 3 && (aw.includes(qw) || qw.includes(aw))))
    );
    score += (commonWords.length / Math.max(queryWords.length, 1)) * 0.35;

    // 5. Word overlap with answer
    const answerWords = tokenize(faq.answer.toLowerCase());
    const answerHits = queryWords.filter((qw) =>
      qw.length > 3 && answerWords.some((aw) => aw === qw)
    );

    // 5.5. Fee intent boost: if user asks about fees/cost, boost Course Fees entries
    if (feeIntent && faq.category === "Course Fees") {
      score += 0.15;
    }
    score += (answerHits.length / Math.max(queryWords.length, 1)) * 0.2;

    // 6. Fuzzy matching bonus (Levenshtein on keywords)
    const fuzzyBonus = faq.keywords.some((kw) =>
      queryWords.some((qw) => qw.length > 3 && kw.length > 3 && levenshtein(qw, kw) <= 2)
    );
    if (fuzzyBonus) score += 0.15;

    return { faq, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return only results with a meaningful score
  return scored.filter((s) => s.score > 0.1);
}

// ===== Tokenizer =====
function tokenize(text) {
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "and", "but", "or", "not", "no", "if", "it",
    "this", "that", "there", "their", "they", "them", "i", "me", "my",
    "you", "your", "we", "our", "he", "she", "his", "her", "its",
    "what", "which", "who", "whom", "how", "when", "where", "why",
    "all", "each", "every", "any", "few", "more", "most", "other",
    "some", "such", "than", "too", "very", "just", "about", "also",
    "so", "up", "out", "am", "please", "tell", "know", "want", "need",
    "get", "give", "let", "like"
  ]);

  return text
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stopWords.has(w));
}

// ===== Levenshtein Distance =====
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ===== UI Helpers =====
function addMessage(html, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  // For bot messages, HTML is already formatted; for user messages, escape and add line breaks
  if (sender === "user") {
    div.textContent = html;
  } else {
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

function hideQuickQuestions() {
  quickEl.classList.add("hidden");
}

// ===== Auto-open after 2 seconds (optional — remove if embedding on real site) =====
// setTimeout(() => { if (!isOpen) toggleBtn.click(); }, 2000);
