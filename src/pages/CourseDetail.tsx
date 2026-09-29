import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import Eyebrow from "@/components/editorial/Eyebrow";
import {
  ArrowLeft, ArrowUpRight, CheckCircle2, Clock, Plus, Minus,
} from "lucide-react";
import { defaultKeyBenefits, type Course } from "@/data/courses";
import { useCourse, useCourses } from "@/cms/records";
import courseUnits from "@/data/course-units.json";
import Seo from "@/seo/Seo";
import {
  buildCourseTitle, buildCourseDescription, buildCourseKeywords, buildCourseSchema,
  buildCourseBreadcrumb, PAGE_META,
} from "@/seo/siteMeta";
import { courseSeoOverrides } from "@/seo/courseSeoOverrides";
import { useContent } from "@/cms/useContent";

// Exact per-course SEO from the keyword map, keyed by slug. Walsh mirror slugs
// (…-uecampus, …-direct) reuse their base course's row.
const seoForCourse = (course: Course) =>
  courseSeoOverrides[course.slug] ??
  courseSeoOverrides[course.slug.replace(/-(uecampus|direct)$/, "")];

// Real awarding-body units, sourced from official Qualifi/Walsh/PPA/eie
// curricula and kept out of the course data files. Keyed by course slug.
// An item is either a plain title or a title with its credit value.
type UnitItem = string | { name: string; credit?: string };
type UnitGroup = { title: string; items: UnitItem[]; note?: string };
type UnitOverride = { source?: string; modules: UnitGroup[] };
const unitOverrides = courseUnits as Record<string, UnitOverride>;

// Tab order. The labels come from the CMS (courseDetail.tabs); a tab whose
// label is blank is hidden.
const TAB_IDS = ["overview", "admissions", "academics", "careers", "payment"] as const;
type TabId = (typeof TAB_IDS)[number];

const Fact = ({ label, value }: { label: string; value: string }) => (
  <div className="py-5 px-4 first:pl-0">
    <p className="eyebrow text-ink-mute">{label}</p>
    <p className="mt-2 font-serif text-[15px] md:text-[16px] text-ink leading-snug">{value}</p>
  </div>
);

