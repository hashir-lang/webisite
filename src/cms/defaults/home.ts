/**
 * Editable copy for the home page (useContent("home")), edited at
 * /admin/pages/home. Each section component in src/components/sections reads
 * its own sub-object here; PartnersMarquee and FeaturedCourses are also placed
 * on other pages and read the same copy there.
 *
 * Every string can be changed or blanked and every list added to, removed
 * from and reordered. Pictures and routes stay in code: the image-backed lists
 * (hero.photos, testimonials.items, marquee.items) name their picture with a
 * short key that the component resolves — the valid keys are listed above
 * each list.
 */
export const HOME_DEFAULTS = {
  hero: {
    title: "Online Degrees",
    titleAccent: "Without Barriers",
    intro:
      "Internationally recognised degrees, study 100% online fitted around your lifestyle. Awarded with partner institutions in the UK, France, Malta, and the USA.",
    searchPlaceholder: "What would you like to study?",
    searchButton: "Search",
    primaryLink: "Find your programme",
    secondaryLink: "Book a consultation",
    /** Prefix of the "Plate 01" corner marker; the number is counted in code. */
    plateLabel: "Plate",
    /** Prefix of the "Drag to browse · 01 / 08" hint under the photo stack. */
    dragHint: "Drag to browse",
    volumeLabel: "UeCampus · Vol. I",
    // image keys: hero-students | sorina | jacek | jose | liliana | maurice | about-hero | library
    photos: [
      { caption: "Built to fit a life. Designed to outlast a trend.",    kicker: "On accessible study",              image: "hero-students" },
      { caption: "A pivotal moment in my career.",                       kicker: "Sorina V. · Romania",              image: "sorina" },
      { caption: "Studying from anywhere has been transformative.",      kicker: "Jacek Z. · Poland",                image: "jacek" },
      { caption: "Industry-focused training that prepared me to excel.", kicker: "Jose A. · United Kingdom",         image: "jose" },
      { caption: "A game-changer for my confidence and skills.",         kicker: "Liliana S. · United Arab Emirates", image: "liliana" },
      { caption: "Practical training that prepared me to excel.",        kicker: "Maurice J. · USA",                 image: "maurice" },
      { caption: "A higher education, accessible from anywhere.",        kicker: "The UeCampus community",           image: "about-hero" },
      { caption: "Open stacks. Open hours. Open to everyone.",           kicker: "The new campus",                   image: "library" },
    ],
    stats: [
      { num: "90+",  label: "Recognised programmes" },
      { num: "06",   label: "Partner institutions" },
      { num: "33+",  label: "Countries reached" },
      { num: "500+", label: "Students" },
    ],
  },
  marquee: {
    eyebrow: "In partnership with",
    // id keys (logo + partner page): eie | ppa | walsh | qualifi | eduqual
    items: [
      { name: "eie European Business School", place: "Malta, EU",            imageAlt: "eie European Business School, partner of UeCampus", id: "eie" },
      { name: "PPA Business School",          place: "Paris, FR",            imageAlt: "PPA Business School, partner of UeCampus",          id: "ppa" },
      { name: "Walsh College",                place: "Michigan, US",         imageAlt: "Walsh College, partner of UeCampus",                id: "walsh" },
      { name: "Qualifi",                      place: "Ofqual-Regulated, UK", imageAlt: "Qualifi, partner of UeCampus",                      id: "qualifi" },
      { name: "EduQual",                      place: "Scotland, UK",         imageAlt: "EduQual, partner of UeCampus",                      id: "eduqual" },
    ],
  },
  values: {
    eyebrow: "Our promise",
    title: "Three pillars,",
    titleAccent: "one institution",
    intro:
      "Every decision we make, whether building a programme or awarding a scholarship, traces back to the same three commitments. They are how we measure ourselves.",
    items: [
      {
        title: "Study at your own pace.",
        desc: "Learn without limits. UeCampus delivers online learning that fits around your lifestyle.",
      },
      {
        title: "A global qualification, without leaving home.",
        desc: "Earn international recognition with partner institutions in the UK, France, Malta, and the USA, without uprooting your life.",
      },
      {
        title: "Made attainable, on purpose.",
        desc: "We make high-quality education attainable, because every motivated student deserves the chance to succeed without financial barriers.",
      },
    ],
  },
  featured: {
    badge: "Search programme",
    title: "Programmes,",
    titleAccent: "selected for you",
    brochureLink: "Download brochure",
    readMoreLabel: "Read course",
  },
  why: {
    title: "Why study at",
    titleAccent: "UeCampus",
    /** The accent-coloured ending of the heading ("…?"). */
    titleSuffix: "…?",
    body:
      "Step into the future of learning with UeCampus, where global opportunities meet true flexibility. We break down the barriers of traditional education by delivering globally-recognised qualification online at an affordable rate. Study at your own pace, from anywhere in the world, while gaining the knowledge, skills, and confidence to thrive. At UeCampus, you don’t just earn a degree; you gain the freedom and competitive edge to shape the career and life you’ve always imagined.",
    aboutLink: "More about UeCampus",
    note: "A note from the team",
    quoteEyebrow: "Pull quote",
    quote: "A reliable partner in online higher education: flexible, affordable, and internationally recognised.",
    quoteCaption: "Flexible learning, affordable, with dedicated tutor support",
    videoTitle: "A film, from our students",
    videoCaption: "Student testimonial · Part 1",
    videoPlate: "Plate 02",
  },
  testimonials: {
    eyebrow: "In their words",
    title: "From UeCampus students across the globe",
    /** Prefix of the "Plate 01" marker on the portrait; the number is counted in code. */
    plateLabel: "Plate",
    // image keys: sorina | jacek | jose | liliana | maurice
    items: [
      {
        name: "Sorina Vasile",
        place: "Romania",
        programme: "BBA in Marketing",
        quote:
          "Completing my BBA in Marketing at UeCampus was a pivotal moment in my career. The in-depth curriculum and industry-focused training provided me with the expertise and confidence to excel in their field. UeCampus truly prepares you for success.",
        image: "sorina",
      },
      {
        name: "Jacek Zalewski",
        place: "Poland",
        programme: "Bachelor of Business Administration in Marketing",
        quote:
          "UeCampus transformed my career trajectory. The BBA in Marketing program gave me both the strategic knowledge and hands-on experience I needed to thrive in today's competitive marketing landscape. If you are serious about building a successful marketing career, UeCampus delivers.",
        image: "jacek",
      },
      {
        name: "Jose Arismendy",
        place: "United Kingdom",
        programme: "Bachelor of Business Administration in Marketing",
        quote:
          "Completing my BBA in Marketing at UeCampus was a pivotal moment in my career. The in-depth curriculum and industry-focused training provided me with the expertise and confidence to excel in their field. UeCampus truly prepares you for success.",
        image: "jose",
      },
      {
        name: "Liliana Sequia",
        place: "United Arab Emirates",
        programme: "Psychology, Level 5",
        quote:
          "Completing my Psychology Level 5 at UeCampus was a game-changer for my career. The comprehensive curriculum and practical training equipped me with the skills and confidence to excel in their field. UeCampus truly prepares you for success.",
        image: "liliana",
      },
      {
        name: "Maurice Janine",
        place: "USA",
        programme: "Level 7 Diploma in Hospitality and Tourism Management",
        quote:
          "Completing my Level 7 Diploma in Hospitality and Tourism Management at UeCampus was a game-changer for my career. The comprehensive curriculum and practical training equipped me with the skills and confidence to excel in their field. UeCampus truly prepares you for success.",
        image: "maurice",
      },
    ],
  },
  faq: {
    title: "Frequently asked",
    titleAccent: "questions",
    intro: "A few of the most common questions. If yours isn’t here, write to us, we read every note that comes in.",
    allLink: "All FAQs",
    // answer = the plain reply; steps = an optional numbered list; note = an optional closing paragraph.
    items: [
      {
        question: "What is UeCampus?",
        answer:
          "UeCampus is an online platform offering a wide range of recognised programmes and degrees, delivered with leading universities and awarding bodies, to help you advance your career from anywhere.",
        steps: [] as string[],
        note: "",
      },
      {
        question: "How do I enrol on a programme?",
        answer: "",
        steps: [
          "Click Apply Now and sign up.",
          "Fill in a few quick questions about you and your chosen programme.",
          "Submit — and you’re done.",
        ],
        note: "Need a hand at any stage? Our admissions officers are ready to help via the website chat or by email (listed on our site).",
      },
      {
        question: "What financial aid or scholarships are available?",
        answer:
          "UeCampus offers a range of scholarships, discounts, and promotional tuition offers. Full details are on our Scholarships page.",
        steps: [] as string[],
        note: "",
      },
      {
        question: "Do I need an English proficiency test?",
        answer:
          "This depends on the programme and partner institution. Some require IELTS or TOEFL; others accept alternative qualifications or prior study in English.",
        steps: [] as string[],
        note: "",
      },
    ],
  },
  cta: {
    eyebrow: "Closing remarks",
    title: "Apply when it’s",
    titleAccent: "right for you",
    body:
      "Most programmes operate on a flexible intake; you can apply at any time and begin as soon as your enrolment is confirmed. Speak with an admissions officer to find the right starting point.",
    primaryLink: "Speak with admissions",
    secondaryLink: "Or, find a scholarship",
    caption: "Flexible intake · Apply anytime",
  },
  partnerInOnlineEd: {
    imageAlt: "Global student community",
    figureLabel: "Figure 03",
    eyebrow: "A global community",
    title: "A community,",
    titleAccent: "connected",
    body:
      "Students from across the world choose UeCampus to advance their education and careers. That diversity sharpens our mission: to deliver globally relevant education and to foster an environment of academic exchange that travels well beyond any single classroom.",
    stats: [
      { num: "90+",  label: "Countries reached" },
      { num: "04",   label: "Partner institutions" },
      { num: "100%", label: "Online delivery" },
    ],
  },
};
