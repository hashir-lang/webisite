/**
 * The page registry — the one list of everything the CMS can edit.
 *
 * Each entry pairs a page key with the compiled defaults for its copy (a
 * src/cms/defaults/*.ts module) and, for routed pages, the SEO defaults from
 * siteMeta. The admin console renders its editor straight from `defaults`, so
 * adding an editable page is: write its defaults module, wire the component
 * to useContent("<key>"), register it here.
 */
import { PAGE_META } from "@/seo/siteMeta";
import type { ContentObject, ContentValue } from "./types";
import { SITE_DEFAULTS, SITE_LABELS, SITE_TEMPLATES } from "./defaults/site";
import { OVERLAYS_DEFAULTS, OVERLAYS_LABELS, OVERLAYS_TEMPLATES } from "./defaults/overlays";
import { HOME_DEFAULTS } from "./defaults/home";
import { ABOUT_DEFAULTS } from "./defaults/about";
import { PROGRAMMES_DEFAULTS } from "./defaults/programmes";
import { FEES_DEFAULTS } from "./defaults/fees";
import { SCHOLARSHIP_DEFAULTS } from "./defaults/scholarship";
import { CONTACT_DEFAULTS } from "./defaults/contact";
import { APPLY_DEFAULTS } from "./defaults/apply";
import { THANK_YOU_DEFAULTS } from "./defaults/thankYou";
import { PARTNERS_DEFAULTS } from "./defaults/partners";
import { FAQS_DEFAULTS } from "./defaults/faqs";
import { NOT_FOUND_DEFAULTS } from "./defaults/notFound";
import { COURSE_DETAIL_DEFAULTS } from "./defaults/courseDetail";
import { PARTNER_DETAIL_DEFAULTS } from "./defaults/partnerDetail";

export type PageMetaDefaults = { title: string; description: string; keywords: string };

export type PageDef<T extends ContentObject = ContentObject> = {
  key: string;
  /** Shown in the admin list. */
  label: string;
  /** Admin grouping: "Global" or "Pages". */
  group: "Global" | "Pages";
  /** The route this page lives at (used for "view live" and meta lookup). */
  path: string;
  /** SEO defaults from siteMeta; absent for entries that are not a route. */
  meta?: PageMetaDefaults;
  /** One line of guidance shown above the editor. */
  hint?: string;
  defaults: T;
  /** Friendlier field labels, keyed by dotted path (indices stripped) or by leaf key. */
  labels?: Record<string, string>;
  /** Blank items for "Add" on lists, keyed by dotted path (indices stripped). */
  templates?: Record<string, ContentValue>;
};

const definePage = <T extends ContentObject>(def: PageDef<T>) => def;

export const PAGES = {
  site: definePage({
    key: "site",
    label: "Header & footer",
    group: "Global",
    path: "/",
    hint: "Navigation, contact details, footer columns, address and social profiles — shown on every page.",
    defaults: SITE_DEFAULTS,
    labels: SITE_LABELS,
    templates: SITE_TEMPLATES,
  }),
  overlays: definePage({
    key: "overlays",
    label: "Popups & chat",
    group: "Global",
    path: "/",
    hint: "The welcome sign-in popup, the cookie banner and the support chatbot — its messages and every FAQ answer it can give.",
    defaults: OVERLAYS_DEFAULTS,
    labels: OVERLAYS_LABELS,
    templates: OVERLAYS_TEMPLATES,
  }),
  home: definePage({
    key: "home", label: "Home", group: "Pages", path: PAGE_META.home.path, meta: PAGE_META.home,
    defaults: HOME_DEFAULTS,
  }),
  about: definePage({
    key: "about", label: "About us", group: "Pages", path: PAGE_META.about.path, meta: PAGE_META.about,
    defaults: ABOUT_DEFAULTS,
  }),
  programmes: definePage({
    key: "programmes", label: "Programmes", group: "Pages", path: PAGE_META.programmes.path, meta: PAGE_META.programmes,
    defaults: PROGRAMMES_DEFAULTS,
  }),
  courses: definePage({
    key: "courses", label: "All courses (/courses)", group: "Pages", path: PAGE_META.courses.path, meta: PAGE_META.courses,
    hint: "This URL shows the Programmes page with its own SEO tags. Its text is edited under “Programmes”.",
    defaults: {},
  }),
  fees: definePage({
    key: "fees", label: "Tuition & fees", group: "Pages", path: PAGE_META.fees.path, meta: PAGE_META.fees,
    defaults: FEES_DEFAULTS,
  }),
  scholarship: definePage({
    key: "scholarship", label: "Scholarship", group: "Pages", path: PAGE_META.scholarship.path, meta: PAGE_META.scholarship,
    defaults: SCHOLARSHIP_DEFAULTS,
  }),
  contact: definePage({
    key: "contact", label: "Contact us", group: "Pages", path: PAGE_META.contact.path, meta: PAGE_META.contact,
    defaults: CONTACT_DEFAULTS,
  }),
  apply: definePage({
    key: "apply", label: "Enquire now (application form)", group: "Pages", path: PAGE_META.apply.path, meta: PAGE_META.apply,
    defaults: APPLY_DEFAULTS,
  }),
  thankYou: definePage({
    key: "thankYou", label: "Thank you", group: "Pages", path: PAGE_META.thankYou.path, meta: PAGE_META.thankYou,
    defaults: THANK_YOU_DEFAULTS,
  }),
  partners: definePage({
    key: "partners", label: "Accreditation & partners", group: "Pages", path: PAGE_META.partners.path, meta: PAGE_META.partners,
    defaults: PARTNERS_DEFAULTS,
  }),
  faqs: definePage({
    key: "faqs", label: "FAQs", group: "Pages", path: PAGE_META.faqs.path, meta: PAGE_META.faqs,
    defaults: FAQS_DEFAULTS,
  }),
  notFound: definePage({
    key: "notFound", label: "404 page", group: "Pages", path: PAGE_META.notFound.path, meta: PAGE_META.notFound,
    defaults: NOT_FOUND_DEFAULTS,
  }),
  courseDetail: definePage({
    key: "courseDetail", label: "Programme pages — shared labels", group: "Pages", path: "/programmes/*",
    hint: "Section headings, buttons and labels shared by every /programmes/<slug> page. Each programme's own text and SEO tags are edited under SEO and Programmes.",
    defaults: COURSE_DETAIL_DEFAULTS,
  }),
  partnerDetail: definePage({
    key: "partnerDetail", label: "Partner pages — shared labels", group: "Pages", path: "/partners/*",
    hint: "Section headings and labels shared by every partner page.",
    defaults: PARTNER_DETAIL_DEFAULTS,
  }),
};

export type PageKey = keyof typeof PAGES;
export type PageContent<K extends PageKey> = (typeof PAGES)[K]["defaults"];

export const PAGE_LIST = Object.values(PAGES) as PageDef[];
export const isPageKey = (k: string): k is PageKey => Object.prototype.hasOwnProperty.call(PAGES, k);

const normalizePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

/**
 * The storage key for a route's SEO overrides: the registry key for pages the
 * registry knows, the path itself for everything else (programme and partner
 * pages, /courses). One rule, used by both the site and the admin.
 */
export function metaKeyForPath(path: string): string {
  const p = normalizePath(path);
  for (const def of PAGE_LIST) {
    if (def.meta && def.path === p) return def.key;
  }
  return p;
}
