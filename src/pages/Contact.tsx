import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight, ExternalLink, Mail, Phone, MapPin, MessageCircle, type LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { submitContact } from "@/lib/api";
import { useContent } from "@/cms/useContent";

// Shared with the enquiry form (Apply.tsx) and the welcome popup, so every
// form on the site accepts and rejects exactly the same things.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lenient: 7–15 digits, allowing spaces, dashes, parentheses and a leading +.
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

// The contact channel cards (label, text, note, link) live in the CMS
// "contact" entry (src/cms/defaults/contact.ts). The icon is picked here from
// the card's link, so an admin can add or reorder cards without a code change.
const channelIcon = (href: string): LucideIcon => {
  const h = href.trim().toLowerCase();
  if (h.startsWith("mailto:")) return Mail;
  if (h.startsWith("tel:")) return Phone;
  if (h.includes("wa.me") || h.includes("whatsapp")) return MessageCircle;
  if (h.includes("maps")) return MapPin;
  return ExternalLink;
};

// All copy comes from the CMS "contact" entry (src/cms/defaults/contact.ts
// holds the defaults; /admin/pages/contact edits them). Empty strings and
// empty lists render nothing, which is how an admin removes a piece of text.
const Contact = () => {
  const c = useContent("contact");
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Same field rules as the enquiry form and the welcome popup.
  const nameValid = form.name.trim() !== "";
  const emailValid = EMAIL_RE.test(form.email.trim());
  const subjectValid = form.subject.trim() !== "";
  const messageValid = form.message.trim() !== "";
  // Optional: only checked once something has been typed.
  const phoneValid = form.phone.trim() === "" || PHONE_RE.test(form.phone.trim());
  const formValid = nameValid && emailValid && subjectValid && messageValid && phoneValid;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      setTouched(true);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      // Stored in contact_messages (api/contact.php) and forwarded to the CRM,
      // then read back by the admin console at /admin/contact.
      const res = await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        source: "contact-us",
      });
      toast(
        res.duplicate
          ? {
              title: c.messages.duplicateTitle,
              description: c.messages.duplicateDescription,
            }
          : {
              title: c.messages.sentTitle,
              description: c.messages.sentDescription,
            },
      );
      setTouched(false);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast({
        title: c.messages.errorTitle,
        description: c.messages.errorDescription,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout hideCta>
      <Seo
        title={PAGE_META.contact.title}
        description={PAGE_META.contact.description}
        keywords={PAGE_META.contact.keywords}
        canonicalPath={PAGE_META.contact.path}
      />
      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-16 md:pb-24 border-b border-rule">
        <div className="container-wide flex items-baseline justify-between pb-12 md:pb-16">
          <p className="eyebrow">{c.hero.eyebrow}</p>
          <p className="eyebrow hidden md:block">{c.hero.eyebrowRight}</p>
        </div>
        <div className="container-wide grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-serif text-display-lg text-ink">
              {c.hero.title}
              <br />
              <span className="italic-serif text-plum">{c.hero.titleAccent}</span>
              <span className="text-ember">.</span>
            </h1>
          </div>
          {c.hero.intro && (
            <p className="lg:col-span-4 font-serif text-[19px] leading-[1.6] text-ink-soft">
              {c.hero.intro}
            </p>
          )}
        </div>
      </section>

      {/* CHANNELS */}
      {c.channels.items.length > 0 && (
        <section className="bg-plum-paper border-t border-rule">
          <div className="container-wide grid md:grid-cols-2 lg:grid-cols-4 border-t border-ink/20">
            {c.channels.items.map((ch, i) => {
              const Icon = channelIcon(ch.href);
              return (
                <a
                  key={`${ch.label}-${i}`}
                  href={ch.href}
                  className={`group block py-10 px-6 lg:px-10 transition-snap hover:bg-paper ${
                    i > 0 ? "lg:border-l lg:border-rule" : ""
                  } ${i % 2 !== 0 ? "md:border-l md:border-rule" : ""} border-b border-rule`}
                >
                  <Icon className="h-5 w-5 text-plum" strokeWidth={1.5} />
                  <p className="mt-4 eyebrow text-ink-mute">{ch.label}</p>
                  <p className="mt-2 font-serif text-[22px] text-ink group-hover:text-plum transition-snap">
                    {ch.primary}
                  </p>
                  {ch.note && (
                    <p className="mt-3 text-[13px] text-ink-mute leading-relaxed">{ch.note}</p>
                  )}
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* FORM + STATEMENT */}
      <section className="bg-paper py-24 md:py-32 border-t border-rule">
        <div className="container-wide grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            {c.note.eyebrow && <Eyebrow>{c.note.eyebrow}</Eyebrow>}
            <h2 className="mt-5 font-serif text-display text-ink">
              {c.note.title}
              <br />
              <span className="italic-serif text-plum">{c.note.titleAccent}</span>.
            </h2>
            {c.note.body && (
              <p className="mt-8 font-serif text-[18px] leading-[1.65] text-ink-soft max-w-[44ch]">
                {c.note.body}
              </p>
            )}
            {c.note.addressLines.length > 0 && (
              <ul className="mt-12 space-y-3 text-[14px] text-ink-mute">
                {c.note.addressLines.map((line, i) => (
                  <li key={`${line}-${i}`}>{line}</li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={submit}
            className="lg:col-span-7 bg-white border border-rule p-8 md:p-10"
          >
            {c.form.eyebrow && <Eyebrow>{c.form.eyebrow}</Eyebrow>}
            {c.form.title && (
              <h3 className="mt-4 font-serif text-[28px] text-ink leading-tight">
                {c.form.title}
              </h3>
            )}

            <div className="mt-10 space-y-7">
              <Field label={c.form.nameLabel} value={form.name}
                     onChange={(v) => setForm({ ...form, name: v })}
                     error={touched && !nameValid}
                     errorText={c.form.requiredError} />
              <Field label={c.form.emailLabel} type="email" value={form.email}
                     onChange={(v) => setForm({ ...form, email: v })}
                     error={touched && !emailValid}
                     errorText={c.form.emailError} />
              <Field label={c.form.phoneLabel} type="tel" value={form.phone}
                     onChange={(v) => setForm({ ...form, phone: v })}
                     error={touched && !phoneValid}
                     errorText={c.form.phoneError} />
              <Field label={c.form.subjectLabel} value={form.subject}
                     onChange={(v) => setForm({ ...form, subject: v })}
                     error={touched && !subjectValid}
                     errorText={c.form.requiredError} />

              <label className="block">
                <span className="eyebrow text-ink-mute block mb-3">{c.form.messageLabel}</span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`w-full bg-transparent border-b py-3 text-[16px] text-ink placeholder:text-ink-mute outline-none transition-snap resize-none ${
                    touched && !messageValid ? "border-ember" : "border-rule focus:border-ink"
                  }`}
                />
                {touched && !messageValid && c.form.messageError && (
                  <span className="mt-2 block text-[12px] text-ember">
                    {c.form.messageError}
                  </span>
                )}
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center gap-3 bg-aubergine text-white px-7 py-4 text-[13px] font-medium transition-smooth hover:bg-plum disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? c.form.submittingLabel : c.form.submitLabel}
                <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </PageLayout>
  );
};

// Mirrors the field in Apply.tsx: validation and its messages are ours, not the
// browser's, so every form on the site fails the same way. The label and the
// error text are passed in from the CMS copy.
const Field = ({
  label,
  value,
  onChange,
  type = "text",
  error,
  errorText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: boolean;
  errorText: string;
}) => (
  <label className="block">
    <span className="eyebrow text-ink-mute block mb-3">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-transparent border-b py-3 text-[16px] text-ink placeholder:text-ink-mute outline-none transition-snap ${
        error ? "border-ember" : "border-rule focus:border-ink"
      }`}
    />
    {error && errorText && <span className="mt-2 block text-[12px] text-ember">{errorText}</span>}
  </label>
);

export default Contact;
