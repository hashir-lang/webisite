import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import FeaturedCourses from "@/components/sections/FeaturedCourses";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight } from "lucide-react";
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
