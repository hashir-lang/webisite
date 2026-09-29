import { useMemo } from "react";
import { useCms } from "./ContentProvider";
import { mergeContent } from "./merge";
import { PAGES, metaKeyForPath, type PageContent, type PageKey } from "./registry";
import type { ContentObject, MetaOverride } from "./types";

/**
 * The copy for one page: the compiled defaults with any CMS overrides laid
 * over them. Components read from the returned object instead of hard-coded
 * strings, so an admin can change (or blank) any of them from /admin/pages.
 *
 *   const c = useContent("about");
 *   <h1>{c.hero.title}</h1>
 */
export function useContent<K extends PageKey>(key: K): PageContent<K> {
  const { state } = useCms();
  const override = state.pages[key]?.content;
  return useMemo(
    () => mergeContent(PAGES[key].defaults as ContentObject, override) as PageContent<K>,
    [key, override],
  );
}

/** SEO overrides for a route, if an admin has set any. Used by <Seo>. */
export function useMetaOverride(path: string): MetaOverride | undefined {
  const { state } = useCms();
  return state.pages[metaKeyForPath(path)]?.meta ?? undefined;
}
