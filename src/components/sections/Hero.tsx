import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import { useContent } from "@/cms/useContent";
import heroImg     from "@/assets/hero-students.jpg";
import aboutImg    from "@/assets/about-hero.jpg";
import libraryImg  from "@/assets/library-bg.jpg";
import sorina from "@/assets/sorina.png";
import jacek from "@/assets/jacek.png";
import jose from "@/assets/jose.png";
import liliana from "@/assets/liliana.png";
import maurice from "@/assets/maurice.png";

/**
 * Pictures for the photo stack, picked by the `image` key of each item in
 * home.hero.photos (src/cms/defaults/home.ts). The captions and kickers are
 * CMS copy; the files stay here. An unknown key falls back to the campus
 * photo so a mistyped key never breaks the stack.
 */
const HERO_IMAGES: Record<string, string> = {
  "hero-students": heroImg,
  sorina,
  jacek,
  jose,
  liliana,
  maurice,
  "about-hero": aboutImg,
  library: libraryImg,
};
const heroImage = (key: string) => HERO_IMAGES[key.trim().toLowerCase()] ?? heroImg;

const pad2 = (n: number) => String(n).padStart(2, "0");

const STACK = 3;          // visible cards in the stack
const SWIPE_THRESHOLD = 80;
const EXIT_MS = 380;

