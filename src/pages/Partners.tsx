import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import PartnersMarquee from "@/components/sections/PartnersMarquee";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight } from "lucide-react";
import Seo from "@/seo/Seo";
import { PAGE_META, SITE_URL } from "@/seo/siteMeta";
import { partnersBySlug, partnerHref } from "@/data/partners";
import { useContent } from "@/cms/useContent";
import eie     from "@/assets/partner-eie-exact.jpg";
import ppa     from "@/assets/partner-ppa-exact-cropped.png";
import walsh   from "@/assets/partner-walsh.png";
import qualifi from "@/assets/partner-qualifi-exact.png";

// The partner profiles are records (logo, place, tagline, description) and
// stay in code; the page's own wording comes from the CMS "partners" entry
// (src/cms/defaults/partners.ts holds the defaults; /admin/pages/partners
// edits them). Empty strings and empty lists render nothing.
const PARTNERS = [
  {
    logo: eie,
    slug: "eie",
    name: "eie European Business School",
    place: "St Julian's, Malta",
    tagline: "European Institute of Executives",
    desc: "A European business school delivering professionally-focused bachelor's, master's and MBA programmes designed around the skills employers demand. Regulated by Malta's National Commission for Further and Higher Education (NCFHE) and operating across Europe, eie programmes are recognised under the Bologna Process throughout the European Union. More than 2,000 graduates hold eie qualifications and are working across 25+ countries.",
    verifyLabel: "Verify on NCFHE Malta register",
    verifyHref: "https://ncfhe.gov.mt/",
    logoClass: "max-h-16",
  },
  {
    logo: ppa,
    slug: "ppa-business-school",
    name: "PPA Business School",
    place: "Paris, France",
    tagline: "La Grande École en Alternance",
    desc: "A Paris-based grande école offering work-integrated bachelor and master programmes across business, marketing and management. PPA Business School holds CEFDG recognition from the French Ministry of Higher Education, and its degrees are recognised across Europe under the Bologna Agreement. With campuses across France, PPA alumni hold leadership roles in organisations across 30+ countries.",
    verifyLabel: "Verify on CEFDG register",
    verifyHref: "https://www.cefdg.fr/",
    logoClass: "max-h-20",
  },
  {
    logo: walsh,
    slug: "walsh-college",
    name: "Walsh College",
    place: "Michigan, United States",
    tagline: "Business-focused higher education",
    desc: "A US institution offering accredited business, technology and accounting degrees with a strong emphasis on applied learning and career outcomes. Walsh College holds dual accreditation from the Higher Learning Commission (HLC) — a regional accreditor recognised by the US Department of Education since 1922 — and ACBSP, the global standard for business education quality. Walsh credentials are recognised by employers and professional bodies across North America, Europe, and the Gulf region.",
    verifyLabel: "Verify on HLC directory",
    verifyHref: "https://www.hlcommission.org/directory/",
    logoClass: "max-h-14",
  },
  {
    logo: qualifi,
    slug: "qualifi",
    name: "Qualifi",
    place: "Ofqual-regulated, UK",
    tagline: "UK awarding organisation",
    desc: "A UK awarding organisation regulated by Ofqual (the Office of Qualifications and Examinations Regulation), listed on the Regulated Qualifications Framework (RQF). Qualifi Level 3–7 diplomas serve as direct entry pathways to full undergraduate and postgraduate degrees at universities across the UK and internationally. More than 40,000 learners in over 50 countries hold Qualifi qualifications, making it one of the most widely recognised UK awarding bodies globally.",
    verifyLabel: "Verify on Ofqual public register",
    verifyHref: "https://register.ofqual.gov.uk/",
    logoClass: "max-h-16",
  },
];

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Accreditation & University Partners",
  url: `${SITE_URL}/accreditation-and-partners`,
  author: {
    "@type": "Organization",
    name: "UeCampus",
    url: SITE_URL,
  },
  dateModified: "2025-09-01",
  reviewedBy: {
    "@type": "Organization",
    name: "UeCampus Accreditation Team",
  },
};

