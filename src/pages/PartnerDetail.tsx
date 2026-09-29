import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { partnerHref, type Partner } from "@/data/partners";
import { useCourses, usePartner } from "@/cms/records";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

const RELATED_LIMIT = 6;

// Fill the `{token}` placeholders in a CMS string (see the token list in
// src/cms/defaults/partnerDetail.ts).
const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));

// The partner record (name, summary, paragraphs, facts…) comes from
// src/data/partners.ts. The page's own wording comes from the CMS
// "partnerDetail" entry (src/cms/defaults/partnerDetail.ts holds the defaults;
// /admin/pages/partnerDetail edits them). Empty strings render nothing.
const PartnerDetailBody = ({ partner }: { partner: Partner }) => {
  const c = useContent("partnerDetail");
  const courses = useCourses();

  // Programmes delivered with this partner, matched on the same awarding-body
  // values the /programmes filter uses, so the preview here and the filtered
  // catalogue stay in sync.
  const relatedAll = courses.filter((course) =>
    partner.programmeFilter.includes(course.universityShort),
  );
  const relatedCourses = relatedAll.slice(0, RELATED_LIMIT);
  const hasMore = relatedAll.length > relatedCourses.length;

  // Deep-link into /programmes with this partner pre-selected in the filters
  // (one ?uni= value per awarding-body label — Walsh spans two tracks).
  const filterParams = new URLSearchParams();
  partner.programmeFilter.forEach((v) => filterParams.append("uni", v));
  const showAllTo = `/programmes?${filterParams.toString()}`;

  const title = `${partner.name} | UeCampus Partner`;
  const description = partner.summary;

  const vars = {
    name: partner.name,
    shortName: partner.shortName,
    shown: relatedCourses.length,
    total: relatedAll.length,
  };

  return (
    <PageLayout>
      <Seo
        title={title}
        description={description}
        keywords={`${partner.name}, ${partner.name} accreditation, ${partner.name} online degree, uecampus partners`}
        canonicalPath={partnerHref(partner)}
      />

      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-20 md:pb-28 border-b border-rule">
        <div className="container-wide flex items-baseline justify-between pb-12 md:pb-16">
          {c.hero.backLink && (
            <Link to="/accreditation-and-partners" className="eyebrow group inline-flex items-center gap-2 text-ink-mute hover:text-ink transition-snap">
              <ArrowLeft className="h-3.5 w-3.5 transition-snap group-hover:-translate-x-0.5" />
              {c.hero.backLink}
            </Link>
          )}
          <p className="eyebrow hidden md:block">{partner.place}</p>
        </div>

        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow eyebrow-plum">{partner.tagline}</p>
            <h1 className="mt-4 font-serif text-display-lg text-ink">
              {partner.name}
              <span className="text-ember">.</span>
            </h1>
            <p className="mt-6 font-serif text-[19px] leading-[1.6] text-ink-soft max-w-[54ch]">
              {partner.summary}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="bg-white border border-rule p-8 h-40 w-full max-w-xs flex items-center justify-center">
              <img
                src={partner.logo}
                alt={fill(c.hero.logoAlt, vars)}
                className={`${partner.logoClass} w-auto object-contain`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT + FACTS */}
      <section className="bg-paper py-24 md:py-32 border-t border-rule">
        <div className="container-wide grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            {c.about.eyebrow && <Eyebrow>{c.about.eyebrow}</Eyebrow>}
            <div className="mt-8 space-y-6 max-w-[60ch]">
              {partner.about.map((para, i) => (
                <p key={i} className="font-serif text-[18px] md:text-[19px] leading-[1.65] text-ink-soft">
                  {para}
                </p>
              ))}
            </div>

            <ul className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {partner.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Facts panel */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border-t border-ink/20">
              {partner.facts.map((f) => (
                <div key={f.label} className="py-5 border-b border-rule">
                  <p className="eyebrow text-ink-mute">{f.label}</p>
                  <p className="mt-1.5 font-serif text-[17px] text-ink leading-snug">{f.value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED PROGRAMMES */}
      {relatedCourses.length > 0 && (
        <section className="bg-plum-paper py-24 md:py-32 border-t border-rule">
          <div className="container-wide">
            <div className="grid lg:grid-cols-12 gap-10 mb-14 md:mb-16 items-end">
              <div className="lg:col-span-7">
                {c.related.eyebrow && <Eyebrow>{fill(c.related.eyebrow, vars)}</Eyebrow>}
                <h2 className="mt-5 font-serif text-display text-ink">
                  {c.related.title}
                  <br />
                  {c.related.titleLine2} <span className="italic-serif text-plum">{partner.shortName}</span>.
                </h2>
              </div>
              {(hasMore ? c.related.introSome : c.related.introAll) && (
                <p className="lg:col-span-4 lg:col-start-9 font-serif text-[18px] leading-[1.6] text-ink-soft">
                  {fill(hasMore ? c.related.introSome : c.related.introAll, vars)}
                </p>
              )}
            </div>

            <ul className="grid md:grid-cols-2 lg:grid-cols-3 border-t border-l border-rule">
              {relatedCourses.map((course) => (
                <li key={course.slug} className="border-b border-r border-rule">
                  <Link to={`/programmes/${course.slug}`} className="group flex h-full flex-col p-7 transition-snap hover:bg-paper">
                    <p className="eyebrow text-ink-mute">{course.levelGroup}</p>
                    <h3 className="mt-3 font-serif text-[20px] leading-tight text-ink flex-1">{course.title}</h3>
                    {c.related.cardLink && (
                      <span className="mt-6 inline-flex items-center gap-2 font-serif text-[15px] text-plum">
                        <span className="link-editorial">{c.related.cardLink}</span>
                        <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {(hasMore ? c.related.showMoreButton : c.related.showAllButton) && (
              <div className="mt-12">
                <Link
                  to={showAllTo}
                  className="group inline-flex items-center gap-3 bg-aubergine text-white px-7 py-4 text-[13px] font-medium transition-snap hover:bg-plum"
                >
                  {fill(hasMore ? c.related.showMoreButton : c.related.showAllButton, vars)}
                  <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="bg-aubergine text-white py-20 md:py-28">
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            {c.cta.eyebrow && <Eyebrow tone="paper">{c.cta.eyebrow}</Eyebrow>}
            <h2 className="mt-5 font-serif text-display text-white">
              {c.cta.title}
              <br />
              <span className="italic-serif text-bloom">{c.cta.titleAccent}</span>
              <span className="text-ember">.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            {c.cta.button && (
              <Link to="/enquire-now" className="group inline-flex items-center gap-3 bg-white text-aubergine px-7 py-4 text-[13px] font-medium transition-snap hover:bg-bloom">
                {c.cta.button}
                <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

const PartnerNotFound = () => {
  const c = useContent("partnerDetail");
  return (
    <PageLayout>
      <Seo
        title="Partner Not Found | UeCampus"
        description={PAGE_META.notFound.description}
        canonicalPath="/accreditation-and-partners"
        noindex
      />
      <section className="container-wide py-32 text-center">
        {c.notFound.eyebrow && <p className="eyebrow">{c.notFound.eyebrow}</p>}
        <h1 className="mt-4 font-serif text-display text-ink">{c.notFound.title}<span className="text-ember">.</span></h1>
        {c.notFound.body && (
          <p className="mt-6 font-serif text-[18px] text-ink-mute">
            {c.notFound.body}
          </p>
        )}
        {c.notFound.backLink && (
          <Link
            to="/accreditation-and-partners"
            className="mt-10 group inline-flex items-center gap-2 bg-aubergine text-white px-7 py-3.5 text-[13px] font-medium hover:bg-plum transition-snap"
          >
            <ArrowLeft className="h-4 w-4 transition-snap group-hover:-translate-x-0.5" />
            {c.notFound.backLink}
          </Link>
        )}
      </section>
    </PageLayout>
  );
};

const PartnerDetail = ({ slug: slugProp }: { slug?: string }) => {
  const params = useParams<{ slug: string }>();
  const slug = slugProp ?? params.slug;
  const partner = usePartner(slug)?.record;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [partner]);

  if (!partner) {
    return <PartnerNotFound />;
  }

  return <PartnerDetailBody partner={partner} />;
};

export default PartnerDetail;
