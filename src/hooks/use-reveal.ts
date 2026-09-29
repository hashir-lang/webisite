import { useEffect } from "react";

/**
 * One-shot IntersectionObserver that promotes `.reveal` elements
 * to `.reveal.in` as they enter the viewport. The CSS handles the
 * transition; this hook just toggles the class.
 *
 * Mounted once at the layout level - no per-component wiring.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const el of els) io.observe(el);

    // Re-scan if the DOM grew (e.g. after navigation within SPA).
    const mo = new MutationObserver(() => {
      const fresh = document.querySelectorAll<HTMLElement>(".reveal:not(.in)");
      fresh.forEach((el) => io.observe(el));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
