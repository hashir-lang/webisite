import type { ContentObject, ContentValue } from "./types";

export const isPlainObject = (v: unknown): v is ContentObject =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => k in b && deepEqual(a[k], b[k]));
  }
  return false;
}

/** An override may only replace a default of the same kind — never a string with an array, etc. */
const sameKind = (def: ContentValue, o: unknown): o is ContentValue => {
  if (Array.isArray(def)) return Array.isArray(o);
  if (isPlainObject(def)) return isPlainObject(o);
  return typeof o === typeof def;
};

/**
 * Lay a sparse override over the compiled defaults.
 *
 * - Keys missing from the override keep their default.
 * - Nested objects merge recursively.
 * - Arrays and primitives are replaced wholesale (an empty string or an empty
 *   array is a deliberate "remove this").
 * - Anything of the wrong kind, or a key the defaults don't know, is ignored,
 *   so a stale or hand-edited row can never break a page.
 */
export function mergeContent<T extends ContentObject>(defaults: T, override: unknown): T {
  if (!isPlainObject(override)) return defaults;
  const out: ContentObject = {};
  for (const key of Object.keys(defaults)) {
    const d = defaults[key];
    const o = override[key];
    if (o === undefined || !sameKind(d, o)) {
      out[key] = d;
    } else if (isPlainObject(d)) {
      out[key] = mergeContent(d, o);
    } else {
      out[key] = o;
    }
  }
  return out as T;
}

/**
 * The inverse of mergeContent(): given the defaults and the fully edited
 * object, return only what differs (null when nothing does). This is what the
 * editor saves, so untouched fields keep following the code when it changes.
 */
export function diffContent(defaults: ContentObject, edited: ContentObject): ContentObject | null {
  const out: ContentObject = {};
  for (const key of Object.keys(defaults)) {
    const d = defaults[key];
    const e = edited[key];
    if (e === undefined || !sameKind(d, e)) continue;
    if (isPlainObject(d)) {
      const sub = diffContent(d, e as ContentObject);
      if (sub) out[key] = sub;
    } else if (!deepEqual(d, e)) {
      out[key] = e;
    }
  }
  return Object.keys(out).length ? out : null;
}

/** A blank value with the same shape as `template` — what "Add item" inserts. */
export function blankLike(template: ContentValue | undefined): ContentValue {
  if (template === undefined || typeof template === "string") return "";
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  if (Array.isArray(template)) return [];
  const o: ContentObject = {};
  for (const k of Object.keys(template)) o[k] = blankLike(template[k]);
  return o;
}
