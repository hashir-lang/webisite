import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { submitEnquiry } from "@/lib/api";
import PageLayout from "@/components/layout/PageLayout";
import Eyebrow from "@/components/editorial/Eyebrow";
import { ArrowUpRight, ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourses } from "@/cms/records";
import Seo from "@/seo/Seo";
import { PAGE_META } from "@/seo/siteMeta";
import { useContent } from "@/cms/useContent";

type StepId = 0 | 1 | 2;

// The form always has these three steps; their names (and every other string
// on the page) come from the CMS "apply" entry (src/cms/defaults/apply.ts),
// editable at /admin/pages/apply.
const STEP_IDS: StepId[] = [0, 1, 2];
const stepNumber = (i: number) => String(i + 1).padStart(2, "0");

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  programme: string;
  qualification: string;
  intake: string;
  message: string;
  consent: boolean;
};

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  programme: "",
  qualification: "",
  intake: "",
  message: "",
  consent: false,
};

const Apply = () => {
  const c = useContent("apply");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  // The catalogue with any programme-level CMS edits (titles) applied.
  const courses = useCourses();
  const [step, setStep] = useState<StepId>(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Programmes grouped by level for a tidy <optgroup> picker.
  const grouped = useMemo(() => {
    const order = ["Doctorate", "Master's", "Bachelor's", "Diploma", "Top-Up"];
    const map = new Map<string, { slug: string; title: string }[]>();
    for (const c of courses) {
      if (!map.has(c.levelGroup)) map.set(c.levelGroup, []);
      map.get(c.levelGroup)!.push({ slug: c.slug, title: c.title });
    }
    return order
      .filter((g) => map.has(g))
      .map((g) => ({
        group: g,
        items: map.get(g)!.sort((a, b) => a.title.localeCompare(b.title)),
      }));
  }, [courses]);

  // Deep-link support: /enquire-now?programme=<slug> preselects the programme.
  useEffect(() => {
    const slug = params.get("programme");
    if (slug && courses.some((c) => c.slug === slug)) {
      setForm((f) => ({ ...f, programme: slug }));
    }
  }, [params, courses]);

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const stepValid = (s: StepId): boolean => {
    if (s === 0) {
      return (
        form.firstName.trim() !== "" &&
        form.lastName.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
        form.phone.trim() !== "" &&
        form.country.trim() !== ""
      );
    }
    if (s === 1) {
      return (
        form.programme !== "" &&
        form.qualification !== "" &&
        form.intake !== ""
      );
    }
    return form.consent;
  };

  const next = () => {
    if (!stepValid(step)) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setStep((s) => Math.min(2, s + 1) as StepId);
  };

  const back = () => {
    setTouched(false);
    setStep((s) => Math.max(0, s - 1) as StepId);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepValid(2)) {
      setTouched(true);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      await submitEnquiry({ ...form, programmeTitle, source: "enquire-now" });
      navigate("/thank-you", { state: { firstName: form.firstName } });
    } catch {
      setSubmitting(false);
      toast({
        title: c.messages.errorTitle,
        description: c.messages.errorDescription,
        variant: "destructive",
      });
    }
  };

  // Empty (not "—") when unmatched, so the CRM receives a real title or falls
  // back to the slug rather than storing the review step's placeholder dash.
  const programmeTitle =
    courses.find((c) => c.slug === form.programme)?.title ?? "";

  return (
    <PageLayout hideCta>
      <Seo
        title={PAGE_META.apply.title}
        description={PAGE_META.apply.description}
        keywords={PAGE_META.apply.keywords}
        canonicalPath={PAGE_META.apply.path}
      />
      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-12 md:pb-16 border-b border-rule">
        <div className="container-wide flex items-baseline justify-between pb-10 md:pb-14">
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

      {/* FORM */}
      <section className="bg-paper py-16 md:py-24">
        <div className="container-wide grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Step rail */}
          <aside className="lg:col-span-4">
            {c.steps.eyebrow && <Eyebrow>{c.steps.eyebrow}</Eyebrow>}
            <ol className="mt-8 space-y-1">
              {STEP_IDS.map((i) => {
                const n = stepNumber(i);
                const label = c.steps.items[i]?.label ?? "";
                const active = i === step;
                const done = i < step;
                return (
                  <li
                    key={n}
                    className={`flex items-start gap-4 py-4 border-b border-rule transition-snap ${
                      active ? "" : "opacity-60"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-mono transition-snap ${
                        done
                          ? "bg-aubergine text-white"
                          : active
                            ? "bg-plum text-white"
                            : "border border-rule text-ink-mute"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : n}
                    </span>
                    <span className="flex-1">
                      <span className="block font-serif text-[19px] text-ink leading-tight">
                        {label}
                      </span>
                      <span className="eyebrow text-ink-mute">
                        {[c.steps.stepLabel, n].filter(Boolean).join(" ")}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
            {(c.steps.resumeBefore || c.steps.resumeEmail || c.steps.resumeAfter) && (
              <p className="mt-8 text-[13px] leading-relaxed text-ink-mute max-w-[34ch]">
                {c.steps.resumeBefore}{" "}
                {c.steps.resumeEmail && (
                  <a href={`mailto:${c.steps.resumeEmail}`} className="text-plum hover:underline">
                    {c.steps.resumeEmail}
                  </a>
                )}{" "}
                {c.steps.resumeAfter}
              </p>
            )}
          </aside>

          {/* Panel */}
          <form
            onSubmit={submit}
            className="lg:col-span-8 bg-white border border-rule p-8 md:p-10"
          >
            {step === 0 && (
              <Fieldset
                eyebrow={c.form.eyebrow}
                title={c.form.details.title}
                hint={c.form.details.hint}
              >
                <div className="grid sm:grid-cols-2 gap-7">
                  <Field
                    label={c.form.details.firstNameLabel}
                    value={form.firstName}
                    onChange={(v) => set({ firstName: v })}
                    error={touched && form.firstName.trim() === ""}
                    errorText={c.form.errors.required}
                  />
                  <Field
                    label={c.form.details.lastNameLabel}
                    value={form.lastName}
                    onChange={(v) => set({ lastName: v })}
                    error={touched && form.lastName.trim() === ""}
                    errorText={c.form.errors.required}
                  />
                </div>
                <Field
                  label={c.form.details.emailLabel}
                  type="email"
                  value={form.email}
                  onChange={(v) => set({ email: v })}
                  error={
                    touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                  }
                  errorText={c.form.errors.email}
                />
                <div className="grid sm:grid-cols-2 gap-7">
                  <Field
                    label={c.form.details.phoneLabel}
                    type="tel"
                    value={form.phone}
                    onChange={(v) => set({ phone: v })}
                    error={touched && form.phone.trim() === ""}
                    errorText={c.form.errors.required}
                  />
                  <Field
                    label={c.form.details.countryLabel}
                    value={form.country}
                    onChange={(v) => set({ country: v })}
                    error={touched && form.country.trim() === ""}
                    errorText={c.form.errors.required}
                  />
                </div>
              </Fieldset>
            )}

            {step === 1 && (
              <Fieldset
                eyebrow={c.form.eyebrow}
                title={c.form.programme.title}
                hint={c.form.programme.hint}
              >
                <SelectField
                  label={c.form.programme.programmeLabel}
                  value={form.programme}
                  onChange={(v) => set({ programme: v })}
                  error={touched && form.programme === ""}
                  errorText={c.form.errors.select}
                  placeholder={c.form.programme.programmePlaceholder}
                >
                  {grouped.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map((it) => (
                        <option key={it.slug} value={it.slug}>
                          {it.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </SelectField>

                <div className="grid sm:grid-cols-2 gap-7">
                  <SelectField
                    label={c.form.programme.qualificationLabel}
                    value={form.qualification}
                    onChange={(v) => set({ qualification: v })}
                    error={touched && form.qualification === ""}
                    errorText={c.form.errors.select}
                    placeholder={c.form.programme.selectPlaceholder}
                  >
                    {c.form.programme.qualifications.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    label={c.form.programme.intakeLabel}
                    value={form.intake}
                    onChange={(v) => set({ intake: v })}
                    error={touched && form.intake === ""}
                    errorText={c.form.errors.select}
                    placeholder={c.form.programme.selectPlaceholder}
                  >
                    {c.form.programme.intakes.map((it) => (
                      <option key={it} value={it}>
                        {it}
                      </option>
                    ))}
                  </SelectField>
                </div>

                <label className="block">
                  <span className="eyebrow text-ink-mute block mb-3">
                    {c.form.programme.notesLabel}
                  </span>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => set({ message: e.target.value })}
                    placeholder={c.form.programme.notesPlaceholder}
                    className="w-full bg-transparent border-b border-rule py-3 text-[16px] text-ink placeholder:text-ink-mute outline-none focus:border-ink transition-snap resize-none"
                  />
                </label>
              </Fieldset>
            )}

            {step === 2 && (
              <Fieldset
                eyebrow={c.form.eyebrow}
                title={c.form.review.title}
                hint={c.form.review.hint}
              >
                <dl className="divide-y divide-rule border-y border-rule">
                  <Row label={c.form.review.nameLabel} value={`${form.firstName} ${form.lastName}`.trim() || c.form.review.emptyValue} />
                  <Row label={c.form.review.emailLabel} value={form.email || c.form.review.emptyValue} />
                  <Row label={c.form.review.phoneLabel} value={form.phone || c.form.review.emptyValue} />
                  <Row label={c.form.review.countryLabel} value={form.country || c.form.review.emptyValue} />
                  <Row label={c.form.review.programmeLabel} value={programmeTitle || c.form.review.emptyValue} />
                  <Row label={c.form.review.qualificationLabel} value={form.qualification || c.form.review.emptyValue} />
                  <Row label={c.form.review.intakeLabel} value={form.intake || c.form.review.emptyValue} />
                  {form.message.trim() !== "" && (
                    <Row label={c.form.review.notesLabel} value={form.message} />
                  )}
                </dl>

                <label className="mt-2 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => set({ consent: e.target.checked })}
                    className="mt-1 h-4 w-4 accent-plum"
                  />
                  <span className="text-[14px] leading-relaxed text-ink-soft">
                    {c.form.review.consentText}
                  </span>
                </label>
                {touched && !form.consent && c.form.review.consentError && (
                  <p className="text-[12px] text-ember">
                    {c.form.review.consentError}
                  </p>
                )}
              </Fieldset>
            )}

            {/* Controls */}
            <div className="mt-10 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="group inline-flex items-center gap-2 text-[13px] font-medium text-ink hover:text-plum transition-snap"
                >
                  <ArrowLeft className="h-4 w-4 transition-smooth group-hover:-translate-x-0.5" />
                  {c.form.backLabel}
                </button>
              ) : (
                <span />
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={next}
                  className="group inline-flex items-center gap-3 bg-aubergine text-white px-7 py-4 text-[13px] font-medium transition-smooth hover:bg-plum"
                >
                  {c.form.continueLabel}
                  <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-3 bg-aubergine text-white px-7 py-4 text-[13px] font-medium transition-smooth hover:bg-plum disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? c.form.submittingLabel : c.form.submitLabel}
                  <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              )}
            </div>

            {c.form.talkLink && (
              <p className="mt-6 text-[12px] text-ink-mute">
                {c.form.talkPrompt && <>{c.form.talkPrompt}{" "}</>}
                <Link to="/contact-us" className="text-plum hover:underline">
                  {c.form.talkLink}
                </Link>
                .
              </p>
            )}
          </form>
        </div>
      </section>
    </PageLayout>
  );
};

const Fieldset = ({
  eyebrow,
  title,
  hint,
  children,
}: {
  eyebrow: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) => (
  <div className="animate-fade-up">
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    {title && (
      <h2 className="mt-4 font-serif text-[28px] text-ink leading-tight">
        {title}
      </h2>
    )}
    {hint && <p className="mt-2 text-[14px] text-ink-mute">{hint}</p>}
    <div className="mt-9 space-y-7">{children}</div>
  </div>
);

// Validation and its messages are ours, not the browser's, so every form on
// the site fails the same way. Labels and error text come from the CMS copy.
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

const SelectField = ({
  label,
  value,
  onChange,
  children,
  error,
  errorText,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  error?: boolean;
  errorText: string;
  placeholder: string;
}) => (
  <label className="block">
    <span className="eyebrow text-ink-mute block mb-3">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-transparent border-b py-3 text-[16px] outline-none transition-snap ${
        value === "" ? "text-ink-mute" : "text-ink"
      } ${error ? "border-ember" : "border-rule focus:border-ink"}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {children}
    </select>
    {error && errorText && (
      <span className="mt-2 block text-[12px] text-ember">
        {errorText}
      </span>
    )}
  </label>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline gap-6 py-4">
    <dt className="eyebrow text-ink-mute w-32 shrink-0">{label}</dt>
    <dd className="text-[15px] text-ink leading-relaxed break-words">{value}</dd>
  </div>
);

export default Apply;
