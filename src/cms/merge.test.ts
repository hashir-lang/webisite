import { describe, expect, it } from "vitest";
import { blankLike, deepEqual, diffContent, mergeContent } from "./merge";

const DEFAULTS = {
  hero: { title: "Hello", subtitle: "World", bullets: ["a", "b"] },
  faqs: [
    { q: "Q1", a: "A1" },
    { q: "Q2", a: "A2" },
  ],
  show: true,
  count: 3,
};

describe("mergeContent", () => {
  it("returns defaults untouched when there is no override", () => {
    expect(mergeContent(DEFAULTS, null)).toEqual(DEFAULTS);
    expect(mergeContent(DEFAULTS, undefined)).toEqual(DEFAULTS);
    expect(mergeContent(DEFAULTS, "junk")).toEqual(DEFAULTS);
  });

  it("overrides nested strings and keeps siblings", () => {
    const out = mergeContent(DEFAULTS, { hero: { title: "Hi" } });
    expect(out.hero.title).toBe("Hi");
    expect(out.hero.subtitle).toBe("World");
    expect(out.hero.bullets).toEqual(["a", "b"]);
  });

  it("replaces arrays wholesale so items can be added, removed and reordered", () => {
    const out = mergeContent(DEFAULTS, { faqs: [{ q: "Q2", a: "A2" }, { q: "New", a: "N" }, { q: "Q1", a: "A1" }] });
    expect(out.faqs.map((f) => f.q)).toEqual(["Q2", "New", "Q1"]);
    expect(mergeContent(DEFAULTS, { hero: { bullets: [] } }).hero.bullets).toEqual([]);
  });

  it("treats an empty string as a deliberate removal", () => {
    expect(mergeContent(DEFAULTS, { hero: { subtitle: "" } }).hero.subtitle).toBe("");
  });

  it("ignores wrong-kind values and unknown keys", () => {
    const out = mergeContent(DEFAULTS, { hero: "nope", show: "yes", count: "3", extra: 1 } as unknown);
    expect(out).toEqual(DEFAULTS);
    expect("extra" in out).toBe(false);
  });
});

describe("diffContent", () => {
  it("is null when nothing changed", () => {
    expect(diffContent(DEFAULTS, structuredClone(DEFAULTS))).toBeNull();
  });

  it("returns only the changed leaves", () => {
    const edited = structuredClone(DEFAULTS);
    edited.hero.title = "Hi";
    edited.count = 4;
    expect(diffContent(DEFAULTS, edited)).toEqual({ hero: { title: "Hi" }, count: 4 });
  });

  it("returns a whole array when any item differs", () => {
    const edited = structuredClone(DEFAULTS);
    edited.faqs.push({ q: "Q3", a: "A3" });
    expect(diffContent(DEFAULTS, edited)).toEqual({ faqs: edited.faqs });
  });

  it("round-trips: merge(defaults, diff(defaults, edited)) === edited", () => {
    const edited = structuredClone(DEFAULTS);
    edited.hero.bullets = ["z"];
    edited.faqs = [];
    edited.show = false;
    const sparse = diffContent(DEFAULTS, edited);
    expect(mergeContent(DEFAULTS, sparse)).toEqual(edited);
  });
});

describe("helpers", () => {
  it("deepEqual compares structurally", () => {
    expect(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(deepEqual([1, 2], [2, 1])).toBe(false);
  });

  it("blankLike builds an empty value of the same shape", () => {
    expect(blankLike("text")).toBe("");
    expect(blankLike(5)).toBe(0);
    expect(blankLike(true)).toBe(false);
    expect(blankLike(["x"])).toEqual([]);
    expect(blankLike({ q: "Q", a: "A", tags: ["t"] })).toEqual({ q: "", a: "", tags: [] });
  });
});
