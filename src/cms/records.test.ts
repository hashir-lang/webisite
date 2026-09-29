import { describe, expect, it } from "vitest";
import { applyOverride, courseContentDefaults, partnerContentDefaults, recordPageDef } from "./records";
import { courses, coursesBySlug } from "@/data/courses";
import { partners, partnerHref } from "@/data/partners";

const sample = courses[0];

describe("courseContentDefaults", () => {
  it("materialises what the page shows, including fallbacks for optional fields", () => {
    const d = courseContentDefaults(sample);
    expect(d.title).toBe(sample.title);
    expect(d.gains).toEqual(sample.gains ?? sample.highlights);
    expect(d.keyBenefits.length).toBeGreaterThan(0);
    expect(Array.isArray(d.modules)).toBe(true);
    for (const m of d.modules) {
      expect(typeof m.title).toBe("string");
      expect(typeof m.note).toBe("string");
      expect(m.items.every((i) => typeof i === "string")).toBe(true);
    }
  });
});

describe("applyOverride", () => {
  it("returns the record untouched when there is no override", () => {
    const { record, changed } = applyOverride(sample, courseContentDefaults(sample), null);
    expect(record).toBe(sample);
    expect(changed).toEqual([]);
  });

  it("applies only the edited fields and leaves absent optionals absent", () => {
    const base = { ...sample, gains: undefined, careerDesc: undefined };
    const defaults = courseContentDefaults(base);
    const { record, changed } = applyOverride(base, defaults, { title: "Renamed", overview: "New overview" });
    expect(record.title).toBe("Renamed");
    expect(record.overview).toBe("New overview");
    expect(record.tagline).toBe(base.tagline);
    // Not edited, so still undefined — the page keeps its own fallback.
    expect(record.gains).toBeUndefined();
    expect(record.careerDesc).toBeUndefined();
    expect(changed).toEqual(["title", "overview"]);
    // Non-text fields (image, slug, level) never come from the CMS.
    expect(record.img).toBe(base.img);
    expect(record.slug).toBe(base.slug);
  });

  it("an edited module list replaces the official unit list wholesale", () => {
    const defaults = courseContentDefaults(sample);
    const modules = [{ title: "Only unit", note: "", items: ["A", "B"] }];
    const { record, changed } = applyOverride(sample, defaults, { modules });
    expect(record.modules).toEqual(modules);
    expect(changed).toEqual(["modules"]);
  });

  it("ignores unknown keys and wrong-kind values", () => {
    const defaults = courseContentDefaults(sample);
    const { record, changed } = applyOverride(sample, defaults, { img: "hacked.jpg", title: 42, nope: "x" });
    expect(record.img).toBe(sample.img);
    expect(record.title).toBe(sample.title); // wrong kind -> default kept
    expect(changed).toEqual(["title"]);
  });
});

describe("recordPageDef", () => {
  it("resolves a programme path (with or without the leading slash) to an editor definition", () => {
    const c = courses.find((x) => !x.canonicalSlug)!;
    const def = recordPageDef(`programmes/${c.slug}`)!;
    expect(def).not.toBeNull();
    expect(def.key).toBe(`/programmes/${c.slug}`);
    expect(def.path).toBe(`/programmes/${c.slug}`);
    expect(def.label).toBe(c.title);
    expect(def.meta?.title).toBeTruthy();
    expect(def.defaults.title).toBe(c.title);
    expect(recordPageDef(`/programmes/${c.slug}`)!.key).toBe(def.key);
  });

  it("keeps a duplicate listing's SEO on the canonical slug while its text stays its own", () => {
    const dup = Object.values(coursesBySlug).find((x) => x.canonicalSlug);
    if (!dup) return; // catalogue has no duplicates — nothing to check
    const def = recordPageDef(`programmes/${dup.slug}`)!;
    expect(def.key).toBe(`/programmes/${dup.slug}`);
    expect(def.path).toBe(`/programmes/${dup.canonicalSlug}`);
  });

  it("resolves every partner by its public URL", () => {
    for (const p of partners) {
      const def = recordPageDef(partnerHref(p).slice(1))!;
      expect(def).not.toBeNull();
      expect(def.label).toBe(p.name);
      expect(def.defaults).toEqual(partnerContentDefaults(p));
    }
  });

  it("returns null for anything else", () => {
    expect(recordPageDef("programmes/does-not-exist")).toBeNull();
    expect(recordPageDef("about")).toBeNull();
    expect(recordPageDef("")).toBeNull();
  });
});
