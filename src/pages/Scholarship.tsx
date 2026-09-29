import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import FeaturedCourses from "@/components/sections/FeaturedCourses";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

// All copy comes from the CMS "scholarship" entry (src/cms/defaults/scholarship.ts
// holds the defaults; /admin/pages/scholarship edits them). Empty strings and
// empty lists render nothing, which is how an admin removes a piece of text.
const Scholarship = () => {
  const c = useContent("scholarship");
  return (
    <PageLayout>
      <Seo
        title={PAGE_META.scholarship.title}
        description={PAGE_META.scholarship.description}
        keywords={PAGE_META.scholarship.keywords}
        canonicalPath={PAGE_META.scholarship.path}
      />
      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-20 md:pb-24 border-b border-rule">
        <div className="container-wide flex items-baseline justify-between pb-12 md:pb-16">
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <p className="eyebrow hidden md:block">{c.hero.eyebrowRight}</p>
        </div>
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-display-lg text-ink">
              {c.hero.title}
              <br />
              <span className="italic-serif text-plum">{c.hero.titleAccent}</span>
              <span className="text-ember">.</span>
            </h1>
          </div>
          {c.hero.intro && (
            <p className="lg:col-span-4 font-serif text-[19px] leading-[1.6] text-ink-soft">
              {c.hero.intro}
            </p>
          )}
        </div>
      </section>

      {/* STATS */}
      {c.stats.items.length > 0 && (
        <section className="bg-plum-paper py-16 border-t border-rule">
          <div className="container-wide grid md:grid-cols-3 border-t border-ink/20">
            {c.stats.items.map((s, i) => (
              <div key={`${s.title}-${i}`} className={`reveal py-8 ${i > 0 ? "md:border-l md:border-rule md:pl-8" : ""}`} style={{ transitionDelay: `${i * 80}ms` }}>
                <p className="font-serif text-display-sm text-ink leading-none">{s.num}</p>
                <p className="mt-3 eyebrow text-ink-mute">{s.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SCHOLARSHIPS DETAIL */}
      {c.awards.items.length > 0 && (
        <section className="bg-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide mb-16 md:mb-20 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              {c.awards.eyebrow && <Eyebrow>{c.awards.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.awards.title}
                <br />
                <span className="italic-serif text-plum">{c.awards.titleAccent}</span>.
              </h2>
            </div>
            {c.awards.intro && (
              <p className="lg:col-span-5 font-serif text-[19px] leading-[1.6] text-ink-soft">
                {c.awards.intro}
              </p>
            )}
          </div>

          <div className="container-wide divide-y divide-rule border-y border-rule">
            {c.awards.items.map((s, i) => (
              <article key={`${s.title}-${i}`} className="reveal py-14 md:py-20 grid md:grid-cols-12 gap-8 md:gap-12 items-start" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="md:col-span-2">
                  <p className="marker-number text-[72px]">{String(i + 1).padStart(2, "0")}</p>
                </div>
                <div className="md:col-span-6">
                  <h3 className="font-serif text-display-sm text-ink leading-[1.05]">
                    {s.title}<span className="text-ember">.</span>
                  </h3>
                  {s.eligibility && (
                    <p className="mt-5 font-serif text-[18px] italic-serif text-ink-mute">
                      {s.eligibility}
                    </p>
                  )}
                  {s.desc && (
                    <p className="mt-6 text-[15px] leading-relaxed text-ink-soft max-w-[58ch]">
                      {s.desc}
                    </p>
                  )}
                </div>
                <div className="md:col-span-4 lg:pl-8">
                  <div className="bg-aubergine text-white p-6">
                    {c.awards.awardLabel && <p className="eyebrow text-white/65">{c.awards.awardLabel}</p>}
                    <p className="mt-3 font-serif text-[24px] leading-tight">{s.award}</p>
                    {c.awards.applyLink && (
                      <Link to="/contact-us" className="mt-6 group inline-flex items-center gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-white">
                        {c.awards.applyLink}
                        <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <FeaturedCourses />
    </PageLayout>
  );
};

export default Scholarship;
