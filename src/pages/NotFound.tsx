import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

// All copy comes from the CMS "notFound" entry (src/cms/defaults/notFound.ts
// holds the defaults; /admin/pages/notFound edits them). Empty strings and
// empty lists render nothing, which is how an admin removes a piece of text.
const NotFound = () => {
  const c = useContent("notFound");
  const location = useLocation();

  useEffect(() => {
    console.warn("404, non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageLayout hideCta>
      <Seo
        title={PAGE_META.notFound.title}
        description={PAGE_META.notFound.description}
        canonicalPath={location.pathname}
        noindex
      />
      <section className="bg-paper min-h-[70vh] flex items-center py-24 md:py-32 border-b border-rule">
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            {c.hero.eyebrow && <p className="eyebrow">{c.hero.eyebrow}</p>}
            <h1 className="mt-6 font-serif text-display-xl text-ink leading-[0.95]">
              {c.hero.title}
              <br />
              <span className="italic-serif text-plum">{c.hero.titleAccent}</span>
              <span className="text-ember">.</span>
            </h1>
            {(c.hero.bodyBefore || c.hero.bodyAfter) && (
              <p className="mt-10 font-serif text-[20px] leading-[1.55] text-ink-soft max-w-[52ch]">
                {c.hero.bodyBefore}{" "}
                <code className="font-mono text-[15px] text-ink bg-paper-deep px-1.5 py-0.5">
                  {location.pathname}
                </code>{" "}
                {c.hero.bodyAfter}
              </p>
            )}
          </div>

          <div className="lg:col-span-5">
            {c.links.items.length > 0 && (
              <ul className="border-y border-rule divide-y divide-rule">
                {c.links.items.map((l, i) => (
                  <li key={`${l.to}-${i}`}>
                    <Link to={l.to} className="group flex items-center justify-between py-5">
                      <span className="flex items-baseline gap-5">
                        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-[22px] text-ink transition-snap group-hover:text-plum">
                          {l.label}
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-ink-mute transition-snap group-hover:text-plum group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {c.links.returnLabel && (
              <Link
                to="/"
                className="mt-10 group inline-flex items-center gap-2 font-serif text-lg text-ink"
              >
                <ArrowLeft className="h-4 w-4 transition-snap group-hover:-translate-x-0.5" />
                <span className="link-editorial">{c.links.returnLabel}</span>
              </Link>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFound;
