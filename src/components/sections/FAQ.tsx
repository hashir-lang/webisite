import { useState } from "react";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useContent } from "@/cms/useContent";

// All copy comes from the CMS "home" entry (faq section). Each item has a
// plain `answer`, an optional numbered list of `steps` and an optional
// closing `note`; whichever are blank are simply not rendered.
const FAQ = () => {
  const { faq } = useContent("home");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-hero-purple py-24 md:py-32">
      <div className="container-wide grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Sticky title column */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <h2 className="font-serif text-display text-ink">
            {faq.title}
            <br />
            <span className="italic-serif text-plum">{faq.titleAccent}</span>
            <span className="text-ember">.</span>
          </h2>
          {faq.intro && (
            <p className="mt-8 text-[15px] leading-relaxed text-ink-soft max-w-xs">
              {faq.intro}
            </p>
          )}
          {faq.allLink && (
            <Link
              to="/faqs"
              className="mt-8 inline-flex items-center gap-2 font-serif text-lg text-ink group"
            >
              <span className="link-editorial">{faq.allLink}</span>
              <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
        </div>

        {/* Accordion */}
        {faq.items.length > 0 && (
          <div className="lg:col-span-8 divide-y divide-white/10 border-y border-white/10">
            {faq.items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={`${f.question}-${i}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start gap-6 md:gap-10 py-7 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-mute pt-2 w-10 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-serif text-[22px] md:text-[26px] leading-[1.18] text-ink transition-snap group-hover:text-plum">
                      {f.question}
                    </span>
                    <span className="shrink-0 mt-1.5 h-9 w-9 rounded-full border border-white/20 flex items-center justify-center transition-snap group-hover:border-white group-hover:bg-white/10">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pl-[3.5rem] md:pl-20 pr-2 pb-8 -mt-3">
                      <div className="font-serif text-[17px] leading-[1.7] text-ink-soft max-w-[58ch]">
                        {f.answer}
                        {f.steps.length > 0 && (
                          <ol className={`list-decimal pl-5 space-y-2${f.answer ? " mt-4" : ""}`}>
                            {f.steps.map((step, j) => (
                              <li key={j}>{step}</li>
                            ))}
                          </ol>
                        )}
                        {f.note && <p className="mt-4">{f.note}</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;
