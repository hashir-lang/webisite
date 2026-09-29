import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Eyebrow from "@/components/editorial/Eyebrow";
import { useContent } from "@/cms/useContent";
import sorina from "@/assets/sorina.png";
import jacek from "@/assets/jacek.png";
import jose from "@/assets/jose.png";
import liliana from "@/assets/liliana.png";
import maurice from "@/assets/maurice.png";

/**
 * Portraits, picked by the `image` key of each item in home.testimonials.items
 * (src/cms/defaults/home.ts). The words are CMS copy; the files stay here. An
 * unknown key shows the card without a portrait rather than someone else's.
 */
const PORTRAITS: Record<string, string> = { sorina, jacek, jose, liliana, maurice };
const portrait = (key: string): string | undefined => PORTRAITS[key.trim().toLowerCase()];

const pad2 = (n: number) => String(n).padStart(2, "0");

// All copy comes from the CMS "home" entry (testimonials section). Empty
// strings render nothing; an empty list hides the section.
const Testimonials = () => {
  const { testimonials } = useContent("home");
  const [i, setI] = useState(0);
  const total = testimonials.items.length;
  if (total === 0) return null;

  const current = i % total;
  const t = testimonials.items[current];
  const img = portrait(t.image);

  return (
    <section className="bg-paper-soft py-24 md:py-32 border-t border-rule">
      <div className="container-wide">
        {/* Section header */}
        <div className="max-w-2xl mb-12 md:mb-16">
          {testimonials.eyebrow && <Eyebrow>{testimonials.eyebrow}</Eyebrow>}
          <h2 className="mt-5 font-serif text-display-sm text-ink leading-[1.1]">
            {testimonials.title}<span className="text-ember">.</span>
          </h2>
        </div>

        {/* Horizontal testimonial card */}
        <article className="bg-white rounded-3xl overflow-hidden ring-1 ring-rule shadow-[0_30px_70px_-40px_rgba(40,16,80,0.25)] grid md:grid-cols-12">
          {/* Portrait */}
          <figure className="md:col-span-5 relative aspect-[4/5] md:aspect-auto md:min-h-[580px] bg-aubergine grain overflow-hidden">
            {img && (
              <img
                src={img}
                alt={t.name}
                className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-95"
              />
            )}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 55%, hsl(var(--aubergine) / 0.55))",
              }}
            />
            <span className="absolute top-5 left-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/90">
              {testimonials.plateLabel ? `${testimonials.plateLabel} ` : ""}{pad2(current + 1)}
            </span>
            <figcaption className="absolute bottom-5 left-5 right-5 text-white">
              <p className="font-serif text-[20px] leading-tight">{t.name}</p>
              {t.place && <p className="eyebrow text-white/70 mt-1">{t.place}</p>}
            </figcaption>
          </figure>

          {/* Quote */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between">
            <p className="font-serif text-[20px] md:text-[24px] leading-[1.45] text-ink">
              <span className="italic-serif text-plum text-[1.4em] leading-none mr-1">“</span>
              {t.quote.replace(/^[“"]?|[”"]?$/g, "")}
              <span className="italic-serif text-plum text-[1.4em] leading-none ml-1">”</span>
            </p>

            <div className="mt-10 flex items-end justify-between gap-6 border-t border-rule pt-5">
              <div>
                {t.programme && <p className="eyebrow eyebrow-plum">{t.programme}</p>}
                <p className="mt-1 font-serif text-[16px] text-ink-soft">
                  {t.place ? `${t.name}, ${t.place}` : t.name}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="pagination-pill">
                  {pad2(current + 1)} / {pad2(total)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setI((p) => (p - 1 + total) % total)}
                    aria-label="Previous testimonial"
                    className="h-9 w-9 rounded-full border border-rule flex items-center justify-center transition-snap hover:bg-ink hover:text-paper hover:border-ink"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 -rotate-[225deg]" />
                  </button>
                  <button
                    onClick={() => setI((p) => (p + 1) % total)}
                    aria-label="Next testimonial"
                    className="h-9 w-9 rounded-full border border-rule flex items-center justify-center transition-snap hover:bg-ink hover:text-paper hover:border-ink"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 rotate-45" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Testimonials;
