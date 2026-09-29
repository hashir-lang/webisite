import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import PartnersMarquee from "@/components/sections/PartnersMarquee";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight } from "lucide-react";
import aboutImg from "@/assets/about-hero.jpg";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

// All copy comes from the CMS "about" entry (src/cms/defaults/about.ts holds
// the defaults; /admin/pages/about edits them). Empty strings and empty lists
// render nothing, which is how an admin removes a piece of text.
const About = () => {
  const c = useContent("about");
  return (
    <PageLayout>
      <Seo
        title={PAGE_META.about.title}
        description={PAGE_META.about.description}
        keywords={PAGE_META.about.keywords}
        canonicalPath={PAGE_META.about.path}
      />
      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container-wide flex items-baseline justify-between pb-12 md:pb-16">
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <p className="eyebrow hidden md:block">{c.hero.eyebrowRight}</p>
        </div>

        <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <h1 className="font-serif text-display-xl text-ink">
              {c.hero.title}
              <br />
              <span className="italic-serif text-plum">{c.hero.titleAccent}</span>
              <span className="text-ember">.</span>
            </h1>
            {c.hero.intro && (
              <p className="mt-10 font-serif text-[20px] md:text-[22px] leading-[1.55] text-ink-soft max-w-xl">
                {c.hero.intro}
              </p>
            )}

            <div className="mt-10 flex items-center gap-8">
              {c.hero.primaryLink && (
                <Link to="/programmes" className="group inline-flex items-center gap-2 font-serif text-lg text-ink">
                  <span className="link-editorial">{c.hero.primaryLink}</span>
                  <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
              {c.hero.secondaryLink && (
                <Link to="/accreditation-and-partners" className="group inline-flex items-center gap-2 font-serif text-lg text-ink">
                  <span className="link-editorial">{c.hero.secondaryLink}</span>
                  <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
            </div>
          </div>

          <figure className="lg:col-span-5 relative aspect-[4/5] grain overflow-hidden bg-aubergine">
            <img
              src={aboutImg}
              alt={c.hero.imageAlt}
              className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-95"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, hsl(var(--aubergine) / 0.15), hsl(var(--aubergine) / 0.7))" }}
            />
            {(c.hero.imageQuote || c.hero.imageCaption) && (
              <figcaption className="absolute bottom-6 left-6 right-6 text-white">
                {c.hero.imageQuote && (
                  <p className="font-serif italic-serif text-[16px] leading-snug">&ldquo;{c.hero.imageQuote}&rdquo;</p>
                )}
                {c.hero.imageCaption && <p className="eyebrow text-white/60 mt-3">{c.hero.imageCaption}</p>}
              </figcaption>
            )}
          </figure>
        </div>
      </section>

      {/* PARTNERS MARQUEE */}
      <PartnersMarquee />

      {/* STATS */}
      {c.stats.items.length > 0 && (
        <section className="bg-plum-paper py-20 md:py-28 border-t border-rule">
          <div className="container-wide">
            {c.stats.eyebrow && <Eyebrow>{c.stats.eyebrow}</Eyebrow>}
            <div className="mt-10 grid md:grid-cols-3 border-t border-ink/20">
              {c.stats.items.map((s, i) => (
                <div
                  key={`${s.title}-${i}`}
                  className={`reveal pt-10 md:pt-14 pb-12 ${i > 0 ? "md:border-l md:border-rule md:pl-10" : ""}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <p className="font-serif text-display-lg text-ink leading-none">{s.num}</p>
                  <p className="mt-4 font-serif text-[22px] text-ink">{s.title}</p>
                  {s.desc && (
                    <p className="mt-3 text-[14px] text-ink-mute leading-relaxed max-w-[30ch]">{s.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY + MISSION/VISION ───────────────── */}
      <section className="bg-aubergine text-white py-24 md:py-32 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full"
          style={{ background: "radial-gradient(closest-side, hsl(var(--orchid) / 0.3), transparent 70%)" }}
        />
        <div className="relative container-wide grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            {c.why.eyebrow && <Eyebrow tone="paper">{c.why.eyebrow}</Eyebrow>}
            <h2 className="mt-5 font-serif text-display text-white">
              {c.why.title}
              <br />
              <span className="italic-serif text-bloom">{c.why.titleAccent}</span>
              <span className="text-ember">.</span>
            </h2>
            {c.why.body && (
              <p className="mt-10 font-serif text-[19px] md:text-[20px] leading-[1.65] text-white/90 drop-cap max-w-[58ch]">
                {c.why.body}
              </p>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            {[c.why.mission, c.why.vision].map((card, i) =>
              card.title || card.body ? (
                <article key={i} className="bg-white text-ink p-8 md:p-10">
                  <Eyebrow number={String(i + 1).padStart(2, "0")} tone="plum">{card.eyebrow}</Eyebrow>
                  {card.title && (
                    <h3 className="mt-5 font-serif text-[28px] leading-tight text-ink">{card.title}</h3>
                  )}
                  {card.body && <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">{card.body}</p>}
                </article>
              ) : null,
            )}
          </div>
        </div>
      </section>

      {/* PILLARS / ADVANTAGES ─────────────────── */}
      {c.pillars.items.length > 0 && (
        <section className="bg-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide">
            <div className="grid lg:grid-cols-12 gap-10 mb-16 md:mb-20">
              <div className="lg:col-span-5">
                {c.pillars.eyebrow && <Eyebrow>{c.pillars.eyebrow}</Eyebrow>}
                <h2 className="mt-5 font-serif text-display text-ink">
                  {c.pillars.title}
                  <br />
                  {c.pillars.titleLine2} <span className="italic-serif text-plum">{c.pillars.titleAccent}</span>.
                </h2>
              </div>
              {c.pillars.intro && (
                <p className="lg:col-span-6 lg:col-start-7 font-serif text-[20px] leading-[1.6] text-ink-soft pt-2 md:pt-12">
                  {c.pillars.intro}
                </p>
              )}
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-ink/20">
              {c.pillars.items.map((p, i) => (
                <li
                  key={`${p.title}-${i}`}
                  className={`reveal pt-8 pb-10 pr-6 ${
                    i % 4 !== 0 ? "lg:border-l lg:border-rule lg:pl-6" : ""
                  } ${
                    i % 2 !== 0 ? "sm:border-l sm:border-rule sm:pl-6 lg:border-l lg:pl-6" : ""
                  } border-b border-rule`}
                  style={{ transitionDelay: `${(i % 4) * 60}ms` }}
                >
                  <p className="marker-number text-[44px]">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 font-serif text-[22px] text-ink leading-tight">{p.title}</h3>
                  {p.desc && <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{p.desc}</p>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default About;
