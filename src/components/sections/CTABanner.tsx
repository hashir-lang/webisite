import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Eyebrow from "@/components/editorial/Eyebrow";
import { useContent } from "@/cms/useContent";

// All copy comes from the CMS "home" entry (cta section). Empty strings
// render nothing, which is how an admin removes a piece of text.
const CTABanner = () => {
  const { cta } = useContent("home");
  return (
    <section className="bg-paper-soft border-t border-rule">
      <div className="container-wide py-20 md:py-28 grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
        <div className="lg:col-span-7">
          {cta.eyebrow && <Eyebrow>{cta.eyebrow}</Eyebrow>}
          <h2 className="mt-5 font-serif text-display text-ink">
            {cta.title}
            <br />
            <span className="italic-serif text-plum">{cta.titleAccent}</span>
            <span className="text-ember">.</span>
          </h2>
          {cta.body && (
            <p className="mt-8 font-serif text-[19px] leading-[1.6] text-ink-soft max-w-[58ch]">
              {cta.body}
            </p>
          )}
        </div>

        <div className="lg:col-span-5 lg:col-start-8 flex flex-col gap-4 lg:items-end">
          {cta.primaryLink && (
            <Link
              to="/contact-us"
              className="group inline-flex items-center gap-3 bg-aubergine text-white px-8 py-4 text-[14px] font-medium transition-smooth hover:bg-plum"
            >
              {cta.primaryLink}
              <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
          {cta.secondaryLink && (
            <Link
              to="/scholarship"
              className="group inline-flex items-center gap-2 font-serif text-lg text-ink"
            >
              <span className="link-editorial">{cta.secondaryLink}</span>
              <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
          {cta.caption && (
            <p className="mt-2 eyebrow text-ink-mute">
              {cta.caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
