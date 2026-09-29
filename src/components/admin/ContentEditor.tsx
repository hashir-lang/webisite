import { ArrowDown, ArrowUp, Plus, RotateCcw, Trash2 } from "lucide-react";
import { blankLike, deepEqual, isPlainObject } from "@/cms/merge";
import type { ContentObject, ContentValue } from "@/cms/types";

/**
 * A form generated from a page's content shape.
 *
 * `defaults` is the compiled copy (the schema); `value` is the fully merged
 * object being edited. Strings become inputs or textareas, booleans toggles,
 * arrays lists with add / remove / reorder, nested objects grouped sections.
 * Every leaf shows when it differs from the default and can be reset alone.
 */

type Path = (string | number)[];

type Ctx = {
  labels: Record<string, string>;
  templates: Record<string, ContentValue>;
  update: (path: Path, v: ContentValue) => void;
};

const humanize = (k: string) => {
  const s = k.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Dotted path with array indices stripped — the key for labels/templates. */
const dotted = (p: Path) => p.filter((x): x is string => typeof x === "string").join(".");

function setIn(root: ContentValue, path: Path, v: ContentValue): ContentValue {
  if (!path.length) return v;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[head as number] = setIn(copy[head as number], rest, v);
    return copy;
  }
  const obj: ContentObject = isPlainObject(root) ? { ...root } : {};
  obj[head as string] = setIn(obj[head as string], rest, v);
  return obj;
}

const labelFor = (ctx: Ctx, path: Path): string => {
  const last = path[path.length - 1];
  if (typeof last === "number") return `Item ${last + 1}`;
  return ctx.labels[dotted(path)] ?? ctx.labels[last] ?? humanize(last);
};

const truncate = (s: string, n = 90) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/** First string inside an item — used as the collapsed title of a list card. */
const preview = (v: ContentValue): string => {
  if (typeof v === "string") return v;
  if (isPlainObject(v)) {
    for (const k of Object.keys(v)) {
      const s = v[k];
      if (typeof s === "string" && s.trim()) return s;
    }
  }
  return "";
};

const btn =
  "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-snap";

const Label = ({ text, modified, added, onReset }: { text: string; modified: boolean; added?: boolean; onReset?: () => void }) => (
  <span className="flex items-center justify-between gap-3 mb-1.5">
    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
      {text}
      {added && <span className="ml-2 text-emerald-700 normal-case tracking-normal">added</span>}
      {modified && !added && <span className="ml-2 text-plum normal-case tracking-normal">edited</span>}
    </span>
    {modified && onReset && (
      <button type="button" onClick={onReset} className={btn} title="Back to the default text">
        <RotateCcw className="h-3 w-3" /> Reset
      </button>
    )}
  </span>
);

type FieldProps = {
  ctx: Ctx;
  path: Path;
  /** Decides how the field renders; the default value, or a template for added list items. */
  shape: ContentValue;
  /** The compiled default at this path, if there is one (undefined for added list items). */
  def: ContentValue | undefined;
  val: ContentValue | undefined;
};

const inputCls =
  "w-full bg-paper border border-rule px-3 py-2 text-[14px] text-ink outline-none focus:border-ink transition-snap";

