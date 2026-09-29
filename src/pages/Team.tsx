import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";

/**
 * The team.
 *
 * ── HOW TO ADD REAL PHOTOS ──────────────────────────────────────────────
 * 1. Drop each photo into `src/assets/` (e.g. `team-rushan.jpg`, portrait,
 *    ideally a 4:5 aspect ratio so it fills the card cleanly).
 * 2. `import rushanPhoto from "@/assets/team-rushan.jpg";` at the top of this file.
 * 3. Set `img: rushanPhoto` on that member below.
 * Members without an `img` render a branded initials tile automatically, so
 * the page always looks complete while photos are still being gathered.
 * ────────────────────────────────────────────────────────────────────────
 */
type Member = {
  name: string;
  role: string;
  dept: string;
  bio: string;
  /** Optional portrait; falls back to an initials tile when omitted. */
  img?: string;
  linkedin?: string;
};

/** Featured on the leadership spotlight. */
const LEAD: Member = {
  name: "Rushan Maryam",
  role: "CEO & Director",
  dept: "Leadership",
  bio: "Rushan sets the vision and direction of UeCampus, leading the team behind our mission to make internationally recognised higher education accessible to learners everywhere — flexible, affordable, and held to the standards of our awarding partners.",
};

/** Tier 2 — department heads. Rendered as a centred row. */
const HEADS: Member[] = [
  {
    name: "Richard George",
    role: "Head of Academics",
    dept: "Academics",
    bio: "Leads academic quality and programme delivery, ensuring every course meets the standards of our awarding bodies and partner institutions.",
  },
  {
    name: "Aazma Iqbal",
    role: "Head of Admissions",
    dept: "Admissions",
    bio: "Leads admissions at UeCampus — guiding prospective students from first enquiry through to enrolment on the right programme.",
  },
  {
    name: "Shanzaa Nasir",
    role: "Head of Marketing",
    dept: "Growth",
    bio: "Leads UeCampus marketing — shaping how we reach new learners and tell the story of degrees without barriers across our channels.",
  },
];

/** Tier 3 — the wider team. Rendered as a 4-up row. */
const TEAM: Member[] = [
  {
    name: "Rafael Christian Cordova Formaran",
    role: "Academics Coordinator",
    dept: "Academics",
    bio: "Guides students through their studies day to day — from onboarding and coursework to assessment and graduation.",
  },
  {
    name: "Hashir Saqib",
    role: "IT & Web Developer",
    dept: "Technology",
    bio: "Builds and maintains the software, platforms and websites that keep UeCampus running smoothly for students and staff.",
  },
  {
    name: "Rohan Daniel Diaz Lucin",
    role: "Digital Media Specialist",
    dept: "Growth",
    bio: "Produces the digital media and content that bring the UeCampus brand to life across social and web.",
  },
  {
    name: "Manpreet Kaur",
    role: "Admissions",
    dept: "Admissions",
    bio: "Helps prospective students through the admissions process — answering questions and guiding them to the programme that fits them best.",
  },
  {
    name: "Humna",
    role: "Accountant",
    dept: "Operations",
    bio: "Keeps the finances in order — handling accounts, fees and reporting across the institution.",
  },
];

/** Derive up to two initials from a name for the fallback portrait tile. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/** Shared portrait: real photo when present, branded initials tile otherwise. */
const Portrait = ({ member }: { member: Member }) => (
  <figure className="relative aspect-[4/5] grain overflow-hidden bg-aubergine">
    {member.img ? (
      <img
        src={member.img}
        alt={member.name}
        className="absolute inset-0 h-full w-full object-cover transition-smooth group-hover:scale-[1.03]"
      />
    ) : (
      <>
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/4 -right-1/4 h-[120%] w-[120%] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--orchid) / 0.35), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-white/90 text-display-lg leading-none">
            {initials(member.name)}
          </span>
        </div>
      </>
    )}
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, hsl(var(--aubergine) / 0.05), hsl(var(--aubergine) / 0.45))",
      }}
    />
    <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
      <span className="eyebrow text-white/70">{member.dept}</span>
    </figcaption>
  </figure>
);

/** A single team member card — portrait + name, role and bio. */
const MemberCard = ({ member, delay = 0 }: { member: Member; delay?: number }) => (
  <article className="reveal group" style={{ transitionDelay: `${delay}ms` }}>
    <Portrait member={member} />
    <div className="mt-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-[24px] text-ink leading-tight">
          {member.name}
        </h3>
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="mt-1 inline-flex text-ink-mute transition-smooth hover:text-plum hover:-translate-y-0.5"
          >
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
      <p className="mt-1 eyebrow text-plum">{member.role}</p>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-soft max-w-[38ch]">
        {member.bio}
      </p>
    </div>
  </article>
);

