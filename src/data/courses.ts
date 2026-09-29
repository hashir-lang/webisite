import cyber from "@/assets/course-cyber.jpg";
import mba from "@/assets/course-mba.jpg";
import ai from "@/assets/course-ai.jpg";
import phd from "@/assets/course-phd.jpg";
import edu from "@/assets/course-edu.jpg";
import logistics from "@/assets/course-logistics.jpg";
import { liveCourses } from "./courses-live";
import { programImages } from "./program-images";
import { walshDirectContent, walshSlugToContentKey } from "./walsh-direct-content";

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  level: "Doctorate" | "Postgraduate" | "Undergraduate" | "Diploma" | "Top-Up";
  levelGroup: "Doctorate" | "Master's" | "Bachelor's" | "Diploma" | "Top-Up";
  university: string;
  universityShort: string;
  accreditation: string[];
  accreditedBy: string;
  accreditedByDesc: string;
  duration: string;
  tuition: string;
  qualification: string;
  language: string;
  accessibility: string;
  categories: string[];
  intakes: string[];
  img: string;
  overview: string;
  overviewLong?: string;
  gains?: string[];
  keyBenefits?: string[];
  highlights: string[];
  modules: { title: string; items: string[] }[];
  entryRequirements: string[];
  applicationSteps?: { title: string; desc: string }[];
  careerOutcomes: string[];
  careerDesc?: string;
  paymentPlans?: { title: string; desc: string }[];
  scholarships?: string[];
  specializations?: string[];
  /** When true the course is removed from all listings but still reachable via its direct /programmes/<slug> URL. */
  hidden?: boolean;
  /**
   * Slug of the programme this one duplicates. Set on the redundant copies of a
   * programme that the catalogue lists more than once under the SAME partner, so
   * their detail pages point search engines at the single canonical version.
   */
  canonicalSlug?: string;
};

export const defaultKeyBenefits = [
  "Comprehensive Foundation",
  "Flexible Learning",
  "One-on-One Tutor Support",
  "Globally Recognised Qualification",
  "Assessment-Based Structure",
  "Accelerated Completion",
  "Affordable and Accessible",
];

const WALSH = {
  university: "Walsh College (USA)",
  universityShort: "Walsh College Direct",
  accreditation: ["HLC (US Dept. of Education)", "ACBSP", "Forbes-ranked"],
  accreditedBy: "Walsh College",
  accreditedByDesc:
    "A Forbes-ranked US institution accredited by the Higher Learning Commission (HLC) and ACBSP, recognised for business and technology education.",
  language: "English",
  qualification: "US Degree",
  accessibility: "Flexible Eligibility",
};

const PPA = {
  university: "Pôle Paris Alternance (PPA), France",
  universityShort: "PPA",
  accreditation: [
    "Qualifi Level 7 Diploma (UK, Ofqual-regulated)",
    "PPA MBA Degree (France)",
  ],
  accreditedBy: "PPA & Qualifi",
  accreditedByDesc:
    "A dual award combining an MBA degree from Pôle Paris Alternance, a French higher education institution, with a Level 7 Diploma from Qualifi, a UK awarding organisation regulated by Ofqual.",
  language: "English",
  qualification: "MBA (France) + Level 7 Diploma (UK)",
  accessibility: "Flexible Eligibility",
};

const EIE = {
  university: "eie European Business School, Malta, EU",
  universityShort: "eie Business School",
  accreditation: [
    "Licensed by MFHEA (Malta Further & Higher Education Authority)",
    "Aligned to EQF / MQF",
    "Recognised across EU, UK, Asia & Middle East",
  ],
  accreditedBy: "eie European Business School",
  accreditedByDesc:
    "A Malta-based higher education institution licensed by the Malta Further & Higher Education Authority (MFHEA) and aligned with the European and Malta Qualifications Frameworks (EQF / MQF), with recognition across Europe, the UK, Asia and the Middle East.",
  language: "English",
  qualification: "EQF / MQF-aligned Degree",
  accessibility: "Flexible Eligibility",
};

const QUALIFI = {
  university: "Qualifi, UK Awarding Organisation",
  universityShort: "Qualifi",
  accreditation: ["Ofqual-regulated UK Awarding Organisation"],
  accreditedBy: "Qualifi",
  accreditedByDesc:
    "A UK awarding organisation regulated by Ofqual, delivering regulated qualifications from Level 2 to Level 8. Qualifi diplomas stand on their own as professional credentials and serve as pathway qualifications into full degree programmes.",
  language: "English",
  qualification: "Ofqual-regulated UK Diploma",
  accessibility: "Flexible Eligibility",
};

const qualifiLevelMeta: Record<
  number,
  { group: Course["levelGroup"]; level: Course["level"]; duration: string; entry: string[] }
