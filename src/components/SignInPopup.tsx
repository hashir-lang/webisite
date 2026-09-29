import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { submitSignin } from "@/lib/api";
import { useContent } from "@/cms/useContent";

/**
 * A welcome sign-in popup that captures the visitor's name and email.
 *
 * Behaviour (per product requirement):
 *  - Shows once each time the site is opened or reloaded. It lives at the App
 *    level, so it does NOT reappear on client-side route changes — only on a
 *    real page load/reload (which remounts this component with `open = true`).
 *  - The visitor must close it manually: it never auto-dismisses, and it does
 *    not close on outside-click or the Escape key. The only ways out are the
 *    explicit close (✕) button or submitting the form.
 *
 * All wording comes from the CMS "overlays" entry (src/cms/defaults/overlays.ts
 * holds the defaults; /admin/pages/overlays edits them).
 */

const STORAGE_KEY = "ue_signin";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lenient: 7–15 digits, allowing spaces, dashes, parentheses and a leading +.
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

const SignInPopup = () => {
  const { popup } = useContent("overlays");
  // Show on every page load UNLESS the visitor has already submitted the form
  // (we persist `ue_signin` only on submit, never on close). So a submitted
  // visitor never sees it again; someone who just closes it (✕) still does.
  // Start closed and decide after mount, so the prerendered HTML never bakes in
  // the modal (or its body scroll-lock) and there is no hydration mismatch.
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  // Decide whether to open, after mount. Skip entirely during prerendering so
  // the popup and its scroll-lock never appear in the static HTML.
  useEffect(() => {
    if (typeof window !== "undefined" && (window as Window & { __PRERENDER__?: boolean }).__PRERENDER__) {
      return;
    }
    try {
      if (localStorage.getItem(STORAGE_KEY) === null) setOpen(true);
    } catch {
      setOpen(true); // storage unavailable (e.g. private mode) — show as before
    }
  }, []);

  // Lock body scroll and focus the first field while the popup is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  const nameValid = name.trim() !== "";
  const emailValid = EMAIL_RE.test(email);
  const phoneValid = PHONE_RE.test(phone.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameValid || !emailValid || !phoneValid) {
      setTouched(true);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitSignin({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
        );
      } catch {
        // Storage may be unavailable (private mode); not essential.
      }
      setOpen(false);
    } catch {
      setSubmitError(popup.submitError);
      setSubmitting(false);
    }
  };

  const fieldCls = (invalid: boolean) =>
    `w-full bg-transparent border-b py-2.5 text-[15px] text-ink placeholder:text-ink-mute outline-none transition-snap ${
      touched && invalid ? "border-ember" : "border-rule focus:border-ink"
    }`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-title"
    >
      {/* Overlay — intentionally not clickable-to-close: the visitor must
          dismiss the popup with the ✕ button or by submitting. */}
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

      <div className="relative w-full max-w-sm bg-paper border border-rule shadow-lg animate-fade-up">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 text-ink-mute hover:text-ink transition-snap"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 md:p-7">
          {popup.eyebrow && <p className="eyebrow text-ink-mute">{popup.eyebrow}</p>}
          <h2
            id="signin-title"
            className="mt-2.5 font-serif text-[22px] leading-tight text-ink"
          >
            {popup.title}
            {popup.titleAccent && <span className="italic-serif text-plum"> {popup.titleAccent}</span>}
            <span className="text-ember">.</span>
          </h2>
          {popup.body && (
            <p className="mt-2 text-[13px] leading-relaxed text-ink-mute">{popup.body}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="eyebrow text-ink-mute block mb-2">{popup.nameLabel}</span>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldCls(!nameValid)}
              />
              {touched && !nameValid && (
                <span className="mt-2 block text-[12px] text-ember">{popup.nameError}</span>
              )}
            </label>

            <label className="block">
              <span className="eyebrow text-ink-mute block mb-2">{popup.emailLabel}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldCls(!emailValid)}
              />
              {touched && !emailValid && (
                <span className="mt-2 block text-[12px] text-ember">{popup.emailError}</span>
              )}
            </label>

            <label className="block">
              <span className="eyebrow text-ink-mute block mb-2">{popup.phoneLabel}</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={popup.phonePlaceholder}
                className={fieldCls(!phoneValid)}
              />
              {touched && !phoneValid && (
                <span className="mt-2 block text-[12px] text-ember">{popup.phoneError}</span>
              )}
            </label>

            {submitError && (
              <p className="text-[12px] text-ember">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex items-center gap-3 bg-aubergine text-white px-6 py-3 text-[13px] font-medium transition-smooth hover:bg-plum disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? popup.buttonBusy : popup.button}
              <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPopup;
