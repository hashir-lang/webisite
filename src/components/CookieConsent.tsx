import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { useContent } from "@/cms/useContent";

const STORAGE_KEY = "ue-cookie-consent";

// Signal the choice to Google Tag Manager so tags can be gated on consent.
const pushConsent = (value: "granted" | "denied") => {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "cookie_consent_update", cookie_consent: value });
};

// All wording comes from the CMS "overlays" entry (src/cms/defaults/overlays.ts
// holds the defaults; /admin/pages/overlays edits them).
const CookieConsent = () => {
  const { cookies } = useContent("overlays");
  // Start hidden. We only reveal after mount once we've read localStorage, so
  // the prerendered HTML never bakes in the banner and there is no hydration
  // mismatch for returning visitors who already chose.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip during prerendering so the banner is never baked into static HTML.
    if (typeof window !== "undefined" && (window as Window & { __PRERENDER__?: boolean }).__PRERENDER__) {
      return;
    }
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* storage blocked — honour the choice for this session only */
    }
    pushConsent(choice === "accepted" ? "granted" : "denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed z-50 bottom-24 md:bottom-6 left-4 right-4 md:right-auto md:left-6 w-auto md:w-[420px] animate-fade-up"
    >
      <div className="bg-paper border border-rule shadow-pill rounded-lg p-6 md:p-7">
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-full bg-plum-paper text-plum flex items-center justify-center shrink-0">
            <Cookie className="h-4 w-4" strokeWidth={1.5} />
          </span>
          {cookies.eyebrow && <p className="eyebrow text-ink-mute">{cookies.eyebrow}</p>}
        </div>

        <h2 className="mt-4 font-serif text-[20px] leading-snug text-ink">
          {cookies.title}<span className="text-ember">.</span>
        </h2>
        {cookies.body && (
          <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
            {cookies.body}
            {cookies.learnMore && (
              <>
                {" "}
                <Link to="/faqs" className="link-editorial text-ink whitespace-nowrap">
                  {cookies.learnMore}
                </Link>
              </>
            )}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="flex-1 inline-flex items-center justify-center bg-aubergine text-white px-5 py-3 text-[13px] font-medium transition-snap hover:bg-plum rounded-full"
          >
            {cookies.accept}
          </button>
          <button
            type="button"
            onClick={() => choose("declined")}
            className="flex-1 inline-flex items-center justify-center border border-rule text-ink px-5 py-3 text-[13px] font-medium transition-snap hover:bg-paper-soft rounded-full"
          >
            {cookies.decline}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