> = {
  2: {
    group: "Diploma",
    level: "Diploma",
    duration: "6 months",
    entry: ["Open access, no formal qualifications required", "Basic English proficiency"],
  },
  3: {
    group: "Diploma",
    level: "Diploma",
    duration: "6 months",
    entry: ["Level 2 qualification or equivalent", "Basic English proficiency (IELTS 5.0 or equivalent)"],
  },
  4: {
    group: "Diploma",
    level: "Diploma",
    duration: "8 months",
    entry: [
      "A-levels, Level 3 qualification or equivalent",
      "Mature applicants with relevant work experience considered",
      "English proficiency (IELTS 5.5 or equivalent)",
    ],
  },
  5: {
    group: "Diploma",
    level: "Diploma",
    duration: "8 months",
    entry: [
      "Level 4 qualification or equivalent",
      "Mature applicants with relevant work experience considered",
      "English proficiency (IELTS 5.5 or equivalent)",
    ],
  },
  6: {
    group: "Diploma",
    level: "Diploma",
    duration: "8 months",
    entry: [
      "Level 5 qualification or equivalent undergraduate study",
      "English proficiency (IELTS 5.5 or equivalent)",
    ],
  },
  7: {
    group: "Diploma",
    level: "Diploma",
    duration: "8 months",
    entry: [
      "Bachelor's degree or Level 6 qualification",
      "Relevant professional experience considered for mature applicants",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
  },
  8: {
    group: "Doctorate",
    level: "Doctorate",
    duration: "8 months",
    entry: [
      "Master's degree in a relevant field",
      "Significant professional experience",
      "Research proposal aligned with faculty expertise",
      "English proficiency (IELTS 6.5 or equivalent)",
    ],
  },
};

const defaultIntakes = ["September 2026", "March 2026", "September 2025"];

const defaultApplicationSteps = [
  { title: "Enquire", desc: "Submit an enquiry so our admissions team can check your fit and answer your questions." },
  { title: "Apply", desc: "Complete the short online application and upload your supporting documents." },
  { title: "Assessment", desc: "An admissions advisor reviews your profile and confirms eligibility." },
  { title: "Offer & Enrolment", desc: "Accept your offer, select your intake, and activate your student portal access." },
];

const defaultPaymentPlans = [
  { title: "Upfront payment", desc: "Pay your tuition in full at enrolment for a simplified experience." },
  { title: "Monthly instalments", desc: "Spread your tuition across monthly instalments aligned to your intake." },
  { title: "Employer sponsorship", desc: "Have your tuition invoiced directly to your employer where supported." },
];

const defaultScholarships = [
  "Early-bird enrolment discount",
  "Alumni referral award",
  "Regional affordability scholarship",
  "Women in Tech / Women in Business scholarships",
];

const allCourses: Course[] = [
  // DOCTORATE
  {
    slug: "dba-walsh",
    title: "Doctor of Business Administration in Accounting",
    tagline: "A fully online US doctorate from Walsh College, ranked #1 Online DBA by Forbes (2024), with an Accounting concentration.",
    level: "Doctorate",
    levelGroup: "Doctorate",
    ...WALSH,
    accreditation: [
      "Regionally accredited US institution",
      "HLC (US Dept. of Education) · ACBSP",
      "#1 Online DBA by Forbes (2024)",
    ],
    accreditedByDesc:
      "A regionally accredited US institution, Forbes-ranked (#1 Online DBA, 2024), recognised globally for business and accounting research.",
    qualification: "Accredited US Doctorate",
    accessibility: "100% Online",
    duration: "3 years",
    tuition: "Contact admissions",
    categories: ["Accounting", "Finance", "Business", "Entrepreneurship"],
    intakes: ["September 2026", "March 2026", "September 2025"],
    img: phd,
    overview:
      "The Doctor of Business Administration in Accounting from Walsh College prepares senior professionals for executive and academic careers in accounting and finance, combining advanced research methods with an Accounting concentration.",
    overviewLong:
      "Delivered 100% online and built around a flexible three-year structure, the programme is designed for working professionals who want to complete a rigorous US doctorate while maintaining their executive responsibilities. You will conduct original research that addresses real-world challenges in accounting and business.",
    highlights: [
      "Accredited Walsh College degree with global recognition",
      "Complete in 3 years while continuing to work",
      "Transparent tuition with payment plans",
      "100% online with flexible scheduling",
    ],
    gains: [
      "A fully accredited US doctorate from Walsh College",
      "Advanced research methods applied to accounting and finance",
      "A publishable dissertation tackling a real business challenge",
      "Executive-level insight into financial strategy and reporting",
      "Access to Walsh College faculty and a global cohort of leaders",
      "Preparation for C-suite, consulting and academic roles",
    ],
    keyBenefits: [
      "#1 Online DBA by Forbes (2024), unmatched credibility and recognition",
      "Fully online, designed for working professionals globally",
      "Led by Walsh College Faculty, top US academics and business experts",
      "Research & dissertation focus, solve real-world business and accounting challenges",
      "Flexible 3-4 year structure, balance study with an executive schedule",
      "Prestigious US accreditation, doctorate from a regionally accredited US institution",
    ],
    careerDesc:
      "A Doctorate of Business Administration in Accounting from Walsh College positions you for executive and academic excellence.",
    modules: [
      {
        title: "Core Courses",
        items: [
          "DCT 700 Doctoral Studies Seminar",
          "RES 711 Research Methods: Introduction and Scope",
          "RES 712 Qualitative and Exploratory Research Methods",
          "RES 713 Quantitative Research Methods I: Data Management and Non-Experimental",
          "RES 714 Quantitative Research Methods II: Experimental and Statistical",
          "DCT 701 Comprehensive Examination for Doctorate",
          "DIS 796 Dissertation I, Chapter 1",
          "DIS 797 Dissertation II, Chapter 2",
          "DIS 798 Dissertation III, Chapter 3",
          "DIS 799 Dissertation IV, Chapter 4",
          "DIS 800 Dissertation V, Chapter 5",
        ],
      },
      {
        title: "Residency Courses",
        items: [
          "RSD 801 Doctoral Residency I",
          "RSD 802 Doctoral Residency II",
          "RSD 803 Doctoral Residency III",
        ],
      },
      {
        title: "Concentrations (Select One)",
        items: [
          "ACC 732 Accounting and Financial Reporting in the Global Economy",
          "ACC 733 Financial Accounting Theory & Analysis",
          "ACC 734 Seminar in Empirical Accounting Research",
          "ACC 735 Applied Research in Accounting Topics",
          "BTC 701 Organizational Resilience Framework",
          "ECN 724 The Consequences of Economic Development for Business",
          "FIN 748 Financial and Economic Model Analysis",
          "IT 701 Innovation, Risk, and Cybersecurity",
          "MGT 765 High Performance Leadership",
        ],
      },
      {
        title: "General Business Electives",
        items: [
          "ACC 732 Accounting and Financial Reporting in the Global Economy",
          "BTC 701 Organizational Resilience Framework",
          "ECN 724 The Consequences of Economic Development for Business",
          "FIN 748 Financial and Economic Model Analysis",
          "IT 701 Innovation, Risk, and Cybersecurity",
          "MGT 765 High Performance Leadership",
          "MGT 709 Sustainability and Ethical Business Practices",
          "MKT 743 Marketing Strategy, Structures, and Systems",
          "MGT 722 Managing Organizational Development and Change",
        ],
      },
    ],
    entryRequirements: [
      "A Master's Degree (minimum 3.0 GPA or equivalent)",
      "At least 2 years of professional work experience",
      "A CV or Professional Resume",
      "A Letter of Intent describing academic and research goals",
    ],
    paymentPlans: [
      { title: "Full Payment Upfront", desc: "Pay your tuition in full at enrolment." },
      { title: "Quarterly Instalments", desc: "Spread payment across the year in four quarterly instalments." },
      { title: "Semi-Annual", desc: "Smaller, regular instalments throughout the programme." },
    ],
    careerOutcomes: [
      "C-Level Executive (CFO, COO, CEO)",
      "University Professor or Academic Researcher (Accounting & Finance)",
      "Business Consultant or Policy Advisor",
      "Director of Financial Strategy",
      "Corporate Trainer or Leadership Coach",
      "Entrepreneurial Innovator",
    ],
  },

  // MASTER'S
  {
    slug: "mba-general-management-walsh",
    title: "MBA, General Management",
    tagline: "Develop strategic, financial and leadership capability to manage organisations across industries.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...WALSH,
    duration: "1 to 1.5 years",
    tuition: "Contact admissions",
    categories: ["Business", "Entrepreneurship"],
    intakes: ["September 2026", "March 2026", "January 2026", "September 2025"],
    img: mba,
    overview:
      "The Walsh MBA in General Management blends core management disciplines, strategy, finance, marketing and operations, with practical leadership development. Designed for ambitious professionals stepping into senior roles.",
    overviewLong:
      "You'll move from functional mastery to cross-functional leadership, finishing with a live capstone consulting project where you apply everything you have learned to a real client brief.",
    highlights: [
      "Forbes-ranked ACBSP-accredited MBA",
      "Flexible 1-2 year completion pathway",
      "Live capstone consulting project",
      "Dedicated career coaching",
    ],
    gains: [
      "A globally recognised, ACBSP-accredited MBA",
      "Strategic decision-making across finance, marketing and operations",
      "Confidence leading cross-functional teams in uncertain environments",
      "A portfolio of applied projects including a capstone consulting engagement",
      "Expanded professional network of alumni, faculty and employers",
      "Career coaching to land your next senior role",
    ],
    keyBenefits: [
      "Flexible 1-2 year completion",
      "Forbes-ranked Walsh College",
      "ACBSP-accredited curriculum",
      "Live capstone consulting project",
      "Career coaching included",
      "Global alumni network",
      "Affordable tuition with payment plans",
    ],
    careerDesc:
      "MBA graduates typically move into general manager, director, consulting or founder roles, or use the qualification to pivot into a new industry or function with confidence.",
    modules: [
      {
        title: "Core Foundations",
        items: ["Financial Accounting", "Managerial Economics", "Marketing Management", "Organisational Behaviour"],
      },
      {
        title: "Advanced Management",
        items: ["Corporate Finance", "Strategic Management", "Operations & Supply Chain", "Business Analytics"],
      },
      {
        title: "Leadership & Capstone",
        items: ["Ethics & Governance", "Global Business Environment", "Capstone Consulting Project"],
      },
    ],
    entryRequirements: [
      "Bachelor's degree (2:2 or equivalent)",
      "Minimum 2 years of professional experience preferred",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "Senior manager / Director",
      "Product & programme leadership",
      "Consulting & strategy roles",
      "Founder / entrepreneur",
    ],
  },
  {
    slug: "msc-artificial-intelligence-walsh",
    title: "MSc in Artificial Intelligence",
    tagline: "Advanced AI, deep learning and neural networks for high-impact technical roles.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...WALSH,
    duration: "1 to 1.5 years",
    tuition: "Contact admissions",
    categories: ["Artificial Intelligence (AI)", "Data Analytics", "Information Technology"],
    intakes: defaultIntakes,
    img: ai,
    overview:
      "Build deep expertise in artificial intelligence, from modern machine learning foundations to production-grade deep learning systems. Graduate ready to design and ship AI products.",
    overviewLong:
      "The programme moves fast from first principles to industrial-strength deep learning. You will work with real datasets, GPU-backed cloud labs and modern tooling so that by graduation you have built, deployed and monitored your own AI systems.",
    highlights: [
      "Hands-on deep learning and neural network coursework",
      "Real datasets and industry collaborations",
      "GPU-backed cloud lab access",
      "Capstone AI product project",
    ],
    gains: [
      "Working knowledge of modern deep learning architectures",
      "Ability to design, train and deploy production ML systems",
      "Experience with computer vision and NLP pipelines",
      "MLOps skills: experiment tracking, deployment, monitoring",
      "A portfolio of AI projects you can show to employers",
      "Grounding in responsible and safe AI practice",
    ],
    keyBenefits: [
      "Production-focused AI curriculum",
      "GPU-backed cloud lab access",
      "Real industry datasets",
      "Capstone AI product build",
      "MLOps and deployment coverage",
      "AI ethics and safety modules",
      "Globally recognised qualification",
    ],
    careerDesc:
      "MSc AI graduates move into machine-learning engineering, AI research, data science and MLOps roles across tech, finance, healthcare and the public sector.",
    modules: [
      {
        title: "Foundations",
        items: ["Mathematics for AI", "Statistical Learning", "Python & ML Engineering", "Data Engineering"],
      },
      {
        title: "Core AI",
        items: ["Deep Learning", "Neural Networks & Architectures", "Natural Language Processing", "Computer Vision"],
      },
      {
        title: "Applied & Capstone",
        items: ["Reinforcement Learning", "AI Ethics & Safety", "MLOps & Deployment", "Capstone Project"],
      },
    ],
    entryRequirements: [
      "Bachelor's degree in CS, Engineering, Maths or related field",
      "Programming experience (Python preferred)",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "Machine Learning Engineer",
      "AI Research Scientist",
      "Data Scientist",
      "MLOps / AI Platform Engineer",
    ],
  },
  {
    slug: "msc-cyber-security-walsh",
    title: "MSc in Cyber Security",
    tagline: "Threat mitigation, digital forensics and ethical hacking for modern enterprise defenders.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...WALSH,
    duration: "1 to 1.5 years",
    tuition: "Contact admissions",
    categories: ["Cyber Security", "Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "A practitioner-focused master's in cyber security. Move from principles to offensive and defensive techniques, incident response and forensics, graduating ready for senior security roles.",
    overviewLong:
      "The curriculum is aligned to widely used industry frameworks such as NIST and ISO 27001. Through red-team and blue-team exercises in realistic virtual labs you will build the instincts that senior security teams look for.",
    highlights: [
      "Hands-on red-team / blue-team exercises",
      "Digital forensics and incident response labs",
      "Industry-aligned with NIST and ISO frameworks",
      "Capstone security assessment project",
    ],
    gains: [
      "Deep understanding of modern attack and defence techniques",
      "Practical experience in penetration testing and incident response",
      "Digital forensics skills used in real investigations",
      "Fluency with NIST, ISO 27001 and cloud security frameworks",
      "A portfolio of security assessments and lab write-ups",
      "Preparation for senior security and leadership roles",
    ],
    keyBenefits: [
      "Offensive and defensive coverage",
      "Hands-on virtual labs",
      "Digital forensics modules",
      "Cloud and container security",
      "Industry framework alignment",
      "Capstone security assessment",
      "Pathway to CISO roles",
    ],
    careerDesc:
      "MSc Cyber Security graduates move into SOC, penetration testing, incident response and governance roles, with clear progression toward head-of-security and CISO positions.",
    modules: [
      {
        title: "Foundations",
        items: ["Network Security", "Cryptography", "Secure Systems Engineering", "Risk & Compliance"],
      },
      {
        title: "Offensive & Defensive",
        items: ["Ethical Hacking & Penetration Testing", "Threat Intelligence", "Security Operations (SOC)", "Incident Response"],
      },
      {
        title: "Specialist & Capstone",
        items: ["Digital Forensics", "Cloud & Container Security", "AI for Cyber Defence", "Capstone Project"],
      },
    ],
    entryRequirements: [
      "Bachelor's degree in CS, IT or related field",
      "Basic networking & systems knowledge",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "Security Engineer / Analyst",
      "Penetration Tester",
      "Incident Responder",
      "CISO / Head of Security",
    ],
  },

  // BACHELOR'S
  {
    slug: "bba-walsh",
    title: "BBA, Bachelor of Business Administration",
    tagline: "A flexible three-year bachelor's covering the full breadth of modern business, with specialisation options.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...WALSH,
    duration: "3 years",
    tuition: "Contact admissions",
    categories: ["Business", "Marketing", "Accounting", "Entrepreneurship"],
    intakes: ["September 2026", "March 2026", "September 2025", "March 2025"],
    img: mba,
    specializations: ["Marketing", "Accounting", "Entrepreneurship"],
    overview:
      "Walsh's BBA gives you rigorous business fundamentals with the flexibility to specialise in Marketing, Accounting or Entrepreneurship. Graduate with both breadth and depth ready for your first management role.",
    overviewLong:
      "You will study alongside a diverse global cohort, take on applied projects with real employers from year two, and finish with a capstone business project that prepares you for a fast start in industry or entrepreneurship.",
    highlights: [
      "Choose from Marketing, Accounting or Entrepreneurship",
      "Applied projects with real employers",
      "Forbes-ranked ACBSP-accredited curriculum",
      "Career coaching from year one",
    ],
    gains: [
      "A broad understanding of modern business fundamentals",
      "Depth in your chosen specialisation: Marketing, Accounting or Entrepreneurship",
      "Applied project experience with real employers",
      "Professional communication, teamwork and presentation skills",
      "A capstone business project you can showcase to recruiters",
      "A direct pathway into graduate management roles or postgraduate study",
    ],
    keyBenefits: [
      "Three specialisation pathways",
      "Forbes-ranked, ACBSP-accredited BBA",
      "Flexible three-year structure",
      "Applied projects with employers",
      "Career coaching from year one",
      "Internship and capstone project",
      "Affordable global tuition",
    ],
    careerDesc:
      "BBA graduates enter management trainee, marketing, accounting, analyst and founder roles across industries, or progress into MBA and specialist master's programmes.",
    modules: [
      {
        title: "Year 1, Foundations",
        items: ["Principles of Management", "Financial Accounting", "Microeconomics", "Business Communication"],
      },
      {
        title: "Year 2, Core",
        items: ["Marketing Principles", "Managerial Accounting", "Business Statistics", "Organisational Behaviour"],
      },
      {
        title: "Year 3, Specialisation",
        items: ["Specialisation Core Modules", "Business Law", "Operations Management", "Electives"],
      },
      {
        title: "Year 4, Capstone",
        items: ["Strategic Management", "Ethics & Sustainability", "Capstone Business Project", "Internship"],
      },
    ],
    entryRequirements: [
      "High school diploma / A-levels or equivalent",
      "English proficiency (IELTS 5.5 or equivalent)",
      "Personal statement",
    ],
    careerOutcomes: [
      "Management Trainee",
      "Marketing / Sales Associate",
      "Junior Accountant",
      "Founder / Start-up roles",
    ],
  },
  {
    slug: "bba-marketing-walsh",
    title: "BBA in Marketing",
    tagline: "Digital marketing, brand strategy and consumer insight for the modern economy.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...WALSH,
    duration: "3 years",
    tuition: "Contact admissions",
    categories: ["Marketing", "Business"],
    intakes: ["September 2026", "March 2026", "September 2025"],
    img: mba,
    overview:
      "Specialise in marketing from day one. Learn brand strategy, content and digital marketing, and consumer behaviour, with real-world campaigns as your assessments.",
    overviewLong:
      "Modules are aligned with widely recognised industry certifications so the skills you build in class are immediately relevant in the workplace. Every assessment is focused on producing portfolio-ready deliverables rather than theoretical essays.",
    highlights: [
      "Digital marketing and brand strategy specialisation",
      "Live client campaign projects",
      "Google, HubSpot and Meta certification-aligned modules",
      "Portfolio of work at graduation",
    ],
    gains: [
      "Fluency in digital marketing channels and analytics tools",
      "Strategic thinking in brand, positioning and consumer insight",
      "Hands-on experience running live campaigns for real clients",
      "A portfolio of briefs, creative and measurable results",
      "Certification-aligned skills employers recognise",
      "Confidence to step into agency or in-house marketing roles",
    ],
    keyBenefits: [
      "Marketing specialisation from year one",
      "Live client campaign projects",
      "Industry certification alignment",
      "Portfolio-ready assessments",
      "Marketing analytics coverage",
      "Internship in final year",
      "Forbes-ranked Walsh College award",
    ],
    careerDesc:
      "BBA Marketing graduates start their careers as digital marketing executives, brand coordinators, content managers or marketing analysts in agencies, start-ups and established brands.",
    modules: [
      {
        title: "Year 1-2, Foundations & Core",
        items: ["Principles of Marketing", "Consumer Behaviour", "Business Foundations", "Research Methods"],
      },
      {
        title: "Year 3, Specialist Marketing",
        items: ["Brand Strategy", "Digital Marketing & SEO", "Content & Social Media", "Marketing Analytics"],
      },
      {
        title: "Year 4, Capstone",
        items: ["Integrated Campaign Project", "Global Marketing", "Marketing Leadership", "Internship"],
      },
    ],
    entryRequirements: [
      "High school diploma / A-levels or equivalent",
      "English proficiency (IELTS 5.5 or equivalent)",
    ],
    careerOutcomes: [
      "Digital Marketing Executive",
      "Brand Manager",
      "Content & Social Media Manager",
      "Marketing Analyst",
    ],
  },
  {
    slug: "bba-international-business-walsh",
    title: "BBA in International Business",
    tagline: "Cross-border trade, global markets and international strategy.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...WALSH,
    duration: "3 years",
    tuition: "Contact admissions",
    categories: ["Business", "Entrepreneurship"],
    intakes: ["September 2026", "September 2025"],
    img: mba,
    overview:
      "Prepare for a career in multinational business. The programme combines core business disciplines with international strategy, cross-border trade and global markets.",
    overviewLong:
      "Courses are taught with an explicitly global lens, from international trade law to cross-cultural management, and culminate in a capstone market-entry project where you design a launch strategy for a real company expanding abroad.",
    highlights: [
      "Focus on cross-border trade and global strategy",
      "International case studies and exchange opportunities",
      "Forbes-ranked business school curriculum",
      "Capstone global market entry project",
    ],
    gains: [
      "A strong grounding in international trade, finance and marketing",
      "Cross-cultural management and negotiation skills",
      "Understanding of multinational strategy and global value chains",
      "Experience designing a real market-entry proposal",
      "A global alumni and employer network",
      "Readiness to work in or with multinational organisations",
    ],
    keyBenefits: [
      "Cross-border trade focus",
      "Global market entry capstone",
      "International case-study method",
      "Cross-cultural management modules",
      "Forbes-ranked award",
      "Exchange and internship opportunities",
      "Flexible three-year structure",
    ],
    careerDesc:
      "Graduates join multinationals, trade bodies and fast-scaling exporters in roles across international operations, supply chain, global marketing and trade compliance.",
    modules: [
      {
        title: "Year 1-2, Foundations & Core",
        items: ["Principles of Management", "International Economics", "Business Statistics", "Global Business Environment"],
      },
      {
        title: "Year 3, International Focus",
        items: ["International Trade Law", "Global Marketing", "Cross-Cultural Management", "Multinational Finance"],
      },
      {
        title: "Year 4, Capstone",
        items: ["Global Strategy", "Market Entry Project", "International Internship", "Electives"],
      },
    ],
    entryRequirements: [
      "High school diploma / A-levels or equivalent",
      "English proficiency (IELTS 5.5 or equivalent)",
    ],
    careerOutcomes: [
      "International Business Analyst",
      "Export / Import Manager",
      "Global Supply Chain Coordinator",
      "International Marketing Specialist",
    ],
  },
  {
    slug: "bsc-information-technology-walsh",
    title: "BSc in Information Technology (BSIT)",
    tagline: "A broad IT degree with pathways in Cybersecurity and Data Analytics.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...WALSH,
    duration: "3 years",
    tuition: "Contact admissions",
    categories: ["Information Technology", "Cyber Security", "Data Analytics"],
    intakes: ["September 2026", "March 2026", "September 2025", "March 2025"],
    img: cyber,
    specializations: ["General IT", "Cybersecurity", "Data Analytics"],
    overview:
      "The BSIT gives you a strong foundation across software, infrastructure and data, with the option to specialise in Cybersecurity or Data Analytics in your final year.",
    overviewLong:
      "You will work in hands-on labs with industry-standard tools across programming, networking, cloud and databases before choosing the pathway that fits the career you want, rounded off with a capstone project for a real client.",
    highlights: [
      "Three specialisation pathways",
      "Hands-on labs and industry tools",
      "Forbes-ranked institution",
      "Capstone project with a real client",
    ],
    gains: [
      "Programming, networking and database fundamentals",
      "Working knowledge of cloud and modern web/mobile stacks",
      "Specialist depth in Cybersecurity or Data Analytics",
      "A capstone project solving a real client's technical problem",
      "A portfolio of code, systems and analyses",
      "A flexible foundation for further study or direct entry into industry",
    ],
    keyBenefits: [
      "Three specialisation tracks",
      "Hands-on industry-standard labs",
      "Cloud, web and mobile coverage",
      "Real-client capstone project",
      "Forbes-ranked Walsh College",
      "Flexible three-year completion",
      "Pathway to MSc AI or Cyber Security",
    ],
    careerDesc:
      "BSIT graduates launch careers as software developers, systems and network engineers, security analysts and data analysts across technology, finance, public sector and start-up employers.",
    modules: [
      {
        title: "Year 1-2, IT Foundations",
        items: ["Introduction to Programming", "Computer Networks", "Databases", "Operating Systems"],
      },
      {
        title: "Year 3, Specialisation",
        items: ["Cybersecurity / Data Analytics / Enterprise IT tracks", "Web & Mobile Development", "Cloud Computing", "Statistics"],
      },
      {
        title: "Year 4, Capstone",
        items: ["Advanced Topics", "Systems Architecture", "Capstone Project", "Internship"],
      },
    ],
    entryRequirements: [
      "High school diploma / A-levels or equivalent",
      "Maths foundations recommended",
      "English proficiency (IELTS 5.5 or equivalent)",
    ],
    careerOutcomes: [
      "Software Developer",
      "Systems / Network Engineer",
      "Security Analyst",
      "Data Analyst",
    ],
  },
  {
    slug: "bsc-cyber-security-walsh",
    title: "Bachelor of Science in Cyber Security",
    tagline: "A fully online US degree building advanced expertise in defending digital systems and data.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...WALSH,
    duration: "3 years",
    tuition: "Contact admissions",
    categories: ["Cyber Security", "Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "A fully online programme building advanced expertise in defending digital systems and data. Learners develop foundational and advanced skills in network protection, risk assessment, ethical hacking, and emerging security technologies, and graduate prepared to lead cybersecurity initiatives in the global digital economy.",
    highlights: [
      "Dual qualification, Qualifi Level 4 and 5 Diploma plus Walsh BS in Cyber Security",
      "Walsh College accreditation (HLC and ACBSP)",
      "Top-ranked online cyber security programme",
      "Flexible study schedule with one-on-one tutoring",
    ],
    modules: [
      {
        title: "Core Modules",
        items: [
          "Threat Analysis and Strategic Security Planning",
          "Ethical Hacking and Vulnerability Assessment",
          "Management Principles in Cyber Security",
          "Cloud Security and Emerging Technologies",
        ],
      },
    ],
    entryRequirements: [
      "Level 4 and Level 5 (or Extended Level 5) Diploma in Cyber Security from Qualifi, or equivalent",
      "Other qualifications considered upon review",
    ],
    careerOutcomes: [
      "Cybersecurity Analyst",
      "Network Security Engineer",
      "Information Security Specialist",
      "Security Consultant",
      "Penetration Tester",
      "Incident Response Manager",
    ],
  },
  {
    slug: "bba-finance-walsh",
    title: "BBA in Finance",
    tagline: "A three-year online Bachelor's blending business insights with financial analysis and leadership.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...WALSH,
    duration: "3 years",
    tuition: "Contact admissions",
    categories: ["Finance", "Accounting", "Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A three-year, fully online Bachelor of Business Administration programme blending real-world business insights with a nationally recognised curriculum. The BBA in Finance equips learners with the knowledge, confidence, and leadership skills required to thrive in financial analysis, banking, investment management, and corporate finance.",
    highlights: [
      "Fully online learning",
      "Three-year structured Bachelor's degree",
      "Career-focused curriculum covering finance, management, marketing, and leadership",
      "Walsh College accreditation (HLC and ACBSP)",
    ],
    modules: [
      {
        title: "Core Business & Finance",
        items: [
          "Financial Analysis",
          "Corporate Finance",
          "Investment Management",
          "Managerial Accounting",
          "Business Strategy",
          "Leadership",
        ],
      },
    ],
    entryRequirements: [
      "American High School Diploma: minimum GPA 3.0 plus two AP subjects (Group A) at grade 3",
      "International Baccalaureate (IB) Diploma: 21 points",
      "Other qualifications considered upon review",
    ],
    careerOutcomes: [
      "Financial Analyst",
      "Investment Manager",
      "Banking Officer",
      "Corporate Finance Specialist",
      "Financial Planner",
      "Risk Analyst",
    ],
  },
  {
    slug: "bba-human-resource-management-walsh",
    title: "Bachelor of Business Administration in Human Resource Management",
    tagline: "A fully online US BBA building people-management and strategic HR capability.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...WALSH,
    duration: "3 years",
    tuition: "Contact admissions",
    categories: ["Human Resource", "Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A fully online Bachelor of Business Administration with a Human Resource Management concentration, building core business knowledge alongside specialist capability in talent management, employment law, organisational behaviour and HR strategy.",
    highlights: [
      "Forbes-ranked, ACBSP-accredited Walsh College degree",
      "Specialist Human Resource Management concentration",
      "100% online with flexible scheduling",
      "Walsh College accreditation (HLC and ACBSP)",
    ],
    modules: [
      {
        title: "Core Business & HR",
        items: [
          "Principles of Management",
          "Organisational Behaviour",
          "Human Resource Management",
          "Talent Acquisition and Development",
          "Employment Law and Ethics",
          "Compensation and Benefits",
        ],
      },
    ],
    entryRequirements: [
      "American High School Diploma: minimum GPA 3.0 plus two AP subjects (Group A) at grade 3",
      "International Baccalaureate (IB) Diploma: 21 points",
      "Other qualifications considered upon review",
    ],
    careerOutcomes: [
      "HR Officer / HR Coordinator",
      "Recruitment Specialist",
      "Training and Development Officer",
      "People Operations Analyst",
      "HR Business Partner (with experience)",
    ],
  },
  {
    slug: "ms-management-walsh",
    title: "Master of Science in Management",
    tagline: "A US Master's developing leadership, strategy and organisational management capability.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...WALSH,
    duration: "1 to 1.5 years",
    tuition: "Contact admissions",
    categories: ["Business", "Human Resource"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "The Master of Science in Management develops advanced leadership, strategic thinking and organisational management capability, preparing professionals to lead teams and drive change across diverse organisations.",
    highlights: [
      "Forbes-ranked, ACBSP-accredited Walsh College degree",
      "Leadership and strategic-management focus",
      "Flexible 1-2 year completion",
      "100% online with career coaching",
    ],
    modules: [
      {
        title: "Management Core",
        items: [
          "Leadership Communication",
          "Strategic Thinking and Ethical Decision Making",
          "Leading Organizational Change",
          "Design Thinking for Adaptive Problem Solving",
          "Leading a Resilient and Diverse Workforce",
          "Integrated Leadership Experience",
        ],
      },
    ],
    entryRequirements: [
      "Bachelor's degree (2:2 or equivalent)",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "Operations Manager",
      "Team / Department Lead",
      "Management Consultant",
      "Programme Manager",
    ],
  },
  {
    slug: "ms-marketing-walsh",
    title: "Master of Science in Marketing",
    tagline: "A US Master's in data-driven marketing, brand strategy and digital growth.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...WALSH,
    duration: "1 to 1.5 years",
    tuition: "Contact admissions",
    categories: ["Marketing", "Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "The Master of Science in Marketing builds advanced capability in data-driven marketing, consumer insight, brand strategy and digital growth, preparing graduates for senior marketing and brand leadership roles.",
    highlights: [
      "Forbes-ranked, ACBSP-accredited Walsh College degree",
      "Data-driven, digital-first marketing curriculum",
      "Flexible 1-2 year completion",
      "100% online with career coaching",
    ],
    modules: [
      {
        title: "Marketing Core",
        items: [
          "Marketing Strategy, Structures and Systems",
          "Consumer and Buyer Behaviour",
          "Digital and Social Media Marketing",
          "Marketing Analytics",
          "Brand Management",
          "Integrated Marketing Communications",
        ],
      },
    ],
    entryRequirements: [
      "Bachelor's degree (2:2 or equivalent)",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "Marketing Manager",
      "Brand Manager",
      "Head of Growth",
      "Marketing Analytics Lead",
    ],
  },
  {
    slug: "ms-information-technology-walsh",
    title: "Master of Science in Information Technology",
    tagline: "A US Master's in enterprise IT, cloud, security and data systems.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...WALSH,
    duration: "1 to 1.5 years",
    tuition: "Contact admissions",
    categories: ["Information Technology", "Data Analytics"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "The Master of Science in Information Technology develops advanced capability in enterprise systems, cloud computing, cybersecurity and data management, preparing graduates to lead technology functions and projects.",
    highlights: [
      "Forbes-ranked, ACBSP-accredited Walsh College degree",
      "Enterprise IT, cloud and security focus",
      "Flexible 1-2 year completion",
      "100% online with career coaching",
    ],
    modules: [
      {
        title: "IT Core",
        items: [
          "Governance, Risk and Compliance",
          "Project Management Fundamentals",
          "Cybersecurity for Leadership",
          "Cloud and Enterprise Architecture",
          "Data Management and Analytics",
          "IT Capstone",
        ],
      },
    ],
    entryRequirements: [
      "Bachelor's degree (2:2 or equivalent)",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "IT Manager",
      "Cloud / Systems Architect",
      "Information Security Manager",
      "Technology Consultant",
    ],
  },
  // ---------------------------------------------------------------
  // PPA, Pôle Paris Alternance (France),4 MBA specialisations + 3 BBAs
  // Dual award: PPA MBA + Qualifi Level 7 Diploma (Ofqual-regulated)
  // ---------------------------------------------------------------
  {
    slug: "mba-international-business-ppa",
    title: "MBA in International Business",
    tagline: "Lead across borders with a French MBA and a UK Level 7 Diploma in one dual-award programme.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...PPA,
    duration: "10 months",
    tuition: "Contact admissions",
    categories: ["Business", "Entrepreneurship"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "The PPA MBA in International Business prepares you to lead in a global environment, combining European business perspective with UK-regulated academic rigour.",
    highlights: [
      "Dual award: PPA MBA + Qualifi Level 7 Diploma",
      "International strategy and cross-border trade focus",
      "Flexible online delivery",
      "Global cohort of working professionals",
    ],
    modules: [
      { title: "Core Management", items: ["Strategic Management", "International Finance", "Global Marketing", "Research Methods"] },
      { title: "International Focus", items: ["Global Trade & Policy", "Cross-Cultural Leadership", "International Negotiation", "Emerging Markets"] },
      { title: "Capstone", items: ["Strategic Consulting Project", "Dissertation"] },
    ],
    entryRequirements: [
      "Bachelor's degree in any discipline",
      "Minimum 2 years of professional experience preferred",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "International Business Manager",
      "Global Strategy Consultant",
      "Export / Import Director",
      "International Market Development Lead",
    ],
  },
  {
    slug: "mba-human-resource-management-ppa",
    title: "MBA in Human Resource Management",
    tagline: "Master people strategy, talent and organisational change with a dual French MBA + UK Level 7 award.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...PPA,
    duration: "10 months",
    tuition: "Contact admissions",
    categories: ["Human Resource", "Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A strategic MBA for HR leaders, combining people analytics, talent strategy and organisational development with a European perspective on modern work.",
    highlights: [
      "Dual award: PPA MBA + Qualifi Level 7 Diploma",
      "Modern people analytics and talent strategy",
      "Focus on culture and organisational change",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Core Management", items: ["Strategic Management", "Financial Acumen for HR", "Research Methods", "Business Ethics"] },
      { title: "Specialist HR", items: ["Strategic HRM", "Talent Acquisition & Retention", "People Analytics", "Organisational Development"] },
      { title: "Leadership & Capstone", items: ["Culture & Change Leadership", "HR Consulting Project", "Dissertation"] },
    ],
    entryRequirements: [
      "Bachelor's degree in any discipline",
      "HR or people-management exposure preferred",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "HR Director / Head of People",
      "Talent Strategy Lead",
      "Organisational Development Consultant",
      "People Analytics Manager",
    ],
  },
  {
    slug: "mba-supply-chain-management-ppa",
    title: "MBA in Supply Chain Management",
    tagline: "Lead resilient global supply chains with a dual French MBA and UK Level 7 Diploma award.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...PPA,
    duration: "10 months",
    tuition: "Contact admissions",
    categories: ["Supply Chain", "Business"],
    intakes: defaultIntakes,
    img: logistics,
    overview:
      "Build the strategic and analytical skills to run high-performing supply chains in a global economy, with live case studies drawn from manufacturing, retail and logistics.",
    highlights: [
      "Dual award: PPA MBA + Qualifi Level 7 Diploma",
      "Supply chain analytics and optimisation",
      "Sustainability and ESG focus",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Core Management", items: ["Strategic Management", "Operations Finance", "Research Methods", "Business Analytics"] },
      { title: "Specialist Supply Chain", items: ["Global Logistics", "Procurement & Sourcing", "Supply Chain Analytics", "Sustainable Supply Chains"] },
      { title: "Capstone", items: ["Resilience & Risk Project", "Dissertation"] },
    ],
    entryRequirements: [
      "Bachelor's degree in any discipline",
      "Operations, logistics or procurement exposure preferred",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "Supply Chain Director",
      "Head of Logistics",
      "Procurement Manager",
      "Supply Chain Consultant",
    ],
  },
  {
    slug: "mba-accounting-finance-ppa",
    title: "MBA in Accounting & Finance",
    tagline: "Sharpen your financial leadership with a dual French MBA and UK Level 7 Diploma award.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...PPA,
    duration: "10 months",
    tuition: "Contact admissions",
    categories: ["Accounting", "Finance", "Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A finance-focused MBA that combines corporate finance, financial reporting and strategic decision-making, designed for accountants and analysts moving into senior roles.",
    highlights: [
      "Dual award: PPA MBA + Qualifi Level 7 Diploma",
      "Corporate finance and valuation focus",
      "Advanced financial reporting",
      "Strategic risk and governance",
    ],
    modules: [
      { title: "Core Management", items: ["Strategic Management", "Business Analytics", "Research Methods", "Ethics & Governance"] },
      { title: "Specialist Finance", items: ["Corporate Finance", "Advanced Financial Reporting", "Financial Modelling & Valuation", "Risk Management"] },
      { title: "Capstone", items: ["Finance Consulting Project", "Dissertation"] },
    ],
    entryRequirements: [
      "Bachelor's degree (accounting, finance, business or related)",
      "Relevant professional experience preferred",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "Finance Director / CFO",
      "Financial Controller",
      "Corporate Finance Manager",
      "Treasury / Risk Lead",
    ],
  },
  {
    slug: "bba-human-resource-management-ppa",
    title: "BBA in Human Resource Management",
    tagline: "A foundational BBA exploring HR and people management principles with a dual PPA + Qualifi award.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...PPA,
    qualification: "PPA BBA (France) + Extended Level 5 Diploma (UK)",
    duration: "2 years",
    tuition: "Contact admissions",
    categories: ["Human Resource", "Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A foundational programme exploring the principles of HR and people management, including staff recruitment, development, and retention, alongside core elements of organisational behaviour. Designed for those entering the HR profession or seeking a structured route into people-focused leadership roles.",
    highlights: [
      "Dual qualification, Extended Level 5 Diploma from Qualifi (UK) plus a BBA degree from PPA (France)",
      "Curriculum aligned with international HR standards and practices",
      "Coverage of cross-cultural management, leadership, and organisational behaviour",
      "Flexible online delivery with tutor support",
    ],
    modules: [
      {
        title: "HR Foundations",
        items: [
          "Cross-Cultural Management in International Business",
          "Leadership and Management",
          "Foundations of Human Resource Management",
          "Organisational Behaviour and Workplace Dynamics",
          "Employment Law and Ethical HR Practices",
          "Talent Acquisition, Development, and Retention",
        ],
      },
    ],
    entryRequirements: [
      "Completed secondary education (high school diploma or equivalent)",
      "Other qualifications considered upon review",
    ],
    careerOutcomes: [
      "HR Officer / HR Coordinator",
      "Recruitment Specialist",
      "Training and Development Officer",
      "Employee Engagement Coordinator",
      "HR Analyst",
      "Diversity and Inclusion Officer",
    ],
  },
  {
    slug: "bba-marketing-ppa",
    title: "BBA in Marketing",
    tagline: "A foundational BBA in marketing and brand strategy with a dual PPA + Qualifi award.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...PPA,
    qualification: "PPA BBA (France) + Extended Level 5 Diploma (UK)",
    duration: "2 years",
    tuition: "Contact admissions",
    categories: ["Marketing", "Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A foundational programme covering marketing principles, consumer behaviour, digital marketing and brand strategy, designed for those entering marketing or seeking a structured route into brand and growth roles. Awarded as a dual PPA (France) BBA and a Qualifi (UK) Extended Level 5 Diploma.",
    highlights: [
      "Dual qualification, Extended Level 5 Diploma from Qualifi (UK) plus a BBA degree from PPA (France)",
      "Coverage of digital marketing, branding and consumer behaviour",
      "Practical, campaign-focused learning",
      "Flexible online delivery with tutor support",
    ],
    modules: [
      {
        title: "Marketing Foundations",
        items: [
          "Principles of Marketing",
          "Consumer Behaviour",
          "Digital and Social Media Marketing",
          "Brand Management",
          "Marketing Research and Analytics",
          "Integrated Marketing Communications",
        ],
      },
    ],
    entryRequirements: [
      "Completed secondary education (high school diploma or equivalent)",
      "Other qualifications considered upon review",
    ],
    careerOutcomes: [
      "Marketing Coordinator",
      "Brand Assistant",
      "Digital Marketing Executive",
      "Social Media Manager",
      "Market Research Analyst",
    ],
  },
  {
    slug: "bba-international-business-ppa",
    title: "BBA in International Business",
    tagline: "A foundational BBA in global business and trade with a dual PPA + Qualifi award.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...PPA,
    qualification: "PPA BBA (France) + Extended Level 5 Diploma (UK)",
    duration: "2 years",
    tuition: "Contact admissions",
    categories: ["Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A foundational programme exploring international trade, cross-cultural management, global strategy and international finance, designed for those seeking careers in globally operating organisations. Awarded as a dual PPA (France) BBA and a Qualifi (UK) Extended Level 5 Diploma.",
    highlights: [
      "Dual qualification, Extended Level 5 Diploma from Qualifi (UK) plus a BBA degree from PPA (France)",
      "Focus on global trade, strategy and cross-cultural management",
      "International, real-world case studies",
      "Flexible online delivery with tutor support",
    ],
    modules: [
      {
        title: "International Business Foundations",
        items: [
          "Introduction to International Business",
          "Cross-Cultural Management",
          "Global Trade and Economics",
          "International Marketing",
          "International Finance",
          "Global Strategy and Operations",
        ],
      },
    ],
    entryRequirements: [
      "Completed secondary education (high school diploma or equivalent)",
      "Other qualifications considered upon review",
    ],
    careerOutcomes: [
      "International Business Coordinator",
      "Export / Import Officer",
      "Global Operations Assistant",
      "Trade Analyst",
      "International Account Executive",
    ],
  },

  // ---------------------------------------------------------------
  // eie European Business School (Malta, EU)
  // ---------------------------------------------------------------
  {
    slug: "bba-business-management-eie",
    title: "BA (Hons) in Business Management (BBA)",
    tagline: "A 100% online MQF/EQF Level 6 Honours Bachelor's completable in as little as 1.5 years.",
    level: "Undergraduate",
    levelGroup: "Bachelor's",
    ...EIE,
    duration: "2 years",
    tuition: "Contact admissions",
    categories: ["Business", "Entrepreneurship", "Marketing"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "The eie BA (Hons) in Business Management is a fully online MQF Level 6 / EQF Level 6 Honours Bachelor's, designed to be completed in 1.5 to 2 years with flexible study and recognition across Europe and beyond.",
    highlights: [
      "MQF Level 6 / EQF Level 6 Honours Bachelor's",
      "100% online, 1.5-2 year flexible completion",
      "Credit recognition for prior study or experience",
      "Recognised across EU, UK, Asia & Middle East",
    ],
    modules: [
      { title: "Business Foundations", items: ["Principles of Management", "Financial Accounting", "Marketing Principles", "Microeconomics"] },
      { title: "Core Business", items: ["Organisational Behaviour", "Operations Management", "Business Statistics", "Business Law"] },
      { title: "Strategy & Final Year", items: ["Strategic Management", "Entrepreneurship", "Research Methods", "Dissertation / Capstone"] },
    ],
    entryRequirements: [
      "A-levels, Level 5 diploma or equivalent",
      "Mature applicants with relevant work experience considered",
      "English proficiency (IELTS 5.5 or equivalent)",
    ],
    careerOutcomes: [
      "Management Trainee",
      "Operations / Business Analyst",
      "Marketing or Sales Coordinator",
      "Small-business owner / Founder",
    ],
  },
  {
    slug: "master-hospitality-tourism-eie",
    title: "Master's in Hospitality & Tourism (MBA)",
    tagline: "An MFHEA-licensed MBA/Master's in Hospitality & Tourism, aligned to EQF/MQF and recognised internationally.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...EIE,
    duration: "10 months",
    tuition: "Contact admissions",
    categories: ["Hospitality and Tourism", "Business"],
    intakes: defaultIntakes,
    img: edu,
    overview:
      "A fully online MBA / Master's for ambitious professionals in hospitality, travel and tourism, combining European business strategy with a focus on experience design and revenue leadership.",
    highlights: [
      "EQF / MQF-aligned Master's",
      "Global recognition across EU, UK, Asia & Middle East",
      "Revenue management and experience design",
      "Flexible 100% online delivery",
    ],
    modules: [
      { title: "Business Core", items: ["Strategic Management", "Financial Acumen", "Research Methods", "Marketing Strategy"] },
      { title: "Specialist", items: ["Hospitality Operations", "Revenue Management", "Guest Experience Design", "Sustainable Tourism"] },
      { title: "Capstone", items: ["Industry Project", "Dissertation"] },
    ],
    entryRequirements: [
      "Bachelor's degree in any discipline",
      "Hospitality, travel or services experience preferred",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "General Manager (Hotels / Resorts)",
      "Head of Guest Experience",
      "Tourism & Destination Manager",
      "Hospitality Consultant",
    ],
  },
  {
    slug: "master-business-management-eie",
    title: "Master's in Business Management",
    tagline: "An MFHEA-licensed, EQF/MQF-aligned Master's in Business Management, delivered fully online.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...EIE,
    duration: "10 months",
    tuition: "Contact admissions",
    categories: ["Business", "Entrepreneurship"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A broad management Master's covering strategy, finance, marketing and leadership with a European outlook and flexible online delivery, recognised across the EU, UK, Asia and the Middle East.",
    highlights: [
      "EQF / MQF-aligned Master's",
      "Broad general-management curriculum",
      "European perspective on strategy and leadership",
      "100% online, flexible schedule",
    ],
    modules: [
      { title: "Management Core", items: ["Strategic Management", "Financial Acumen", "Marketing Strategy", "Research Methods"] },
      { title: "Leadership", items: ["Leadership & Change", "People Management", "Operations Strategy", "Business Ethics"] },
      { title: "Capstone", items: ["Consulting Project", "Dissertation"] },
    ],
    entryRequirements: [
      "Bachelor's degree in any discipline",
      "Personal statement",
      "English proficiency (IELTS 6.0 or equivalent)",
    ],
    careerOutcomes: [
      "General Manager / Director",
      "Head of Operations",
      "Business Development Lead",
      "Management Consultant",
    ],
  },
  {
    slug: "mba-accounting-finance-eie",
    title: "MBA in Accounting and Finance",
    tagline: "A specialised, career-oriented MBA preparing professionals for strategic roles in corporate finance and financial leadership.",
    level: "Postgraduate",
    levelGroup: "Master's",
    ...EIE,
    duration: "10 months",
    tuition: "Contact admissions",
    categories: ["Accounting", "Finance", "Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A specialised, career-oriented MBA preparing professionals for strategic roles in corporate finance, auditing, investment, and financial leadership. Awarded by eie European Business School and combined with a UK-regulated Qualifi Level 7 Diploma, the programme integrates core MBA learning with advanced financial expertise to develop global finance leaders.",
    highlights: [
      "Dual qualification, Qualifi Level 7 Diploma in Accounting and Finance plus the eie MBA",
      "MFHEA-accredited and EQF Level 7 aligned, recognised across the European Union and beyond",
      "Fully online delivery with flexible study schedule",
      "Curriculum integrating core MBA learning with strategic finance expertise",
    ],
    modules: [
      {
        title: "Finance Core",
        items: [
          "Strategic Financial Management",
          "Advanced Auditing and Assurance",
          "Investment Analysis and Portfolio Management",
          "Risk Management and Financial Controls",
          "Corporate Governance, Ethics, and Compliance",
          "Leadership and Strategic Decision-Making",
        ],
      },
    ],
    entryRequirements: [
      "Bachelor's degree or equivalent",
      "Or Qualifi Level 6 Diploma or equivalent",
      "Or minimum three years of managerial work experience",
    ],
    careerOutcomes: [
      "Chief Financial Officer (CFO)",
      "Financial Controller",
      "Investment Manager",
      "Strategic Consultant",
      "Finance Director",
      "Audit and Risk Manager",
      "FinTech Founder / Entrepreneur",
      "Corporate Finance Advisor",
    ],
  },

  // ---------------------------------------------------------------
  // Qualifi (UK Ofqual-regulated), Diplomas Level 2-8
  // ---------------------------------------------------------------
  {
    slug: "qualifi-level-2-cyber-security",
    title: "Qualifi Level 2 Diploma for Beginners in Cyber Security",
    tagline: "An Ofqual-regulated entry-level UK diploma introducing the fundamentals of cyber security for complete beginners.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[2].duration,
    tuition: "Contact admissions",
    categories: ["Cyber Security", "Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "An Ofqual-regulated Level 2 qualification introducing the core concepts of cyber security, ideal for first-time learners with no prior experience and as a pathway to further study.",
    highlights: [
      "Entry-level Ofqual-regulated UK diploma",
      "Open access, no formal qualifications required",
      "Beginner-friendly introduction to cyber security",
      "Pathway into Level 3 and Level 4 Cyber study",
    ],
    modules: [
      { title: "Foundations", items: ["Introduction to Cyber Security", "Staying Safe Online", "Computer & Network Basics", "Understanding Cyber Threats"] },
    ],
    entryRequirements: qualifiLevelMeta[2].entry,
    careerOutcomes: [
      "IT Support Trainee",
      "Junior Help Desk Assistant",
      "Cyber Security Awareness Roles",
      "Pathway to Level 3 / Level 4 Cyber study",
    ],
  },
  {
    slug: "qualifi-level-3-business-management",
    title: "Qualifi Level 3 Diploma in Business Management",
    tagline: "An Ofqual-regulated Level 3 pathway into undergraduate business study.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[3].duration,
    tuition: "Contact admissions",
    categories: ["Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "A Level 3 diploma that builds practical management understanding and prepares learners for Level 4 or degree-level study.",
    highlights: [
      "Ofqual-regulated UK Level 3 diploma",
      "Pathway to Level 4 and Bachelor's study",
      "Practical, applied content",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Core Business", items: ["Principles of Management", "Marketing Basics", "Finance for Non-Finance", "Operations Essentials"] },
    ],
    entryRequirements: qualifiLevelMeta[3].entry,
    careerOutcomes: [
      "Team Leader / Supervisor",
      "Junior Business Analyst",
      "Project Coordinator",
      "Pathway to Bachelor's study",
    ],
  },
  {
    slug: "qualifi-level-4-business-management",
    title: "Qualifi Level 4 Diploma in Business Management",
    tagline: "An Ofqual-regulated first-year-undergraduate equivalent Level 4 Business Management diploma.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[4].duration,
    tuition: "Contact admissions",
    categories: ["Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "Equivalent to the first year of a UK Bachelor's in Business Management, this Level 4 diploma covers core management, finance and marketing, a recognised pathway into Level 5 study.",
    highlights: [
      "Equivalent to Year 1 of a UK Bachelor's",
      "Ofqual-regulated",
      "Clear pathway to Level 5 and Top-Up",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Management Fundamentals", items: ["Principles of Management", "Business Communication", "Business Environment", "Marketing Principles"] },
      { title: "Operations & Finance", items: ["Finance for Managers", "Operations Management", "Business Ethics", "Research Skills"] },
    ],
    entryRequirements: qualifiLevelMeta[4].entry,
    careerOutcomes: [
      "Assistant Manager",
      "Business Analyst (Junior)",
      "Marketing Executive",
      "Pathway to Level 5 study",
    ],
  },
  {
    slug: "qualifi-level-4-information-technology",
    title: "Qualifi Level 4 Diploma in Information Technology",
    tagline: "An Ofqual-regulated Level 4 IT diploma equivalent to Year 1 of a UK undergraduate degree.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[4].duration,
    tuition: "Contact admissions",
    categories: ["Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "A structured entry into IT careers covering systems, networks, programming and databases, with a clear progression route into Level 5 IT or Cyber Security.",
    highlights: [
      "Equivalent to Year 1 of a UK BSc",
      "Ofqual-regulated",
      "Pathway to Level 5 IT / Cyber",
      "Flexible online delivery",
    ],
    modules: [
      { title: "IT Core", items: ["Computer Systems", "Programming Fundamentals", "Databases", "Networking"] },
      { title: "Applied IT", items: ["Web Technologies", "IT Security Basics", "Problem-Solving in IT", "IT Project Basics"] },
    ],
    entryRequirements: qualifiLevelMeta[4].entry,
    careerOutcomes: [
      "IT Technician",
      "Junior Developer",
      "Network Support Analyst",
      "Pathway to Level 5 study",
    ],
  },
  {
    slug: "qualifi-level-4-cyber-security",
    title: "Qualifi Level 4 Diploma in Cyber Security",
    tagline: "An Ofqual-regulated Level 4 Cyber Security diploma, a practical entry to a high-demand career.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[4].duration,
    tuition: "Contact admissions",
    categories: ["Cyber Security", "Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "A focused introduction to cyber security covering threats, defences, cryptography and security operations, ideal for career-starters and career-changers.",
    highlights: [
      "Ofqual-regulated Level 4 diploma",
      "Practical security operations content",
      "Pathway to Level 5 / Level 7 Cyber",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Foundations", items: ["Networking Fundamentals", "Introduction to Cyber Security", "Cryptography Basics", "Operating Systems"] },
      { title: "Applied Security", items: ["Security Operations", "Threats & Vulnerabilities", "Incident Response Basics", "Risk & Compliance"] },
    ],
    entryRequirements: qualifiLevelMeta[4].entry,
    careerOutcomes: [
      "Junior Security Analyst",
      "SOC Analyst (Tier 1)",
      "IT Support with Security Focus",
      "Pathway to Level 5 Cyber",
    ],
  },
  {
    slug: "qualifi-level-4-accounting-finance",
    title: "Qualifi Level 4 Diploma in Accounting and Finance",
    tagline: "An Ofqual-regulated Level 4 Accounting and Finance diploma, a practical entry to the finance industry.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: "As little as 4 months (fast-track)",
    tuition: "Contact admissions",
    categories: ["Accounting", "Finance"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "An undergraduate-level programme providing the essential skills and knowledge required for a successful career in the finance industry. With a focus on practical application and industry relevance, the diploma equips learners, both school leavers and working professionals, with the expertise to excel in today's competitive business environment.",
    highlights: [
      "Strong foundation in core accounting and finance principles",
      "Supportive online learning environment with personalised guidance",
      "Affordable fee structure with scholarships available",
      "Fast completion, as little as 4 months",
    ],
    modules: [
      {
        title: "Accounting & Finance Fundamentals",
        items: [
          "Financial Accounting Fundamentals",
          "Management Accounting",
          "Business Economics",
          "Quantitative Methods for Finance",
          "Business Law and Ethics",
          "Introduction to Corporate Finance",
        ],
      },
    ],
    entryRequirements: qualifiLevelMeta[4].entry,
    careerOutcomes: [
      "Accounts Assistant",
      "Junior Accountant",
      "Bookkeeper",
      "Audit Assistant",
      "Finance Officer",
    ],
  },
  {
    slug: "qualifi-level-4-psychology",
    title: "Qualifi Level 4 Diploma in Psychology",
    tagline: "An Ofqual-regulated Level 4 Psychology diploma exploring core psychological theories and mental health.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[4].duration,
    tuition: "Contact admissions",
    categories: ["Psychology", "Education"],
    intakes: defaultIntakes,
    img: edu,
    overview:
      "An undergraduate-level programme exploring core psychological theories, research methods, mental health, and human development. The diploma is designed for those passionate about understanding human behaviour, supporting mental wellbeing, or working within therapeutic and community settings, and provides a foundation for progression to Level 5 study or roles in the wellbeing sector.",
    highlights: [
      "Equivalent to Year 1 of a UK undergraduate degree in Psychology",
      "Globally recognised Qualifi (UK) qualification regulated by Ofqual",
      "Flexible 100% online delivery with one-on-one tutor support",
      "Assignment-based assessment (no exams)",
    ],
    modules: [
      {
        title: "Psychology Foundations",
        items: [
          "Foundations of Psychology",
          "Research Methods in Psychology",
          "Cognitive Psychology",
          "Developmental Psychology",
          "Social Psychology",
          "Mental Health and Wellbeing",
        ],
      },
    ],
    entryRequirements: qualifiLevelMeta[4].entry,
    careerOutcomes: [
      "Psychology Research Assistant",
      "Mental Health Support Worker",
      "Community Engagement Officer",
      "Wellbeing Coach (entry-level)",
      "Care and Support Practitioner",
    ],
  },
  {
    slug: "qualifi-level-5-extended-business-management",
    title: "Qualifi Level 5 Extended Diploma in Business Management",
    tagline: "An Ofqual-regulated Level 5 Extended diploma, a full pathway to Level 6 Top-Up and a UK Bachelor's degree.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "Equivalent to the first two years of a UK Bachelor's degree, this Level 5 Extended diploma develops advanced management capability and unlocks Top-Up degree progression.",
    highlights: [
      "Equivalent to Years 1-2 of a UK BA",
      "Ofqual-regulated",
      "Direct pathway to Top-Up Bachelor's",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Level 4 Content", items: ["Principles of Management", "Marketing", "Finance", "Operations"] },
      { title: "Level 5 Content", items: ["Strategic Management", "HRM", "Business Analysis", "Research Methods"] },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Manager / Team Lead",
      "Business Analyst",
      "Project Coordinator",
      "Top-Up Bachelor's progression",
    ],
  },
  {
    slug: "qualifi-level-5-extended-cyber-security",
    title: "Qualifi Level 5 Extended Diploma in Cyber Security",
    tagline: "An Ofqual-regulated Level 5 Extended Cyber Security diploma, a pathway to Top-Up BSc completion.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Cyber Security", "Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "Equivalent to the first two years of a UK BSc in Cyber Security, this Extended diploma develops practical security analyst capabilities and opens a Top-Up route to a full degree.",
    highlights: [
      "Equivalent to Years 1-2 of a UK BSc",
      "Ofqual-regulated",
      "Pathway to Top-Up Cyber BSc",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Level 4 Content", items: ["Networking", "Intro to Cyber", "Cryptography Basics", "Operating Systems"] },
      { title: "Level 5 Content", items: ["Security Architecture", "Ethical Hacking Fundamentals", "Digital Forensics Basics", "Risk & Compliance"] },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Security Analyst",
      "SOC Analyst",
      "Vulnerability Analyst",
      "Top-Up BSc progression",
    ],
  },
  {
    slug: "qualifi-level-5-extended-information-technology",
    title: "Qualifi Level 5 Extended Diploma in Information Technology",
    tagline: "An Ofqual-regulated Level 5 Extended IT diploma, a pathway to a Top-Up BSc in IT.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "A Level 5 Extended IT diploma covering software, databases, networks and cloud, equivalent to the first two years of a UK BSc in IT.",
    highlights: [
      "Equivalent to Years 1-2 of a UK BSc",
      "Ofqual-regulated",
      "Pathway to Top-Up IT BSc",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Level 4 Content", items: ["Programming", "Databases", "Networking", "Computer Systems"] },
      { title: "Level 5 Content", items: ["Software Engineering", "Cloud Computing", "Web Technologies", "Data Analysis Fundamentals"] },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Software Developer",
      "Systems Analyst",
      "Junior Cloud Engineer",
      "Top-Up BSc progression",
    ],
  },
  {
    slug: "qualifi-level-5-hospitality-tourism",
    title: "Qualifi Level 5 Diploma in Hospitality and Tourism Management",
    tagline: "An advanced online programme building in-depth industry knowledge for the global hospitality sector.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: "As little as 6 months (fast-track)",
    tuition: "Contact admissions",
    categories: ["Hospitality and Tourism", "Business"],
    intakes: defaultIntakes,
    img: edu,
    overview:
      "An advanced online programme building in-depth industry knowledge, leadership ability, and practical skills for the global hospitality sector. Learners gain expertise in hospitality operations, tourism marketing, and strategic management, positioning themselves as sought-after professionals in hotels, resorts, travel agencies, and beyond.",
    highlights: [
      "Equivalent to Year 2 of a UK undergraduate degree",
      "Globally recognised Qualifi (UK) qualification regulated by Ofqual",
      "Assignment-focused assessment, no traditional exams",
      "Fast completion in as little as 6 months",
    ],
    modules: [
      {
        title: "Hospitality & Tourism Core",
        items: [
          "Strategic Hospitality Management",
          "Tourism Marketing and Destination Management",
          "Hospitality Operations and Service Quality",
          "Financial Management for Hospitality",
          "Cross-Cultural Communication and Leadership",
        ],
      },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Hotel Operations Manager",
      "Tourism Marketing Manager",
      "Resort Manager",
      "Travel Agency Director",
      "Events and Conference Manager",
    ],
  },
  {
    slug: "qualifi-level-5-psychology",
    title: "Qualifi Level 5 Diploma in Psychology",
    tagline: "An advanced undergraduate programme deepening understanding of psychological theories and applied practice.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Psychology", "Education"],
    intakes: defaultIntakes,
    img: edu,
    overview:
      "An advanced undergraduate programme deepening understanding of psychological theories and applied practice. The diploma covers cognitive, developmental, and abnormal psychology alongside research methods and assessment, and incorporates practical learning through projects and case studies, equivalent to Year 2 of a UK undergraduate Psychology degree.",
    highlights: [
      "Equivalent to Year 2 of a UK undergraduate Psychology degree",
      "Globally recognised Qualifi (UK) qualification regulated by Ofqual",
      "Practical learning through research projects and case studies",
      "Flexible 100% online delivery with tutor support",
    ],
    modules: [
      {
        title: "Advanced Psychology",
        items: [
          "Cognitive Psychology, Advanced",
          "Developmental Psychology, Advanced",
          "Abnormal Psychology and Psychopathology",
          "Research Methods and Statistics",
          "Psychological Assessment",
          "Applied Psychology in Practice",
        ],
      },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Mental Health Support Worker (advanced)",
      "Research Assistant in Psychology",
      "Behavioural Analyst",
      "Counselling Support Practitioner",
      "Wellbeing Coordinator",
    ],
  },
  {
    slug: "qualifi-level-5-accounting-finance",
    title: "Qualifi Level 5 Diploma in Accounting and Finance",
    tagline: "An advanced undergraduate programme building on Level 4 with deeper coverage of financial management and auditing.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Accounting", "Finance"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "An advanced undergraduate programme building on Level 4 Accounting and Finance with deeper coverage of financial management, auditing, and strategic accounting decision-making. The diploma prepares learners for senior accounting roles or progression into Year 3 of a UK Bachelor's degree or Level 7 postgraduate study.",
    highlights: [
      "Equivalent to Year 2 of a UK undergraduate degree",
      "Globally recognised Qualifi (UK) qualification regulated by Ofqual",
      "Assignment-based assessment with no exams",
      "Pathway to Walsh Bachelor's in Accounting top-up or Year 3 of a UK degree",
    ],
    modules: [
      {
        title: "Advanced Accounting & Finance",
        items: [
          "Advanced Financial Accounting",
          "Management Accounting and Decision-Making",
          "Auditing and Assurance",
          "Corporate Finance",
          "Taxation Principles",
          "Financial Reporting Standards",
        ],
      },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Senior Accounts Assistant",
      "Management Accountant",
      "Audit Senior",
      "Tax Advisor (junior)",
      "Financial Analyst",
    ],
  },
  {
    slug: "qualifi-level-5-education-training",
    title: "Qualifi Level 5 Diploma in Education and Training",
    tagline: "A teaching qualification for educators working in further education, adult learning, and work-based training.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: "3 to 6 months",
    tuition: "Contact admissions",
    categories: ["Education"],
    intakes: defaultIntakes,
    img: edu,
    overview:
      "A teaching qualification designed for educators, trainers, and learning facilitators working, or wishing to work, in further education, adult and community learning, work-based training, or the public services. The diploma develops teaching, curriculum planning, assessment, and leadership skills, and includes a mandatory teaching practice requirement.",
    highlights: [
      "Internationally recognised teaching qualification regulated by Ofqual",
      "Develops competence to plan, deliver, and assess learning across diverse settings",
      "Pathway to Qualified Teacher Learning and Skills (QTLS) status in the UK",
      "Flexible 100% online delivery with tutor support",
    ],
    modules: [
      {
        title: "Teaching Core",
        items: [
          "Theories, Principles and Models in Education and Training",
          "Teaching, Learning and Assessment in Education and Training",
          "Developing Teaching, Learning and Assessment in Education and Training",
          "Wider Professional Practice and Development in Education and Training",
          "Developing, Using and Organising Resources in a Specialist Area",
        ],
      },
    ],
    entryRequirements: [
      "Hold a relevant qualification at least one level above the learners taught (ideally Level 3 in subject specialism)",
      "Access to 100 hours of teaching practice during the course",
      "Minimum 19 years old at the start of the programme",
      "Adequate literacy, language, numeracy, and ICT skills",
    ],
    careerOutcomes: [
      "Further Education Lecturer",
      "Adult Education Tutor",
      "Corporate Trainer",
      "Workplace Assessor",
      "Curriculum Developer",
    ],
  },
  {
    slug: "qualifi-level-6-business-management",
    title: "Qualifi Level 6 Diploma in Business Management",
    tagline: "An Ofqual-regulated final-year undergraduate equivalent Level 6 Business Management diploma.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[6].duration,
    tuition: "Contact admissions",
    categories: ["Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "Equivalent to the final year of a UK Bachelor's, the Level 6 diploma focuses on strategic management, leadership and applied research, a recognised pathway into Level 7.",
    highlights: [
      "Equivalent to the final year of a UK BA",
      "Ofqual-regulated",
      "Clear pathway into Level 7 and MBA study",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Strategic Focus", items: ["Strategic Management", "Leadership & People", "Research Project", "International Business"] },
    ],
    entryRequirements: qualifiLevelMeta[6].entry,
    careerOutcomes: [
      "Manager / Senior Team Lead",
      "Business Partner",
      "Consultant (Entry)",
      "Pathway to MBA and Level 7 study",
    ],
  },
  {
    slug: "qualifi-level-3-integrated-business-management",
    title: "Qualifi Level 3 Integrated Diploma in Business and Management",
    tagline: "An Ofqual-regulated Level 3 integrated diploma and a pathway into Level 4 degree study.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[3].duration,
    tuition: "Contact admissions",
    categories: ["Business"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "An integrated Level 3 diploma that builds foundational business and management knowledge alongside the academic and study skills needed for higher education, providing a recognised pathway into a Level 4 undergraduate programme.",
    highlights: [
      "Foundation/Year-0 equivalent for degree entry",
      "Ofqual-regulated Qualifi (UK) qualification",
      "Integrated study-skills and English support",
      "Flexible 100% online delivery",
    ],
    modules: [
      { title: "Foundation Units", items: ["English for Higher Education", "Communication and Cultural Skills for Higher Education", "An Introduction to the Business Environment", "Business Resources"] },
      { title: "Business & Management Units", items: ["An Introduction to Marketing", "Human Resource Management", "Business Communication", "Recruitment and Selection in Business"] },
    ],
    entryRequirements: qualifiLevelMeta[3].entry,
    careerOutcomes: [
      "Business Administrator",
      "Team Coordinator",
      "Pathway to Level 4 degree study",
      "Junior Operations Assistant",
    ],
  },
  {
    slug: "qualifi-level-5-information-technology",
    title: "Qualifi Level 5 Diploma in Information Technology",
    tagline: "An Ofqual-regulated Level 5 IT diploma, equivalent to Year 2 of a UK BSc in IT.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "A Level 5 IT diploma deepening knowledge of software development, networking, databases and emerging technologies, equivalent to the second year of a UK BSc in Information Technology and a pathway into a Top-Up degree.",
    highlights: [
      "Equivalent to Year 2 of a UK BSc",
      "Ofqual-regulated Qualifi (UK) qualification",
      "Pathway to a Top-Up BSc in IT",
      "Flexible 100% online delivery",
    ],
    modules: [
      { title: "Core IT Units", items: ["Software Engineering", "Database Design and Development", "Network Security", "Systems Analysis and Design", "Emerging Technologies"] },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Software Developer",
      "Systems Analyst",
      "Network Administrator",
      "Top-Up BSc progression",
    ],
  },
  {
    slug: "qualifi-level-5-cyber-security",
    title: "Qualifi Level 5 Diploma in Cyber Security",
    tagline: "An Ofqual-regulated Level 5 Cyber Security diploma, equivalent to Year 2 of a UK BSc.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Cyber Security", "Information Technology"],
    intakes: defaultIntakes,
    img: cyber,
    overview:
      "A Level 5 Cyber Security diploma covering network defence, ethical hacking, cryptography and security operations, equivalent to the second year of a UK BSc and a pathway into a Top-Up degree.",
    highlights: [
      "Equivalent to Year 2 of a UK BSc",
      "Ofqual-regulated Qualifi (UK) qualification",
      "Hands-on security operations focus",
      "Pathway to a Top-Up BSc in Cyber Security",
    ],
    modules: [
      { title: "Core Cyber Security Units", items: ["Network Security and Defence", "Ethical Hacking and Penetration Testing", "Cryptography", "Security Operations and Incident Response", "Governance, Risk and Compliance"] },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Security Analyst",
      "SOC Analyst",
      "Penetration Tester (Junior)",
      "Top-Up BSc progression",
    ],
  },
  {
    // Qualifi RQF 610/3935/4. Content, units and credit values taken from the
    // awarding body's own specification (see source in course-units.json).
    // Slug follows the live "level-4-diploma-in-artificial-intelligence" naming
    // so the two AI diplomas sit together as a Level 4 → Level 5 progression.
    slug: "level-5-diploma-in-artificial-intelligence",
    title: "Level 5 Diploma in Artificial Intelligence",
    tagline: "An Ofqual-regulated Level 5 AI diploma covering deep learning, NLP and computer vision, equivalent to Year 2 of a UK BSc.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Artificial Intelligence (AI)", "Data Analytics", "Information Technology"],
    intakes: defaultIntakes,
    img: ai,
    overview:
      "An advanced continuation of the Level 4 Diploma in Artificial Intelligence, this 120-credit Qualifi qualification takes learners beyond AI fundamentals into advanced machine learning techniques, natural language processing, computer vision, reinforcement learning and AI for robotics. Alongside the technical content it develops critical thinking, problem-solving and the ethical dimensions of AI, with hands-on projects that apply AI expertise to real-world challenges.",
    overviewLong:
      "The diploma is made up of six mandatory 20-credit units at Level 5, carrying 120 credits in total (Ofqual qualification number 610/3935/4). Learners build on the deep learning, data science and neural network fundamentals introduced at Level 4, working with advanced network architectures, reinforcement learning, language and vision models, and the design of systems that people can actually interact with. Assessment is coursework-based and delivered entirely online. On completion learners are equipped with the knowledge, skills and ethical awareness expected of a competent AI professional, and can progress to a Level 6 qualification, the final year of an undergraduate degree, or employment in the field.",
    gains: [
      "Deep comprehension of advanced AI concepts beyond the fundamentals",
      "Ability to apply sophisticated machine learning methodologies to complex problems",
      "Advanced data handling, cleaning and feature-engineering skills",
      "Mastery of advanced AI programming languages and libraries",
      "Competence in assessing the ethical and legal implications of AI",
      "Strategic understanding of AI's societal and economic impacts",
    ],
    highlights: [
      "120 credits at Level 5, equivalent to Year 2 of a UK BSc",
      "Ofqual-regulated Qualifi (UK) qualification (610/3935/4)",
      "Six mandatory 20-credit units across deep learning, NLP and computer vision",
      "Progression to Level 6 or the final year of an undergraduate degree",
    ],
    modules: [
      {
        title: "Mandatory Units",
        items: [
          "Visualisation",
          "Reinforce Machine Learning",
          "Natural Language Processing",
          "Human-AI Interaction",
          "Advanced Deep Machine Learning",
          "Introduction to Computer Vision",
        ],
      },
    ],
    entryRequirements: [
      "A Level 4 qualification or an equivalent international qualification",
      "Or relevant work experience with clear career ambitions, including applicants holding a degree in another discipline",
      "Aged 18 or over",
      "English proficiency (IELTS 4.0 / CEFR B1 or equivalent) where applicable",
    ],
    careerOutcomes: [
      "Machine Learning Engineer",
      "NLP / Computer Vision Engineer (Junior)",
      "AI Developer",
      "Progression to Level 6 or the final year of a BSc",
    ],
  },
  {
    slug: "qualifi-level-5-extended-accounting-finance",
    title: "Qualifi Level 5 Extended Diploma in Accounting and Finance",
    tagline: "An Ofqual-regulated Level 5 Extended Accounting & Finance diploma, a pathway to a Top-Up BA.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Accounting", "Finance"],
    intakes: defaultIntakes,
    img: mba,
    overview:
      "An extended Level 5 diploma covering financial and management accounting, corporate finance, audit and taxation, equivalent to the first two years of a UK undergraduate degree in Accounting and Finance.",
    highlights: [
      "Equivalent to Years 1-2 of a UK degree",
      "Ofqual-regulated Qualifi (UK) qualification",
      "Pathway to a Top-Up BA in Accounting & Finance",
      "Flexible 100% online delivery",
    ],
    modules: [
      { title: "Level 4 Content", items: ["Accounting in a Business Context", "Economics for Business", "Quantitative Methods", "Financial Accounting"] },
      { title: "Level 5 Content", items: ["Management Accounting", "Corporate Finance", "Audit and Assurance", "Taxation", "Financial Reporting"] },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Assistant Accountant",
      "Finance Officer",
      "Audit Assistant",
      "Top-Up BA progression",
    ],
  },
  {
    slug: "qualifi-level-5-extended-psychology",
    title: "Qualifi Level 5 Extended Diploma in Psychology",
    tagline: "An Ofqual-regulated Level 5 Extended Psychology diploma, a pathway to a Top-Up BSc.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[5].duration,
    tuition: "Contact admissions",
    categories: ["Psychology", "Education"],
    intakes: defaultIntakes,
    img: edu,
    overview:
      "An extended Level 5 diploma covering cognitive, developmental, social and abnormal psychology alongside research methods, equivalent to the first two years of a UK undergraduate Psychology degree and a pathway into a Top-Up programme.",
    highlights: [
      "Equivalent to Years 1-2 of a UK degree",
      "Ofqual-regulated Qualifi (UK) qualification",
      "Research-methods and applied-practice focus",
      "Pathway to a Top-Up BSc in Psychology",
    ],
    modules: [
      { title: "Level 4 Content", items: ["Introduction to Psychology", "Biological Psychology", "Cognitive Psychology", "Research Methods I"] },
      { title: "Level 5 Content", items: ["Developmental Psychology", "Social Psychology", "Abnormal Psychology", "Research Methods II"] },
    ],
    entryRequirements: qualifiLevelMeta[5].entry,
    careerOutcomes: [
      "Wellbeing Practitioner",
      "Research Assistant",
      "People & Behaviour Analyst",
      "Top-Up BSc progression",
    ],
  },
  // ---- Level 7 subjects (Master's equivalent) ----
  ...[
    { slug: "health-social-care", subject: "Health and Social Care", categories: ["Business"], img: edu, careers: ["Service Manager", "Clinical Lead", "Health & Social Care Consultant", "Policy Lead"] },
    { slug: "data-science", subject: "Data Science", categories: ["Data Analytics", "Information Technology"], img: ai, careers: ["Data Scientist", "ML Engineer", "Analytics Lead", "Research Analyst"] },
    // "Accounting and Finance" Level 7 removed here — the live catalogue already
    // provides "Level 7 Diploma in Accounting and Finance" (courses-live.ts), so the
    // generated stub was a duplicate.
    { slug: "hospitality-tourism-management", subject: "Hospitality and Tourism Management", categories: ["Hospitality and Tourism", "Business"], img: edu, careers: ["General Manager", "Revenue Manager", "Experience Lead", "Tourism Consultant"] },
    { slug: "psychology", subject: "Psychology", categories: ["Psychology", "Education"], img: edu, careers: ["People Consultant", "Wellbeing Lead", "Counsellor (with further training)", "Research Analyst"] },
    { slug: "strategic-management", subject: "Strategic Management", categories: ["Business"], img: mba, careers: ["Head of Strategy", "Senior Consultant", "General Manager", "Transformation Lead"] },
    { slug: "strategic-marketing", subject: "Strategic Marketing", categories: ["Marketing", "Business"], img: mba, careers: ["Marketing Director", "Brand Lead", "Head of Growth", "Marketing Consultant"] },
    { slug: "human-resource-management", subject: "Human Resource Management", categories: ["Human Resource", "Business"], img: mba, careers: ["HR Director", "Talent Lead", "People Partner", "HR Consultant"] },
    { slug: "education-management", subject: "Education Management", categories: ["Education"], img: edu, careers: ["Head of Centre / Principal", "Curriculum Lead", "Training Manager", "Education Consultant"] },
    { slug: "information-technology", subject: "Information Technology", categories: ["Information Technology", "Data Analytics"], img: cyber, careers: ["IT Manager", "Senior Systems Analyst", "Enterprise Architect", "Technology Consultant"] },
    { slug: "project-management", subject: "Project Management", categories: ["Business"], img: mba, careers: ["Project Manager", "Programme Manager", "PMO Lead", "Delivery Consultant"] },
  ].map<Course>((s) => ({
    slug: `qualifi-level-7-${s.slug}`,
    title: `Qualifi Level 7 Diploma in ${s.subject}`,
    tagline: `An Ofqual-regulated Master's-equivalent Level 7 diploma in ${s.subject}.`,
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[7].duration,
    tuition: "Contact admissions",
    categories: s.categories,
    intakes: defaultIntakes,
    img: s.img,
    overview: `The Qualifi Level 7 Diploma in ${s.subject} is a UK Ofqual-regulated Master's-equivalent qualification. It builds the strategic, analytical and leadership capability needed for senior roles in ${s.subject.toLowerCase()}, and can ladder into a full Master's degree with a partner university.`,
    highlights: [
      "Master's-equivalent Ofqual-regulated diploma",
      `Specialist focus on ${s.subject}`,
      "Pathway into full Master's / MBA top-up",
      "Flexible online delivery",
    ],
    modules: [
      { title: "Strategic Foundations", items: ["Strategic Management", "Leadership & Change", "Research Methods", "Ethics & Governance"] },
      { title: `${s.subject} Specialist Modules`, items: [`${s.subject} Strategy`, `Advanced ${s.subject} Practice`, `Analytics in ${s.subject}`, "Contemporary Issues"] },
      { title: "Research & Application", items: ["Dissertation / Research Project"] },
    ],
    entryRequirements: qualifiLevelMeta[7].entry,
    careerOutcomes: s.careers,
  })),
  {
    slug: "qualifi-level-7-business-psychology",
    title: "Qualifi Level 7 Diploma in Business Psychology",
    tagline: "A postgraduate-level programme blending psychological principles with business strategy.",
    level: "Diploma",
    levelGroup: "Diploma",
    ...QUALIFI,
    duration: qualifiLevelMeta[7].duration,
    tuition: "Contact admissions",
    categories: ["Psychology", "Business", "Human Resource"],
    intakes: defaultIntakes,
    img: edu,
    overview:
      "A postgraduate-level programme blending psychological principles with business strategy, exploring how human behaviour influences organisational performance, leadership, change, and consumer engagement. The diploma is designed for HR leaders, consultants, and senior managers who want to apply psychological insight to strategic business decisions.",
    highlights: [
      "Globally recognised Qualifi (UK) qualification regulated by Ofqual",
      "Interdisciplinary curriculum combining psychology and business strategy",
      "Assignment-based assessment with no traditional exams",
      "Flexible 100% online delivery with tutor support",
    ],
    modules: [
      {
        title: "Business Psychology Core",
        items: [
          "Foundations of Business Psychology",
          "Organisational Behaviour and Workplace Dynamics",
          "Leadership Psychology and Decision-Making",
          "Consumer Behaviour and Marketing Psychology",
          "Change Management and Organisational Development",
          "Research Methods in Business Psychology",
        ],
      },
    ],
    entryRequirements: qualifiLevelMeta[7].entry,
    careerOutcomes: [
      "Organisational Development Consultant",
      "HR Strategy Lead",
      "Talent and Behavioural Insights Manager",
      "Change Management Consultant",
      "Leadership Coach",
      "Consumer Insights Manager",
    ],
  },
  {
    slug: "qualifi-level-8-business-administration",
    title: "Qualifi Level 8 Diploma in Strategic Management and Leadership (Business Administration)",
    tagline: "An Ofqual-regulated Doctorate-equivalent diploma with a research and dissertation focus.",
    level: "Doctorate",
    levelGroup: "Doctorate",
    ...QUALIFI,
    duration: qualifiLevelMeta[8].duration,
    tuition: "Contact admissions",
    categories: ["Business", "Entrepreneurship"],
    intakes: ["September 2026", "September 2025"],
    img: phd,
    overview:
      "A Level 8 Ofqual-regulated diploma equivalent in scope to a Doctorate, centred on an independent research dissertation in an area of applied business administration.",
    highlights: [
      "Ofqual-regulated Doctorate-equivalent diploma",
      "Research and dissertation-led structure",
      "Supervision from experienced academics and practitioners",
      "Pathway into PhD / DBA conversions with partner universities",
    ],
    modules: [
      { title: "Research Preparation", items: ["Advanced Research Methods", "Literature Review", "Research Proposal Development"] },
      { title: "Dissertation", items: ["Data Collection & Analysis", "Thesis Writing", "Viva Voce Defence"] },
    ],
    entryRequirements: qualifiLevelMeta[8].entry,
    careerOutcomes: [
      "Senior Executive / C-suite",
      "Research-focused Consultant",
      "Academic / Adjunct Faculty",
      "Pathway to PhD / DBA",
    ],
  },

  // The 48 additional courses imported from the live uecampus.com catalogue.
  ...liveCourses,
];

// ---------------------------------------------------------------
// Duplicate programmes.
//
// The catalogue was assembled from three sources (hand-authored partner
// courses, the live uecampus.com import and the generated Qualifi stubs), so a
// number of programmes ended up listed two or three times under the SAME
// awarding partner with only the wording of the title differing — e.g. three
// Walsh MBAs ("Master of Business Administration (MBA)", "Master of Business
// Administration Degree (MBA)", "Master's in Business Administration (MBA)").
//
// What is NOT a duplicate and must stay:
//   • The same subject offered by DIFFERENT partners (a Walsh MBA and an eie
//     MBA are two separate degrees from two separate institutions).
//   • The two Walsh TRACKS. Every Walsh programme is mirrored below into both
//     "Walsh College Direct" (academic US route) and "Walsh College" (the
//     UeCampus dual-award fast track) — different entry route, duration and
//     award, so both listings are intentional.
//   • Genuinely distinct concentrations (Stem MBA vs the General MBA, the BSc
//     tracks in IT / Cyber / Data Analytics / AI).
//
// Each redundant copy is marked `hidden` rather than deleted: it disappears
// from every listing, the sitemap and the prerender, but its /programmes/<slug>
// URL still resolves and now carries a canonical tag pointing at the version we
// kept, so existing inbound links and search results are not broken.
// Map: duplicate slug → the slug it duplicates (the one kept in the listings).
// ---------------------------------------------------------------
const DUPLICATE_OF: Record<string, string> = {
  // ---- Walsh, Master's ----
  // One General MBA. Kept: the curated, homepage-featured "MBA, General
  // Management". Stem MBA is a separate STEM-designated award and stays.
  "master-of-business-administration-mba": "mba-general-management-walsh",
  "master-of-business-administration-degree-mba": "mba-general-management-walsh",
  "masters-in-business-administration-mba": "mba-general-management-walsh",
  // One MSc Finance.
  "msc-in-finance": "master-of-science-in-finance",
  // One MSc AI/ML at Master's level.
  "msc-in-ai-and-machine-learning": "msc-artificial-intelligence-walsh",

  // ---- Walsh, Doctorate ----
  // "DBA in Accounting and Finance" repeats the Accounting DBA. The generic
  // "Doctor of Business Administration (DBA)" is a separate offering and stays.
  "doctorate-in-business-dba": "dba-walsh",

  // ---- Walsh, Bachelor's ----
  // One General Business BBA.
  "bachelor-of-business-administration-bba": "bba-walsh",
  "bba-in-general-business": "bba-walsh",
  // One Accounting BBA.
  "bachelors-in-accounting": "bba-in-accounting",
  // One Entrepreneurship BBA.
  "bachelors-in-entrepreneurship": "bba-in-entrepreneurship",
  // One Data Analytics bachelor's.
  "bachelors-in-data-analytics": "bsc-in-data-analytics",

  // ---- eie European Business School ----
  // The live import repeats the hand-authored BA (Hons) Business Management
  // (and misspells "Management" in its title).
  "bachelor-of-arts-in-business-managment---eie-european-business-school":
    "bba-business-management-eie",

  // ---- Qualifi Level 7 ----
  // The generated "Qualifi Level 7 Diploma in …" stubs repeat the live-imported
  // "Level 7 Diploma in …" entries, which carry the real programme content.
  "qualifi-level-7-data-science": "level-7-diploma-in-data-science",
  "qualifi-level-7-hospitality-tourism-management":
    "level-7-diploma-in-hospitality-and-tourism-management",
  "qualifi-level-7-psychology": "level-7-diploma-in-psychology",
  "qualifi-level-7-strategic-management":
    "level-7-diploma-in-strategic-management-and-leadership",
  "qualifi-level-7-strategic-marketing": "level-7-diploma-in-strategic-marketing",
  "qualifi-level-7-human-resource-management":
    "level-7-diploma-in-human-resource-management",
  "qualifi-level-7-education-management":
    "level-7-diploma-in-education-management-and-leadership",
  "qualifi-level-7-information-technology": "level-7-diploma-in-information-technology",
};

// Applied BEFORE the Walsh mirroring below so each generated mirror inherits
// both flags and neither track of a duplicate reappears in the listings.
for (const c of allCourses) {
  const canonical = DUPLICATE_OF[c.slug];
  if (!canonical) continue;
  c.hidden = true;
  c.canonicalSlug = canonical;
}

// ---------------------------------------------------------------
// Walsh is offered under BOTH tracks.
//   • "Walsh College Direct"  → "Walsh Direct"      (academic walshcollege.edu route)
//   • "Walsh College"         → "Walsh (Fast track)" (UeCampus dual-award pathway)
// Every Walsh programme must appear under both filters, so we mirror each
// Walsh course into whichever track it is missing from. The Fast-track mirror
// keeps the established "-uecampus" slug (so its course-units.json units still
// resolve); the Direct mirror uses a "-direct" slug.
// ---------------------------------------------------------------
const WALSH_DIRECT_LABEL = "Walsh College Direct";
const WALSH_FAST_LABEL = "Walsh College";
const WALSH_FAST_ACCREDITED = {
  accreditedBy: "Walsh College & Qualifi",
  accreditedByDesc:
    "A UeCampus dual-award pathway: an Ofqual-regulated Qualifi diploma delivered alongside top-up courses from Walsh College, a Forbes-ranked US institution accredited by the HLC and ACBSP.",
};
const WALSH_DIRECT_ACCREDITED = {
  accreditedBy: "Walsh College",
  accreditedByDesc:
    "A Forbes-ranked US institution accredited by the Higher Learning Commission (HLC) and ACBSP, recognised for business and technology education.",
};

// Snapshot the Walsh courses before appending, then mirror each one.
const walshBase = allCourses.filter(
  (c) => c.universityShort === WALSH_DIRECT_LABEL || c.universityShort === WALSH_FAST_LABEL,
);
const walshSlugs = new Set(allCourses.map((c) => c.slug));
const walshTrackBySlug = new Map(walshBase.map((c) => [c.slug, c.universityShort]));
/**
 * The slug a duplicate's mirror should canonicalise to: the kept programme as it
 * appears in the SAME track, so a Direct duplicate points at the Direct original
 * and a Fast-track duplicate at the Fast-track original.
 */
const canonicalInTrack = (canonicalSlug: string, mirrorIsDirect: boolean) => {
  const track = walshTrackBySlug.get(canonicalSlug);
  if (!track) return canonicalSlug; // non-Walsh partner: no mirrors exist
  if (track === (mirrorIsDirect ? WALSH_DIRECT_LABEL : WALSH_FAST_LABEL)) return canonicalSlug;
  return track === WALSH_DIRECT_LABEL ? `${canonicalSlug}-uecampus` : `${canonicalSlug}-direct`;
};
for (const base of walshBase) {
  const isDirect = base.universityShort === WALSH_DIRECT_LABEL;
  const mirrorSlug = isDirect ? `${base.slug}-uecampus` : `${base.slug}-direct`;
  if (walshSlugs.has(mirrorSlug)) continue;
  allCourses.push({
    ...base,
    slug: mirrorSlug,
    universityShort: isDirect ? WALSH_FAST_LABEL : WALSH_DIRECT_LABEL,
    ...(isDirect ? WALSH_FAST_ACCREDITED : WALSH_DIRECT_ACCREDITED),
    ...(base.canonicalSlug
      ? { canonicalSlug: canonicalInTrack(base.canonicalSlug, !isDirect) }
      : {}),
  });
  walshSlugs.add(mirrorSlug);
}

// ---------------------------------------------------------------
// Authentic walshcollege.ae content. Overwrite the overview, extended
// overview, curriculum units and career outcomes of every Walsh course
// (both tracks, base and mirror) with the real programme data transcribed
// from https://walshcollege.ae. Runs AFTER mirroring so both the "-direct"
// and "-uecampus" slugs inherit the same authentic content. Mirror suffixes
// are stripped so the base slug resolves to its content key.
// ---------------------------------------------------------------
for (const c of allCourses) {
  const baseSlug = c.slug.replace(/-(direct|uecampus)$/, "");
  const key = walshSlugToContentKey[baseSlug];
  if (!key) continue;
  const data = walshDirectContent[key];
  if (!data) continue;
  c.overview = data.overview;
  if (data.overviewLong) c.overviewLong = data.overviewLong;
  c.modules = data.modules.map((m) => ({ title: m.title, items: [...m.items] }));
  c.careerOutcomes = [...data.careerOutcomes];
}

// coursesBySlug keeps EVERY course (including hidden ones) so direct
// /programmes/<slug> links still resolve even when a course is hidden from listings.
// ---------------------------------------------------------------
// Duration policy. Keyed off the Walsh TRACK (universityShort) and level, so
// it applies uniformly to hardcoded, generated-mirror and live-imported
// courses regardless of their slug or where the duration was first set.
//   • Walsh (Fast track) — UeCampus dual-award pathway:
//       Bachelor's → 2 years,  Master's → 1 year,
//       Doctorate  → 3 years,  Diploma  → 1.5 years.
//   • Walsh Direct — academic US degree route:
//       Bachelor's → 3 years,  Master's → 1 to 1.5 years,  Doctorate → 3 years.
//   • Standalone Qualifi diplomas (awarded by Qualifi): Level 2 & 3
//     take 6 months; every higher Qualifi diploma takes 8 months.
// ---------------------------------------------------------------
for (const c of allCourses) {
  const isWalshFast = c.universityShort === WALSH_FAST_LABEL;
  const isWalshDirect = c.universityShort === WALSH_DIRECT_LABEL;
  if (isWalshFast || isWalshDirect) {
    if (c.levelGroup === "Bachelor's") {
      c.duration = isWalshFast ? "2 years" : "3 years";
    } else if (c.levelGroup === "Master's") {
      c.duration = isWalshFast ? "1 year" : "1 to 1.5 years";
    } else if (c.levelGroup === "Doctorate") {
      c.duration = "3 years";
    } else if (c.levelGroup === "Diploma") {
      c.duration = "1.5 years";
    }
  } else if (c.slug.endsWith("-uecampus") && c.levelGroup === "Diploma") {
    // Non-Walsh UeCampus dual-award diploma pathway: fast 1.5-year route.
    c.duration = "1.5 years";
  } else if (c.universityShort === "Qualifi") {
    const level = Number(/level[ -]?(\d)/i.exec(`${c.slug} ${c.title}`)?.[1]);
    c.duration = level === 2 || level === 3 ? "6 months" : "8 months";
  }
}

// Programmes withdrawn from the catalogue. Removed from every listing AND from
// coursesBySlug, so their /programmes/<slug> detail pages 404 as well.
const REMOVED_SLUGS = new Set([
  // PPA's offering is 3 BBAs (Marketing, International Business, HR Management)
  // and 4 MBAs (HR Management, Accounting & Finance, International Business,
  // Supply Chain Management). No doctorate. Everything else attributed to PPA
  // was never part of the school's catalogue and has been deleted outright.
  "qualifi-level-7-health-social-care",
  "level-7-diploma-in-health-and-social-care",
  // Qualifi diplomas withdrawn to match the current offering (13). The
  // remaining "Qualifi Level 7 Diploma in …" duplicates are now folded into
  // their live counterparts via DUPLICATE_OF above.
  "level-7-diploma-in-cyber-security",
  "level-7-diploma-in-executive-management",
  "level-7-diploma-in-logistics-and-supply-chain-crisis-management",
  "level-7-international-diploma-in-process-safety-management",
  "qualifi-level-2-cyber-security",
  "qualifi-level-5-education-training",
  "qualifi-level-5-extended-accounting-finance",
  "qualifi-level-5-extended-cyber-security",
  "qualifi-level-5-extended-information-technology",
  "qualifi-level-5-extended-psychology",
  "qualifi-level-6-business-management",
  "qualifi-level-7-business-psychology",
  "qualifi-level-7-project-management",
]);
for (let i = allCourses.length - 1; i >= 0; i--) {
  if (REMOVED_SLUGS.has(allCourses[i].slug)) allCourses.splice(i, 1);
}

// Assign a unique, subject-matched cover image to every programme (including the
// generated Qualifi diplomas and mirrored Walsh tracks) so no two cards share a
// photo. Falls back to the course's original image if a slug is missing a mapping.
for (const c of allCourses) {
  const img = programImages[c.slug];
  if (img) c.img = img;
}

export const coursesBySlug: Record<string, Course> = Object.fromEntries(
  allCourses.map((c) => [c.slug, c])
);

// The catalogue used by every listing (Programmes, related courses, the Apply
// dropdown, etc.). Hidden courses are excluded here but remain in coursesBySlug.
export const courses: Course[] = allCourses.filter((c) => !c.hidden);

export const featuredSlugs = [
  "dba-walsh",
  "mba-general-management-walsh",
  "msc-artificial-intelligence-walsh",
  "msc-cyber-security-walsh",
  "bba-walsh",
  "bba-marketing-walsh",
  "bba-international-business-walsh",
  "bsc-information-technology-walsh",
];
