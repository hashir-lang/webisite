import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Eyebrow from "@/components/editorial/Eyebrow";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

// All copy — including every topic and its questions — comes from the CMS
// "faqs" entry (src/cms/defaults/faqs.ts holds the defaults; /admin/pages/faqs
// edits them). Empty strings and empty lists render nothing, which is how an
// admin removes a piece of text.
const FAQs = () => {
  const c = useContent("faqs");
  const categories = c.browse.categories;

  // Topics are addressed by position (there is no stable id in the content);
  // the index is clamped so a topic removed in the CMS can't leave a dangling
  // selection.
  const [active, setActive] = useState(0);
  const [open,   setOpen]   = useState<string | null>("0-0");

  const activeIndex = Math.min(active, Math.max(0, categories.length - 1));
  const current = categories[activeIndex] as (typeof categories)[number] | undefined;

  // FAQPage structured data built from every question across all categories,
  // so Google can surface rich FAQ results for the page.
  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: categories.flatMap((cat) =>
        cat.items.map((it) => ({
          "@type": "Question",
          name: it.question,
          acceptedAnswer: { "@type": "Answer", text: it.answer },
        })),
      ),
    }),
    [categories],
  );

  return (
    <PageLayout>
      <Seo
        title={PAGE_META.faqs.title}
        description={PAGE_META.faqs.description}
        keywords={PAGE_META.faqs.keywords}
        canonicalPath={PAGE_META.faqs.path}
        schema={faqSchema.mainEntity.length > 0 ? faqSchema : undefined}
      />
      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-20 md:pb-28 border-b border-rule">
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

      {/* CATEGORIES + ACCORDION */}
      {current && (
        <section className="bg-paper py-16 md:py-24">
          <div className="container-wide grid gap-10 lg:grid-cols-[280px_1fr]">
            {/* Category rail */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              {c.browse.eyebrow && <p className="eyebrow mb-5">{c.browse.eyebrow}</p>}
              <ul className="flex lg:flex-col flex-wrap gap-1 lg:gap-0 lg:divide-y lg:divide-rule lg:border-y lg:border-rule">
                {categories.map((cat, ci) => {
                  const isActive = ci === activeIndex;
                  return (
                    <li key={`${cat.label}-${ci}`} className="lg:w-full">
                      <button
                        onClick={() => {
                          setActive(ci);
                          setOpen(`${ci}-0`);
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 lg:px-0 lg:py-4 text-left transition-snap ${
                          isActive ? "text-ink" : "text-ink-mute hover:text-ink"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] w-7">
                            {String(ci + 1).padStart(2, "0")}
                          </span>
                          <span className="font-serif text-[18px] leading-tight">{cat.label}</span>
                        </span>
                        <span className="font-mono text-[10px] text-ink-mute">{cat.items.length}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Accordion */}
            <div>
              {current.label && <Eyebrow>{current.label}</Eyebrow>}
              <h2 className="mt-4 font-serif text-display-sm text-ink">{current.label}<span className="text-ember">.</span></h2>

              <div className="mt-10 divide-y divide-rule border-y border-rule">
                {current.items.map((f, i) => {
                  const key = `${activeIndex}-${i}`;
                  const isOpen = open === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="w-full flex items-start gap-6 md:gap-10 py-7 text-left group"
                        aria-expanded={isOpen}
                      >
                        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-mute pt-2 w-10 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 font-serif text-[22px] md:text-[24px] leading-[1.18] text-ink transition-snap group-hover:text-plum">
                          {f.question}
                        </span>
                        <span className="shrink-0 mt-1.5 h-9 w-9 rounded-full border border-rule flex items-center justify-center transition-snap group-hover:border-ink">
                          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </span>
                      </button>
                      {isOpen && f.answer && (
                        <div className="pl-[3.5rem] md:pl-20 pb-8 -mt-3">
                          <p className="font-serif text-[17px] leading-[1.7] text-ink-soft max-w-[58ch]">
                            {f.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STILL HAVE QUESTIONS */}
      <section className="bg-aubergine text-white py-20 md:py-28">
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            {c.cta.eyebrow && <Eyebrow tone="paper">{c.cta.eyebrow}</Eyebrow>}
            <h2 className="mt-5 font-serif text-display text-white">
              {c.cta.title}
              <br />
              <span className="italic-serif text-bloom">{c.cta.titleAccent}</span>?
            </h2>
            {c.cta.body && (
              <p className="mt-8 font-serif text-[18px] text-white/85 max-w-[52ch]">
                {c.cta.body}
              </p>
            )}
          </div>
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-3 lg:items-end">
            {c.cta.contactLabel && (
              <Link to="/contact-us" className="group inline-flex items-center gap-3 bg-white text-aubergine px-7 py-4 text-[13px] font-medium transition-snap hover:bg-bloom">
                {c.cta.contactLabel}
                <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
            {c.cta.email && (
              <a href={`mailto:${c.cta.email}`} className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 hover:text-white">
                {c.cta.email}
              </a>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FAQs;
