import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, ChevronRight, ChevronDown } from "lucide-react";
import logo from "@/assets/uecampus-logo.png";
import { useContent } from "@/cms/useContent";

/** "+44 7747 312812" -> "tel:+447747312812" */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

// All copy (contact strip, menu labels and links, button labels) comes from
// the CMS "site" entry — src/cms/defaults/site.ts holds the defaults and
// /admin/pages/site edits them.
const Header = () => {
  const site = useContent("site");
  const NAV = site.nav.items;
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-smooth ${
        scrolled
          ? "bg-paper/85 backdrop-blur-md border-b border-rule"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Slim utility strip - only visible at top, hides on scroll */}
      <div
        className={`hidden lg:block overflow-hidden transition-smooth ${
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
        }`}
      >
        <div className="container-wide flex items-center justify-end py-2 text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mute">
          <span className="flex items-center gap-5">
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="hover:text-plum transition-snap">
                {site.contact.email}
              </a>
            )}
            {site.contact.email && site.contact.phone && <span aria-hidden className="h-3 w-px bg-rule" />}
            {site.contact.phone && (
              <a href={telHref(site.contact.phone)} className="hover:text-plum transition-snap">
                {site.contact.phone}
              </a>
            )}
          </span>
        </div>
      </div>

      <div className="container-wide flex h-16 md:h-20 items-center justify-between gap-6">
        {/* Wordmark - serif type instead of logo image */}
        <Link
          to="/"
          className="flex items-center group"
          onClick={() => setOpen(false)}
          aria-label="UeCampus - Home"
        >
          <img
            src={logo}
            alt="UeCampus"
            className="h-11 md:h-14 w-auto transition-smooth group-hover:opacity-80"
          />
        </Link>

        {/* Desktop nav - small, refined, hover-mega-menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((item) => {
            if (item.children.length > 0) {
              const isOpen = openMenu === item.label;
              const isActive =
                location.pathname === item.to ||
                item.children.some((c) => c.to === location.pathname);
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    className={`inline-flex items-center gap-1 text-[13px] font-medium tracking-tight transition-snap ${
                      isActive || isOpen ? "text-plum" : "text-ink hover:text-plum"
                    }`}
                    aria-expanded={isOpen}
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-snap ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-5 w-[440px]">
                      <div className="bg-paper border border-rule shadow-card-soft rounded-sm p-2 animate-fade-up">
                        {item.children.map((c, ci) => {
                          const linkActive = location.pathname === c.to;
                          return (
                            <Link
                              key={c.to}
                              to={c.to}
                              className={`group flex items-start gap-4 px-5 py-4 transition-snap border-b border-rule last:border-b-0 ${
                                linkActive ? "bg-plum-paper" : "hover:bg-paper-soft"
                              }`}
                            >
                              <span className="font-mono text-[11px] tracking-[0.18em] text-ink-mute pt-1 w-10">
                                {String(ci + 1).padStart(2, "0")}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block font-serif text-[18px] text-ink leading-tight">
                                  {c.label}
                                </span>
                                {c.desc && (
                                  <span className="block text-[13px] text-ink-mute mt-1 leading-snug">
                                    {c.desc}
                                  </span>
                                )}
                              </span>
                              <ArrowUpRight className="h-4 w-4 text-ink-mute mt-1 transition-smooth group-hover:text-plum group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-[13px] font-medium tracking-tight transition-snap ${
                    isActive ? "text-plum" : "text-ink hover:text-plum"
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {site.header.portalLabel && (
            <a
              href={site.header.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-ink hover:text-plum transition-snap"
            >
              {site.header.portalLabel}
            </a>
          )}
          <Link
            to="/enquire-now"
            className="group inline-flex items-center gap-2 rounded-full bg-aubergine text-white px-5 py-2.5 text-[13px] font-medium transition-smooth hover:bg-plum"
          >
            {site.header.applyLabel}
            <ArrowUpRight className="h-3.5 w-3.5 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer - full-bleed, editorial */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-16 bg-paper z-40 overflow-y-auto animate-fade-in">
          <div className="container-wide py-8">
            <p className="eyebrow mb-6">{site.header.menuEyebrow}</p>
            <nav className="divide-y divide-rule border-y border-rule">
              {NAV.map((item, idx) => (
                <div key={item.label} className="py-2">
                  <Link
                    to={item.to}
                    className="flex items-center justify-between py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] tracking-[0.18em] text-ink-mute">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-2xl text-ink leading-none">
                        {item.label}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink-mute" />
                  </Link>
                  {item.children.length > 0 && (
                    <ul className="ml-12 mb-3 space-y-1">
                      {item.children.map((c) => (
                        <li key={c.to}>
                          <Link
                            to={c.to}
                            className="block text-[14px] text-ink-soft py-1.5 hover:text-plum transition-snap"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-10 flex flex-col gap-3">
              <Link
                to="/enquire-now"
                className="rounded-full bg-aubergine text-white px-6 py-3.5 text-[14px] font-medium text-center"
              >
                {site.header.applyLabelMobile}
              </Link>
              {site.header.portalLabel && (
                <a
                  href={site.header.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-rule px-6 py-3.5 text-[14px] font-medium text-ink text-center"
                >
                  {site.header.portalLabel}
                </a>
              )}
              <div className="pt-6 mt-2 border-t border-rule font-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute space-y-1">
                {site.contact.email && <p>{site.contact.email}</p>}
                {site.contact.phone && <p>{site.contact.phone}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
