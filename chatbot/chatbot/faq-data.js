// UeCampus FAQ Knowledge Base
// Each entry has: id, category, question, answer, keywords (for fuzzy matching)

const FAQ_DATA = [
  // ===== General =====
  {
    id: 1,
    category: "General",
    question: "What is UeCampus?",
    answer: "UeCampus is a fully online education platform that offers flexible, accredited degree programmes and diplomas. It allows students to earn internationally recognized qualifications from anywhere in the world, designed to fit around busy lifestyles.",
    keywords: ["what", "uecampus", "about", "platform", "who", "introduction", "overview", "describe"]
  },
  {
    id: 2,
    category: "General",
    question: "Where is UeCampus based?",
    answer: "UeCampus is a UK-based online education provider. Their contact number is a UK line: +44 7586 797014, and you can reach them at Info@uecampus.com.",
    keywords: ["where", "based", "location", "country", "uk", "united kingdom", "headquarters", "address", "located"]
  },
  {
    id: 3,
    category: "General",
    question: "What is the mission of UeCampus?",
    answer: "UeCampus's mission is to expand access to higher education by providing flexible, affordable, and high-quality online learning opportunities for students worldwide, breaking down barriers and empowering individuals from all backgrounds.",
    keywords: ["mission", "goal", "purpose", "aim", "objective"]
  },
  {
    id: 4,
    category: "General",
    question: "What is the vision of UeCampus?",
    answer: "UeCampus envisions a world where anyone can advance their career and unlock their full potential through knowledge, skills, and opportunity-driven education \u2014 with no limits on time, place, or background.",
    keywords: ["vision", "future", "aspiration", "dream"]
  },
  {
    id: 5,
    category: "General",
    question: "Is UeCampus an official university?",
    answer: "UeCampus is an online education platform that partners with recognized universities and awarding bodies including Walsh College (HLC & ACBSP accredited, USA), PPA / Pole Paris Alternance (France), eie European Business School (MFHEA accredited, Malta), and Qualifi (Ofqual-regulated, UK) to deliver accredited programmes.",
    keywords: ["official", "university", "real", "legitimate", "legit", "accredited", "recognized", "fake", "scam", "trust"]
  },
  {
    id: 6,
    category: "General",
    question: "Who is UeCampus suitable for?",
    answer: "UeCampus is ideal for working professionals, career changers, international students, and anyone who needs a flexible learning schedule to earn a degree or diploma without attending a physical campus.",
    keywords: ["who", "suitable", "for whom", "target", "audience", "ideal", "right for", "working", "professional", "career changer"]
  },
  {
    id: 7,
    category: "General",
    question: "What makes UeCampus different from other online platforms?",
    answer: "UeCampus offers fully accredited programmes through recognized partners (Walsh College, PPA, eie Business School, Qualifi), a simple 3-step enrolment process, globally recognized qualifications, and study options designed for busy lifestyles. All programmes offer installment payment plans and a 5% discount for full upfront payment.",
    keywords: ["different", "unique", "special", "why choose", "better", "advantage", "compared", "comparison", "stand out"]
  },
  {
    id: 8,
    category: "General",
    question: "Can I study at UeCampus from any country?",
    answer: "Yes. UeCampus programmes are fully online and accessible from anywhere in the world. Students can study from their home country without needing to relocate.",
    keywords: ["any country", "international", "worldwide", "global", "abroad", "overseas", "from my country", "location", "anywhere"]
  },
  {
    id: 9,
    category: "General",
    question: "How do I get started with UeCampus?",
    answer: "Getting started is simple:<ul><li>Browse and choose your programme</li><li>Fill in the online application form</li><li>Get enrolled and start learning immediately via the Student Portal</li></ul>",
    keywords: ["get started", "start", "begin", "how to", "first step", "join", "register", "sign up"]
  },
  {
    id: 10,
    category: "General",
    question: "What is the student rating of UeCampus?",
    answer: "UeCampus has a course rating of 4.9 out of 5, reflecting high satisfaction among its student community.",
    keywords: ["rating", "review", "stars", "score", "satisfaction", "feedback", "reputation"]
  },
  {
    id: 11,
    category: "General",
    question: "How many students does UeCampus have?",
    answer: "UeCampus currently has 100 enrolled students, with the community continuing to grow.",
    keywords: ["how many", "students", "enrolled", "number", "count", "size", "community"]
  },
  {
    id: 12,
    category: "General",
    question: "What language are courses taught in?",
    answer: "Courses at UeCampus are conducted in English, as they are delivered through internationally recognized UK, US, and European partner institutions.",
    keywords: ["language", "english", "medium", "taught in", "instruction language", "arabic", "french", "hindi"]
  },

  // ===== Programmes =====
  {
    id: 13,
    category: "Programmes",
    question: "What types of programmes does UeCampus offer?",
    answer: "UeCampus offers a wide range of programmes:<h4>Qualifi Diplomas (Levels 2\u20137)</h4><ul><li>From <span class='fee'>\u00a31,500</span> to <span class='fee'>\u00a33,000</span></li></ul><h4>Bachelor's Degrees</h4><ul><li>Through Walsh College, PPA, and eie Business School</li><li>From <span class='fee'>\u00a34,500</span> to <span class='fee'>\u00a312,000</span></li></ul><h4>Master's / MBA Degrees</h4><ul><li>Through PPA and Walsh College</li><li>From <span class='fee'>\u00a33,500</span> to <span class='fee'>\u00a38,000</span></li></ul><h4>Doctorate Programmes (DBA / PhD)</h4><ul><li>Through Walsh College</li><li><span class='fee'>\u00a320,000</span></li></ul>All programmes are 100% online with flexible payment plans available.",
    keywords: ["types", "programmes", "courses", "offer", "available", "list", "catalog", "what can i study", "all courses", "all programmes"]
  },
  {
    id: 14,
    category: "Programmes",
    question: "What are Walsh Programmes?",
    answer: "Walsh College is a US-based institution accredited by HLC (Higher Learning Commission) and ACBSP. Through UeCampus, Walsh offers:<h4>Bachelor's Degrees</h4><ul><li>BSc Applied Management \u2014 <span class='fee'>\u00a36,600</span> <span class='duration'>(18 months)</span></li><li>BSc Information Technology \u2014 <span class='fee'>\u00a36,600</span> <span class='duration'>(2 years)</span></li><li>BBA General Business \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(18\u201320 months)</span></li><li>BBA Finance \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(3 years)</span></li><li>BBA Marketing \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(2\u20133 years)</span></li><li>BBA Human Resource Management \u2014 <span class='fee'>\u00a34,500</span> <span class='duration'>(18 months)</span></li><li>BSc AI & Machine Learning \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(2 years)</span></li><li>Bachelor's in Data Analytics \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(20 months)</span></li></ul><h4>Master's Degrees</h4><ul><li>MSc Information Technology \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1\u20132 years)</span></li><li>MSc AI and Machine Learning \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1 year)</span></li></ul><h4>Doctorate Programmes</h4><ul><li>DBA (Doctor of Business Administration) \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in Data Analytics \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in Cyber Security \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in AI & Machine Learning \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li></ul>",
    keywords: ["walsh", "walsh university", "walsh college", "walsh programme", "us degree", "american"]
  },
  {
    id: 15,
    category: "Programmes",
    question: "What are PPA Programmes?",
    answer: "PPA (Pole Paris Alternance) is a French partner institution. Through UeCampus, PPA offers:<h4>Bachelor's</h4><ul><li>BBA (Bachelor of Business Administration) \u2014 <span class='fee'>~\u00a34,500</span> <span class='duration'>(18 months)</span></li></ul><h4>MBA Programmes</h4><ul><li>MBA \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1 year)</span></li><li>MBA in Accounting and Finance \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA in Human Resource Management \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA in International Business \u2014 <span class='fee'>\u00a37,000</span> <span class='duration'>(6 months)</span></li><li>MBA in Supply Chain Management \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA for ACCA Members \u2014 <span class='fee'>\u00a33,500</span> <span class='duration'>(6 months)</span></li></ul>PPA MBA programmes typically include a Qualifi Level 7 Diploma as part of the pathway.",
    keywords: ["ppa", "professional progression", "professional programme", "pole paris", "paris"]
  },
  {
    id: 16,
    category: "Programmes",
    question: "What is eie Business School?",
    answer: "eie European Business School (EBS) is an MFHEA-accredited institution based in Malta. Through UeCampus, eie offers:<h4>BA Programmes</h4><ul><li>BA in Accountancy and Finance \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li><li>BA in Business Administration \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li><li>BA in Tourism and Hospitality Management \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li></ul>All eie programmes emphasize real-world experience and staying current with industry trends.",
    keywords: ["eie", "ebs", "business school", "eie business", "european", "malta", "mfhea"]
  },
  {
    id: 17,
    category: "Programmes",
    question: "What are Qualifi Diplomas?",
    answer: "Qualifi is a UK-based Ofqual-regulated awarding body. UeCampus offers Qualifi Diplomas at multiple levels:<ul><li>Level 2 Diploma \u2014 <span class='fee'>\u00a31,500</span> <span class='duration'>(6 months)</span></li><li>Level 3 Diplomas \u2014 <span class='fee'>\u00a31,800\u2013\u00a32,200</span> <span class='duration'>(6\u201312 months)</span></li><li>Level 4 Diplomas \u2014 <span class='fee'>\u00a32,200</span> <span class='duration'>(6 months)</span></li><li>Level 5 Diplomas \u2014 <span class='fee'>\u00a32,200</span> <span class='duration'>(6 months)</span></li><li>Extended Level 5 Diploma \u2014 <span class='fee'>\u00a33,000</span> <span class='duration'>(6 months)</span></li><li>Level 7 Diplomas \u2014 <span class='fee'>\u00a32,200\u2013\u00a32,500</span> <span class='duration'>(6\u201312 months)</span></li></ul>Subjects include Business Management, IT & Data Science, AI, Cyber Security, Hospitality, Education, HR, Health & Social Care, Psychology, Strategic Marketing, Logistics, and more. These diplomas can serve as pathway routes into degree-level programmes.",
    keywords: ["qualifi", "diploma", "ofqual", "awarding body", "qualification", "level"]
  },
  {
    id: 18,
    category: "Programmes",
    question: "Do you offer Bachelor's degree programmes?",
    answer: "Yes! UeCampus offers several Bachelor's programmes:<h4>Walsh College (USA)</h4><ul><li>BSc Applied Management \u2014 <span class='fee'>\u00a36,600</span> <span class='duration'>(18 months)</span></li><li>BSc Information Technology \u2014 <span class='fee'>\u00a36,600</span> <span class='duration'>(2 years)</span></li><li>BBA General Business \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(18\u201320 months)</span></li><li>BBA Finance \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(3 years)</span></li><li>BBA Marketing \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(2\u20133 years)</span></li><li>BBA Human Resource Management \u2014 <span class='fee'>\u00a34,500</span> <span class='duration'>(18 months)</span></li><li>BSc AI & Machine Learning \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(2 years)</span></li><li>Bachelor's in Data Analytics \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(20 months)</span></li></ul><h4>PPA</h4><ul><li>BBA \u2014 <span class='fee'>~\u00a34,500</span> <span class='duration'>(18 months)</span></li></ul><h4>eie Business School (Malta)</h4><ul><li>BA Accountancy & Finance \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li><li>BA Business Administration \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li><li>BA Tourism & Hospitality Management \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li></ul>",
    keywords: ["bachelor", "bachelors", "undergraduate", "ug", "bsc", "ba", "bba", "degree"]
  },
  {
    id: 19,
    category: "Programmes",
    question: "Do you offer Master's degree programmes?",
    answer: "Yes! UeCampus offers these Master's/MBA programmes:<h4>PPA (Pole Paris Alternance)</h4><ul><li>MBA \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1 year)</span></li><li>MBA in Accounting and Finance \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA in Human Resource Management \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA in International Business \u2014 <span class='fee'>\u00a37,000</span> <span class='duration'>(6 months)</span></li><li>MBA in Supply Chain Management \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA for ACCA Members \u2014 <span class='fee'>\u00a33,500</span> <span class='duration'>(6 months)</span></li></ul><h4>Walsh College (USA)</h4><ul><li>MSc Information Technology \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1\u20132 years)</span></li><li>MSc AI and Machine Learning \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1 year)</span></li></ul>",
    keywords: ["master", "masters", "postgraduate", "pg", "msc", "mba", "ma", "graduate"]
  },
  {
    id: 20,
    category: "Programmes",
    question: "Do you offer Doctorate or PhD programmes?",
    answer: "Yes! UeCampus offers Doctorate programmes through Walsh College (USA):<ul><li>Doctor of Business Administration (DBA) \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in Data Analytics \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in Cyber Security \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in AI & Machine Learning \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li></ul>All doctorate programmes are fully online and carry Walsh College's HLC accreditation.",
    keywords: ["doctorate", "phd", "dba", "doctor", "doctoral", "research degree"]
  },
  {
    id: 21,
    category: "Programmes",
    question: "How long does it take to complete a degree?",
    answer: "Programme durations at UeCampus:<ul><li>Qualifi Diplomas \u2014 <span class='duration'>6\u201312 months</span></li><li>Bachelor's Degrees \u2014 <span class='duration'>18 months to 3 years</span></li><li>Master's / MBA \u2014 <span class='duration'>6 months to 2 years</span></li><li>Doctorate (DBA/PhD) \u2014 <span class='duration'>3 years</span></li></ul>Exact duration depends on the specific course and whether you study full-time or part-time.",
    keywords: ["how long", "duration", "time", "complete", "finish", "years", "months", "length"]
  },
  {
    id: 22,
    category: "Programmes",
    question: "Can I study part-time?",
    answer: "Yes. UeCampus programmes are designed with flexibility in mind, allowing students to study at their own pace. Part-time options are available for working professionals.",
    keywords: ["part-time", "part time", "flexible", "own pace", "slow", "balance work"]
  },
  {
    id: 23,
    category: "Programmes",
    question: "Are courses fully online?",
    answer: "Yes, all UeCampus programmes are 100% online. There is no requirement to attend a physical campus or location at any point during your studies.",
    keywords: ["fully online", "online", "remote", "distance", "physical", "campus", "attend", "in person", "on-site"]
  },
  {
    id: 24,
    category: "Programmes",
    question: "Can I switch my programme after enrolling?",
    answer: "Programme changes are possible subject to eligibility and availability. Contact UeCampus at Info@uecampus.com or +44 7586 797014 to discuss your options.",
    keywords: ["switch", "change", "transfer", "programme change", "different course", "swap"]
  },
  {
    id: 25,
    category: "Programmes",
    question: "What subjects or fields are available to study?",
    answer: "UeCampus offers programmes in these fields:<ul><li>Business & Management</li><li>Finance & Accounting</li><li>Human Resource Management</li><li>Marketing</li><li>Information Technology</li><li>Artificial Intelligence & Machine Learning</li><li>Cyber Security</li><li>Data Analytics</li><li>Hospitality & Tourism Management</li><li>Education & Training</li><li>Health & Social Care</li><li>Psychology</li><li>Logistics & Supply Chain Management</li><li>Strategic Leadership</li><li>Process Safety Management</li></ul>Visit uecampus.com/courses for the full list.",
    keywords: ["subjects", "fields", "areas", "topics", "business", "management", "what can i study", "specialization"]
  },

  // ===== Course Fees (Individual) =====
  // --- Qualifi Diplomas ---
  {
    id: 100,
    category: "Course Fees",
    question: "How much does the Level 2 Diploma cost?",
    answer: "The Qualifi Level 2 Diploma costs <span class='fee'>\u00a31,500</span> and takes approximately <span class='duration'>6 months</span> to complete. This is an entry-level qualification regulated by Ofqual (UK). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 2", "diploma", "fee", "cost", "price", "1500"]
  },
  {
    id: 101,
    category: "Course Fees",
    question: "How much does the Level 3 Diploma in Business and Management cost?",
    answer: "The Qualifi Level 3 Integrated Diploma in Business and Management costs <span class='fee'>\u00a31,800</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 3", "business", "management", "diploma", "fee", "cost", "1800"]
  },
  {
    id: 102,
    category: "Course Fees",
    question: "How much does the Level 3 Diploma in IT and Data Science cost?",
    answer: "The Qualifi Level 3 Extended Diploma in IT and Data Science costs <span class='fee'>\u00a32,200</span> and takes approximately <span class='duration'>1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 3", "it", "data science", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 103,
    category: "Course Fees",
    question: "How much does the Level 4 Diploma in Business and Management cost?",
    answer: "The Qualifi Level 4 Diploma in Business and Management costs <span class='fee'>\u00a32,200</span> and takes <span class='duration'>6 months to 1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 4", "business", "management", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 104,
    category: "Course Fees",
    question: "How much does the Level 4 Diploma in Artificial Intelligence cost?",
    answer: "The Qualifi Level 4 Diploma in Artificial Intelligence costs <span class='fee'>\u00a32,200</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 4", "artificial intelligence", "ai", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 105,
    category: "Course Fees",
    question: "How much does the Level 4 Diploma in Cyber Security cost?",
    answer: "The Qualifi Level 4 Diploma in Cyber Security costs <span class='fee'>\u00a32,200</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 4", "cyber security", "cybersecurity", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 106,
    category: "Course Fees",
    question: "How much does the Level 4 Diploma in Hospitality and Tourism Management cost?",
    answer: "The Qualifi Level 4 Diploma in Hospitality and Tourism Management costs <span class='fee'>\u00a32,200</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 4", "hospitality", "tourism", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 107,
    category: "Course Fees",
    question: "How much does the Level 5 Diploma in Business and Management cost?",
    answer: "The Qualifi Level 5 Diploma in Business and Management costs <span class='fee'>\u00a32,200</span> and takes <span class='duration'>6 months to 1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 5", "business", "management", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 108,
    category: "Course Fees",
    question: "How much does the Level 5 Diploma in Education and Training cost?",
    answer: "The Qualifi Level 5 Diploma in Education and Training costs <span class='fee'>\u00a32,200</span> and takes <span class='duration'>6 months to 1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 5", "education", "training", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 109,
    category: "Course Fees",
    question: "How much does the Level 5 Diploma in Hospitality and Tourism Management cost?",
    answer: "The Qualifi Level 5 Diploma in Hospitality and Tourism Management costs <span class='fee'>\u00a32,200</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 5", "hospitality", "tourism", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 110,
    category: "Course Fees",
    question: "How much does the Extended Level 5 Diploma in Business Management cost?",
    answer: "The Qualifi Extended Level 5 Diploma in Business Management costs <span class='fee'>\u00a33,000</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["extended", "level 5", "business", "management", "diploma", "fee", "cost", "3000"]
  },
  {
    id: 111,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Human Resource Management cost?",
    answer: "The Qualifi Level 7 Diploma in Human Resource Management costs <span class='fee'>\u00a32,500</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "human resource", "hr", "hrm", "diploma", "fee", "cost", "2500"]
  },
  {
    id: 112,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Cyber Security cost?",
    answer: "The Qualifi Level 7 Diploma in Cyber Security costs <span class='fee'>\u00a32,200\u2013\u00a32,500</span> and takes <span class='duration'>6 months to 1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "cyber security", "cybersecurity", "diploma", "fee", "cost", "2500"]
  },
  {
    id: 113,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Information Technology cost?",
    answer: "The Qualifi Level 7 Diploma in Information Technology costs <span class='fee'>\u00a32,200\u2013\u00a32,500</span> and takes <span class='duration'>6 months to 1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "information technology", "it", "diploma", "fee", "cost", "2500"]
  },
  {
    id: 114,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Education Management and Leadership cost?",
    answer: "The Qualifi Level 7 Diploma in Education Management and Leadership costs <span class='fee'>\u00a32,500</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "education", "management", "leadership", "diploma", "fee", "cost", "2500"]
  },
  {
    id: 115,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Health and Social Care cost?",
    answer: "The Qualifi Level 7 Diploma in Health and Social Care costs <span class='fee'>\u00a32,500</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "health", "social care", "diploma", "fee", "cost", "2500"]
  },
  {
    id: 116,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Psychology cost?",
    answer: "The Qualifi Level 7 Diploma in Psychology costs <span class='fee'>\u00a32,500</span> and takes approximately <span class='duration'>6 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "psychology", "diploma", "fee", "cost", "2500"]
  },
  {
    id: 117,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Executive Management cost?",
    answer: "The Qualifi Level 7 Diploma in Executive Management costs <span class='fee'>\u00a32,200</span> and takes approximately <span class='duration'>1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "executive", "management", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 118,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Logistics & Supply Chain Crisis Management cost?",
    answer: "The Qualifi Level 7 Diploma in Logistics & Supply Chain Crisis Management costs <span class='fee'>\u00a32,200</span> and takes approximately <span class='duration'>1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "logistics", "supply chain", "crisis", "management", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 119,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Strategic Management and Leadership cost?",
    answer: "The Qualifi Level 7 Diploma in Strategic Management and Leadership costs <span class='fee'>\u00a32,200\u2013\u00a32,500</span> and takes <span class='duration'>6 months to 1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "strategic", "management", "leadership", "diploma", "fee", "cost", "2500"]
  },
  {
    id: 120,
    category: "Course Fees",
    question: "How much does the Level 7 Diploma in Strategic Marketing cost?",
    answer: "The Qualifi Level 7 Diploma in Strategic Marketing costs <span class='fee'>\u00a32,200</span> and takes approximately <span class='duration'>1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "strategic", "marketing", "diploma", "fee", "cost", "2200"]
  },
  {
    id: 121,
    category: "Course Fees",
    question: "How much does the Level 7 International Diploma in Process Safety Management cost?",
    answer: "The Qualifi Level 7 International Diploma in Process Safety Management costs <span class='fee'>\u00a32,500</span> and takes approximately <span class='duration'>1 year</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["level 7", "process safety", "safety management", "international", "diploma", "fee", "cost", "2500"]
  },

  // --- Walsh Bachelor's ---
  {
    id: 130,
    category: "Course Fees",
    question: "How much does the BSc in Applied Management cost?",
    answer: "The BSc in Applied Management (BSAM) from Walsh College costs <span class='fee'>\u00a36,600</span> and takes approximately <span class='duration'>18 months</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["bsc", "applied management", "bsam", "walsh", "bachelor", "fee", "cost", "6600"]
  },
  {
    id: 131,
    category: "Course Fees",
    question: "How much does the BSc in Information Technology cost?",
    answer: "The BSc in Information Technology (BSIT) from Walsh College costs <span class='fee'>\u00a36,600</span> and takes approximately <span class='duration'>2 years</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["bsc", "information technology", "bsit", "it", "walsh", "bachelor", "fee", "cost", "6600"]
  },
  {
    id: 132,
    category: "Course Fees",
    question: "How much does the BBA in General Business cost?",
    answer: "The BBA in General Business from Walsh College costs <span class='fee'>\u00a312,000</span> and takes approximately <span class='duration'>18\u201320 months</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["bba", "general business", "walsh", "bachelor", "fee", "cost", "12000"]
  },
  {
    id: 133,
    category: "Course Fees",
    question: "How much does the BBA in Finance cost?",
    answer: "The BBA in Finance from Walsh College costs <span class='fee'>\u00a312,000</span> and takes approximately <span class='duration'>3 years</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["bba", "finance", "walsh", "bachelor", "fee", "cost", "12000"]
  },
  {
    id: 134,
    category: "Course Fees",
    question: "How much does the BBA in Marketing cost?",
    answer: "The BBA in Marketing from Walsh College costs <span class='fee'>\u00a312,000</span> and takes approximately <span class='duration'>2\u20133 years</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["bba", "marketing", "walsh", "bachelor", "fee", "cost", "12000"]
  },
  {
    id: 135,
    category: "Course Fees",
    question: "How much does the BBA in Human Resource Management cost?",
    answer: "The BBA in Human Resource Management from Walsh College costs <span class='fee'>\u00a34,500</span> and takes approximately <span class='duration'>18 months</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["bba", "human resource", "hr", "hrm", "walsh", "bachelor", "fee", "cost", "4500"]
  },
  {
    id: 136,
    category: "Course Fees",
    question: "How much does the BSc in AI & Machine Learning cost?",
    answer: "The BSc in Artificial Intelligence & Machine Learning from Walsh College costs <span class='fee'>\u00a312,000</span> and takes approximately <span class='duration'>2 years</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["bsc", "artificial intelligence", "ai", "machine learning", "ml", "walsh", "bachelor", "fee", "cost", "12000"]
  },
  {
    id: 137,
    category: "Course Fees",
    question: "How much does the Bachelor's in Data Analytics cost?",
    answer: "The Bachelor's in Data Analytics from Walsh College costs <span class='fee'>\u00a312,000</span> and takes approximately <span class='duration'>20 months</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["bachelor", "data analytics", "data", "analytics", "walsh", "fee", "cost", "12000"]
  },

  // --- eie Business School Bachelor's ---
  {
    id: 140,
    category: "Course Fees",
    question: "How much does the BA in Accountancy and Finance from eie Business School cost?",
    answer: "The BA in Accountancy and Finance from eie European Business School (MFHEA accredited, Malta) costs <span class='fee'>\u00a36,500</span> and takes approximately <span class='duration'>2 years</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["ba", "accountancy", "finance", "eie", "ebs", "bachelor", "fee", "cost", "6500"]
  },
  {
    id: 141,
    category: "Course Fees",
    question: "How much does the BA in Business Administration from eie Business School cost?",
    answer: "The BA in Business Administration from eie European Business School (MFHEA accredited, Malta) costs <span class='fee'>\u00a36,500</span> and takes approximately <span class='duration'>2 years</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["ba", "business administration", "eie", "ebs", "bachelor", "fee", "cost", "6500"]
  },
  {
    id: 142,
    category: "Course Fees",
    question: "How much does the BA in Tourism and Hospitality Management from eie Business School cost?",
    answer: "The BA in Tourism and Hospitality Management from eie European Business School (MFHEA accredited, Malta) costs <span class='fee'>\u00a36,500</span> and takes approximately <span class='duration'>2 years</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["ba", "tourism", "hospitality", "eie", "ebs", "bachelor", "fee", "cost", "6500"]
  },

  // --- PPA Programmes ---
  {
    id: 145,
    category: "Course Fees",
    question: "How much does the PPA BBA cost?",
    answer: "The BBA (Bachelor of Business Administration) from PPA (Pole Paris Alternance) costs approximately <span class='fee'>\u00a34,500</span> and takes about <span class='duration'>18 months</span> to complete. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["ppa", "bba", "bachelor", "business administration", "fee", "cost", "4500"]
  },
  {
    id: 146,
    category: "Course Fees",
    question: "How much does the MBA cost?",
    answer: "The MBA (Master of Business Administration) from PPA costs <span class='fee'>\u00a38,000</span> and takes approximately <span class='duration'>1 year</span> to complete. This includes a Qualifi Level 7 Diploma as part of the pathway. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["mba", "master", "business administration", "ppa", "fee", "cost", "8000"]
  },
  {
    id: 147,
    category: "Course Fees",
    question: "How much does the MBA in Accounting and Finance cost?",
    answer: "The MBA in Accounting and Finance from PPA costs <span class='fee'>\u00a34,000</span> and takes approximately <span class='duration'>6 months</span> to complete. This includes a Qualifi Level 7 Diploma pathway. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["mba", "accounting", "finance", "ppa", "fee", "cost", "4000"]
  },
  {
    id: 148,
    category: "Course Fees",
    question: "How much does the MBA in Human Resource Management cost?",
    answer: "The MBA in Human Resource Management from PPA costs <span class='fee'>\u00a34,000</span> and takes approximately <span class='duration'>6 months</span> to complete. This includes a Qualifi Level 7 Diploma pathway. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["mba", "human resource", "hr", "hrm", "ppa", "fee", "cost", "4000"]
  },
  {
    id: 149,
    category: "Course Fees",
    question: "How much does the MBA in International Business cost?",
    answer: "The MBA in International Business from PPA costs <span class='fee'>\u00a37,000</span> and takes approximately <span class='duration'>6 months</span> to complete. This includes a Qualifi Level 7 Diploma pathway. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["mba", "international business", "ppa", "fee", "cost", "7000"]
  },
  {
    id: 150,
    category: "Course Fees",
    question: "How much does the MBA in Supply Chain Management cost?",
    answer: "The MBA in Supply Chain Management from PPA costs <span class='fee'>\u00a34,000</span> and takes approximately <span class='duration'>6 months</span> to complete. This includes a Qualifi Level 7 Diploma pathway. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["mba", "supply chain", "management", "ppa", "fee", "cost", "4000"]
  },
  {
    id: 151,
    category: "Course Fees",
    question: "How much does the MBA for ACCA Members cost?",
    answer: "The MBA for ACCA Members from PPA costs <span class='fee'>\u00a33,500</span> and takes approximately <span class='duration'>6 months</span> to complete. This is specifically designed for ACCA-qualified professionals. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["mba", "acca", "ppa", "fee", "cost", "3500"]
  },

  // --- Walsh Master's ---
  {
    id: 155,
    category: "Course Fees",
    question: "How much does the MSc in Information Technology cost?",
    answer: "The MSc in Information Technology from Walsh College costs <span class='fee'>\u00a38,000</span> and takes <span class='duration'>1\u20132 years</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["msc", "information technology", "it", "walsh", "master", "fee", "cost", "8000"]
  },
  {
    id: 156,
    category: "Course Fees",
    question: "How much does the MSc in AI and Machine Learning cost?",
    answer: "The MSc in AI and Machine Learning from Walsh College costs <span class='fee'>\u00a38,000</span> and takes approximately <span class='duration'>1 year</span> to complete. This is a US-accredited degree (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["msc", "artificial intelligence", "ai", "machine learning", "ml", "walsh", "master", "fee", "cost", "8000"]
  },

  // --- Walsh Doctorates ---
  {
    id: 160,
    category: "Course Fees",
    question: "How much does the DBA (Doctor of Business Administration) cost?",
    answer: "The Doctor of Business Administration (DBA) from Walsh College costs <span class='fee'>\u00a320,000</span> and takes approximately <span class='duration'>3 years</span> to complete. This is a US-accredited doctorate (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["dba", "doctor", "business administration", "doctorate", "walsh", "fee", "cost", "20000"]
  },
  {
    id: 161,
    category: "Course Fees",
    question: "How much does the PhD in Data Analytics cost?",
    answer: "The PhD in Data Analytics from Walsh College costs <span class='fee'>\u00a320,000</span> and takes approximately <span class='duration'>3 years</span> to complete. This is a US-accredited doctorate (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["phd", "data analytics", "data", "doctorate", "walsh", "fee", "cost", "20000"]
  },
  {
    id: 162,
    category: "Course Fees",
    question: "How much does the PhD in Cyber Security cost?",
    answer: "The PhD in Cyber Security from Walsh College costs <span class='fee'>\u00a320,000</span> and takes approximately <span class='duration'>3 years</span> to complete. This is a US-accredited doctorate (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["phd", "cyber security", "cybersecurity", "doctorate", "walsh", "fee", "cost", "20000"]
  },
  {
    id: 163,
    category: "Course Fees",
    question: "How much does the PhD in AI & Machine Learning cost?",
    answer: "The PhD in AI & Machine Learning from Walsh College costs <span class='fee'>\u00a320,000</span> and takes approximately <span class='duration'>3 years</span> to complete. This is a US-accredited doctorate (HLC & ACBSP). Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["phd", "artificial intelligence", "ai", "machine learning", "ml", "doctorate", "walsh", "fee", "cost", "20000"]
  },

  // ===== Admission =====
  {
    id: 200,
    category: "Admission",
    question: "How do I apply to UeCampus?",
    answer: "Applying is a simple 3-step process:<ul><li>Choose your programme from uecampus.com/courses</li><li>Fill in the online application form with your personal and academic details</li><li>Once accepted, access the Student Portal and start learning immediately</li></ul>",
    keywords: ["apply", "application", "how to apply", "enroll", "enrol", "admission", "register", "sign up", "join"]
  },
  {
    id: 201,
    category: "Admission",
    question: "What are the admission requirements?",
    answer: "Entry requirements vary by programme level:<ul><li>Diplomas \u2014 may have flexible entry, depending on the level</li><li>Undergraduate degrees \u2014 completion of secondary education (A-levels or equivalent)</li><li>Postgraduate degrees \u2014 a bachelor's degree</li><li>Doctorate \u2014 a master's degree or relevant experience</li></ul>Contact UeCampus for programme-specific requirements.",
    keywords: ["requirements", "eligibility", "criteria", "qualification", "entry", "prerequisite", "need", "a-levels", "grades"]
  },
  {
    id: 202,
    category: "Admission",
    question: "What documents do I need to apply?",
    answer: "Typically you will need:<ul><li>Identification (passport or national ID)</li><li>Academic transcripts or certificates</li><li>Possibly a personal statement</li></ul>Exact document requirements depend on the programme \u2014 check with UeCampus directly.",
    keywords: ["documents", "papers", "passport", "transcript", "certificate", "id", "required documents", "upload"]
  },
  {
    id: 203,
    category: "Admission",
    question: "Is there an application deadline?",
    answer: "UeCampus accepts applications on a rolling basis, meaning you can apply at any time of the year. There is no fixed intake deadline for most programmes.",
    keywords: ["deadline", "last date", "closing date", "when to apply", "intake", "rolling", "cutoff"]
  },
  {
    id: 204,
    category: "Admission",
    question: "How long does the application process take?",
    answer: "The application process at UeCampus is designed to be quick. Once you submit your form, you can expect a response in a short turnaround. Contact Info@uecampus.com for current processing times.",
    keywords: ["how long", "application process", "processing time", "wait", "turnaround", "response time"]
  },
  {
    id: 205,
    category: "Admission",
    question: "Can I apply without completing my previous degree?",
    answer: "This depends on the programme you are applying for. Some diploma programmes may have more flexible entry requirements. Reach out to UeCampus to discuss your specific situation.",
    keywords: ["without degree", "incomplete", "no degree", "drop out", "previous education", "unfinished"]
  },
  {
    id: 206,
    category: "Admission",
    question: "Is there an entrance exam?",
    answer: "UeCampus does not currently require an entrance exam. Admission is primarily based on your academic qualifications and application form.",
    keywords: ["entrance exam", "test", "exam", "assessment", "aptitude", "ielts", "toefl"]
  },
  {
    id: 207,
    category: "Admission",
    question: "Can I defer my enrolment after being accepted?",
    answer: "Deferral options may be available depending on the programme. Contact UeCampus at Info@uecampus.com to request a deferral and discuss available options.",
    keywords: ["defer", "deferral", "postpone", "delay", "later", "next intake"]
  },
  {
    id: 208,
    category: "Admission",
    question: "Will I receive a confirmation of acceptance?",
    answer: "Yes. Once your application is reviewed and accepted, you will receive confirmation and instructions on how to access the Student Portal to begin your studies.",
    keywords: ["confirmation", "acceptance", "offer letter", "accepted", "approved", "status"]
  },
  {
    id: 209,
    category: "Admission",
    question: "What is the minimum age requirement?",
    answer: "The minimum age for enrolment is typically 18 years, in line with higher education standards. Some programmes may have different requirements \u2014 contact UeCampus to confirm.",
    keywords: ["age", "minimum age", "how old", "18", "years old", "age limit", "young"]
  },
  {
    id: 210,
    category: "Admission",
    question: "Can I apply if I am already working full-time?",
    answer: "Absolutely. UeCampus programmes are specifically designed for working professionals. The fully online, self-paced format means you can study around your work schedule.",
    keywords: ["working", "full-time job", "employed", "job", "work and study", "balance", "busy"]
  },

  // ===== Accreditation =====
  {
    id: 300,
    category: "Accreditation",
    question: "Are UeCampus degrees internationally recognized?",
    answer: "Yes. UeCampus partners with internationally recognized institutions:<ul><li>Walsh College (USA) \u2014 accredited by HLC & ACBSP</li><li>Qualifi (UK) \u2014 regulated by Ofqual</li><li>PPA / Pole Paris Alternance (France)</li><li>eie European Business School (Malta) \u2014 accredited by MFHEA</li></ul>Degrees are accepted globally by employers and academic institutions.",
    keywords: ["internationally recognized", "recognized", "accepted", "global", "valid", "worldwide", "value"]
  },
  {
    id: 301,
    category: "Accreditation",
    question: "Who accredits UeCampus programmes?",
    answer: "UeCampus programmes are accredited through its partner institutions:<ul><li>Walsh College \u2014 HLC (Higher Learning Commission) & ACBSP accredited (USA)</li><li>Qualifi \u2014 Ofqual-regulated (UK)</li><li>PPA / Pole Paris Alternance (France)</li><li>eie European Business School \u2014 MFHEA accredited (Malta)</li></ul>",
    keywords: ["accredits", "accreditation", "accredited by", "who", "authority", "body", "hlc", "acbsp", "mfhea"]
  },
  {
    id: 302,
    category: "Accreditation",
    question: "Is Qualifi a recognized awarding body?",
    answer: "Yes. Qualifi is regulated by Ofqual (Office of Qualifications and Examinations Regulation) in the UK, making its diplomas and qualifications officially recognized credentials.",
    keywords: ["qualifi", "recognized", "ofqual", "awarding body", "regulated", "official"]
  },
  {
    id: 303,
    category: "Accreditation",
    question: "Will my degree be accepted by employers?",
    answer: "Yes. Because UeCampus qualifications are issued through accredited partner institutions (Walsh, Qualifi, etc.), they carry the same weight as qualifications from those institutions and are recognized by employers globally.",
    keywords: ["employer", "accepted", "job", "hiring", "cv", "resume", "worth", "value", "respected"]
  },
  {
    id: 304,
    category: "Accreditation",
    question: "Is the Walsh College degree recognized in the US?",
    answer: "Yes. Walsh College is accredited by the Higher Learning Commission (HLC) and ACBSP in the United States. Degrees earned through Walsh programmes at UeCampus carry Walsh College's full accreditation and are recognized accordingly.",
    keywords: ["walsh", "us", "usa", "america", "united states", "recognized in us", "hlc", "acbsp"]
  },
  {
    id: 305,
    category: "Accreditation",
    question: "Will my qualification be recognized in the UAE?",
    answer: "UeCampus is internationally focused and accessible to students in the UAE and wider Middle East. For formal recognition by UAE government bodies, it is advisable to verify through your local authority (e.g., KHDA or MOE).",
    keywords: ["uae", "dubai", "abu dhabi", "middle east", "khda", "moe", "gulf", "recognized in uae", "emirates"]
  },
  {
    id: 306,
    category: "Accreditation",
    question: "Can I use my UeCampus qualification for further study?",
    answer: "Yes. Qualifications from UeCampus's accredited partners can be used as pathways into further education. For example, a Qualifi diploma can qualify you for direct entry into a bachelor's or master's programme.",
    keywords: ["further study", "pathway", "progression", "continue", "higher degree", "next level", "top-up"]
  },
  {
    id: 307,
    category: "Accreditation",
    question: "Who are UeCampus's international partners?",
    answer: "UeCampus collaborates with four main partners:<ul><li>Walsh College (USA) \u2014 HLC & ACBSP accredited, offers BSc, BBA, MSc, DBA, PhD</li><li>PPA / Pole Paris Alternance (France) \u2014 offers BBA and MBA programmes</li><li>eie European Business School (Malta) \u2014 MFHEA accredited, offers BA degrees</li><li>Qualifi (UK) \u2014 Ofqual-regulated, offers Level 2\u20137 diplomas</li></ul>",
    keywords: ["partners", "partner institutions", "collaborations", "affiliations", "tie-ups"]
  },
  {
    id: 308,
    category: "Accreditation",
    question: "Is eie Business School accredited?",
    answer: "Yes. eie European Business School (EBS) is accredited by MFHEA (Malta Further and Higher Education Authority). It is based in Malta and offers BA-level programmes in Accountancy & Finance, Business Administration, and Tourism & Hospitality Management through UeCampus.",
    keywords: ["eie", "ebs", "accredited", "business school accreditation", "mfhea", "malta"]
  },

  // ===== Scholarships =====
  {
    id: 400,
    category: "Scholarships",
    question: "Does UeCampus offer scholarships?",
    answer: "Yes, UeCampus has a dedicated Scholarships page (uecampus.com/scholarship). Scholarship offerings are updated periodically \u2014 visit the page or contact UeCampus for current available scholarships.",
    keywords: ["scholarship", "scholarships", "financial aid", "funding", "free", "discount", "sponsorship"]
  },
  {
    id: 401,
    category: "Scholarships",
    question: "Who is eligible for a scholarship?",
    answer: "Scholarship eligibility varies by programme and scholarship type. Criteria may include academic merit, financial need, or geographic background. Contact Info@uecampus.com for eligibility details.",
    keywords: ["eligible", "eligibility", "qualify", "who can get", "criteria", "requirements"]
  },
  {
    id: 402,
    category: "Scholarships",
    question: "How do I apply for a scholarship?",
    answer: "To apply for a scholarship, visit uecampus.com/scholarship for details, or contact the UeCampus team directly at Info@uecampus.com or +44 7586 797014.",
    keywords: ["apply scholarship", "how to get scholarship", "scholarship application", "apply for funding"]
  },
  {
    id: 403,
    category: "Scholarships",
    question: "Are there merit-based scholarships?",
    answer: "UeCampus offers scholarship opportunities that may include merit-based awards. Check the scholarship page or speak with the admissions team for the most current offerings.",
    keywords: ["merit", "merit-based", "academic", "grades", "performance", "top students"]
  },
  {
    id: 404,
    category: "Scholarships",
    question: "Are there scholarships for international students?",
    answer: "UeCampus is an internationally focused platform serving students globally. Scholarship availability for international students can be confirmed by contacting Info@uecampus.com.",
    keywords: ["international scholarship", "foreign student", "overseas", "global scholarship"]
  },
  {
    id: 405,
    category: "Scholarships",
    question: "Can I apply for a scholarship after enrolling?",
    answer: "Some scholarships may be available post-enrolment. Reach out to UeCampus to find out which scholarships you may still be eligible for after starting your programme.",
    keywords: ["after enrolling", "already enrolled", "current student", "post enrolment"]
  },
  {
    id: 406,
    category: "Scholarships",
    question: "Is there financial support for working professionals?",
    answer: "UeCampus is designed for working professionals and may offer scholarship or financial assistance options tailored to them. Contact the team at Info@uecampus.com to explore your options.",
    keywords: ["working professional", "financial support", "employed", "assistance", "help paying"]
  },
  {
    id: 407,
    category: "Scholarships",
    question: "When are scholarship applications open?",
    answer: "Scholarship windows vary. Visit uecampus.com/scholarship regularly for updates, or subscribe to UeCampus updates via the newsletter on their website.",
    keywords: ["when", "scholarship open", "deadline", "dates", "window", "availability"]
  },

  // ===== Student Life =====
  {
    id: 500,
    category: "Student Life",
    question: "How does online learning work at UeCampus?",
    answer: "Once enrolled, students access course materials, lectures, and assignments through the UeCampus Student Portal. You can study at your own pace, with no fixed class times required.",
    keywords: ["how does it work", "online learning", "how to study", "learning experience", "method", "format"]
  },
  {
    id: 501,
    category: "Student Life",
    question: "How do I access the Student Portal?",
    answer: "The Student Portal is accessible via the 'Student Portal' button on the UeCampus website at uecampus.com. You will receive login credentials upon enrolment.",
    keywords: ["student portal", "portal", "login", "access", "dashboard", "lms", "platform"]
  },
  {
    id: 502,
    category: "Student Life",
    question: "Can I study at my own pace?",
    answer: "Yes. UeCampus programmes are designed to be flexible and self-paced, allowing you to study when and where it suits you \u2014 ideal for professionals balancing work and study.",
    keywords: ["own pace", "self-paced", "flexible", "schedule", "anytime", "my time"]
  },
  {
    id: 503,
    category: "Student Life",
    question: "Are there live classes or is content pre-recorded?",
    answer: "UeCampus's model is focused on flexible online delivery. For details on live vs. recorded content in your specific programme, contact Info@uecampus.com.",
    keywords: ["live", "recorded", "pre-recorded", "classes", "lectures", "zoom", "video", "webinar"]
  },
  {
    id: 504,
    category: "Student Life",
    question: "How are assignments submitted?",
    answer: "Assignments are submitted digitally through the Student Portal. Your programme guidelines will outline specific submission formats and deadlines.",
    keywords: ["assignment", "submit", "submission", "homework", "coursework", "upload work"]
  },
  {
    id: 505,
    category: "Student Life",
    question: "How are exams conducted?",
    answer: "Examinations are conducted online through the Student Portal. The format (open book, timed, proctored, etc.) depends on your specific programme and the awarding body.",
    keywords: ["exam", "examination", "test", "assessment", "proctored", "open book", "final exam"]
  },
  {
    id: 506,
    category: "Student Life",
    question: "What happens if I miss a deadline?",
    answer: "Missed deadline policies vary by programme and partner institution. It is recommended to contact your course coordinator or reach out to UeCampus support as soon as possible.",
    keywords: ["miss", "deadline", "late", "missed", "extension", "overdue", "penalty"]
  },
  {
    id: 507,
    category: "Student Life",
    question: "Is there a student community?",
    answer: "UeCampus encourages student interaction as part of the online learning experience. For information on forums, peer groups, or communities, contact the UeCampus team.",
    keywords: ["community", "forum", "peers", "classmates", "network", "social", "interact", "group"]
  },
  {
    id: 508,
    category: "Student Life",
    question: "Can I interact with lecturers?",
    answer: "Yes. Students can interact with course instructors and the UeCampus support team throughout their studies. The exact mode of interaction depends on the programme.",
    keywords: ["lecturer", "teacher", "instructor", "professor", "tutor", "interact", "contact", "ask questions"]
  },
  {
    id: 509,
    category: "Student Life",
    question: "What devices do I need to study online?",
    answer: "You need a computer, tablet, or smartphone with a reliable internet connection to access the Student Portal and course materials. No special software installations are required.",
    keywords: ["device", "computer", "laptop", "phone", "tablet", "requirements", "technical", "internet", "software", "hardware"]
  },
  {
    id: 510,
    category: "Student Life",
    question: "Will I receive a certificate upon completion?",
    answer: "Yes. Upon successfully completing your programme, you will receive an official qualification or certificate from the relevant awarding partner (Walsh College, Qualifi, PPA, or eie Business School).",
    keywords: ["certificate", "completion", "graduation", "degree certificate", "qualification", "diploma", "receive", "get"]
  },
  {
    id: 511,
    category: "Student Life",
    question: "Is there a blog or learning resource available?",
    answer: "Yes. UeCampus has a Blogs section at uecampus.com/blogs focused on the latest industry trends and market updates, encouraging students to stay updated beyond their formal coursework.",
    keywords: ["blog", "resource", "learning resource", "articles", "reading", "trends", "news"]
  },

  // ===== Fees & Payment =====
  {
    id: 600,
    category: "Fees & Payment",
    question: "How much do programmes cost?",
    answer: "Here's an overview of UeCampus programme fees:<h4>Qualifi Diplomas</h4><ul><li>Level 2: <span class='fee'>\u00a31,500</span></li><li>Level 3: <span class='fee'>\u00a31,800\u2013\u00a32,200</span></li><li>Level 4: <span class='fee'>\u00a32,200</span></li><li>Level 5: <span class='fee'>\u00a32,200\u2013\u00a33,000</span></li><li>Level 7: <span class='fee'>\u00a32,200\u2013\u00a32,500</span></li></ul><h4>Bachelor's Degrees</h4><ul><li>Walsh College: <span class='fee'>\u00a34,500\u2013\u00a312,000</span></li><li>PPA BBA: <span class='fee'>~\u00a34,500</span></li><li>eie BA: <span class='fee'>\u00a36,500</span></li></ul><h4>Master's / MBA</h4><ul><li>PPA MBA: <span class='fee'>\u00a33,500\u2013\u00a38,000</span></li><li>Walsh MSc: <span class='fee'>\u00a38,000</span></li></ul><h4>Doctorate</h4><ul><li>Walsh DBA/PhD: <span class='fee'>\u00a320,000</span></li></ul>All programmes offer installment plans and a 5% discount for full upfront payment. Ask me about any specific course for detailed pricing!",
    keywords: ["cost", "price", "fee", "fees", "how much", "tuition", "expensive", "cheap", "affordable", "pricing", "all fees", "fee structure"]
  },
  {
    id: 601,
    category: "Fees & Payment",
    question: "What are the Qualifi Diploma fees?",
    answer: "Qualifi Diploma fees by level:<ul><li>Level 2 Diploma \u2014 <span class='fee'>\u00a31,500</span> <span class='duration'>(6 months)</span></li><li>Level 3 Diplomas \u2014 <span class='fee'>\u00a31,800\u2013\u00a32,200</span> <span class='duration'>(6\u201312 months)</span></li><li>Level 4 Diplomas \u2014 <span class='fee'>\u00a32,200</span> <span class='duration'>(6 months)</span></li><li>Level 5 Diplomas \u2014 <span class='fee'>\u00a32,200</span> <span class='duration'>(6 months)</span></li><li>Extended Level 5 Diploma \u2014 <span class='fee'>\u00a33,000</span> <span class='duration'>(6 months)</span></li><li>Level 7 Diplomas \u2014 <span class='fee'>\u00a32,200\u2013\u00a32,500</span> <span class='duration'>(6\u201312 months)</span></li></ul>All include payment plan options and a 5% discount for full upfront payment.",
    keywords: ["qualifi", "diploma fees", "diploma cost", "diploma price", "level fees"]
  },
  {
    id: 602,
    category: "Fees & Payment",
    question: "What are the Bachelor's degree fees?",
    answer: "Bachelor's degree fees at UeCampus:<h4>Walsh College (USA, HLC & ACBSP)</h4><ul><li>BSc Applied Management \u2014 <span class='fee'>\u00a36,600</span> <span class='duration'>(18 months)</span></li><li>BSc Information Technology \u2014 <span class='fee'>\u00a36,600</span> <span class='duration'>(2 years)</span></li><li>BBA General Business \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(18\u201320 months)</span></li><li>BBA Finance \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(3 years)</span></li><li>BBA Marketing \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(2\u20133 years)</span></li><li>BBA Human Resource Management \u2014 <span class='fee'>\u00a34,500</span> <span class='duration'>(18 months)</span></li><li>BSc AI & Machine Learning \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(2 years)</span></li><li>Bachelor's in Data Analytics \u2014 <span class='fee'>\u00a312,000</span> <span class='duration'>(20 months)</span></li></ul><h4>PPA</h4><ul><li>BBA \u2014 <span class='fee'>~\u00a34,500</span> <span class='duration'>(18 months)</span></li></ul><h4>eie Business School (Malta, MFHEA)</h4><ul><li>BA Accountancy & Finance \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li><li>BA Business Administration \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li><li>BA Tourism & Hospitality \u2014 <span class='fee'>\u00a36,500</span> <span class='duration'>(2 years)</span></li></ul>",
    keywords: ["bachelor fees", "bachelor cost", "undergraduate fees", "bsc fees", "bba fees", "ba fees", "degree cost"]
  },
  {
    id: 603,
    category: "Fees & Payment",
    question: "What are the Master's and MBA fees?",
    answer: "Master's and MBA fees at UeCampus:<h4>PPA (Pole Paris Alternance)</h4><ul><li>MBA \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1 year)</span></li><li>MBA Accounting & Finance \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA Human Resource Management \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA International Business \u2014 <span class='fee'>\u00a37,000</span> <span class='duration'>(6 months)</span></li><li>MBA Supply Chain Management \u2014 <span class='fee'>\u00a34,000</span> <span class='duration'>(6 months)</span></li><li>MBA for ACCA Members \u2014 <span class='fee'>\u00a33,500</span> <span class='duration'>(6 months)</span></li></ul><h4>Walsh College (USA, HLC & ACBSP)</h4><ul><li>MSc Information Technology \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1\u20132 years)</span></li><li>MSc AI & Machine Learning \u2014 <span class='fee'>\u00a38,000</span> <span class='duration'>(1 year)</span></li></ul>All include installment plans and a 5% upfront payment discount.",
    keywords: ["master fees", "mba fees", "mba cost", "msc fees", "postgraduate fees", "master cost"]
  },
  {
    id: 604,
    category: "Fees & Payment",
    question: "What are the Doctorate/PhD fees?",
    answer: "Doctorate programme fees at UeCampus (all through Walsh College, USA):<ul><li>Doctor of Business Administration (DBA) \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in Data Analytics \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in Cyber Security \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li><li>PhD in AI & Machine Learning \u2014 <span class='fee'>\u00a320,000</span> <span class='duration'>(3 years)</span></li></ul>All doctorate programmes are HLC & ACBSP accredited. Payment plans are available, and you get a 5% discount for full upfront payment.",
    keywords: ["doctorate fees", "phd fees", "phd cost", "dba fees", "dba cost", "doctoral fees"]
  },
  {
    id: 605,
    category: "Fees & Payment",
    question: "Are installment payment plans available?",
    answer: "Yes! All UeCampus programmes offer flexible payment options including monthly, quarterly, and semi-annual installment plans. You also get a 5% discount if you pay the full fee upfront. Contact Info@uecampus.com for a payment plan tailored to your programme.",
    keywords: ["installment", "payment plan", "emi", "monthly", "pay in parts", "split payment", "quarterly"]
  },
  {
    id: 606,
    category: "Fees & Payment",
    question: "Is there a discount for paying upfront?",
    answer: "Yes! All UeCampus programmes offer a <span class='fee'>5% discount</span> for full upfront payment. For example, the \u00a38,000 MBA would cost \u00a37,600 if paid in full. Contact Info@uecampus.com for details.",
    keywords: ["discount", "upfront", "full payment", "early payment", "5%", "save money"]
  },
  {
    id: 607,
    category: "Fees & Payment",
    question: "What currencies are accepted?",
    answer: "UeCampus is a UK-based platform and fees are listed in British Pounds (\u00a3 GBP). Payment currency options should be confirmed with the UeCampus team at Info@uecampus.com, especially for international students.",
    keywords: ["currency", "currencies", "dollar", "pound", "euro", "dirham", "rupee", "payment method", "gbp"]
  },
  {
    id: 608,
    category: "Fees & Payment",
    question: "Are there any hidden fees?",
    answer: "UeCampus promotes transparent, affordable education. Always clarify all associated costs \u2014 including registration, materials, and exam fees \u2014 with the team before enrolling.",
    keywords: ["hidden fees", "extra cost", "additional charges", "transparent", "surprise charges"]
  },
  {
    id: 609,
    category: "Fees & Payment",
    question: "Is there a registration or enrolment fee?",
    answer: "Enrolment fee details are available upon application. Contact UeCampus at Info@uecampus.com for a full breakdown of all costs associated with your chosen programme.",
    keywords: ["registration fee", "enrolment fee", "enrollment fee", "application fee", "joining fee"]
  },
  {
    id: 610,
    category: "Fees & Payment",
    question: "What is the refund policy?",
    answer: "Refund policies vary by programme and partner institution. For specific refund terms, contact Info@uecampus.com before enrolling to understand your rights and options.",
    keywords: ["refund", "money back", "cancel", "cancellation", "withdrawal", "return money"]
  },
  {
    id: 611,
    category: "Fees & Payment",
    question: "Can my employer pay for my studies?",
    answer: "Yes, employer sponsorship is a common way to fund online education. UeCampus can provide enrolment letters and documentation needed for corporate sponsorship applications.",
    keywords: ["employer", "company pay", "sponsor", "sponsorship", "corporate", "company fund", "employer pay"]
  },
  {
    id: 612,
    category: "Fees & Payment",
    question: "Do fees differ for international students?",
    answer: "Fee structures may vary depending on your location and the programme. Contact the UeCampus admissions team for international student-specific fee information.",
    keywords: ["international fees", "different fees", "overseas fees", "foreign student fees"]
  },
  {
    id: 613,
    category: "Fees & Payment",
    question: "Is there a free trial or demo available?",
    answer: "For information about any trial access, demo sessions, or open days, contact UeCampus directly at Info@uecampus.com or +44 7586 797014.",
    keywords: ["free trial", "demo", "try", "sample", "preview", "free access", "open day"]
  },
  {
    id: 614,
    category: "Fees & Payment",
    question: "What is the cheapest programme available?",
    answer: "The most affordable programmes at UeCampus are:<ul><li>Qualifi Level 2 Diploma \u2014 <span class='fee'>\u00a31,500</span> <span class='duration'>(6 months)</span></li><li>Qualifi Level 3 Diploma in Business & Management \u2014 <span class='fee'>\u00a31,800</span> <span class='duration'>(6 months)</span></li><li>MBA for ACCA Members (PPA) \u2014 <span class='fee'>\u00a33,500</span> <span class='duration'>(6 months)</span></li><li>BBA in HR Management (Walsh) \u2014 <span class='fee'>\u00a34,500</span> <span class='duration'>(18 months)</span></li></ul>All programmes offer installment payment plans and scholarships may also be available at uecampus.com/scholarship.",
    keywords: ["cheapest", "affordable", "lowest", "budget", "minimum", "least expensive", "low cost"]
  },

  // ===== Support =====
  {
    id: 700,
    category: "Support",
    question: "How can I contact UeCampus?",
    answer: "You can contact UeCampus via:<ul><li>Email: Info@uecampus.com</li><li>Phone: +44 7586 797014</li><li>WhatsApp: +44 7586 797014</li><li>Contact form: uecampus.com/contact-us</li></ul>You can also connect on Facebook, Twitter, LinkedIn, and Instagram.",
    keywords: ["contact", "reach", "phone", "email", "call", "get in touch", "talk to", "customer service", "help", "whatsapp"]
  },
  {
    id: 701,
    category: "Support",
    question: "What are UeCampus's support hours?",
    answer: "Support hours are not listed on the website. Contact Info@uecampus.com or call +44 7586 797014 to find out when the team is available.",
    keywords: ["support hours", "working hours", "available", "open", "timings", "office hours"]
  },
  {
    id: 702,
    category: "Support",
    question: "Is there academic support or tutoring?",
    answer: "UeCampus states that learners have access to support throughout their studies. For specific academic support services in your programme, contact Info@uecampus.com.",
    keywords: ["academic support", "tutoring", "tutor", "help with studies", "learning support", "mentor"]
  },
  {
    id: 703,
    category: "Support",
    question: "What if I have a technical problem with the portal?",
    answer: "For technical issues with the Student Portal, contact UeCampus support at Info@uecampus.com or +44 7586 797014 and describe the issue for prompt assistance.",
    keywords: ["technical", "problem", "issue", "bug", "error", "not working", "portal issue", "can't login", "glitch"]
  },
  {
    id: 704,
    category: "Support",
    question: "Who do I contact for a complaint?",
    answer: "For complaints or concerns, reach out to UeCampus at Info@uecampus.com. For formal complaints related to academic matters, you may also contact the relevant awarding body directly.",
    keywords: ["complaint", "complain", "issue", "problem", "grievance", "dissatisfied", "unhappy", "escalate"]
  },
  {
    id: 705,
    category: "Support",
    question: "Is career guidance available?",
    answer: "UeCampus's eie Business School (EBS) component emphasizes hands-on experience and real-world skills. For career guidance services, contact the UeCampus team directly.",
    keywords: ["career", "guidance", "counseling", "job help", "career advice", "placement", "job support"]
  },
  {
    id: 706,
    category: "Support",
    question: "Can I get an official transcript?",
    answer: "Yes. Official transcripts can be requested through the Student Portal or by contacting UeCampus at Info@uecampus.com. Processing times may vary.",
    keywords: ["transcript", "official transcript", "academic record", "grades", "marks", "record"]
  },
  {
    id: 707,
    category: "Support",
    question: "Can I get a letter of enrolment?",
    answer: "Yes. Enrolment letters are available upon request. Contact Info@uecampus.com and the team will provide the documentation required (e.g., for visa or employment purposes).",
    keywords: ["enrolment letter", "enrollment letter", "proof of enrollment", "visa letter", "confirmation letter", "letter"]
  },
  {
    id: 708,
    category: "Support",
    question: "How do I unsubscribe from UeCampus emails?",
    answer: "To unsubscribe from UeCampus newsletters or marketing emails, use the unsubscribe link in any email received, or contact Info@uecampus.com directly.",
    keywords: ["unsubscribe", "stop emails", "opt out", "email", "newsletter", "spam"]
  },
  {
    id: 709,
    category: "Support",
    question: "Is there a privacy policy?",
    answer: "Yes. UeCampus has a Privacy Policy and Terms of Service, referenced on the website (uecampus.com). By submitting forms on the site, you agree to these terms.",
    keywords: ["privacy", "privacy policy", "data", "terms", "terms of service", "gdpr", "data protection", "personal information"]
  }
];

// Categories for browsing
const FAQ_CATEGORIES = [
  "General",
  "Programmes",
  "Course Fees",
  "Admission",
  "Accreditation",
  "Scholarships",
  "Student Life",
  "Fees & Payment",
  "Support"
];
