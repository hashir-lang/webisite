import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight, Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type { Course } from "@/data/courses";
import { useCourses } from "@/cms/records";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

// Page wording comes from the CMS "programmes" entry
// (src/cms/defaults/programmes.ts holds the defaults; /admin/pages/programmes
// edits them). Empty strings render nothing. The catalogue and the filter
// options below are data from src/data/courses.ts, not content.

/** Fill a "{count}" placeholder in a CMS string. */
const withCount = (template: string, n: number) => template.replace("{count}", String(n));

type Programme = {
  slug: string;
  title: string;
  desc: string;
  img: string;
  categories: string[];
  university: string;
  level: string;
  intakes: string[];
};

const PROGRAMME_TYPES = [
  "Accounting", "Artificial Intelligence (AI)", "Business", "Cyber Security",
  "Data Analytics", "Education", "Entrepreneurship", "Finance",
  "Hospitality and Tourism", "Human Resource", "Information Technology",
  "Marketing", "Psychology", "Supply Chain",
];

const UNIVERSITIES = [
  "Walsh College Direct",
  "Walsh College",
  "PPA",
  "eie Business School",
  "Qualifi",
];

const LEVELS = ["Diploma", "Undergraduate", "Postgraduate", "Doctorate", "Top-Up"];

// Display labels for filter values that differ from the underlying course data.
const LEVEL_LABELS: Record<string, string> = {
  Doctorate: "Doctoral",
  "Top-Up": "Top-up",
};

// Awarding-body display labels (value -> label shown in the filter).
const UNI_LABELS: Record<string, string> = {
  "Walsh College Direct": "Walsh Direct",
  "Walsh College": "Walsh (Fast track)",
};

// Built inside the component from useCourses(), so programme-level CMS edits
// (titles, taglines) show in the listing too.
const toProgrammes = (list: Course[]): Programme[] =>
  list.map<Programme>((c) => ({
    slug: c.slug,
    title: c.title,
    desc: c.tagline,
    img: c.img,
    categories: c.categories,
    university: c.universityShort,
    level: c.level,
    intakes: c.intakes,
  }));

type FilterSectionProps = {
  title: string;
  options: string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
  defaultOpen?: boolean;
  labels?: Record<string, string>;
};

