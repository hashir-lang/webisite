/**
 * CMS layer for the DATA-DRIVEN pages: one editable entry per programme and
 * per partner, keyed by the page's URL path (so its text and its SEO tags
 * share one row in cms_pages).
 *
 * The record in src/data stays the source of truth; only the fields an admin
 * changed are applied on top of it, at render time, everywhere the record is
 * shown (its own page, listings, related-programme cards, the Apply dropdown).
 * Fields the admin never touched keep following the data file — including
 * optional ones, whose "absent" state is preserved.
 */
import { useMemo } from "react";
import { courses, coursesBySlug, defaultKeyBenefits, type Course } from "@/data/courses";
import { partners, partnersBySlug, partnerHref, type Partner } from "@/data/partners";
import courseUnits from "@/data/course-units.json";
import { buildCourseDescription, buildCourseKeywords, buildCourseTitle } from "@/seo/siteMeta";
import { courseSeoOverrides } from "@/seo/courseSeoOverrides";
import { useCms } from "./ContentProvider";
import { isPlainObject, mergeContent } from "./merge";
import type { PageDef, PageMetaDefaults } from "./registry";
import type { ContentObject, ContentValue } from "./types";

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------

/** Where a programme's own text is stored: its own URL. */
export const courseContentKey = (c: Course) => `/programmes/${c.slug}`;
/** Where its SEO tags live: the canonical URL (duplicate listings share the original's). */
export const courseCanonicalPath = (c: Course) => `/programmes/${c.canonicalSlug ?? c.slug}`;
export const partnerContentKey = (p: Partner) => partnerHref(p);

// ---------------------------------------------------------------------------
// Programmes
// ---------------------------------------------------------------------------

type UnitItem = string | { name: string; credit?: string };
type UnitGroup = { title: string; items: UnitItem[]; note?: string };
const unitOverrides = courseUnits as Record<string, { modules: UnitGroup[] }>;

const unitLabel = (it: UnitItem): string =>
  typeof it === "string" ? it : it.credit ? `${it.name} (${it.credit} credits)` : it.name;

/**
 * The programme's editable text, fully materialised: optional fields show the
 * value the page would actually display (gains fall back to highlights, key
 * benefits to the standard list, modules to the official unit list), so what
 * the admin sees in the editor is what the visitor sees on the page.
 */
export function courseContentDefaults(course: Course) {
  const groups = (unitOverrides[course.slug]?.modules ?? course.modules) as UnitGroup[];
  return {
    title: course.title,
    tagline: course.tagline,
    overview: course.overview,
    overviewLong: course.overviewLong ?? "",
    duration: course.duration,
    tuition: course.tuition,
    qualification: course.qualification,
    language: course.language,
    accessibility: course.accessibility,
    intakes: [...course.intakes],
    accreditedBy: course.accreditedBy,
    accreditedByDesc: course.accreditedByDesc,
    accreditation: [...course.accreditation],
    highlights: [...course.highlights],
    gains: [...(course.gains ?? course.highlights)],
    keyBenefits: [...(course.keyBenefits ?? defaultKeyBenefits)],
    modules: groups.map((g) => ({ title: g.title, note: g.note ?? "", items: g.items.map(unitLabel) })),
    entryRequirements: [...course.entryRequirements],
    applicationSteps: (course.applicationSteps ?? []).map((s) => ({ title: s.title, desc: s.desc })),
    careerDesc: course.careerDesc ?? "",
    careerOutcomes: [...course.careerOutcomes],
    paymentPlans: (course.paymentPlans ?? []).map((p) => ({ title: p.title, desc: p.desc })),
    scholarships: [...(course.scholarships ?? [])],
    specializations: [...(course.specializations ?? [])],
  };
}

const COURSE_LABELS: Record<string, string> = {
  overviewLong: "Overview — long version",
  gains: "What you’ll gain",
  keyBenefits: "Key benefits",
  accreditedBy: "Awarding body",
  accreditedByDesc: "Awarding body description",
  accreditation: "Accreditation points",
  modules: "Modules / units",
  "modules.items": "Units",
  "modules.note": "Note (optional)",
  applicationSteps: "Application steps — leave empty to use the standard steps",
  careerDesc: "Careers intro",
  paymentPlans: "Payment plans — leave empty to use the standard plans",
};

const COURSE_TEMPLATES: Record<string, ContentValue> = {
  modules: { title: "", note: "", items: [] },
  "modules.items": "",
  applicationSteps: { title: "", desc: "" },
  paymentPlans: { title: "", desc: "" },
};

/** The SEO defaults a programme page uses (the hand-written map first, generated tags otherwise). */
export function courseSeoDefaults(c: Course): PageMetaDefaults {
  const seo = courseSeoOverrides[c.slug] ?? courseSeoOverrides[c.slug.replace(/-(uecampus|direct)$/, "")];
  return {
    title: seo?.title ?? buildCourseTitle(c),
    description: seo?.description ?? buildCourseDescription(c),
    keywords: seo?.keywords ?? buildCourseKeywords(c),
  };
}

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

