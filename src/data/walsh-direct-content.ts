// ---------------------------------------------------------------
// Authentic Walsh College (UAE) programme content.
//
// Overviews, curricula (real course-coded units) and career outcomes
// transcribed from the live programme pages at https://walshcollege.ae.
// Applied to every Walsh Direct / Walsh College course (and its mirrored
// track) in courses.ts via the post-processing loop, keyed off the base
// slug through `walshSlugToContentKey`.
//
// To refresh, re-fetch the corresponding walshcollege.ae/<key> page.
// ---------------------------------------------------------------

export type WalshContent = {
  overview: string;
  overviewLong?: string;
  modules: { title: string; items: string[] }[];
  careerOutcomes: string[];
};

// Keyed by the walshcollege.ae page identifier.
export const walshDirectContent: Record<string, WalshContent> = {
  // ----------------------------- MASTER'S -----------------------------
  "GeneralMBA": {
    overview:
      "The MBA at Walsh College is designed to develop strategic leaders equipped to navigate today's dynamic global business landscape. It blends advanced business knowledge with leadership, problem-solving and decision-making skills across finance, marketing, operations and strategy. Learn from experienced industry professionals through consulting projects, case studies and simulations, and benefit from Walsh's industry affiliations, including the American Marketing Association (AMA).",
    overviewLong:
      "This leadership-focused MBA gives you access to AMA resources, networking and certifications, taught by US-based expert faculty with real-world experience. You engage in practical learning through real-world business projects and simulations, earning a globally recognised US MBA degree with strong employability across the UAE, GCC and global markets.",
    modules: [
      { title: "Foundation Courses", items: [
        "ACC 514: Financial Accounting for Decision Making",
        "COM 510: Leadership Communication",
        "IT 520: Technology Innovation, Risk Management & Cybersecurity Leadership",
        "MGT 502: Foundations for Business Success",
        "QM 520: Business Analytics",
      ] },
      { title: "Core Courses", items: [
        "BL 558: Legal Essentials for Business Success",
        "BTC 505: Organizational Resilience Framework I",
        "COM 511: Executive Communications",
        "MGT 600: Leading a Resilient & Diverse Workforce",
        "IDS 590: Resiliency Capstone",
        "BTC 500 / MGT 601: Operations Management & Process Efficiency or Design Thinking for Adaptive Problem Solving",
      ] },
      { title: "Business Literacy Courses", items: [
        "One Economics course (ECN, student choice)",
        "One Finance course (FIN, student choice)",
        "One Marketing course (MKT, student choice)",
      ] },
    ],
    careerOutcomes: [
      "Business Consultant",
      "Operations Manager",
      "Marketing Director",
      "General Manager",
      "Sales & Business Development Professional",
      "Entrepreneur / Startup Founder",
    ],
  },

  "MS-Management": {
    overview:
      "The MSc in Management is designed for aspiring leaders and professionals who want to enhance their managerial and leadership capabilities across industries. Students gain advanced knowledge in organizational behaviour, leadership, strategic management, operations and change management through practical projects, case studies and industry collaborations.",
    overviewLong:
      "Students benefit from Walsh's global industry networks and professional development resources, enhancing career prospects worldwide, with an emphasis on driving business transformation and solving complex organizational challenges.",
    modules: [
      { title: "Foundation Courses", items: [
        "MGT 502: Foundations for Business Success",
      ] },
      { title: "Core Courses", items: [
        "MGT 600: Leading a Resilient & Diverse Workforce",
        "MGT 601: Design Thinking for Adaptive Problem Solving",
        "MGT 603: Evidence-Based Decision Making",
        "MGT 604: Leading Organizational Change",
        "MGT 606: Communication Strategies for Contemporary Organizations",
        "MGT 611: Managing Firm Resources",
        "MGT 685: Strategic Management of the Enterprise",
      ] },
      { title: "General Management Electives (Choose 3)", items: [
        "MGT 540: Strategic Planning for Business and Entrepreneurs",
        "MGT 546: Organizations as Complex Adaptive Systems",
        "MGT 547: Strategic Management of Human, Structural & Relationship Capital",
        "MGT 548: Strategic Management of Knowledge & Innovation",
        "MGT 555: Global Human Resources Management",
        "MGT 558: Building a Learning Culture",
        "MGT 562: Strategic Global Human Resources Management",
        "MKT 550: Marketing Fundamentals",
      ] },
    ],
    careerOutcomes: [
      "Business Consultant",
      "Operations Manager",
      "Development Manager",
      "General Manager",
      "Project Manager",
      "Entrepreneur / Business Owner",
    ],
  },

  "MS-Marketing": {
    overview:
      "The MSc in Marketing at Walsh College is designed for professionals looking to master advanced marketing strategies in a rapidly evolving digital world. The programme provides in-depth expertise in digital marketing, brand management, consumer behaviour, marketing analytics and global marketing strategy.",
    overviewLong:
      "The curriculum emphasises practical application through marketing simulations, campaigns and real-world consulting projects. Students benefit from Walsh's partnership with the American Marketing Association (AMA), gaining access to professional resources, certifications and global networking opportunities while earning a US-accredited degree.",
    modules: [
      { title: "Foundation Courses", items: [
        "MGT 502: Foundations for Business Success",
      ] },
      { title: "Core Courses", items: [
        "COM 510: Leadership Communication",
        "MGT 601: Design Thinking for Adaptive Problem Solving",
        "MKT 550: Marketing Fundamentals",
        "QM 520: Business Analytics",
      ] },
      { title: "Required Electives (Choose Five)", items: [
        "MGT 600: Leading a Resilient & Diverse Workforce",
        "MGT 603: Evidence-Based Decision Making",
        "MKT 541: Public Relations Strategies",
        "MKT 542: Consumer Insights",
        "MKT 543: Creativity and Innovation",
        "MKT 555: Marketing Applications and Metrics",
        "MKT 560: Brand Management",
        "MKT 588: Marketing Internship",
      ] },
      { title: "Capstone", items: [
        "MKT 589: Consulting Project",
      ] },
    ],
    careerOutcomes: [
      "Marketing Manager",
      "Digital Marketing Director",
      "Market Research Analyst",
      "Brand Strategist",
      "Public Relations & Communications Manager",
      "Entrepreneur / Marketing Consultant",
    ],
  },

  "MS-Finance": {
    overview:
      "The MSc in Finance is designed for professionals aiming to excel in corporate finance, investment and financial management. It provides expertise in financial analysis, corporate finance, risk management and investment strategies through real-world projects and case studies, with a CFA-aligned curriculum and access to global financial networks and certifications.",
    overviewLong:
      "Students benefit from US-based expert faculty with extensive experience in global finance and earn a globally recognised US degree with high demand across the UAE, GCC and international financial markets.",
    modules: [
      { title: "Foundation Courses", items: [
        "COM 510: Leadership Communication",
        "MGT 502: Foundations for Business Success",
        "FIN 500: Principles of Finance",
      ] },
      { title: "Core Courses", items: [
        "ACC 514: Financial Accounting for Decision Making",
        "ECN 600: Foundations of Economic Analysis",
        "FIN 610: Foundations of Financial Analysis",
        "FIN 611: Investment Performance and Data Analytics",
        "FIN 620: Financial Management",
        "FIN 621: Financial Statement Analysis",
      ] },
      { title: "Required Electives (Choose Three)", items: [
        "ECN 601: Managerial Economics",
        "ECN 602: Global Economics",
        "ECN 610: Applied Economics",
        "FIN 612: Advanced Investments",
        "FIN 613: Portfolio Analysis and Analytical Case Studies",
        "FIN 614: Commercial Real Estate",
        "FIN 622: Advanced Financial Management",
        "FIN 623: Business Valuation",
        "FIN 624: Mergers & Acquisitions",
        "FIN 625: Risk Management",
        "FIN 633: International Finance",
      ] },
      { title: "Capstone (Choose One)", items: [
        "FIN 690: Finance Simulation",
        "FIN 691: CFA Research Challenge",
        "FIN 692: ACG Cup Competition",
      ] },
    ],
    careerOutcomes: [
      "Financial Analyst",
      "Investment Banker",
      "Risk Management Specialist",
      "Wealth Manager",
      "Corporate Finance Manager",
      "Entrepreneur / Financial Consultant",
    ],
  },

  "MS-AIandML": {
    overview:
      "The MSc in Artificial Intelligence & Machine Learning at Walsh College is designed for professionals aiming to develop advanced expertise in AI, deep learning and intelligent systems.",
    overviewLong:
      "The programme equips students with skills in machine learning, neural networks, natural language processing (NLP), computer vision and AI-driven automation. Learn to design intelligent systems, deploy machine learning models and solve complex real-world challenges through hands-on labs, projects and industry collaborations.",
    modules: [
      { title: "Foundation Courses", items: [
        "IT 501: IT Systems Analysis",
        "IT 530: SQL and Database Fundamentals",
        "IT 531: Network Fundamentals",
        "IT 532: Operating Systems and Virtualization",
        "IT 533: Programming I",
        "QM 501: Introduction to Business Analytics",
      ] },
      { title: "Core Courses", items: [
        "IT 540: Introduction to Data Science Modeling",
        "IT 542: Big Data Analytics",
        "IT 544: Data Visualization & Predictive Modeling",
        "IT 545: Programming for Data Analysis",
        "IT 547: Data Storage Technologies",
        "IT 556: Machine Learning",
        "IT 557: Computer Vision and Deep Learning",
        "IT 558: Deep Learning Theory",
        "IT 559: Natural Language Processing",
        "QM 525: Math of AI and Deep Learning",
      ] },
    ],
    careerOutcomes: [
      "Machine Learning Engineer",
      "AI Research Scientist",
      "Data Scientist",
      "Computer Vision Engineer",
      "Natural Language Processing (NLP) Engineer",
      "AI Entrepreneur / Consultant",
    ],
  },

  "MS-DataAnalytics": {
    overview:
      "The MSc in Data Analytics at Walsh College is designed for professionals who aim to harness the power of data to drive business decisions and innovation.",
    overviewLong:
      "The programme equips students with advanced skills in data analysis, machine learning, data visualization, statistical modeling and predictive analytics, applied through real-world data projects, simulations and consulting assignments.",
    modules: [
      { title: "Foundation Courses", items: [
        "IT 501: IT Systems Analysis",
        "IT 530: SQL and Database Fundamentals",
        "IT 533: Programming I",
        "QM 501: Introduction to Business Analytics",
      ] },
      { title: "Core Courses", items: [
        "IT 544: Data Visualization & Predictive Modeling",
        "IT 545: Programming for Data Analysis",
        "IT 546: Data Mining & Transformation",
        "IT 547: Data Storage Technologies",
        "QM 504: Principles of Data Analytics",
        "QM 505: Data Driven Decision Making",
        "QM 600: Prescriptive Analysis",
        "QM 601: Research Methods & Ethics",
        "QM 602: Lean Six Sigma",
        "QM 640: Data Analytics Capstone",
      ] },
    ],
    careerOutcomes: [
      "Data Analyst",
      "Data Scientist",
      "Business Intelligence Analyst",
      "Risk Analyst",
      "Data Engineer",
      "Entrepreneur / Data Consultant",
    ],
  },

  "MS-GeneralIT": {
    overview:
      "The MSc in Information Technology at Walsh College is designed for professionals seeking to build advanced expertise across the core areas of IT — systems analysis, cloud computing, cybersecurity, IT project management, networking and emerging technologies.",
    overviewLong:
      "Learn to design, implement and manage enterprise-level IT solutions while solving real-world technology challenges through hands-on labs, projects and industry collaborations. The programme offers concentrations in Cybersecurity and Data Science.",
    modules: [
      { title: "Foundation Courses", items: [
        "IT 501: IT Systems Analysis",
        "IT 530: SQL and Database Fundamentals",
        "IT 531: Network Fundamentals",
        "IT 532: Operating Systems & Virtualization",
        "IT 533: Programming I",
        "QM 501: Introduction to Business Analytics",
      ] },
      { title: "Core Courses", items: [
        "IT 505: Governance, Risk & Compliance",
        "IT 534: Programming II",
        "IT 551: Project Management Fundamentals",
        "IT 565: Cybersecurity for Leadership",
      ] },
      { title: "Cybersecurity Concentration", items: [
        "IT 510: Cybersecurity Strategies & Tactics",
        "IT 511: Threats, Vulnerabilities, Controls & Countermeasures",
        "IT 512: Intelligence Analysis Tools and Techniques",
        "IT 536: Digital Forensics",
        "IT 537: Cryptography",
        "IT 538: Cyber Physical Systems",
      ] },
      { title: "Data Science Concentration", items: [
        "IT 540: Introduction to Data Sciences",
        "IT 542: Big Data Analytics",
        "IT 544: Data Visualization & Predictive Modeling",
        "IT 545: Programming for Data Analysis",
        "IT 556: Machine Learning",
        "QM 505: Data Driven Decision Making",
      ] },
    ],
    careerOutcomes: [
      "Network Administrator",
      "Cybersecurity Specialist",
      "Cloud Solutions Architect",
      "IT Project Manager",
      "Systems Analyst",
      "IT Consultant / Entrepreneur",
    ],
  },

  // ----------------------------- DOCTORATE -----------------------------
  "DBA-Accounting": {
    overview:
      "The DBA in Accounting at Walsh College is designed for senior accounting professionals, financial leaders and academics aiming to deepen their expertise in advanced accounting, auditing and financial strategy.",
    overviewLong:
      "The programme develops capabilities in financial research, corporate governance, forensic accounting, taxation strategy and executive decision-making through applied projects, case studies and dissertation work. Students benefit from Walsh's academic and industry connections, expert faculty mentorship and global career support.",
    modules: [
      { title: "Residency Courses", items: [
        "RSD 801: Doctoral Residency I",
        "RSD 802: Doctoral Residency II",
        "RSD 803: Doctoral Residency III",
      ] },
      { title: "Core Courses", items: [
        "DCT 700: Doctoral Studies Seminar",
        "RES 711: Research Methods: Introduction and Scope",
        "RES 712: Qualitative and Exploratory Research Methods",
        "RES 713: Quantitative Research Methods I",
        "RES 714: Quantitative Research Methods II",
        "DCT 701: Comprehensive Examination for Doctorate",
        "DIS 796: Dissertation I – Chapter 1",
        "DIS 797: Dissertation II – Chapter 2",
        "DIS 798: Dissertation III – Chapter 3",
        "DIS 799: Dissertation IV – Chapter 4",
        "DIS 800: Dissertation V – Chapter 5",
      ] },
      { title: "Accounting Concentration", items: [
        "ACC 732: Accounting and Financial Reporting in the Global Economy",
        "ACC 733: Financial Accounting Theory & Analysis",
        "ACC 734: Seminar in Empirical Accounting Research",
        "ACC 735: Applied Research in Accounting Topics",
        "BTC 701: Organizational Resilience Framework",
        "ECN 724: The Consequences of Economic Development for Business",
        "FIN 748: Financial and Economic Model Analysis",
        "IT 701: Innovation, Risk and Cybersecurity",
        "MGT 765: High Performance Leadership",
      ] },
    ],
    careerOutcomes: [
      "Chief Financial Officer (CFO)",
      "Senior Accounting Consultant",
      "Professor / Researcher",
      "Strategic Financial Advisor",
      "Audit & Compliance Director",
      "Global Accounting Leader",
    ],
  },

  // ----------------------------- BACHELOR'S (BBA) -----------------------------
  "bba-GeneralBusiness": {
    overview:
      "The BBA in General Business at Walsh College offers a comprehensive foundation across all key areas of business — management, finance, marketing, operations and entrepreneurship.",
    overviewLong:
      "The programme prepares students with the critical-thinking, problem-solving and leadership skills needed to succeed in today's dynamic global business environment, through instruction from industry experts, hands-on projects and diverse career preparation across management, consulting, operations, finance and entrepreneurship.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 300: Accounting",
        "ACC 310: Managerial Accounting",
        "BL 420: The Legal Environment of Business",
        "COM 210: Business Communications I",
        "COM 300: Communication Essentials",
        "IT 305: Business Computing Tools",
        "MGT 201: Management I",
        "MGT 303: Behavioral Management",
        "MKT 202: Marketing I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
        "FIN 401: Personal Wealth Management",
        "MGT 403: Introduction to Financial Management",
        "MGT 315: Sustainability & Innovation",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "FIN 315: Financial Management",
        "IDS 400: Critical Thinking for Ethical Leaders",
        "IT 335: Cybersecurity & Risk Management for Business",
        "ECN 405: Managerial Economics",
        "MGT 410: Production and Operations Management",
        "MGT 415: Business Strategy of Organizational Resilience",
        "MGT 461: Business Strategy and Policy (Capstone)",
        "MKT 300: Contemporary Marketing Trends",
        "QM 301: Business Analytics & Problem Solving",
      ] },
      { title: "General Business Major Courses", items: [
        "FIN 321: Business and Risk",
        "MGT 454: Project Management",
        "MGT 402: Business Ethics & Legal Issues",
        "MGT 453: Organizational Leadership",
        "MGT 465: Supply Chain Management",
        "Major Electives (eight 300–400 level courses)",
      ] },
    ],
    careerOutcomes: [
      "Operations Manager",
      "Business Analyst",
      "Project Coordinator",
      "Financial Analyst",
      "Management Consultant",
      "Entrepreneur / Business Owner",
    ],
  },

  "bba-marketing": {
    overview:
      "The BBA in Marketing combines solid business fundamentals with dynamic marketing expertise. From brand strategy to social media, digital campaigns to consumer psychology, the programme equips you with the practical skills and creative mindset to thrive in today's global marketplace.",
    overviewLong:
      "The programme offers an industry-focused curriculum, access to American Marketing Association resources and certifications, instruction from expert US-based faculty, hands-on projects and a globally recognised US degree.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 300: Accounting",
        "ACC 310: Managerial Accounting",
        "BL 420: The Legal Environment of Business",
        "COM 210: Business Communications I",
        "COM 300: Communication Essentials",
        "ECN 201: Economics I",
        "ECN 202: Economics II",
        "ENG 100: English Composition",
        "IT 305: Business Computing Tools",
        "MGT 201: Management I",
        "MGT 303: Behavioral Management",
        "MKT 202: Marketing I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "FIN 315: Financial Management",
        "IDS 400: Critical Thinking for Ethical Leaders",
        "IT 335: Cybersecurity & Risk Management",
        "MGT 410: Production and Operations Management",
        "MGT 415: Business Strategy of Organizational Resilience",
        "MGT 461: Business Strategy and Policy (Capstone)",
        "MKT 300: Contemporary Marketing Trends",
        "QM 301: Business Analytics & Problem Solving",
      ] },
      { title: "Marketing Major Courses", items: [
        "MKT 309: Advertising and Promotion Management",
        "MKT 415: Consumer and Buyer Behavior",
        "MKT 435: Marketing Research",
        "MKT 460: Strategic Marketing",
        "Major Electives (three Marketing, one Management, two general 300–400 level courses)",
      ] },
    ],
    careerOutcomes: [
      "Brand Manager",
      "Digital Marketing Specialist",
      "Market Research Analyst",
      "Public Relations Specialist",
      "Sales & Business Development",
      "Advertising & Media Planner",
    ],
  },

  "bba-Finance": {
    overview:
      "The BBA in Finance provides an in-depth understanding of financial management, investment strategies, risk management and financial planning. Students develop the analytical and decision-making capabilities needed for the global finance industry through faculty instruction, hands-on projects and practical simulations.",
    overviewLong:
      "The curriculum establishes a robust foundation for pursuing prestigious certifications including CMA, CFA and IMA membership, positioning graduates for roles across corporate finance, banking, investment analysis and consulting.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 201: Principles of Accounting I",
        "ACC 300: Managerial Accounting",
        "COM 210: Business Communications I",
        "COM 300: Communication Essentials",
        "IT 201: Introduction to Networking",
        "IT 202: Introduction to Databases",
        "IT 203: Introduction to Programming",
        "IT 204: Introduction to Security",
        "IT 305: Business Computing Tools",
        "MGT 201: Management I",
        "MGT 303: Behavioral Management",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
        "MKT 202: Marketing I",
      ] },
      { title: "Core Courses", items: [
        "BL 420: The Legal Environment of Business",
        "COM 405: Business Communication Strategies",
        "FIN 315: Financial Management",
        "IDS 400: Critical Thinking for Ethical Leaders",
        "IT 335: Cybersecurity & Risk Management for Business",
        "MGT 404: Human Resource Management",
        "MGT 410: Production and Operations Management",
        "MGT 415: Business Strategy of Organizational Resilience",
        "MGT 461: Business Strategy and Policy (Capstone)",
        "MKT 300: Contemporary Marketing Trends",
        "QM 301: Business Analytics & Problem Solving",
      ] },
      { title: "Finance Major Courses", items: [
        "ECN 405: Managerial Economics",
        "FIN 321: Business and Risk",
        "FIN 401: Personal Wealth Management",
        "FIN 403: Investment Management",
        "FIN 425: Financial Modeling",
        "FIN 430: Business Decisions and Value Generation",
        "FIN 490: Finance Capstone Simulation",
      ] },
    ],
    careerOutcomes: [
      "Financial Analyst",
      "Investment Banking Professional",
      "Corporate Finance Manager",
      "Risk Management Specialist",
      "Wealth Management Advisor",
      "CMA / CFA / IMA Pathways",
    ],
  },

  "bba-entrepreneurship": {
    overview:
      "The BBA in Entrepreneurship at Walsh College empowers future entrepreneurs and innovative leaders with the knowledge and skills to launch, manage and grow successful businesses.",
    overviewLong:
      "The curriculum emphasises creative thinking, opportunity recognition, business strategy, financial planning and operational management. Students work with experienced entrepreneurs and industry experts through hands-on startup projects and develop practical business plans, preparing to establish independent ventures or drive innovation within existing organizations.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 300: Principles of Accounting I",
        "ACC 310: Managerial Accounting",
        "BL 420: The Legal Environment of Business",
        "COM 210: Business Communications I",
        "COM 300: Communication Essentials",
        "IT 305: Business Computing Tools",
        "FIN 321: Business & Risk",
        "MGT 201: Management I",
        "MGT 303: Behavioral Management",
        "MKT 202: Marketing I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
        "FIN 401: Personal Wealth Management",
        "MGT 402: Business Ethics & Legal Issues",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "FIN 315: Financial Management",
        "IDS 400: Critical Thinking for Ethical Leaders",
        "IT 335: Cybersecurity & Risk Management for Business",
        "MGT 457: Global Management",
        "MGT 410: Production and Operations Management",
        "MGT 415: Business Strategy of Organizational Resilience",
        "MGT 461: Business Strategy and Policy (Capstone)",
        "MKT 300: Contemporary Marketing Trends",
        "QM 301: Business Analytics & Problem Solving",
        "MGT 465: Supply Chain Management",
      ] },
      { title: "Entrepreneurship Major Courses", items: [
        "FIN 407: Entrepreneurial Finance",
        "MGT 315: Sustainability and Innovation",
        "MGT 406: Small Business Legal and Tax Issues",
        "MGT 454: Project Management",
        "MGT 463: Managing Technology as a Strategic Resource",
        "ECN 405: Managerial Economics",
        "MGT 468: Entrepreneurship: from Vision to Pitch",
        "MKT 415: Consumer and Buyer Behavior",
        "MGT 403: Introduction to Financial Management",
        "MGT 404: Human Resource Management",
        "Major Electives (three 300–400 level courses)",
      ] },
    ],
    careerOutcomes: [
      "Startup Founder",
      "Business Consultant",
      "Venture Capital & Investment Professional",
      "Innovation Manager",
      "Franchise Owner",
      "Social Entrepreneur",
    ],
  },

  "bba-Accounting": {
    overview:
      "The BBA in Accounting at Walsh College prepares students with the essential knowledge, skills and ethical foundation for successful careers in accounting, auditing and financial management. The curriculum emphasises financial accounting, managerial accounting, auditing, taxation and financial analysis, combined with modern tools and practical applications.",
    overviewLong:
      "Students gain experience analysing financial data, ensuring compliance and supporting strategic business decisions globally. The programme offers pathways to globally recognised certifications including CMA (Certified Management Accountant), CFA (Chartered Financial Analyst) and IMA membership.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 300: Accounting",
        "ACC 310: Managerial Accounting",
        "BL 420: The Legal Environment of Business",
        "COM 210: Business Communications I",
        "ECN 405: Managerial Economics",
        "COM 300: Communication Essentials",
        "IT 305: Business Computing Tools",
        "MGT 201: Management I",
        "MGT 303: Behavioral Management",
        "MKT 202: Marketing I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
        "MGT 465: Supply Chain Management",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "FIN 315: Financial Management",
        "IDS 400: Critical Thinking for Ethical Leaders",
        "IT 335: Cybersecurity & Risk Management for Business",
        "MGT 410: Production and Operations Management",
        "MGT 415: Business Strategy of Organizational Resilience",
        "MGT 461: Business Strategy and Policy (Capstone)",
        "MKT 300: Contemporary Marketing Trends",
        "QM 301: Business Analytics & Problem Solving",
        "FIN 401: Personal Wealth Management",
      ] },
      { title: "Accounting Major Courses", items: [
        "ACC 301: Financial Accounting I",
        "ACC 302: Financial Accounting II",
        "ACC 303: Financial Accounting III",
        "ACC 315: Ethics in Accounting",
        "ACC 406: Accounting Information Systems",
        "FIN 321: Business and Risk",
        "MGT 315: Sustainability & Innovation",
        "MGT 402: Business Ethics & Legal Issues",
        "ACC 484: Applied Managerial Simulation",
        "TAX 495: Tax and Business Taxation I",
        "MGT 403: Introduction to Financial Management",
        "MGT 457: Global Management",
        "Major Electives (three 300–400 level courses)",
      ] },
    ],
    careerOutcomes: [
      "Financial Accountant",
      "Auditor",
      "Financial Analyst",
      "Tax Consultant",
      "Management Accountant",
      "CMA / CFA / IMA Pathways",
    ],
  },

  "bba-HumanResouce": {
    overview:
      "The BBA in Human Resource Management at Walsh College prepares students to lead and manage people effectively in today's global business environment. The curriculum emphasises talent acquisition, employee engagement, performance management, HR strategy and organizational development, aligned with SHRM (Society for Human Resource Management) standards.",
    overviewLong:
      "Graduates are equipped with the skills to drive organizational success, foster inclusive workplaces and lead transformational HR initiatives in companies worldwide.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 300: Accounting",
        "ACC 310: Managerial Accounting",
        "BL 420: The Legal Environment of Business",
        "COM 210: Business Communications I",
        "COM 300: Communication Essentials",
        "ECN 405: Managerial Economics",
        "IT 305: Business Computing Tools",
        "MGT 201: Management I",
        "MGT 303: Behavioral Management",
        "MGT 419: Continuous Improvement",
        "MGT 420: Process Maturity",
        "MGT 465: Supply Chain Management",
        "MKT 202: Marketing I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "FIN 315: Financial Management",
        "FIN 321: Business and Risk",
        "FIN 401: Personal Wealth Management",
        "IDS 400: Critical Thinking for Ethical Leaders",
        "IT 335: Cybersecurity & Risk Management for Business",
        "MGT 403: Introduction to Financial Management",
        "MGT 410: Production and Operations Management",
        "MGT 415: Business Strategy of Organizational Resilience",
        "MGT 461: Business Strategy and Policy (Capstone)",
        "MKT 300: Contemporary Marketing Trends",
        "QM 301: Business Analytics & Problem Solving",
      ] },
      { title: "Human Resource Management Major Courses", items: [
        "MGT 315: Sustainability and Innovation",
        "MGT 404: Human Resource Management",
        "MGT 405: Management and Labor Relations",
        "MGT 406: Small Business Legal and Tax Issues",
        "MGT 453: Organizational Leadership",
        "MGT 454: Project Management",
        "MGT 457: Global Management",
        "MGT 462: Diversity and Inclusion",
        "MGT 463: Managing Technology as a Strategic Resource",
        "Major Elective (any 300–400 level course)",
      ] },
    ],
    careerOutcomes: [
      "HR Manager",
      "Talent Acquisition Specialist",
      "Learning & Development Specialist",
      "Employee Relations Specialist",
      "Compensation & Benefits Analyst",
      "SHRM-CP / SHRM-SCP Pathways",
    ],
  },

  "bba-InternationalBusiness": {
    overview:
      "The BBA in International Business at Walsh College prepares students to navigate the complexities of global markets and international trade, covering global marketing, international finance, cross-cultural management, supply chain logistics and international law. Students develop the skills to manage operations across borders and lead international expansion strategies.",
    overviewLong:
      "The programme offers a comprehensive curriculum covering global trade, marketing and finance, with practical exposure through case studies, global market simulations and real-world projects.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 300: Accounting",
        "ACC 310: Managerial Accounting",
        "BL 420: The Legal Environment of Business",
        "COM 210: Business Communications I",
        "ECN 405: Managerial Economics",
        "COM 300: Communication Essentials",
        "IT 305: Business Computing Tools",
        "MGT 201: Management I",
        "MGT 303: Behavioral Management",
        "MKT 202: Marketing I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
        "QM 301: Business Analytics & Problem Solving",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "FIN 315: Financial Management",
        "IDS 400: Critical Thinking for Ethical Leaders",
        "IT 335: Cybersecurity & Risk Management for Business",
        "MGT 410: Production and Operations Management",
        "MGT 415: Business Strategy of Organizational Resilience",
        "MGT 461: Business Strategy and Policy (Capstone)",
        "MKT 300: Contemporary Marketing Trends",
        "FIN 401: Personal Wealth Management",
      ] },
      { title: "International Business Major Courses", items: [
        "ACC 301: Financial Accounting I",
        "FIN 310: Financial Markets",
        "FIN 321: Business and Risk",
        "FIN 403: Investment Management",
        "FIN 406: Financial Statement Analysis",
        "MGT 315: Sustainability & Innovation",
        "MGT 402: Business Ethics & Legal Issues",
        "MGT 404: Human Resource Management",
        "FIN 412: International Economics and Finance",
        "FIN 460: Fundamentals of Financial Fraud",
        "MGT 407: International Management & Labor Relations",
        "MGT 408: Global Project Management Strategies",
        "MGT 457: Global Management",
        "MGT 465: Supply Chain Management",
      ] },
    ],
    careerOutcomes: [
      "International Business Manager",
      "Global Supply Chain Manager",
      "International Marketing Specialist",
      "Cross-Cultural Consultant",
      "International Trade Specialist",
      "Global Business Consultant",
    ],
  },

  // ----------------------------- BACHELOR'S (BSIT) -----------------------------
  "BSIT-AIandML": {
    overview:
      "The BSc in Artificial Intelligence & Machine Learning at Walsh College prepares students to design intelligent systems and build AI-powered solutions. The curriculum covers machine learning, NLP, computer vision and robotics, with hands-on experience on real-world projects and AI tools.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 201: Principles of Accounting I",
        "COM 210: Business Communications I",
        "COM 300: Communication Essentials",
        "ECN 201: Economics I",
        "ENG 100: English Composition",
        "IT 201: Introduction to Networking",
        "IT 202: Introduction to Databases",
        "IT 203: Introduction to Programming",
        "IT 204: Introduction to Security",
        "MGT 201: Management I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "IT 402: Systems Analysis and Design",
        "IT 405: Networks & Operating Systems",
        "IT 408: Database Design & Development (SQL)",
        "IT 417: Fundamentals of Cybersecurity",
      ] },
      { title: "AI & Machine Learning Major Courses", items: [
        "IT 445: Programming for Data Analysis",
        "IT 456: Machine Learning",
        "IT 544: Data Visualization & Predictive Modeling",
        "IT 557: Computer Vision & Deep Learning",
        "IT 558: Deep Learning Theory & Practical Applications",
        "IT 559: Natural Language Processing",
        "IT 490 / IT 499: Internship or Collaborative Business Systems",
        "QM 301: Business Analytics & Problem Solving",
      ] },
    ],
    careerOutcomes: [
      "AI Developer",
      "Machine Learning Engineer",
      "Data Analyst",
      "Computer Vision Engineer",
      "NLP Engineer",
      "AI Consultant",
    ],
  },

  "BSIT-general-IT": {
    overview:
      "The BSc in Information Technology at Walsh College provides a strong foundation in IT systems, cybersecurity, data management and cloud computing.",
    overviewLong:
      "The curriculum emphasises technical skill development combined with problem-solving capabilities for the contemporary digital environment. Graduates are prepared for roles spanning IT support, systems administration, cybersecurity, data analysis and emerging technology sectors across the UAE and internationally.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 201: Principles of Accounting I",
        "ACC 300: Managerial Accounting",
        "COM 210: Business Communications I",
        "COM 300: Communication Essentials",
        "IT 201: Introduction to Networking",
        "IT 202: Introduction to Databases",
        "ECN 405: Managerial Economics",
        "IT 203: Introduction to Programming",
        "IT 204: Introduction to Security",
        "MGT 201: Management I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "IT 402: Systems Analysis and Design",
        "IT 405: Networks & Operating Systems",
        "IT 408: Database Design & Development (SQL)",
        "IT 417: Fundamentals of Cybersecurity",
      ] },
      { title: "General IT Major Courses", items: [
        "Nine elective courses from 300–400 level Information Technology offerings",
      ] },
    ],
    careerOutcomes: [
      "Network Administrator",
      "Cybersecurity Specialist",
      "Database Administrator",
      "Cloud Solutions Specialist",
      "IT Support Specialist",
      "IT Project Manager",
    ],
  },

  "BSIT-cyber": {
    overview:
      "The BSc in Cybersecurity at Walsh College prepares students to protect organizations from cyber threats, data breaches and security vulnerabilities. The curriculum emphasises network security, ethical hacking, risk management, digital forensics and cloud security, enabling graduates to design secure systems, detect cyberattacks and implement defence strategies.",
    overviewLong:
      "Students gain competency through specialised instruction combining theory with practical application — hands-on cybersecurity labs, simulations and security tools — taught by US-based faculty with cybersecurity industry experience, culminating in a globally recognised degree.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 201: Principles of Accounting I",
        "ACC 300: Managerial Accounting",
        "COM 210: Business Communications I",
        "COM 300: Communication Essentials",
        "IT 201: Introduction to Networking",
        "IT 202: Introduction to Databases",
        "ECN 405: Managerial Economics",
        "MGT 457: Global Management",
        "IT 203: Introduction to Programming",
        "IT 204: Introduction to Security",
        "MGT 201: Management I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
        "IDS 400: Critical Thinking for Ethical Leaders",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "IT 402: Systems Analysis and Design",
        "IT 405: Networks & Operating Systems",
        "IT 414: Scripting & Automation",
        "IT 408: Database Design & Development (SQL)",
        "IT 403: Project Management & ITIL Framework",
        "IT 417: Fundamentals of Cybersecurity",
        "IT 430: Agile Project Management and Scrum",
        "IT 463: Cryptography",
      ] },
      { title: "Cyber Security Major Courses", items: [
        "IT 407: Server Virtualization & Performance Engineering",
        "IT 410: Principles of Software Engineering",
        "IT 412: Advanced Programming",
        "IT 419: Ethical Hacking Strategies & Tools",
        "IT 422: Advanced Team-Based Attack/Defend Techniques",
        "FIN 321: Business & Risk",
        "IT 440: Cloud Infrastructure",
        "IT 460: Digital and Network Forensics",
        "IT 461: Security Operations and Awareness",
        "IT 462: Securing Cyber Physical Systems",
        "Major Electives (four courses)",
      ] },
    ],
    careerOutcomes: [
      "Cybersecurity Analyst",
      "Ethical Hacker / Penetration Tester",
      "Digital Forensics Expert",
      "Network Security Engineer",
      "Cloud Security Specialist",
      "Risk & Compliance Analyst",
    ],
  },

  "BSIT-DataAnalytics": {
    overview:
      "The BSc in Data Analytics at Walsh College equips students with the skills to collect, analyse and interpret complex data to drive business decisions.",
    overviewLong:
      "Students gain expertise in data visualization, machine learning, predictive analytics, statistical analysis and database management through hands-on experience with industry tools. Graduates are equipped for roles in data analysis, business intelligence, data engineering and consulting across the UAE and global markets.",
    modules: [
      { title: "General Education & Business Courses", items: [
        "ACC 201: Principles of Accounting I",
        "ACC 300: Principles of Accounting",
        "COM 210: Business Communications I",
        "BL 420: The Legal Environment of Business",
        "COM 300: Communication Essentials",
        "IT 201: Introduction to Networking",
        "IT 202: Introduction to Databases",
        "MGT 457: Global Management",
        "IT 203: Introduction to Programming",
        "IT 204: Introduction to Security",
        "MGT 201: Management I",
        "MTH 300: Business Algebra",
        "QM 202: Statistical Methods for Business",
        "IT 440: Cloud Infrastructure",
        "MGT 303: Behavioral Management",
      ] },
      { title: "Core Courses", items: [
        "COM 405: Business Communication Strategies",
        "IT 402: Systems Analysis and Design",
        "IT 405: Networks & Operating Systems",
        "IT 408: Database Design & Development (SQL)",
        "IT 417: Fundamentals of Cybersecurity",
        "IDS 400: Critical Thinking for Ethical Leaders",
        "IT 407: Server Virtualization & Performance Engineering",
        "IT 412: Advanced Programming",
        "IT 419: Ethical Hacking Strategies & Tools",
        "FIN 321: Business and Risk",
      ] },
      { title: "Data Analytics Major Courses", items: [
        "IT 403: Project Management & ITIL Framework",
        "IT 410: Principles of Software Engineering",
        "IT 445: Programming for Data Analysis",
        "IT 456: Machine Learning",
        "IT 544: Data Visualization and Predictive Modeling",
        "IT 499: Collaborative Business Systems (Capstone)",
        "IT 547: Data Storage Technologies",
        "QM 301: Business Analytics & Problem Solving",
        "QM 504: Principles of Data Analytics",
        "QM 505: Data Driven Decision Making",
        "Major Electives (four courses)",
      ] },
    ],
    careerOutcomes: [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Data Engineer",
      "Machine Learning Specialist",
      "Data Privacy & Compliance Analyst",
      "Analytics Consultant",
    ],
  },
};

