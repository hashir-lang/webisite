import { Link, useLocation } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight, Check } from "lucide-react";
import Confetti from "@/components/Confetti";
import logo from "@/assets/uecampus-logo.png";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

// All copy comes from the CMS "thankYou" entry (src/cms/defaults/thankYou.ts
// holds the defaults; /admin/pages/thankYou edits them). Empty strings and
// empty lists render nothing, which is how an admin removes a piece of text.
const ThankYou = () => {
  const c = useContent("thankYou");
  const location = useLocation();
  const firstName = (location.state as { firstName?: string } | null)?.firstName;
  // "Thank you, Amira" when the form passed a name along; just "Thank you" otherwise.
  const heading = [c.hero.title, firstName].filter(Boolean).join(", ");

  return (
    <PageLayout hideCta>
      <Seo
        title={PAGE_META.thankYou.title}
        description={PAGE_META.thankYou.description}
        canonicalPath={PAGE_META.thankYou.path}
        noindex
      />
      <Confetti />
      <section className="bg-paper pt-10 md:pt-14 pb-12 md:pb-16 border-b border-rule">
        <div className="container-wide flex items-baseline justify-between pb-10 md:pb-14">
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <p className="eyebrow hidden md:block">{c.hero.eyebrowRight}</p>
        </div>
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <img
              src={logo}
              alt={c.hero.logoAlt}
              className="h-12 md:h-14 w-auto mb-8 animate-fade-up"
            />
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-aubergine text-white mb-7 animate-fade-up">
              <Check className="h-6 w-6" />
            </span>
            <h1 className="font-serif text-display-lg text-ink">
              {heading}
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

      <section className="bg-paper py-16 md:py-24">
        <div className="container-wide grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            {c.next.eyebrow && <Eyebrow>{c.next.eyebrow}</Eyebrow>}
          </div>
          <div className="lg:col-span-8">
            {c.next.items.length > 0 && (
              <ol className="divide-y divide-rule border-y border-rule">
                {c.next.items.map((s, i) => (
                  <li key={`${s.title}-${i}`} className="flex items-start gap-5 py-6">
                    <span className="mt-0.5 font-mono text-[12px] text-plum">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-serif text-[20px] text-ink leading-tight">{s.title}</span>
                      {s.desc && <span className="mt-1 block text-[14px] text-ink-mute">{s.desc}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {c.next.homeLabel && (
                <Link
                  to="/"
                  className="group inline-flex items-center gap-3 bg-aubergine text-white px-7 py-4 text-[13px] font-medium transition-smooth hover:bg-plum"
                >
                  {c.next.homeLabel}
                  <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
              {c.next.programmesLabel && (
                <Link
                  to="/programmes"
                  className="text-[13px] font-medium text-ink hover:text-plum transition-snap"
                >
                  {c.next.programmesLabel}
                </Link>
              )}
            </div>

            {(c.next.undoBefore || c.next.undoEmail || c.next.undoAfter) && (
              <p className="mt-8 text-[12px] text-ink-mute">
                {c.next.undoBefore}{" "}
                {c.next.undoEmail && (
                  <a href={`mailto:${c.next.undoEmail}`} className="text-plum hover:underline">
                    {c.next.undoEmail}
                  </a>
                )}{" "}
                {c.next.undoAfter}
              </p>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ThankYou;