const Partners = () => {
  const c = useContent("partners");
  return (
    <PageLayout>
      <Seo
        title={PAGE_META.partners.title}
        description={PAGE_META.partners.description}
        keywords={PAGE_META.partners.keywords}
        canonicalPath={PAGE_META.partners.path}
        schema={webPageSchema}
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

      <PartnersMarquee />

      {/* PILLARS */}
      <section className="bg-plum-paper py-24 md:py-32 border-t border-rule">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-10 mb-16 md:mb-20 items-end">
            <div className="lg:col-span-6">
              {c.pillars.eyebrow && <Eyebrow>{c.pillars.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.pillars.title}
                <br />
                {c.pillars.titleLine2} <span className="italic-serif text-plum">{c.pillars.titleAccent}</span>.
              </h2>
            </div>
            {c.pillars.intro && (
              <p className="lg:col-span-5 lg:col-start-8 font-serif text-[19px] leading-[1.6] text-ink-soft">
                {c.pillars.intro}
              </p>
            )}
          </div>
          {c.pillars.items.length > 0 && (
            <ul className="grid md:grid-cols-2 lg:grid-cols-4 border-t border-ink/20">
              {c.pillars.items.map((p, i) => (
                <li
                  key={`${p.title}-${i}`}
                  className={`reveal pt-8 pb-10 pr-6 ${i > 0 ? "lg:border-l lg:border-rule lg:pl-6" : ""} ${i % 2 !== 0 ? "md:border-l md:border-rule md:pl-6" : ""} border-b border-rule`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <p className="marker-number text-[56px]">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-5 font-serif text-[22px] text-ink leading-tight">{p.title}</h3>
                  {p.desc && <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{p.desc}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* PARTNER PROFILES - editorial split layout */}
      <section className="bg-paper py-24 md:py-32 border-t border-rule">
        <div className="container-wide mb-16 md:mb-20">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-6">
              {c.profiles.eyebrow && <Eyebrow>{c.profiles.eyebrow}</Eyebrow>}
              <h2 className="mt-5 font-serif text-display text-ink">
                {c.profiles.title}
                <br />
                <span className="italic-serif text-plum">{c.profiles.titleAccent}</span>.
              </h2>
            </div>
            {c.profiles.intro && (
              <p className="lg:col-span-5 lg:col-start-8 font-serif text-[19px] leading-[1.6] text-ink-soft">
                {c.profiles.intro}
              </p>
            )}
          </div>
        </div>

        <div className="container-wide divide-y divide-rule border-y border-rule">
          {PARTNERS.map((p, i) => (
            <article key={p.name} className="reveal py-12 md:py-16 grid md:grid-cols-12 gap-8 md:gap-12 items-start" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="md:col-span-3 flex items-start gap-5">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute pt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link
                  to={partnerHref(partnersBySlug[p.slug])}
                  aria-label={c.profiles.logoLinkLabel.replace("{name}", p.name)}
                  className="bg-white border border-rule p-6 h-32 flex items-center justify-center w-full transition-snap hover:border-ink"
                >
                  <img
                    src={p.logo}
                    alt={c.profiles.logoAlt.replace("{name}", p.name)}
                    className={`${p.logoClass} w-auto object-contain`}
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="md:col-span-6">
                <p className="eyebrow eyebrow-plum">{p.place}</p>
                <h3 className="mt-3 font-serif text-[32px] md:text-[36px] leading-[1.1] text-ink">
                  {p.name}
                </h3>
                <p className="mt-3 italic-serif text-[16px] text-ink-mute">{p.tagline}</p>
                <p className="mt-5 text-[15px] leading-relaxed text-ink-soft max-w-[58ch]">
                  {p.desc}
                </p>
                <a
                  href={p.verifyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-plum hover:underline"
                >
                  {p.verifyLabel}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="md:col-span-3 flex md:justify-end items-start">
                {c.profiles.viewLink && (
                  <Link to={partnerHref(partnersBySlug[p.slug])} className="group inline-flex items-center gap-2 font-serif text-lg text-ink">
                    <span className="link-editorial">{c.profiles.viewLink}</span>
                    <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Author / verification block */}
        <div className="container-wide mt-16 pt-10 border-t border-rule">
          <div className="author-block max-w-[60ch]">
            <p className="text-[14px] text-ink-soft">
              Verified by <strong>UeCampus Accreditation Team</strong> —{" "}
              Last reviewed: September 2025
            </p>
            <Link
              to="/contact-us"
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-plum hover:underline"
            >
              Contact our Partnerships Office
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

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
            {c.cta.link && (
              <Link to="/programmes" className="group inline-flex items-center gap-3 bg-white text-aubergine px-7 py-4 text-[13px] font-medium transition-snap hover:bg-bloom">
                {c.cta.link}
                <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Partners;
