import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import FeaturedCourses from "@/components/sections/FeaturedCourses";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

// Formats a fee with the CMS currency symbol and en-GB thousands separators.
const fmt = (currency: string, amount: number) => `${currency}${amount.toLocaleString("en-GB")}`;

// All copy, including the fee tables, comes from the CMS "fees" entry
// (src/cms/defaults/fees.ts holds the defaults; /admin/pages/fees edits them).
// Empty strings and empty lists render nothing, which is how an admin removes
// a piece of text.
const Fees = () => {
  const c = useContent("fees");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <PageLayout>
      <Seo
        title={PAGE_META.fees.title}
        description={PAGE_META.fees.description}
        keywords={PAGE_META.fees.keywords}
        canonicalPath={PAGE_META.fees.path}
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

      {/* FEE TABLES BY PARTNER */}
      {c.tables.partners.length > 0 && (
        <section className="bg-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide mb-16 md:mb-20 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              {c.tables.eyebrow && <Eyebrow>{c.tables.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.tables.title}
                <br />
                <span className="italic-serif text-plum">{c.tables.titleAccent}</span>.
              </h2>
            </div>
            {c.tables.intro && (
              <p className="lg:col-span-5 font-serif text-[19px] leading-[1.6] text-ink-soft">
                {c.tables.intro}
              </p>
            )}
          </div>

          <div className="container-wide divide-y divide-rule border-y border-rule">
            {c.tables.partners.map((p, i) => (
              <article
                key={`${p.name}-${i}`}
                className="reveal py-14 md:py-20 grid md:grid-cols-12 gap-8 md:gap-12 items-start"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="md:col-span-4">
                  <p className="marker-number text-[72px]">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 font-serif text-display-sm text-ink leading-[1.05]">
                    {p.name}
                    <span className="text-ember">.</span>
                  </h3>
                  {p.blurb && (
                    <p className="mt-4 font-serif text-[18px] italic-serif text-ink-mute max-w-[34ch]">
                      {p.blurb}
                    </p>
                  )}
                </div>

                <div className="md:col-span-8">
                  {p.rows.length > 0 && (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-rule">
                          <th className="text-left eyebrow text-ink-mute font-normal pb-3">
                            {c.tables.programmeColumn}
                          </th>
                          <th className="text-left eyebrow text-ink-mute font-normal pb-3 hidden sm:table-cell">
                            {c.tables.awardColumn}
                          </th>
                          <th className="text-right eyebrow text-ink-mute font-normal pb-3">
                            {c.tables.feeColumn}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {p.rows.map((r, j) => (
                          <tr key={`${r.level}-${j}`} className="border-b border-rule last:border-b-0">
                            <td className="py-4 pr-4 font-serif text-[19px] text-ink leading-tight align-top">
                              {r.level}
                            </td>
                            <td className="py-4 pr-4 text-[13px] text-ink-mute align-top hidden sm:table-cell">
                              {r.award}
                            </td>
                            <td className="py-4 text-right font-mono text-[14px] text-ink-soft whitespace-nowrap align-top">
                              {fmt(c.tables.currency, r.fee)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* PROGRAMME COMPARISON TABLE */}
      {c.comparison.rows.length > 0 && (
        <section className="bg-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide mb-12 md:mb-16 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              {c.comparison.eyebrow && <Eyebrow>{c.comparison.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.comparison.title}
                <br />
                <span className="italic-serif text-plum">{c.comparison.titleAccent}</span>.
              </h2>
            </div>
            <div className="lg:col-span-5">
              {c.comparison.intro && (
                <p className="font-serif text-[19px] leading-[1.6] text-ink-soft">
                  {c.comparison.intro}
                </p>
              )}
              {c.comparison.browseLink && (
                <Link
                  to="/programmes"
                  className="group inline-flex items-center gap-2 mt-5 text-[13px] font-mono uppercase tracking-[0.18em] text-plum hover:text-aubergine transition-snap"
                >
                  {c.comparison.browseLink}
                  <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
            </div>
          </div>
          <div className="container-wide overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left eyebrow text-ink-mute font-normal pb-3 pr-4">
                    {c.comparison.headers.programme}
                  </th>
                  <th className="text-left eyebrow text-ink-mute font-normal pb-3 pr-4 hidden sm:table-cell">
                    {c.comparison.headers.duration}
                  </th>
                  <th className="text-right eyebrow text-ink-mute font-normal pb-3 pr-4">
                    {c.comparison.headers.totalFee}
                  </th>
                  <th className="text-right eyebrow text-ink-mute font-normal pb-3 pr-4 hidden md:table-cell">
                    {c.comparison.headers.perModule}
                  </th>
                  <th className="text-left eyebrow text-ink-mute font-normal pb-3 hidden lg:table-cell">
                    {c.comparison.headers.awardingBody}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.comparison.rows.map((r, i) => (
                  <tr key={`comp-${i}`} className="border-b border-rule last:border-b-0">
                    <td className="py-4 pr-4 font-serif text-[18px] text-ink leading-tight align-top">
                      {r.programme}
                    </td>
                    <td className="py-4 pr-4 text-[13px] text-ink-mute align-top hidden sm:table-cell">
                      {r.duration}
                    </td>
                    <td className="py-4 pr-4 text-right font-mono text-[14px] text-ink-soft whitespace-nowrap align-top">
                      {fmt(c.tables.currency, r.totalFee)}
                    </td>
                    <td className="py-4 pr-4 text-right font-mono text-[14px] text-ink-mute whitespace-nowrap align-top hidden md:table-cell">
                      {fmt(c.tables.currency, r.perModule)}
                    </td>
                    <td className="py-4 text-[13px] text-ink-mute align-top hidden lg:table-cell">
                      {r.awardingBody}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* WHAT'S INCLUDED */}
      {c.whatIsIncluded.items.length > 0 && (
        <section className="bg-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide mb-16 md:mb-20 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              {c.whatIsIncluded.eyebrow && <Eyebrow>{c.whatIsIncluded.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.whatIsIncluded.title}
                <br />
                <span className="italic-serif text-plum">{c.whatIsIncluded.titleAccent}</span>.
              </h2>
            </div>
            {c.whatIsIncluded.intro && (
              <p className="lg:col-span-5 font-serif text-[19px] leading-[1.6] text-ink-soft">
                {c.whatIsIncluded.intro}
              </p>
            )}
          </div>
          <div className="container-wide grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule">
            {c.whatIsIncluded.items.map((item, i) => (
              <div key={`incl-${i}`} className="bg-paper p-8 md:p-10">
                <h3 className="font-serif text-[22px] text-ink leading-[1.1]">{item.heading}</h3>
                <p className="mt-3 font-serif text-[17px] leading-[1.65] text-ink-soft">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* HOW TO PAY */}
      {c.howToPay.options.length > 0 && (
        <section className="bg-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide mb-16 md:mb-20 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              {c.howToPay.eyebrow && <Eyebrow>{c.howToPay.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.howToPay.title}
                <br />
                <span className="italic-serif text-plum">{c.howToPay.titleAccent}</span>.
              </h2>
            </div>
            {c.howToPay.intro && (
              <p className="lg:col-span-5 font-serif text-[19px] leading-[1.6] text-ink-soft">
                {c.howToPay.intro}
              </p>
            )}
          </div>
          <div className="container-wide divide-y divide-rule border-y border-rule">
            {c.howToPay.options.map((opt, i) => (
              <div
                key={`pay-${i}`}
                className="py-8 md:py-10 grid md:grid-cols-12 gap-6 md:gap-10 items-baseline"
              >
                <p className="marker-number md:col-span-1 text-[40px]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="md:col-span-11">
                  <h3 className="font-serif text-[22px] text-ink">{opt.heading}</h3>
                  <p className="mt-2 font-serif text-[17px] leading-[1.65] text-ink-soft">{opt.body}</p>
                </div>
              </div>
            ))}
          </div>
          {c.howToPay.note && (
            <div className="container-wide mt-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <p className="font-serif text-[17px] leading-[1.6] text-ink-soft max-w-[64ch]">
                {c.howToPay.note}
              </p>
              {c.howToPay.scholarshipLink && (
                <Link
                  to="/scholarship"
                  className="shrink-0 group inline-flex items-center gap-2 text-[13px] font-mono uppercase tracking-[0.18em] text-plum hover:text-aubergine transition-snap"
                >
                  {c.howToPay.scholarshipLink}
                  <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
            </div>
          )}
        </section>
      )}

      {/* WHY COMPETITIVE */}
      {c.whyCompetitive.stats.length > 0 && (
        <section className="bg-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide mb-16 md:mb-20 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              {c.whyCompetitive.eyebrow && <Eyebrow>{c.whyCompetitive.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.whyCompetitive.title}
                <br />
                <span className="italic-serif text-plum">{c.whyCompetitive.titleAccent}</span>.
              </h2>
            </div>
            {c.whyCompetitive.body && (
              <p className="lg:col-span-5 font-serif text-[19px] leading-[1.6] text-ink-soft">
                {c.whyCompetitive.body}
              </p>
            )}
          </div>
          <div className="container-wide grid md:grid-cols-3 gap-px bg-rule border border-rule">
            {c.whyCompetitive.stats.map((s, i) => (
              <div key={`stat-${i}`} className="bg-paper p-10 md:p-12">
                <p className="font-serif text-[40px] md:text-[48px] text-plum leading-[1.05]">
                  {s.figure}
                </p>
                <p className="mt-4 font-serif text-[17px] leading-[1.65] text-ink-soft">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {c.faq.items.length > 0 && (
        <section className="bg-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide mb-16 md:mb-20 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              {c.faq.eyebrow && <Eyebrow>{c.faq.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.faq.title}
                <br />
                <span className="italic-serif text-plum">{c.faq.titleAccent}</span>.
              </h2>
            </div>
          </div>
          <div className="container-wide divide-y divide-rule border-y border-rule">
            {c.faq.items.map((item, i) => (
              <div key={`faq-${i}`} className="py-1">
                <button
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <h3 className="font-serif text-[20px] md:text-[22px] text-ink">{item.question}</h3>
                  <ChevronDown
                    className={`shrink-0 h-5 w-5 text-ink-mute transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="pb-6 font-serif text-[17px] leading-[1.7] text-ink-soft max-w-[72ch]">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-plum-paper py-20 md:py-24 border-t border-rule">
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <h2 className="font-serif text-display text-ink">
              {c.cta.title}
              <br />
              <span className="italic-serif text-plum">{c.cta.titleAccent}</span>?
            </h2>
            {c.cta.body && (
              <p className="mt-5 font-serif text-[18px] leading-[1.6] text-ink-soft max-w-[52ch]">
                {c.cta.body}
              </p>
            )}
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3 lg:items-end">
            {c.cta.primaryLink && (
              <Link
                to="/enquire-now"
                className="group inline-flex items-center gap-2 rounded-full bg-aubergine text-white px-6 py-3.5 text-[14px] font-medium transition-smooth hover:bg-plum"
              >
                {c.cta.primaryLink}
                <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
            {c.cta.secondaryLink && (
              <Link
                to="/scholarship"
                className="text-[13px] font-mono uppercase tracking-[0.18em] text-plum hover:text-aubergine transition-snap"
              >
                {c.cta.secondaryLink}
              </Link>
            )}
          </div>
        </div>
      </section>

      <FeaturedCourses />
    </PageLayout>
  );
};

export default Fees;