const FilterSection = ({ title, options, selected, onToggle, defaultOpen = false, labels }: FilterSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const count = options.filter((o) => selected.has(o)).length;
  return (
    <div className="border-b border-rule last:border-b-0 py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between pb-3"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="eyebrow text-ink">{title}</span>
          {count > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-plum text-white text-[10px] font-medium">
              {count}
            </span>
          )}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-ink-mute transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="space-y-2.5 pb-1">
          {options.map((t) => {
            const checked = selected.has(t);
            return (
              <li key={t}>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <span
                    className={`mt-0.5 h-4 w-4 border flex items-center justify-center shrink-0 transition-snap ${
                      checked
                        ? "bg-ink border-ink"
                        : "bg-paper border-rule group-hover:border-ink"
                    }`}
                  >
                    {checked && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => onToggle(t)}
                  />
                  <span className={`text-[14px] leading-tight ${checked ? "text-ink font-medium" : "text-ink-soft"}`}>
                    {labels?.[t] ?? t}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const Programmes = ({ titleOverride }: { titleOverride?: string }) => {
  const c = useContent("programmes");
  const allCourses = useCourses();
  const programmes = useMemo(() => toProgrammes(allCourses), [allCourses]);
  const [searchParams, setSearchParams] = useSearchParams();
  // Filters live in the URL so they survive navigating into a course and
  // pressing Back — the browser restores the previous /programmes?... URL.
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [selectedTypes,  setSelectedTypes]  = useState<Set<string>>(() => new Set(searchParams.getAll("type")));
  const [selectedUnis,   setSelectedUnis]   = useState<Set<string>>(() => new Set(searchParams.getAll("uni")));
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(() => new Set(searchParams.getAll("level")));
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Courses.tsx renders this component with a titleOverride; treat that as the
  // "/courses" variant and use its dedicated metadata, otherwise "/programmes".
  const meta = titleOverride ? PAGE_META.courses : PAGE_META.programmes;
  const hero = titleOverride ? { ...c.hero, ...c.coursesHero } : c.hero;

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setQuery(q);
  }, [searchParams]);

  // Keep the URL in sync with the active filters (replace, so each toggle
  // doesn't add a history entry).
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    selectedTypes.forEach((v) => params.append("type", v));
    selectedUnis.forEach((v) => params.append("uni", v));
    selectedLevels.forEach((v) => params.append("level", v));
    setSearchParams(params, { replace: true });
  }, [query, selectedTypes, selectedUnis, selectedLevels, setSearchParams]);

  const toggler = (set: Set<string>, setter: (s: Set<string>) => void) => (v: string) => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    setter(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programmes.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q)) return false;
      if (selectedTypes.size > 0 && !p.categories.some((c) => selectedTypes.has(c))) return false;
      if (selectedUnis.size > 0 && !selectedUnis.has(p.university)) return false;
      if (selectedLevels.size > 0 && !selectedLevels.has(p.level)) return false;
      return true;
    });
  }, [programmes, query, selectedTypes, selectedUnis, selectedLevels]);

  const activeCount =
    selectedTypes.size + selectedUnis.size + selectedLevels.size;

  const clearAll = () => {
    setSelectedTypes(new Set());
    setSelectedUnis(new Set());
    setSelectedLevels(new Set());
    setQuery("");
  };

  const FilterPanel = (
    <div className="bg-paper border border-rule">
      <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
        <h2 className="eyebrow text-ink">{c.filters.heading}</h2>
        {activeCount > 0 && c.filters.clearAll && (
          <button
            onClick={clearAll}
            className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-mute hover:text-plum"
          >
            {c.filters.clearAll}
          </button>
        )}
      </div>
      <div className="px-5">
        <FilterSection title={c.filters.levelTitle}    options={LEVELS}          selected={selectedLevels} onToggle={toggler(selectedLevels, setSelectedLevels)} labels={LEVEL_LABELS} defaultOpen />
        <FilterSection title={c.filters.subjectTitle}  options={PROGRAMME_TYPES} selected={selectedTypes}  onToggle={toggler(selectedTypes,  setSelectedTypes)} />
        <FilterSection title={c.filters.awardingTitle} options={UNIVERSITIES}    selected={selectedUnis}   onToggle={toggler(selectedUnis,   setSelectedUnis)} labels={UNI_LABELS} />
      </div>
    </div>
  );

  return (
    <PageLayout>
      <Seo
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonicalPath={meta.path}
      />
      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-14 md:pb-20 border-b border-rule">
        <div className="container-wide flex items-baseline justify-between pb-10">
          <p className="eyebrow">{hero.eyebrow}</p>
          <p className="eyebrow hidden md:block">{hero.eyebrowRight}</p>
        </div>
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <h1 className="font-serif text-display-lg text-ink">
              {hero.title} <span className="italic-serif text-plum">{hero.titleAccent}</span><span className="text-ember">.</span>
            </h1>
          </div>
          {hero.intro && (
            <p className="lg:col-span-5 font-serif text-[19px] leading-[1.6] text-ink-soft max-w-prose">
              {hero.intro}
            </p>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-paper py-12 md:py-16">
        <div className="container-wide grid gap-10 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            {FilterPanel}
          </aside>

          {/* Main */}
          <div>
            {/* Search row */}
            <div className="flex items-center gap-4 pb-2 border-b border-ink">
              <Search className="h-4 w-4 text-ink-mute shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={c.search.placeholder}
                className="flex-1 bg-transparent outline-none text-[16px] text-ink placeholder:text-ink-mute py-2 border-0"
              />
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.18em] text-ink"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {c.filters.mobileButton}
                {activeCount > 0 && (
                  <span className="h-5 min-w-5 px-1.5 rounded-full bg-plum text-white text-[10px] flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>

            {/* Chips */}
            {activeCount > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  ...[...selectedTypes].map((v)  => ({ v, setter: setSelectedTypes,  set: selectedTypes,  k: "t" })),
                  ...[...selectedUnis].map((v)   => ({ v, setter: setSelectedUnis,   set: selectedUnis,   k: "u" })),
                  ...[...selectedLevels].map((v) => ({ v, setter: setSelectedLevels, set: selectedLevels, k: "l" })),
                ].map(({ v, setter, set, k }) => (
                  <button
                    key={`${k}-${v}`}
                    onClick={() => {
                      const next = new Set(set);
                      next.delete(v);
                      setter(next);
                    }}
                    className="inline-flex items-center gap-1.5 border border-rule bg-paper px-3 py-1 text-[12px] text-ink"
                  >
                    {v} <X className="h-3 w-3" />
                  </button>
                ))}
              </div>
            )}

            <p className="mt-6 eyebrow text-ink-mute">
              {withCount(filtered.length === 1 ? c.search.countOne : c.search.countMany, filtered.length)}
            </p>

            {/* Results */}
            <div className="mt-6 divide-y divide-rule border-y border-rule">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  {c.empty.title && <p className="font-serif text-2xl text-ink">{c.empty.title}</p>}
                  {c.empty.body && <p className="mt-2 text-[14px] text-ink-mute">{c.empty.body}</p>}
                  {c.empty.button && (
                    <button
                      onClick={clearAll}
                      className="mt-6 inline-flex bg-aubergine text-white px-6 py-3 text-[13px] font-medium hover:bg-plum transition-snap"
                    >
                      {c.empty.button}
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((p, i) => (
                  <article key={p.slug || p.title} className="reveal py-8 group" style={{ transitionDelay: `${Math.min(i, 8) * 50}ms` }}>
                    <Link
                      to={p.slug ? `/programmes/${p.slug}` : "/contact-us"}
                      className="grid md:grid-cols-[180px_1fr_auto] gap-6 md:gap-10 items-start"
                    >
                      {/* Index */}
                      <div className="hidden md:flex items-start gap-5">
                        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute mt-2">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-deep">
                          <img
                            src={p.img}
                            alt={p.title}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        </div>
                      </div>
                      <div className="md:hidden relative aspect-[16/10] w-full overflow-hidden bg-paper-deep">
                        <img src={p.img} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                      </div>

                      <div className="min-w-0">
                        <p className="eyebrow eyebrow-plum">{p.level} · {p.university}</p>
                        <h3 className="mt-3 font-serif text-[26px] md:text-[28px] leading-[1.15] text-ink transition-snap group-hover:text-plum">
                          {p.title}
                        </h3>
                        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft max-w-[60ch]">
                          {p.desc}
                        </p>
                        {p.university === "Walsh College Direct" && c.list.nextIntake && (
                          <p className="mt-4 eyebrow text-ink-mute">
                            {c.list.nextIntake.replace("{date}", p.intakes[0] ?? "")}
                          </p>
                        )}
                      </div>

                      <div className="hidden md:flex flex-col items-end gap-3 shrink-0">
                        {c.list.detailsLink && (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
                            {c.list.detailsLink}
                            <ArrowUpRight className="h-3 w-3 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>
                        )}
                      </div>
                    </Link>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter sheet */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-aubergine/30" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto w-[88%] max-w-sm bg-paper h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="eyebrow text-ink">{c.filters.mobileHeading}</h3>
              <button onClick={() => setFiltersOpen(false)} className="h-9 w-9 border border-rule flex items-center justify-center" aria-label={c.filters.mobileClose}>
                <X className="h-5 w-5 text-ink" />
              </button>
            </div>
            {FilterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-5 w-full bg-aubergine text-white py-3 text-[13px] font-medium"
            >
              {withCount(c.filters.mobileShowResults, filtered.length)}
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Programmes;