function Field({ ctx, path, shape, def, val }: FieldProps) {
  const label = labelFor(ctx, path);
  const added = def === undefined;
  const modified = added || !deepEqual(def, val);
  const reset = !added ? () => ctx.update(path, def) : undefined;

  if (typeof shape === "string") {
    const text = typeof val === "string" ? val : "";
    const defText = typeof def === "string" ? def : "";
    const multiline = defText.length > 70 || text.length > 70 || text.includes("\n") || defText.includes("\n");
    return (
      <label className="block">
        <Label text={label} modified={modified} added={added} onReset={reset} />
        {multiline ? (
          <textarea
            value={text}
            rows={Math.min(12, Math.max(2, Math.ceil(Math.max(text.length, 1) / 80) + 1))}
            onChange={(e) => ctx.update(path, e.target.value)}
            className={`${inputCls} resize-y leading-relaxed`}
          />
        ) : (
          <input type="text" value={text} onChange={(e) => ctx.update(path, e.target.value)} className={inputCls} />
        )}
        {modified && !added && defText !== "" && (
          <span className="mt-1 block text-[11px] text-ink-mute">Default: {truncate(defText)}</span>
        )}
        {text === "" && defText !== "" && (
          <span className="mt-1 block text-[11px] text-ember">Empty — this text will not be shown on the site.</span>
        )}
      </label>
    );
  }

  if (typeof shape === "number") {
    return (
      <label className="block">
        <Label text={label} modified={modified} added={added} onReset={reset} />
        <input
          type="number"
          value={typeof val === "number" ? val : 0}
          onChange={(e) => ctx.update(path, Number(e.target.value))}
          className={`${inputCls} max-w-[160px]`}
        />
      </label>
    );
  }

  if (typeof shape === "boolean") {
    return (
      <label className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          checked={val === true}
          onChange={(e) => ctx.update(path, e.target.checked)}
          className="h-4 w-4 accent-plum"
        />
        <span className="text-[14px] text-ink">{label}</span>
        {modified && !added && (
          <button type="button" onClick={reset} className={btn}>
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </label>
    );
  }

  if (Array.isArray(shape)) {
    const items = Array.isArray(val) ? val : [];
    const defItems = Array.isArray(def) ? def : [];
    const template: ContentValue = defItems[0] ?? ctx.templates[dotted(path)] ?? shape[0] ?? items[0] ?? "";
    const listModified = def !== undefined && !deepEqual(def, items);
    const move = (from: number, to: number) => {
      if (to < 0 || to >= items.length) return;
      const copy = [...items];
      const [it] = copy.splice(from, 1);
      copy.splice(to, 0, it);
      ctx.update(path, copy);
    };
    return (
      <div className="border border-rule">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-paper-soft border-b border-rule">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
            {label} · {items.length} {items.length === 1 ? "item" : "items"}
            {listModified && <span className="ml-2 text-plum normal-case tracking-normal">edited</span>}
          </span>
          <span className="flex items-center gap-4">
            {listModified && (
              <button type="button" onClick={() => ctx.update(path, def as ContentValue)} className={btn}>
                <RotateCcw className="h-3 w-3" /> Reset list
              </button>
            )}
            <button type="button" onClick={() => ctx.update(path, [...items, blankLike(template)])} className={btn}>
              <Plus className="h-3 w-3" /> Add
            </button>
          </span>
        </div>
        {items.length === 0 ? (
          <p className="px-4 py-4 text-[13px] text-ink-mute">Nothing in this list — it will not appear on the site.</p>
        ) : (
          <ol className="divide-y divide-rule">
            {items.map((item, i) => {
              const itemDef = defItems[i];
              const itemShape = itemDef ?? template;
              const title = preview(item);
              return (
                <li key={i} className="px-4 py-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[13px] text-ink truncate">
                      <span className="font-mono text-[10px] text-ink-mute mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {isPlainObject(item) ? title || <span className="text-ink-mute">(empty)</span> : null}
                    </span>
                    <span className="flex items-center gap-3 shrink-0">
                      <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className={btn} title="Move up">
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1} className={btn} title="Move down">
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => ctx.update(path, items.filter((_, j) => j !== i))}
                        className={`${btn} hover:text-ember`}
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </span>
                  </div>
                  {isPlainObject(itemShape) ? (
                    <div className="space-y-4">
                      {Object.keys(itemShape).map((k) => (
                        <Field
                          key={k}
                          ctx={ctx}
                          path={[...path, i, k]}
                          shape={itemShape[k]}
                          def={isPlainObject(itemDef) ? itemDef[k] : undefined}
                          val={isPlainObject(item) ? item[k] : undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <Field ctx={ctx} path={[...path, i]} shape={itemShape} def={itemDef} val={item} />
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  }

  // Nested object → a titled group.
  const obj = isPlainObject(val) ? val : {};
  const defObj = isPlainObject(def) ? def : undefined;
  return (
    <fieldset className="border border-rule p-4 md:p-5">
      <legend className="px-2 font-serif text-[17px] text-ink">{label}</legend>
      <div className="space-y-5">
        {Object.keys(shape).map((k) => (
          <Field key={k} ctx={ctx} path={[...path, k]} shape={shape[k]} def={defObj?.[k]} val={obj[k] ?? blankLike(shape[k])} />
        ))}
      </div>
    </fieldset>
  );
}

type Props = {
  defaults: ContentObject;
  value: ContentObject;
  onChange: (next: ContentObject) => void;
  labels?: Record<string, string>;
  templates?: Record<string, ContentValue>;
};

const ContentEditor = ({ defaults, value, onChange, labels = {}, templates = {} }: Props) => {
  const ctx: Ctx = {
    labels,
    templates,
    update: (path, v) => onChange(setIn(value, path, v) as ContentObject),
  };
  const keys = Object.keys(defaults);
  if (!keys.length) {
    return (
      <p className="text-[14px] text-ink-mute py-6">
        This page has no editable text registered yet.
      </p>
    );
  }
  return (
    <div className="space-y-6">
      {keys.map((k) => (
        <Field key={k} ctx={ctx} path={[k]} shape={defaults[k]} def={defaults[k]} val={value[k]} />
      ))}
    </div>
  );
};

export default ContentEditor;
