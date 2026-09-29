import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { useContent } from "@/cms/useContent";
import { telHref } from "./Header";

/**
 * Icon for a social profile, picked by its name. Anything unrecognised gets a
 * generic link icon, so an admin can add a new network without a code change.
 * The profile list itself lives in src/cms/defaults/site.ts (footer.socials)
 * and is mirrored by hand in blog/_core.php and siteMeta's SOCIAL_PROFILES.
 */
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  x: Twitter,
  twitter: Twitter,
  youtube: Youtube,
};
const socialIcon = (label: string): LucideIcon => SOCIAL_ICONS[label.trim().toLowerCase()] ?? ExternalLink;

type FooterLink = { label: string; to: string; hard: boolean };

// Every string here comes from the CMS "site" entry (src/cms/defaults/site.ts),
// editable at /admin/pages/site.
const Footer = () => {
  const { footer, contact } = useContent("site");
  return (
    <footer className="bg-aubergine text-white relative overflow-hidden">
      {/* Subtle radial halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[60rem] rounded-full"
        style={{ background: "radial-gradient(closest-side, hsl(var(--orchid) / 0.25), transparent 70%)" }}
      />

      {/* Footer video (70% width) with intro text alongside. Autoplays muted
          (browser requirement); native controls let visitors pause / unmute.
          The poster paints immediately so the slot is never an empty black box
          while the video streams. footer.mp4 must keep its faststart layout
          (moov atom first) or playback stalls until the whole file downloads —
          re-encode with `-movflags +faststart` if it is ever replaced. */}
      <div className="relative container-wide pt-16 md:pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <video
            src="/footer.mp4"
            poster="/footer-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            controls
            preload="metadata"
            className="w-full lg:w-[70%] h-auto rounded-lg border border-white/15 aspect-video bg-aubergine"
          />
          <div className="lg:flex-1">
            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-snug text-white">
              {footer.videoHeadline}
              {footer.videoHeadlineAccent && (
                <span className="italic-serif text-bloom"> {footer.videoHeadlineAccent}</span>
              )}
              <span className="text-ember">.</span>
            </h3>
          </div>
        </div>
      </div>

      <div className="relative container-wide pt-20 md:pt-28 pb-12">
        {/* Big editorial closer */}
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-16 md:mb-24">
          <div className="lg:col-span-8">
            {footer.closerEyebrow && <p className="eyebrow text-white/60 mb-6">{footer.closerEyebrow}</p>}
            <h2 className="font-serif text-display leading-[1.02] text-white">
              {footer.closerTitle}
              <br />
              <span className="italic-serif text-bloom">{footer.closerAccent}</span>
              <span className="text-ember">.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right flex flex-col gap-4 lg:items-end">
            <Link
              to="/enquire-now"
              className="group inline-flex items-center gap-3 bg-white text-aubergine px-7 py-4 text-[13px] font-medium transition-smooth hover:bg-bloom"
            >
              {footer.applyLabel}
              <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            {footer.speakLabel && (
              <Link
                to="/contact-us"
                className="group inline-flex items-center gap-3 text-white font-serif text-lg"
              >
                <span className="link-editorial pb-1">{footer.speakLabel}</span>
                <span className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center transition-smooth group-hover:bg-white group-hover:text-aubergine">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="h-px bg-white/15 mb-14" />

        {/* Colophon */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          {/* Wordmark + blurb */}
          <div className="col-span-2 md:col-span-4">
            <Link to="/" className="font-serif text-3xl text-white">
              Ue<span className="italic-serif">Campus</span>
            </Link>
            {footer.blurb && (
              <p className="mt-5 text-[14px] leading-relaxed text-white/65 max-w-xs">{footer.blurb}</p>
            )}
          </div>

          {/* Three columns */}
          <FooterCol heading={footer.platformHeading} items={footer.platformLinks} />
          <FooterCol heading={footer.programmesHeading} items={footer.programmeLinks} />

          {/* Contact column */}
          <div className="col-span-2 md:col-span-2">
            <h4 className="eyebrow text-white/60 mb-5">{footer.infoHeading}</h4>
            <ul className="space-y-3 text-[14px] text-white/80">
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="link-editorial hover:text-white">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a href={telHref(contact.phone)} className="hover:text-white transition-snap">
                    {contact.phone}
                  </a>
                </li>
              )}
              {footer.addressLines.length > 0 && (
                <li className="text-white/55 text-[13px] leading-relaxed pt-2">
                  {footer.addressLines.map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </li>
              )}
              {footer.socials.length > 0 && (
                <li className="pt-3">
                  <ul className="flex items-center gap-3" aria-label="UeCampus on social media">
                    {footer.socials.map(({ label, href }) => {
                      const Icon = socialIcon(label);
                      return (
                        <li key={label + href}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`UeCampus on ${label}`}
                            title={label}
                            className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center text-white/80 transition-smooth hover:bg-white hover:text-aubergine"
                          >
                            <Icon className="h-4 w-4" strokeWidth={1.75} />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-20 pt-8 border-t border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
            {/* Only the © symbol is the (discreet) admin login link — a
                client-side route, so it stays on the current host. */}
            <Link
              to="/admin/login"
              title="Admin · Enquiry leads"
              aria-label="Admin login"
              className="hover:text-white transition-snap"
            >
              ©
            </Link>{" "}
            {new Date().getFullYear()} {footer.copyright}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legalLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.to}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45 hover:text-white transition-snap"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ heading, items }: { heading: string; items: FooterLink[] }) => (
  <div className="col-span-1 md:col-span-3">
    <h4 className="eyebrow text-white/60 mb-5">{heading}</h4>
    <ul className="space-y-3 text-[14px] text-white/80">
      {items.map((i) => (
        <li key={i.label + i.to}>
          {i.hard ? (
            // Full page navigation — the target is served outside the SPA
            // (e.g. the PHP-rendered /blog). A client-side <Link> would 404.
            <a href={i.to} className="hover:text-white transition-snap link-editorial">
              {i.label}
            </a>
          ) : (
            <Link to={i.to} className="hover:text-white transition-snap link-editorial">
              {i.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