// All copy comes from the CMS "home" entry (hero section). Empty strings and
// empty lists render nothing, which is how an admin removes a piece of text.
const Hero = () => {
  const { hero } = useContent("home");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [index, setIndex]       = useState(0);
  const [drag, setDrag]         = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exitDir, setExitDir]   = useState<0 | 1 | -1>(0);
  const startX     = useRef<number | null>(null);
  const animating  = useRef(false);

  const photos = hero.photos;
  const total = photos.length;
  const current = total ? index % total : 0;

  const advance = (dir: 1 | -1) => {
    if (animating.current || total === 0) return;
    animating.current = true;
    setExitDir(dir);
    setDragging(false);
    window.setTimeout(() => {
      setIndex((i) => {
        const len = total;
        return dir === -1 ? (i + 1) % len : (i - 1 + len) % len;
      });
      setExitDir(0);
      setDrag(0);
      animating.current = false;
    }, EXIT_MS);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (animating.current) return;
    startX.current = e.clientX;
    setDragging(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    setDrag(e.clientX - startX.current);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const distance = e.clientX - startX.current;
    startX.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      advance(distance > 0 ? 1 : -1);
    } else {
      setDragging(false);
      setDrag(0);
    }
  };

  // Never show more cards than there are photos — with fewer than STACK
  // photos the same one would otherwise appear twice in the stack.
  const cards = Array.from({ length: Math.min(STACK, total) }, (_, stackPos) => {
    const photoIndex = (current + stackPos) % total;
    return { stackPos, photoIndex, photo: photos[photoIndex] };
  });

  return (
    <section className="relative bg-hero-purple pt-14 md:pt-20 pb-20 md:pb-24 overflow-hidden">
      <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
        {/* Headline column */}
        <div className="lg:col-span-7">
          <h1 className="font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.98] tracking-[-0.03em] text-ink">
            {hero.title}
            <br />
            <span className="italic-serif text-bloom">{hero.titleAccent}</span>
            <span className="text-ember">.</span>
          </h1>

          {hero.intro && (
            <div className="mt-10 max-w-xl">
              <p className="font-serif text-[20px] md:text-[22px] leading-[1.55] text-ink-soft">
                {hero.intro}
              </p>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchTerm.trim();
              navigate(q ? `/programmes?q=${encodeURIComponent(q)}` : "/programmes");
            }}
            className="mt-10 flex items-center gap-4 max-w-xl border-b border-ink pb-3"
          >
            <Search className="h-4 w-4 text-ink-mute shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={hero.searchPlaceholder}
              className="flex-1 bg-transparent text-[16px] text-ink placeholder:text-ink-mute outline-none border-0 py-1"
            />
            {hero.searchButton && (
              <button
                type="submit"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink hover:text-plum transition-snap"
              >
                {hero.searchButton}
              </button>
            )}
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            {hero.primaryLink && (
              <Link to="/programmes" className="group inline-flex items-center gap-2 font-serif text-lg text-ink">
                <span className="link-editorial">{hero.primaryLink}</span>
                <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
            {hero.secondaryLink && (
              <Link to="/contact-us" className="group inline-flex items-center gap-2 font-serif text-lg text-ink">
                <span className="link-editorial">{hero.secondaryLink}</span>
                <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Photo column - swipeable card stack */}
        {total > 0 && (
          <div className="lg:col-span-5">
            <div className="relative">
              <div
                className="relative aspect-[4/5] select-none touch-pan-y cursor-grab active:cursor-grabbing"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              >
                {/* Render furthest-back first so the front card sits on top */}
                {[...cards].reverse().map(({ stackPos, photoIndex, photo }) => {
                  const isFront   = stackPos === 0;
                  const zIndex    = STACK - stackPos;

                  // Resting positions - back cards fan to the left and rotate, so
                  // their right edge / top corner peek out from behind the front.
                  // Alternating direction (negative then positive) gives a real
                  // "stack of polaroids" feel rather than a uniform offset.
                  const baseOffsetX = stackPos === 1 ? -28 : stackPos === 2 ?  22 : 0;
                  const baseOffsetY = stackPos === 1 ?  14 : stackPos === 2 ?  28 : 0;
                  const baseRot     = stackPos === 1 ?  -5 : stackPos === 2 ?   6 : 0;
                  const baseScale   = 1 - stackPos * 0.02;
                  const baseOpacity = 1 - stackPos * 0.06;

                  // Back cards drift toward the front as the user drags
                  const dragAbs = Math.min(Math.abs(drag) / 180, 1);
                  const offsetX = baseOffsetX * (1 - dragAbs * 0.8);
                  const offsetY = baseOffsetY * (1 - dragAbs * 0.8);
                  const rotation= baseRot     * (1 - dragAbs * 0.8);
                  const scale   = baseScale   + (1 - baseScale)   * dragAbs * 0.9;
                  const opacity = baseOpacity + (1 - baseOpacity) * dragAbs * 0.9;

                  let transform: string;
                  if (isFront && exitDir) {
                    transform = `translate(${exitDir * 130}%, 0) rotate(${exitDir * 22}deg)`;
                  } else if (isFront) {
                    transform = `translate(${drag}px, 0) rotate(${drag * 0.04}deg)`;
                  } else {
                    transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`;
                  }

                  const cardOpacity = isFront && exitDir ? 0 : isFront ? 1 : opacity;
                  const useTransition = isFront ? (!dragging || !!exitDir) : true;

                  return (
                    <figure
                      key={photoIndex}
                      className={`absolute inset-0 overflow-hidden bg-aubergine ${isFront ? "" : "pointer-events-none"}`}
                      style={{
                        transform,
                        opacity: cardOpacity,
                        zIndex,
                        transition: useTransition
                          ? "transform 0.36s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.36s ease"
                          : "none",
                        transformOrigin: "center center",
                        willChange: "transform",
                        boxShadow: "0 30px 60px -28px hsl(272 64% 14% / 0.55)",
                      }}
                    >
                      <img
                        src={heroImage(photo.image)}
                        alt=""
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-90 pointer-events-none"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(180deg, hsl(var(--aubergine) / 0.15), hsl(var(--aubergine) / 0.7))",
                        }}
                      />
                      {isFront && (
                        <>
                          {/* Corner markers */}
                          <div className="absolute top-5 left-5 right-5 flex items-start justify-between text-white/85 pointer-events-none">
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                              {hero.plateLabel ? `${hero.plateLabel} ` : ""}{pad2(current + 1)}
                            </span>
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                              {pad2(current + 1)} / {pad2(total)}
                            </span>
                          </div>
                          {/* Caption */}
                          {(photo.caption || photo.kicker) && (
                            <figcaption className="absolute bottom-6 left-6 right-6 pointer-events-none">
                              {photo.caption && (
                                <p className="font-serif text-[15px] leading-snug text-white">
                                  &ldquo;{photo.caption}&rdquo;
                                </p>
                              )}
                              {photo.kicker && (
                                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/70 mt-3">
                                  {photo.kicker}
                                </p>
                              )}
                            </figcaption>
                          )}
                        </>
                      )}
                    </figure>
                  );
                })}
              </div>

              {/* Drag hint */}
              <div className="mt-4 flex items-center justify-center gap-4 select-none">
                <button
                  onClick={() => advance(1)}
                  aria-label="Previous photo"
                  className="h-11 w-11 rounded-full bg-aubergine text-white shadow-card-soft hover:bg-plum hover:scale-105 transition-smooth flex items-center justify-center"
                >
                  <ArrowUpRight className="h-5 w-5 -rotate-[225deg]" />
                </button>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute">
                  {hero.dragHint ? `${hero.dragHint} · ` : ""}{pad2(current + 1)} / {pad2(total)}
                </p>
                <button
                  onClick={() => advance(-1)}
                  aria-label="Next photo"
                  className="h-11 w-11 rounded-full bg-aubergine text-white shadow-card-soft hover:bg-plum hover:scale-105 transition-smooth flex items-center justify-center"
                >
                  <ArrowUpRight className="h-5 w-5 rotate-45" />
                </button>
              </div>

              {/* Outboard meta */}
              {hero.volumeLabel && (
                <div className="hidden lg:flex absolute -left-12 top-0 flex-col gap-4 text-ink-mute -rotate-90 origin-top-left translate-y-32 pointer-events-none">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] whitespace-nowrap">
                    {hero.volumeLabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ticker / facts row */}
      {hero.stats.length > 0 && (
        <div className="container-wide mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-rule pt-10">
          {hero.stats.map((s, i) => (
            <div key={`${s.label}-${i}`} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <p className="font-serif text-display-sm text-ink leading-none">{s.num}</p>
              {s.label && (
                <p className="mt-2 text-[13px] text-ink-mute leading-snug max-w-[18ch]">
                  {s.label}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
