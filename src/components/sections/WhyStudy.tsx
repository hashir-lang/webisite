import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, ArrowUpRight } from "lucide-react";
import { useContent } from "@/cms/useContent";

// All copy comes from the CMS "home" entry (why section). Empty strings render
// nothing. The YouTube film itself is fixed here; only its title/captions are copy.
const WhyStudy = () => {
  const { why } = useContent("home");
  const [playing, setPlaying] = useState(false);
  return (
  <section className="bg-hero-purple py-24 md:py-32 relative overflow-hidden">
    {/* Soft accent halo */}
    <div
      aria-hidden
      className="pointer-events-none absolute -top-40 -right-40 h-[40rem] w-[40rem] rounded-full"
      style={{ background: "radial-gradient(closest-side, hsl(var(--bloom) / 0.18), transparent 70%)" }}
    />

    <div className="relative container-wide grid lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Left: opinion essay */}
      <div className="lg:col-span-7">
        <h2 className="font-serif text-display text-ink leading-[1.02]">
          {why.title}
          <br />
          <span className="italic-serif text-plum">{why.titleAccent}</span>
          {why.titleSuffix && <span className="text-ember">{why.titleSuffix}</span>}
        </h2>

        {why.body && (
          <p className="mt-10 font-serif text-[19px] md:text-[20px] leading-[1.65] text-ink-soft drop-cap max-w-[58ch]">
            {why.body}
          </p>
        )}

        <div className="mt-12 flex items-center gap-8">
          {why.aboutLink && (
            <Link
              to="/about-us"
              className="group inline-flex items-center gap-2 font-serif text-lg text-ink"
            >
              <span className="link-editorial">{why.aboutLink}</span>
              <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          )}
          {why.note && (
            <>
              <span className="hidden md:block h-px w-16 bg-rule" aria-hidden />
              <p className="eyebrow text-ink-mute hidden md:block">{why.note}</p>
            </>
          )}
        </div>
      </div>

      {/* Right: pull-quote + video */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        {(why.quoteEyebrow || why.quote || why.quoteCaption) && (
          <blockquote className="bg-white rounded-2xl ring-1 ring-white/15 p-8 md:p-10">
            {why.quoteEyebrow && <p className="eyebrow eyebrow-plum">{why.quoteEyebrow}</p>}
            {why.quote && (
              <p className="mt-4 font-serif text-[26px] md:text-[28px] leading-[1.2] text-ink">
                <span className="italic-serif text-plum">&ldquo;</span>
                {why.quote}
                <span className="italic-serif text-plum">&rdquo;</span>
              </p>
            )}
            {why.quoteCaption && (
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute">
                {why.quoteCaption}
              </p>
            )}
          </blockquote>
        )}

        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group bg-aubergine">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/_fjTVWZ2BiA?autoplay=1&rel=0"
              title={why.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play video"
              className="absolute inset-0 h-full w-full cursor-pointer"
            >
              <img
                src="https://img.youtube.com/vi/_fjTVWZ2BiA/maxresdefault.jpg"
                alt={why.videoTitle}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://img.youtube.com/vi/_fjTVWZ2BiA/hqdefault.jpg";
                }}
              />
              <span
                aria-hidden
                className="absolute inset-0 opacity-60"
                style={{ background: "linear-gradient(135deg, hsl(var(--plum)), hsl(var(--aubergine)))" }}
              />
              {(why.videoTitle || why.videoCaption) && (
                <span className="absolute inset-0 flex items-center justify-center text-center px-6">
                  <span>
                    {why.videoTitle && (
                      <span className="block font-serif italic-serif text-white text-2xl md:text-3xl leading-tight">
                        {why.videoTitle}
                      </span>
                    )}
                    {why.videoCaption && (
                      <span className="block eyebrow text-white/70 mt-3">{why.videoCaption}</span>
                    )}
                  </span>
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-white/95 flex items-center justify-center transition-smooth group-hover:scale-110">
                  <Play className="h-7 w-7 text-aubergine fill-aubergine ml-0.5" />
                </span>
              </span>
              {why.videoPlate && (
                <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                  {why.videoPlate}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  </section>
  );
};

export default WhyStudy;
