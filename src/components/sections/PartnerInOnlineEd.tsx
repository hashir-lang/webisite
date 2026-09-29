import Eyebrow from "@/components/editorial/Eyebrow";
import { useContent } from "@/cms/useContent";
import globe from "@/assets/globe-v2.png";

// All copy comes from the CMS "home" entry (partnerInOnlineEd section). Empty
// strings and an empty stats list render nothing.
const PartnerInOnlineEd = () => {
  const { partnerInOnlineEd: c } = useContent("home");
  return (
    <section className="bg-paper py-24 md:py-32 border-t border-rule">
      <div className="container-wide grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Globe - left */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-square max-w-[480px] mx-auto">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(closest-side, hsl(var(--plum-paper)), transparent 70%)",
              }}
            />
            <img
              src={globe}
              alt={c.imageAlt}
              loading="lazy"
              className="relative w-full h-full object-contain"
            />
            {c.figureLabel && (
              <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">
                {c.figureLabel}
              </span>
            )}
          </div>
        </div>

        {/* Essay - right */}
        <div className="lg:col-span-7">
          {c.eyebrow && <Eyebrow>{c.eyebrow}</Eyebrow>}
          <h2 className="mt-5 font-serif text-display text-ink">
            {c.title}
            <br />
            <span className="italic-serif text-plum">{c.titleAccent}</span>
            <span className="text-ember">.</span>
          </h2>

          {c.body && (
            <p className="mt-10 font-serif text-[19px] md:text-[20px] leading-[1.65] text-ink-soft max-w-[58ch]">
              {c.body}
            </p>
          )}

          {c.stats.length > 0 && (
            <ul className="mt-12 grid grid-cols-3 border-t border-rule">
              {c.stats.map((s, i) => (
                <li
                  key={`${s.label}-${i}`}
                  className={`pt-6 ${i > 0 ? "border-l border-rule pl-6" : ""}`}
                >
                  <p className="font-serif text-display-sm text-ink leading-none">{s.num}</p>
                  {s.label && (
                    <p className="mt-2 text-[12px] text-ink-mute uppercase tracking-[0.12em]">
                      {s.label}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnerInOnlineEd;
