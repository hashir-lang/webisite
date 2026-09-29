/**
 * The content layer's shared shapes.
 *
 * Every page declares its editable copy as a plain JSON-like object of
 * strings, numbers, booleans, arrays and nested objects (a `ContentObject`).
 * The CMS stores a *sparse* override with the same shape — only the fields an
 * admin changed — and `mergeContent()` lays it over the compiled defaults at
 * render time. Arrays are replaced wholesale, which is what lets an admin add,
 * remove and reorder items (bullets, FAQs, cards, testimonials).
 */

export type ContentPrimitive = string | number | boolean;
export type ContentValue = ContentPrimitive | ContentValue[] | ContentObject;
export type ContentObject = { [key: string]: ContentValue };

/** SEO overrides for one route. Empty/missing fields fall back to the code. */
export type MetaOverride = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  noindex?: boolean;
};

/** One stored page row, as the API returns it. */
export type PageEntry = {
  content?: ContentObject | null;
  meta?: MetaOverride | null;
  updated_at?: string;
  updated_by?: string | null;
};

/** Everything the site fetches at boot: all overrides, keyed by page key. */
export type CmsState = {
  version: string;
  pages: Record<string, PageEntry>;
};