// Maps each Walsh course's BASE slug (mirror suffixes -direct / -uecampus are
// stripped before lookup) to the walshcollege.ae content key above. Courses
// without an entry here (e.g. msc-cyber-security-walsh — Walsh UAE has no
// standalone MS Cyber Security page) keep their existing curated content.
export const walshSlugToContentKey: Record<string, string> = {
  // Hardcoded "-walsh" Walsh College Direct courses (src/data/courses.ts)
  "dba-walsh": "DBA-Accounting",
  "mba-general-management-walsh": "GeneralMBA",
  "msc-artificial-intelligence-walsh": "MS-AIandML",
  "ms-management-walsh": "MS-Management",
  "ms-marketing-walsh": "MS-Marketing",
  "ms-information-technology-walsh": "MS-GeneralIT",
  "bba-walsh": "bba-GeneralBusiness",
  "bba-marketing-walsh": "bba-marketing",
  "bba-finance-walsh": "bba-Finance",
  "bba-international-business-walsh": "bba-InternationalBusiness",
  "bba-human-resource-management-walsh": "bba-HumanResouce",
  "bsc-information-technology-walsh": "BSIT-general-IT",
  "bsc-cyber-security-walsh": "BSIT-cyber",

  // Live-imported "Walsh College" courses (src/data/courses-live.ts)
  "master-of-business-administration-mba": "GeneralMBA",
  "master-of-business-administration-degree-mba": "GeneralMBA",
  "masters-in-business-administration-mba": "GeneralMBA",
  "stem-mba": "GeneralMBA",
  "master-of-science-in-finance": "MS-Finance",
  "msc-in-finance": "MS-Finance",
  "master-of-science-in-data-analytics": "MS-DataAnalytics",
  "msc-in-ai-and-machine-learning": "MS-AIandML",
  "bachelor-of-business-administration-bba": "bba-GeneralBusiness",
  "bba-in-general-business": "bba-GeneralBusiness",
  "bachelors-in-accounting": "bba-Accounting",
  "bba-in-accounting": "bba-Accounting",
  "bba-for-acca": "bba-Accounting",
  "bachelors-in-entrepreneurship": "bba-entrepreneurship",
  "bba-in-entrepreneurship": "bba-entrepreneurship",
  "bachelors-in-data-analytics": "BSIT-DataAnalytics",
  "bsc-in-data-analytics": "BSIT-DataAnalytics",
  "bsc-in-artificial-intelligence--machine-learning": "BSIT-AIandML",
};
