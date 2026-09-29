import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchSiteContent } from "@/lib/api";
import type { CmsState } from "./types";

/**
 * Loads the CMS overrides and makes them available to every page.
 *
 * Lifecycle:
 *  - Live site, prerendered page: boots from the JSON snapshot the prerenderer
 *    embedded in <head> (identical to the markup, so hydration matches), then
 *    fetches the current overrides and re-renders if anything changed.
 *  - Live site, client-side navigation: defaults first, overrides as soon as
 *    the fetch lands (well under a second; the feed is tiny and ETag-cached).
 *  - Prerender (scripts/prerender.mjs): renders NOTHING until the fetch has
 *    settled, so the static HTML snapshot carries the current CMS content, and
 *    writes that content into <head> as the snapshot the live page boots from.
 */

export const EMPTY_STATE: CmsState = { version: "0", pages: {} };
const EMBED_ID = "ue-cms";

type CmsContextValue = {
  state: CmsState;
  /** True once the fetch has settled (successfully or not). */
  loaded: boolean;
  refresh: () => Promise<void>;
};

const CmsContext = createContext<CmsContextValue>({
  state: EMPTY_STATE,
  loaded: false,
  refresh: async () => {},
});

const isPrerender = () =>
  typeof window !== "undefined" && Boolean((window as Window & { __PRERENDER__?: boolean }).__PRERENDER__);

function readEmbedded(): CmsState | null {
  if (typeof document === "undefined") return null;
  const el = document.getElementById(EMBED_ID);
  if (!el?.textContent) return null;
  try {
    const parsed = JSON.parse(el.textContent) as Partial<CmsState> | null;
    return parsed && typeof parsed === "object" && parsed.pages
      ? { version: String(parsed.version ?? "0"), pages: parsed.pages }
      : null;
  } catch {
    return null;
  }
}

function writeEmbedded(state: CmsState): void {
  let el = document.getElementById(EMBED_ID);
  if (!el) {
    el = document.createElement("script");
    el.id = EMBED_ID;
    el.setAttribute("type", "application/json");
    document.head.appendChild(el);
  }
  // "</script>" inside a JSON string would end the tag early; escape "<".
  el.textContent = JSON.stringify(state).replace(/</g, "\\u003c");
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const prerender = isPrerender();
  // In a prerender the shell may still carry a snapshot from a previous run —
  // never trust it there, always fetch fresh so the new snapshot is current.
  const [state, setState] = useState<CmsState>(() => (prerender ? null : readEmbedded()) ?? EMPTY_STATE);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchSiteContent();
      setState(next);
      if (isPrerender()) writeEmbedded(next);
    } catch {
      // Unreachable API (offline build machine, dev without XAMPP): the site
      // simply shows the compiled defaults.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ state, loaded, refresh }), [state, loaded, refresh]);

  if (prerender && !loaded) return null;
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export const useCms = () => useContext(CmsContext);
