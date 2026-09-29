import { Link } from "react-router-dom";
import Eyebrow from "@/components/editorial/Eyebrow";
import { useContent } from "@/cms/useContent";
import eie from "@/assets/partner-eie-exact.jpg";
import ppa from "@/assets/partner-ppa-exact-cropped.png";
import walsh from "@/assets/partner-walsh.png";
import qualifi from "@/assets/partner-qualifi-exact.png";
import eduqual from "@/assets/partner-eduqual-exact.png";

/**
 * Logo and partner page for each `id` used by home.marquee.items
 * (src/cms/defaults/home.ts). Names, places and alt text are CMS copy; the
 * files and routes stay here. An item with an unknown id still shows its
 * caption (without a logo) and links to the partners overview.
 */
const PARTNER_ASSETS: Record<string, { src: string; to: string; w: number; h: number }> = {
  eie:     { src: eie,     to: "/program/european-business-school-eie", w: 470, h: 172 },
  ppa:     { src: ppa,     to: "/partners/ppa-business-school",          w: 180, h: 180 },
  walsh:   { src: walsh,   to: "/partners/walsh-college",                w: 512, h: 512 },
  qualifi: { src: qualifi, to: "/partners/qualifi",                      w: 768, h: 224 },
  eduqual: { src: eduqual, to: "/partners/eduqual",                      w: 174, h: 100 },
};
const PARTNERS_OVERVIEW = "/accreditation-and-partners";

// Shown on the home, about and partners pages; all read the same "home" copy.
// An empty list hides the section.
const PartnersMarquee = () => {
  const { marquee } = useContent("home");
  if (marquee.items.length === 0) return null;

  return (
    <section className="bg-paper border-t border-rule py-16 md:py-20 overflow-hidden">
      {marquee.eyebrow && (
        <div className="container-wide">
          <div className="flex items-baseline justify-between mb-10 md:mb-12">
            <Eyebrow>{marquee.eyebrow}</Eyebrow>
          </div>
        </div>
      )}

      {/* Infinite editorial ticker */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
          style={{ background: "linear-gradient(90deg, hsl(var(--paper)), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
          style={{ background: "linear-gradient(-90deg, hsl(var(--paper)), transparent)" }}
        />

        <div className="flex w-max animate-marquee gap-16 md:gap-24 items-center">
          {[...marquee.items, ...marquee.items].map((p, i) => {
            const asset = PARTNER_ASSETS[p.id.trim().toLowerCase()];
            return (
              <Link
                to={asset?.to ?? PARTNERS_OVERVIEW}
                key={`${p.name}-${i}`}
                aria-label={`${p.name} — partner details`}
                className="flex flex-col items-center gap-3 shrink-0 group"
              >
                <div className="h-20 md:h-24 flex items-center">
                  {asset && (
                    <img
                      src={asset.src}
                      alt={p.imageAlt}
                      loading="lazy"
                      width={asset.w}
                      height={asset.h}
                      className="max-h-full w-auto object-contain max-w-[200px] md:max-w-[240px] grayscale opacity-80 transition-smooth group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  )}
                </div>
                <figcaption className="text-center">
                  <p className="font-serif text-[14px] text-ink leading-tight group-hover:text-plum transition-snap">{p.name}</p>
                  {p.place && <p className="eyebrow text-ink-mute mt-1">{p.place}</p>}
                </figcaption>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