// The course record (title, overview, modules, fees…) comes from
// src/data/courses.ts. The page's own wording — headings, labels, buttons and
// the standard steps/plans used when a course has none of its own — comes from
// the CMS "courseDetail" entry (src/cms/defaults/courseDetail.ts holds the
// defaults; /admin/pages/courseDetail edits them). Empty strings render nothing.
// `changed` lists the programme's own fields an admin has edited in the CMS
// (/admin/pages/programmes/<slug>); those edits are already applied to
// `course`, and an edited module list wins over the official unit list.
const CourseDetailBody = ({ course, changed }: { course: Course; changed: string[] }) => {
  const c = useContent("courseDetail");
  const courses = useCourses();
  const [tab, setTab] = useState<TabId>("overview");
  const [openModule, setOpenModule] = useState<number | null>(0);

  const seo = seoForCourse(course);

  // `{name}` in a CMS string stands for the programme title.
  const withName = (template: string) => template.replace(/\{name\}/g, () => course.title);

  const keyBenefits      = course.keyBenefits      ?? defaultKeyBenefits;
  const applicationSteps = course.applicationSteps ?? c.admissions.steps;
  const paymentPlans     = course.paymentPlans     ?? c.payment.plans;
  const gains            = course.gains ?? course.highlights;
  const modules: UnitGroup[] = (
    changed.includes("modules") ? course.modules : (unitOverrides[course.slug]?.modules ?? course.modules)
  ) as UnitGroup[];

  const tabs = TAB_IDS.filter((id) => c.tabs[id]);

  const related = courses
    .filter((x) => x.slug !== course.slug && x.categories.some((cat) => course.categories.includes(cat)))
    .slice(0, 3);

  return (
    <PageLayout>
      {/* A duplicate listing canonicalises to the single programme we kept, so
          search engines index one URL per course, not several near-identical ones. */}
      <Seo
        title={seo?.title ?? buildCourseTitle(course)}
        description={seo?.description ?? buildCourseDescription(course)}
        keywords={seo?.keywords ?? buildCourseKeywords(course)}
        canonicalPath={`/programmes/${course.canonicalSlug ?? course.slug}`}
        image={course.img}
        schema={[buildCourseSchema(course), buildCourseBreadcrumb(course)]}
      />
      {/* HERO */}
      <section className="bg-paper pt-10 md:pt-14 pb-14 md:pb-20 border-b border-rule">
        <div className="container-wide flex items-baseline justify-between pb-8">
          <nav className="eyebrow text-ink-mute flex items-center gap-2 flex-wrap">
            {c.hero.breadcrumbHome && (
              <>
                <Link to="/" className="hover:text-plum transition-snap">{c.hero.breadcrumbHome}</Link>
                <span>/</span>
              </>
            )}
            {c.hero.breadcrumbProgrammes && (
              <>
                <Link to="/programmes" className="hover:text-plum transition-snap">{c.hero.breadcrumbProgrammes}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-ink">{course.levelGroup}</span>
          </nav>
          {c.hero.eyebrowRight && <p className="eyebrow hidden md:block">{c.hero.eyebrowRight}</p>}
        </div>

        <div className="container-wide grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7">
            <p className="eyebrow eyebrow-plum">{course.levelGroup} · {course.universityShort}</p>
            <h1 className="mt-5 font-serif text-[32px] md:text-[40px] lg:text-[46px] leading-[1.1] tracking-[-0.02em] text-ink">
              {(seo?.h1 ?? `${course.title} (Online)`).replace(/\s*\(Online\)\s*$/, "")}
              {c.hero.titleSuffix && (
                <>
                  {" "}
                  <span className="text-ink-mute">{c.hero.titleSuffix}</span>
                </>
              )}
              <span className="text-ember">.</span>
            </h1>
            <p className="mt-7 text-[17px] md:text-[18px] leading-[1.6] text-ink-soft max-w-[58ch]">
              {course.tagline}
            </p>

            {/* Inline facts */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-rule border-y border-rule">
              <Fact label={c.hero.factDuration}      value={course.duration} />
              <Fact label={c.hero.factLanguage}      value={course.language} />
              <Fact label={c.hero.factQualification} value={course.qualification} />
              <Fact label={c.hero.factAccessibility} value={course.accessibility} />
            </div>
          </div>

          {/* Accreditation card */}
          <aside className="lg:col-span-5 bg-aubergine text-white p-8 md:p-10 lg:sticky lg:top-28">
            {c.accreditation.eyebrow && <Eyebrow tone="paper">{c.accreditation.eyebrow}</Eyebrow>}
            <h3 className="mt-4 font-serif text-[26px] leading-tight">
              {course.accreditedBy}
            </h3>
            <p className="mt-5 text-[14px] leading-relaxed text-white/85">
              {course.accreditedByDesc}
            </p>
            {c.accreditation.note && (
              <p className="mt-4 text-[13px] leading-relaxed text-white/65">
                {c.accreditation.note}
              </p>
            )}
            <div className="mt-7 flex flex-col gap-2.5">
              {c.accreditation.applyButton && (
                <Link to={`/enquire-now?programme=${course.slug}`} className="group inline-flex items-center justify-between gap-2 bg-white text-aubergine px-5 py-3 text-[13px] font-medium transition-snap hover:bg-bloom hover:text-aubergine">
                  {c.accreditation.applyButton}
                  <ArrowUpRight className="h-4 w-4 transition-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              )}
              {c.accreditation.contactButton && (
                <Link to="/contact-us" className="group inline-flex items-center justify-between gap-2 border border-white/40 px-5 py-3 text-[13px] font-medium hover:bg-white/10 transition-snap">
                  {c.accreditation.contactButton}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* TABS */}
      <section className="bg-paper sticky top-16 md:top-20 z-30 border-b border-rule">
        <div className="container-wide overflow-x-auto">
          <div className="flex items-center gap-2 md:gap-3 min-w-max">
            {tabs.map((id) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative py-4 px-4 md:px-5 text-[14px] md:text-[15px] font-medium transition-snap ${
                    active ? "text-ink" : "text-ink-mute hover:text-ink"
                  }`}
                >
                  {c.tabs[id]}
                  {active && (
                    <span className="absolute left-4 right-4 md:left-5 md:right-5 -bottom-px h-[2px] bg-plum rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TAB CONTENT */}
      <section className="bg-paper py-16 md:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {tab === "overview" && (
              <div className="space-y-14">
                <div>
                  <Eyebrow number="01">{c.overview.eyebrow}</Eyebrow>
                  {c.overview.title && (
                    <h2 className="mt-4 font-serif text-display-sm text-ink">
                      {c.overview.title}
                    </h2>
                  )}
                  <p className="mt-6 font-serif text-[19px] leading-[1.7] text-ink-soft max-w-prose drop-cap">
                    {course.overview}
                  </p>
                  {course.overviewLong && (
                    <p className="mt-5 text-[16px] leading-[1.7] text-ink-soft max-w-prose">
                      {course.overviewLong}
                    </p>
                  )}
                </div>

                {course.specializations && (
                  <div>
                    <Eyebrow number="02">{c.overview.specialisationsEyebrow}</Eyebrow>
                    {c.overview.specialisationsTitle && (
                      <h3 className="mt-4 font-serif text-[28px] text-ink">
                        {c.overview.specialisationsTitle}
                      </h3>
                    )}
                    <ul className="mt-8 grid sm:grid-cols-3 border-t border-rule">
                      {course.specializations.map((s, i) => (
                        <li key={s} className={`py-5 ${i > 0 ? "sm:border-l sm:border-rule sm:pl-5" : ""} border-b sm:border-b-0 border-rule`}>
                          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute">
                            {String(i + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-2 font-serif text-[20px] text-ink">{s}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <Eyebrow number={course.specializations ? "03" : "02"}>{c.overview.gainsEyebrow}</Eyebrow>
                  {c.overview.gainsTitle && (
                    <h3 className="mt-4 font-serif text-[28px] text-ink">
                      {c.overview.gainsTitle}
                    </h3>
                  )}
                  <ul className="mt-8 divide-y divide-rule border-y border-rule">
                    {gains.map((g, i) => (
                      <li key={g} className="py-5 flex items-start gap-6">
                        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute pt-1 w-10 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-[18px] leading-snug text-ink-soft">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === "admissions" && (
              <div className="space-y-14">
                <div>
                  <Eyebrow number="01">{c.admissions.eyebrow}</Eyebrow>
                  {c.admissions.title && (
                    <h2 className="mt-4 font-serif text-display-sm text-ink">
                      {c.admissions.title}
                    </h2>
                  )}
                  {c.admissions.intro && (
                    <p className="mt-6 font-serif text-[17px] leading-[1.7] text-ink-soft max-w-prose">
                      {withName(c.admissions.intro)}
                    </p>
                  )}
                  <ul className="mt-8 grid sm:grid-cols-2 border-t border-rule">
                    {course.entryRequirements.map((r, i) => (
                      <li
                        key={r}
                        className={`flex items-start gap-3 py-5 ${i % 2 !== 0 ? "sm:border-l sm:border-rule sm:pl-6" : ""} border-b border-rule`}
                      >
                        <CheckCircle2 className="h-4 w-4 text-plum mt-1 shrink-0" />
                        <span className="text-[15px] text-ink-soft leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {applicationSteps.length > 0 && (
                  <div>
                    <Eyebrow number="02">{c.admissions.stepsEyebrow}</Eyebrow>
                    {c.admissions.stepsTitle && (
                      <h2 className="mt-4 font-serif text-display-sm text-ink">
                        {c.admissions.stepsTitle}
                      </h2>
                    )}
                    <ol className="mt-8 grid sm:grid-cols-2 border-t border-rule">
                      {applicationSteps.map((step, i) => (
                        <li
                          key={`${step.title}-${i}`}
                          className={`py-7 ${i % 2 !== 0 ? "sm:border-l sm:border-rule sm:pl-6" : ""} ${i < applicationSteps.length - 1 ? "border-b border-rule" : ""}`}
                        >
                          <p className="marker-number text-[44px]">{String(i + 1).padStart(2, "0")}</p>
                          <h4 className="mt-3 font-serif text-[22px] text-ink leading-tight">{step.title}</h4>
                          {step.desc && <p className="mt-2 text-[14px] text-ink-mute leading-relaxed">{step.desc}</p>}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div>
                  <Eyebrow number="03">{c.admissions.intakesEyebrow}</Eyebrow>
                  {c.admissions.intakesTitle && (
                    <h3 className="mt-4 font-serif text-[28px] text-ink">{c.admissions.intakesTitle}</h3>
                  )}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {course.intakes.map((i) => (
                      <span key={i} className="inline-flex items-center gap-2 border border-rule px-4 py-2 text-[13px] text-ink">
                        <Clock className="h-3.5 w-3.5 text-plum" /> {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "academics" && (
              <div className="space-y-14">
                <div>
                  <Eyebrow number="01">{c.academics.eyebrow}</Eyebrow>
                  {c.academics.title && (
                    <h2 className="mt-4 font-serif text-display-sm text-ink">
                      {c.academics.title}
                    </h2>
                  )}
                  {c.academics.intro && (
                    <p className="mt-6 font-serif text-[17px] leading-[1.7] text-ink-soft max-w-prose">
                      {withName(c.academics.intro)}
                    </p>
                  )}

                  <div className="mt-10 divide-y divide-rule border-y border-rule">
                    {modules.map((m, i) => {
                      const isOpen = openModule === i;
                      return (
                        <div key={m.title}>
                          <button
                            onClick={() => setOpenModule(isOpen ? null : i)}
                            className="w-full flex items-start gap-6 md:gap-10 py-6 text-left group"
                            aria-expanded={isOpen}
                          >
                            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute pt-2 w-10 shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 font-serif text-[22px] text-ink transition-snap group-hover:text-plum">
                              {m.title}
                              {m.note && (
                                <span className="ml-3 align-middle font-mono text-[11px] tracking-[0.16em] uppercase text-ink-mute">
                                  {m.note}
                                </span>
                              )}
                            </span>
                            <span className="shrink-0 mt-1 h-8 w-8 rounded-full border border-rule flex items-center justify-center">
                              {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </span>
                          </button>
                          {isOpen && (
                            <ul className="pl-[3.5rem] md:pl-16 pb-6 grid sm:grid-cols-2 gap-2">
                              {m.items.map((it) => {
                                const name   = typeof it === "string" ? it : it.name;
                                const credit = typeof it === "string" ? undefined : it.credit;
                                return (
                                  <li key={name} className="flex items-start gap-2 text-[14px] text-ink-soft">
                                    <span className="mt-2 h-1 w-1 rounded-full bg-plum shrink-0" />
                                    <span className="flex-1">{name}</span>
                                    {credit && (
                                      <span className="shrink-0 pt-0.5 font-mono text-[11px] text-ink-mute whitespace-nowrap">
                                        {credit}
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {tab === "careers" && (
              <div className="space-y-14">
                <div>
                  <Eyebrow number="01">{c.careers.eyebrow}</Eyebrow>
                  {c.careers.title && (
                    <h2 className="mt-4 font-serif text-display-sm text-ink">
                      {c.careers.title}
                    </h2>
                  )}
                  {(course.careerDesc || c.careers.intro) && (
                    <p className="mt-6 font-serif text-[17px] leading-[1.7] text-ink-soft max-w-prose">
                      {course.careerDesc ?? withName(c.careers.intro)}
                    </p>
                  )}
                  <ul className="mt-10 grid sm:grid-cols-2 border-t border-rule">
                    {course.careerOutcomes.map((o, i) => (
                      <li
                        key={o}
                        className={`py-5 ${i % 2 !== 0 ? "sm:border-l sm:border-rule sm:pl-6" : ""} border-b border-rule`}
                      >
                        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute">{String(i + 1).padStart(2, "0")}</p>
                        <p className="mt-2 font-serif text-[20px] text-ink">{o}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === "payment" && (
              <div className="space-y-14">
                <div>
                  <Eyebrow number="01">{c.payment.eyebrow}</Eyebrow>
                  {c.payment.title && (
                    <h2 className="mt-4 font-serif text-display-sm text-ink">
                      {c.payment.title}
                    </h2>
                  )}
                  {c.payment.intro && (
                    <p className="mt-6 font-serif text-[17px] leading-[1.7] text-ink-soft max-w-prose">
                      {withName(c.payment.intro)}
                    </p>
                  )}
                  {c.payment.feesLink && (
                    <Link
                      to="/fees"
                      className="group mt-6 inline-flex items-center gap-2 font-serif text-[16px] text-ink"
                    >
                      <span className="link-editorial">{c.payment.feesLink}</span>
                      <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  )}
                  {paymentPlans.length > 0 && (
                    <ul className="mt-10 grid sm:grid-cols-2 border-t border-rule">
                      {paymentPlans.map((p, i) => (
                        <li
                          key={`${p.title}-${i}`}
                          className={`py-6 ${i % 2 !== 0 ? "sm:border-l sm:border-rule sm:pl-6" : ""} border-b border-rule`}
                        >
                          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute">{String(i + 1).padStart(2, "0")}</p>
                          <h4 className="mt-2 font-serif text-[20px] text-ink leading-tight">{p.title}</h4>
                          {p.desc && <p className="mt-2 text-[14px] text-ink-mute leading-relaxed">{p.desc}</p>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <Eyebrow number="02">{c.payment.tuitionEyebrow}</Eyebrow>
                  {c.payment.tuitionTitle && (
                    <h3 className="mt-4 font-serif text-[28px] text-ink">{c.payment.tuitionTitle}</h3>
                  )}
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-2 border border-rule px-4 py-2 text-[14px] text-ink">
                      <Clock className="h-3.5 w-3.5 text-plum" />{" "}
                      {c.payment.tuitionBadge ? `${c.payment.tuitionBadge} · ${course.tuition}` : course.tuition}
                    </span>
                    {c.payment.tuitionContactLink && (
                      <Link to="/contact-us" className="group inline-flex items-center gap-2 font-serif text-[16px] text-ink">
                        <span className="link-editorial">{c.payment.tuitionContactLink}</span>
                        <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-44 lg:self-start space-y-6">
            <div className="bg-aubergine text-white p-7">
              {c.sidebar.benefitsEyebrow && <Eyebrow tone="paper">{c.sidebar.benefitsEyebrow}</Eyebrow>}
              {c.sidebar.benefitsTitle && (
                <h3 className="mt-3 font-serif text-[22px] text-white">{c.sidebar.benefitsTitle}</h3>
              )}
              <ul className="mt-5 space-y-3">
                {keyBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[14px] text-white/90">
                    <span className="mt-2 h-1 w-1 rounded-full bg-bloom shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {(c.sidebar.helpEyebrow || c.sidebar.helpTitle || c.sidebar.helpLink) && (
              <div className="bg-white border border-rule p-7">
                {c.sidebar.helpEyebrow && <p className="eyebrow text-ink-mute">{c.sidebar.helpEyebrow}</p>}
                {c.sidebar.helpTitle && (
                  <h3 className="mt-3 font-serif text-[18px] text-ink leading-snug">
                    {c.sidebar.helpTitle}
                  </h3>
                )}
                {c.sidebar.helpLink && (
                  <Link
                    to="/contact-us"
                    className="mt-5 group inline-flex items-center gap-2 font-serif text-[16px] text-ink"
                  >
                    <span className="link-editorial">{c.sidebar.helpLink}</span>
                    <ArrowUpRight className="h-4 w-4 transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-paper-soft py-20 md:py-28 border-t border-rule">
          <div className="container-wide">
            <div className="flex items-end justify-between gap-4 mb-12">
              <div>
                {c.related.eyebrow && <Eyebrow>{c.related.eyebrow}</Eyebrow>}
                {c.related.title && (
                  <h2 className="mt-4 font-serif text-display-sm text-ink">{c.related.title}</h2>
                )}
              </div>
              {c.related.allLink && (
                <Link
                  to="/programmes"
                  className="group inline-flex items-center gap-2 font-serif text-lg text-ink"
                >
                  <ArrowLeft className="h-4 w-4 transition-snap group-hover:-translate-x-0.5" />
                  <span className="link-editorial">{c.related.allLink}</span>
                </Link>
              )}
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to={`/programmes/${r.slug}`} className="group block">
                  <div className="relative aspect-[5/4] overflow-hidden bg-paper-deep">
                    <img
                      src={r.img}
                      alt={r.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="pt-5">
                    <p className="eyebrow eyebrow-plum">{r.levelGroup} · {r.universityShort}</p>
                    <h3 className="mt-3 font-serif text-[22px] text-ink leading-tight transition-snap group-hover:text-plum">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

const CourseNotFound = () => {
  const c = useContent("courseDetail");
  return (
    <PageLayout>
      <Seo
        title="Programme Not Found | UeCampus"
        description={PAGE_META.notFound.description}
        canonicalPath="/programmes"
        noindex
      />
      <section className="container-wide py-32 text-center">
        {c.notFound.eyebrow && <p className="eyebrow">{c.notFound.eyebrow}</p>}
        <h1 className="mt-4 font-serif text-display text-ink">{c.notFound.title}<span className="text-ember">.</span></h1>
        {c.notFound.body && (
          <p className="mt-6 font-serif text-[18px] text-ink-mute">
            {c.notFound.body}
          </p>
        )}
        {c.notFound.backLink && (
          <Link
            to="/programmes"
            className="mt-10 group inline-flex items-center gap-2 bg-aubergine text-white px-7 py-3.5 text-[13px] font-medium hover:bg-plum transition-snap"
          >
            <ArrowLeft className="h-4 w-4 transition-snap group-hover:-translate-x-0.5" />
            {c.notFound.backLink}
          </Link>
        )}
      </section>
    </PageLayout>
  );
};

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const rec = useCourse(slug);
  const course = rec?.record;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [course]);

  if (!course) {
    return <CourseNotFound />;
  }

  return <CourseDetailBody course={course} changed={rec?.changed ?? []} />;
};

export default CourseDetail;
