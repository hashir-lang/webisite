import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/cms/useContent";
import cyber from "@/assets/course-cyber.jpg";
import mba from "@/assets/course-mba.jpg";
import ai from "@/assets/course-ai.jpg";
import phd from "@/assets/course-phd.jpg";

type Course = {
  tag: string;
  level: string;
  title: string;
  desc: string;
  img: string;
  to: string;
};

// The featured programmes are course data (tied to their pictures and routes),
// not page copy, so they stay in code. The section's own labels come from
// the CMS "home" entry (featured section).
const COURSES: Course[] = [
  {
    tag: "Cyber Security",
    level: "Bachelor's",
    title: "BSc Cyber Security",
    desc: "Protect digital systems and data with advanced cyber security skills.",
    img: cyber,
    to: "/courses",
  },
  {
    tag: "Business",
    level: "Master's",
    title: "MBA International Business",
    desc: "Gain expertise in managing global enterprises and cross-border teams.",
    img: mba,
    to: "/courses",
  },
  {
    tag: "Artificial Intelligence",
    level: "Master's",
    title: "MSc AI & Machine Learning",
    desc: "Explore advanced AI, deep learning, and automation in practice.",
    img: ai,
    to: "/courses",
  },
  {
    tag: "Artificial Intelligence",
    level: "Doctorate",
    title: "PhD AI & Machine Learning",
    desc: "Research AI innovations, deep learning, and intelligent automation.",
    img: phd,
    to: "/courses",
  },
];

const FeaturedCourses = () => {
  const { featured } = useContent("home");
  return (
    <section className="bg-paper-soft py-24 md:py-32 border-t border-rule relative overflow-hidden">
      <div className="container-wide relative">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-10 mb-14 md:mb-20 items-end">
          <div className="lg:col-span-7">
            {featured.badge && (
              <span className="inline-flex items-center gap-2 rounded-full bg-plum/10 ring-1 ring-plum/15 px-3.5 py-1.5 text-[12px] font-medium text-plum">
                <span className="h-1.5 w-1.5 rounded-full bg-plum" />
                {featured.badge}
              </span>
            )}
            <h2 className="mt-6 font-serif text-display text-ink leading-[1.05]">
              {featured.title}
              <br />
              <span className="italic-serif text-plum">{featured.titleAccent}</span>.
            </h2>
          </div>
          {featured.brochureLink && (
            <div className="lg:col-span-4 lg:col-start-9 lg:text-right">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 rounded-full bg-aubergine text-white px-5 py-2.5 text-[13px] font-medium transition-smooth hover:bg-plum"
              >
                {featured.brochureLink}
                <ArrowUpRight className="h-3.5 w-3.5 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Modern card grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-7">
          {COURSES.map((c, i) => (
            <article
              key={c.title}
              className="reveal group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Link
                to={c.to}
                className="bg-white rounded-3xl overflow-hidden ring-1 ring-rule shadow-[0_20px_50px_-30px_rgba(40,16,80,0.25)] transition-smooth hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(40,16,80,0.35)] flex flex-col h-full"
              >
                <div className="relative aspect-[5/3.4] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 55%, hsl(272 70% 14% / 0.55))",
                    }}
                  />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-white bg-aubergine/70 backdrop-blur-md rounded-full px-3 py-1.5 ring-1 ring-white/20">
                    {c.level}
                  </span>
                  <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85">
                    {String(i + 1).padStart(2, "0")} / {String(COURSES.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="p-7 md:p-8 flex flex-col flex-1">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-plum">
                    <span className="h-1 w-1 rounded-full bg-plum" />
                    {c.tag}
                  </p>
                  <h3 className="mt-3 font-serif text-[24px] md:text-[26px] leading-[1.2] text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
                    {c.desc}
                  </p>
                  <div className="mt-auto pt-6 flex items-center justify-between">
                    {featured.readMoreLabel && (
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-plum transition-smooth group-hover:gap-2">
                        {featured.readMoreLabel}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <span className="h-9 w-9 rounded-full bg-aubergine text-white flex items-center justify-center transition-smooth group-hover:bg-plum group-hover:scale-105">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