/** Vertical flow line + a centred tier label, linking one rank to the next. */
const FlowStep = ({ number, label }: { number: string; label: string }) => (
  <div className="flex flex-col items-center">
    <span aria-hidden className="h-12 md:h-16 w-px bg-rule" />
    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-plum" />
    <p className="mt-5 eyebrow flex items-center gap-3 text-ink-mute">
      <span className="font-mono text-[11px]">{number}</span>
      <span className="h-px w-8 bg-rule-strong" aria-hidden />
      <span>{label}</span>
    </p>
  </div>
);

const Team = () => {
  return (
    <PageLayout>
      <Seo
        title={PAGE_META.team.title}
        description={PAGE_META.team.description}
        keywords={PAGE_META.team.keywords}
        canonicalPath={PAGE_META.team.path}
      />

      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-16 md:pb-20">
        <div className="container-wide flex items-baseline justify-between pb-12 md:pb-16">
          <p className="eyebrow">Chapter 03 / The people</p>
          <p className="eyebrow hidden md:block">Our Team</p>
        </div>

        <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <h1 className="font-serif text-display-xl text-ink">
              The people behind
              <br />
              <span className="italic-serif text-plum">UeCampus</span>
              <span className="text-ember">.</span>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="font-serif text-[20px] md:text-[22px] leading-[1.55] text-ink-soft">
              A small, dedicated team of academics, developers, marketers and
              advisors working towards one thing: making internationally
              recognised education accessible to learners everywhere.
            </p>
            <p className="mt-6 eyebrow text-ink-mute">
              Leadership · Academics · Technology · Growth · Operations
            </p>
          </div>
        </div>
      </section>

      {/* LEADERSHIP SPOTLIGHT */}
      <section className="bg-aubergine text-white py-20 md:py-28 relative overflow-hidden border-t border-rule">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-40 h-[36rem] w-[36rem] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, hsl(var(--orchid) / 0.28), transparent 70%)",
          }}
        />
        <div className="relative container-wide grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <figure className="group lg:col-span-5">
            <Portrait member={LEAD} />
          </figure>

          <div className="lg:col-span-7">
            <Eyebrow number="01" tone="paper">
              Leadership
            </Eyebrow>
            <h2 className="mt-5 font-serif text-display text-white leading-[1.05]">
              {LEAD.name}
            </h2>
            <p className="mt-3 font-serif italic-serif text-bloom text-[22px]">
              {LEAD.role}
            </p>
            <p className="mt-8 font-serif text-[19px] md:text-[20px] leading-[1.65] text-white/90 max-w-[54ch]">
              {LEAD.bio}
            </p>
            {LEAD.linkedin && (
              <a
                href={LEAD.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 font-serif text-lg text-white"
              >
                <span className="link-editorial">Connect on LinkedIn</span>
                <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* TIERS — heads, then the wider team, flowing down from leadership */}
      <section className="bg-paper pt-16 md:pt-20 pb-20 md:pb-28 border-t border-rule">
        <div className="container-wide">
          {/* Tier 2 — department heads */}
          <FlowStep number="02" label="Department heads" />
          <div className="mt-12 md:mt-14 grid grid-cols-3 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-12 max-w-5xl mx-auto">
            {HEADS.map((m, i) => (
              <MemberCard key={`${m.name}-${i}`} member={m} delay={(i % 3) * 80} />
            ))}
          </div>

          {/* Tier 3 — the wider team */}
          <div className="mt-16 md:mt-20">
            <FlowStep number="03" label="The wider team" />
          </div>
          <div className="mt-12 md:mt-14 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12 md:gap-y-14">
            {TEAM.map((m, i) => (
              <MemberCard key={`${m.name}-${i}`} member={m} delay={(i % 5) * 70} />
            ))}
          </div>
        </div>
      </section>

      {/* JOIN US / CTA */}
      <section className="bg-plum-paper py-20 md:py-28 border-t border-rule">
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <Eyebrow>Join us</Eyebrow>
            <h2 className="mt-5 font-serif text-display text-ink">
              Want to help shape
              <br />
              <span className="italic-serif text-plum">
                degrees without barriers
              </span>
              ?
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="text-[15px] leading-relaxed text-ink-soft">
              We&rsquo;re always glad to hear from people who care about
              widening access to education.
            </p>
            <Link
              to="/contact-us"
              className="group mt-5 inline-flex items-center gap-2 font-serif text-lg text-ink"
            >
              <span className="link-editorial">Get in touch</span>
              <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Team;
