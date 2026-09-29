import Eyebrow from "@/components/editorial/Eyebrow";
import { useContent } from "@/cms/useContent";

// The accent dot cycles ember → plum → ink down the row; it is a design
// choice tied to position, not copy, so it stays here.
const ACCENTS = ["bg-ember", "bg-plum", "bg-ink"];

// All copy comes from the CMS "home" entry (values section). Empty strings
// render nothing; an empty list hides the section.
const ValueCards = () => {
  const { values } = useContent("home");
  if (values.items.length === 0) return null;

  return (
    <section className="bg-paper py-20 md:py-32 border-t border-rule">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-20">
          <div className="lg:col-span-5">
            {values.eyebrow && <Eyebrow>{values.eyebrow}</Eyebrow>}
            <h2 className="mt-5 font-serif text-display text-ink">
              {values.title}
              <br />
              <span className="italic-serif text-plum">{values.titleAccent}</span>.
            </h2>
          </div>
          {values.intro && (
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="font-serif text-[20px] leading-[1.55] text-ink-soft pt-2 md:pt-12">
                {values.intro}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 border-t border-ink/20">
          {values.items.map((p, i) => (
            <article
              key={`${p.title}-${i}`}
              className={`reveal group relative border-b border-rule md:border-b-0 ${
                i > 0 ? "md:border-l md:border-rule" : ""
              } pt-10 md:pt-16 pb-12 md:px-10`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-baseline justify-between mb-12">
                <span className="marker-number text-[72px] md:text-[96px]">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${ACCENTS[i % ACCENTS.length]}`} />
              </div>
              <h3 className="font-serif text-[28px] md:text-[32px] leading-[1.1] text-ink mb-5 transition-snap group-hover:text-plum">
                {p.title}
              </h3>
              {p.desc && (
                <p className="text-[15px] leading-relaxed text-ink-soft max-w-[34ch]">
                  {p.desc}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueCards;