export function partnerContentDefaults(p: Partner) {
  return {
    name: p.name,
    shortName: p.shortName,
    place: p.place,
    tagline: p.tagline,
    summary: p.summary,
    about: [...p.about],
    highlights: [...p.highlights],
    facts: p.facts.map((f) => ({ label: f.label, value: f.value })),
    recognition: (p.recognition ?? []).map((r) => ({ title: r.title, detail: r.detail })),
  };
}

const PARTNER_LABELS: Record<string, string> = {
  about: "About — one paragraph per item",
  facts: "Facts panel",
  recognition: "Accreditation & recognition",
};

const PARTNER_TEMPLATES: Record<string, ContentValue> = {
  about: "",
  facts: { label: "", value: "" },
  recognition: { title: "", detail: "" },
};

export function partnerSeoDefaults(p: Partner): PageMetaDefaults {
  return {
    title: `${p.name} | UeCampus Partner`,
    description: p.summary,
    keywords: `${p.name}, ${p.name} accreditation, ${p.name} online degree, uecampus partners`,
  };
}

// ---------------------------------------------------------------------------
// Applying overrides
// ---------------------------------------------------------------------------

export type Overridden<T> = { record: T; changed: string[] };

/**
 * Lay the saved override over the record — but only the fields the admin
 * actually changed, so an optional field that was absent in the data stays
 * absent (and the page keeps its own fallback) until someone edits it.
 */
export function applyOverride<T extends object>(record: T, defaults: ContentObject, override: unknown): Overridden<T> {
  if (!isPlainObject(override)) return { record, changed: [] };
  const merged = mergeContent(defaults, override);
  const out = { ...record } as Record<string, unknown>;
  const changed: string[] = [];
  for (const k of Object.keys(override)) {
    if (!(k in defaults)) continue;
    out[k] = merged[k];
    changed.push(k);
  }
  return { record: out as T, changed };
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** The public catalogue with any programme-level edits applied. */
export function useCourses(): Course[] {
  const { state } = useCms();
  return useMemo(
    () =>
      courses.map((c) => {
        const o = state.pages[courseContentKey(c)]?.content;
        return o ? applyOverride(c, courseContentDefaults(c), o).record : c;
      }),
    [state],
  );
}

/** One programme (hidden ones included — they are still reachable by URL) with its edits. */
export function useCourse(slug: string | undefined): Overridden<Course> | undefined {
  const { state } = useCms();
  return useMemo(() => {
    const c = slug ? coursesBySlug[slug] : undefined;
    if (!c) return undefined;
    const o = state.pages[courseContentKey(c)]?.content;
    return o ? applyOverride(c, courseContentDefaults(c), o) : { record: c, changed: [] };
  }, [slug, state]);
}

export function usePartners(): Partner[] {
  const { state } = useCms();
  return useMemo(
    () =>
      partners.map((p) => {
        const o = state.pages[partnerContentKey(p)]?.content;
        return o ? applyOverride(p, partnerContentDefaults(p), o).record : p;
      }),
    [state],
  );
}

export function usePartner(slug: string | undefined): Overridden<Partner> | undefined {
  const { state } = useCms();
  return useMemo(() => {
    const p = slug ? partnersBySlug[slug] : undefined;
    if (!p) return undefined;
    const o = state.pages[partnerContentKey(p)]?.content;
    return o ? applyOverride(p, partnerContentDefaults(p), o) : { record: p, changed: [] };
  }, [slug, state]);
}

// ---------------------------------------------------------------------------
// Admin: a PageDef built on the fly for a record's URL
// ---------------------------------------------------------------------------

/** Every programme (hidden ones flagged) for the admin list, alphabetical. */
export const allCoursesForAdmin = (): Course[] =>
  Object.values(coursesBySlug).sort((a, b) => a.title.localeCompare(b.title));

/**
 * The editor definition for "/programmes/<slug>" or a partner URL, or null
 * when the path is neither. Same shape as a registry entry, so the page
 * editor treats records and static pages identically.
 */
export function recordPageDef(pathLike: string): PageDef | null {
  const p = pathLike.startsWith("/") ? pathLike : `/${pathLike}`;

  const m = /^\/programmes\/([^/]+)$/.exec(p);
  if (m) {
    const c = coursesBySlug[m[1]];
    if (!c) return null;
    return {
      key: courseContentKey(c),
      label: c.title,
      group: "Pages",
      path: courseCanonicalPath(c),
      hint:
        "This programme’s own text. The headings, buttons and labels shared by every programme page are edited under “Programme pages — shared labels”.",
      meta: courseSeoDefaults(c),
      defaults: courseContentDefaults(c),
      labels: COURSE_LABELS,
      templates: COURSE_TEMPLATES,
    };
  }

  const partner = partners.find((x) => partnerHref(x) === p);
  if (partner) {
    return {
      key: p,
      label: partner.name,
      group: "Pages",
      path: p,
      hint:
        "This partner’s own text. The headings and labels shared by every partner page are edited under “Partner pages — shared labels”.",
      meta: partnerSeoDefaults(partner),
      defaults: partnerContentDefaults(partner),
      labels: PARTNER_LABELS,
      templates: PARTNER_TEMPLATES,
    };
  }

  return null;
}
