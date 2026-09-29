import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, Loader2, RotateCcw } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentEditor from "@/components/admin/ContentEditor";
import { fetchCmsPages, resetCmsPage, saveCmsPage, UnauthorizedError } from "@/lib/api";
import { useCms } from "@/cms/ContentProvider";
import { diffContent, mergeContent } from "@/cms/merge";
import { PAGES, isPageKey, metaKeyForPath, type PageDef } from "@/cms/registry";
import { recordPageDef } from "@/cms/records";
import type { ContentObject, MetaOverride } from "@/cms/types";

type Tab = "content" | "seo";

const cleanMeta = (m: MetaOverride): MetaOverride | null => {
  const out: MetaOverride = {};
  if (m.title?.trim()) out.title = m.title.trim();
  if (m.description?.trim()) out.description = m.description.trim();
  if (m.keywords?.trim()) out.keywords = m.keywords.trim();
  if (m.ogImage?.trim()) out.ogImage = m.ogImage.trim();
  if (m.noindex) out.noindex = true;
  return Object.keys(out).length ? out : null;
};

const Counter = ({ n, max }: { n: number; max: number }) => (
  <span className={`font-mono text-[11px] ${n > max ? "text-ember" : "text-ink-mute"}`}>
    {n}/{max}
  </span>
);

const inputCls =
  "w-full bg-paper border border-rule px-3 py-2 text-[14px] text-ink outline-none focus:border-ink transition-snap";

/**
 * Edit one page: every piece of its text, plus its SEO tags.
 *
 * The URL after /admin/pages/ is either a registry key ("about") or a record
 * page's own path ("programmes/<slug>", "partners/<slug>"). Text is stored
 * under the page's key; SEO tags under the key <Seo> looks up for the page's
 * canonical path — the same row for almost every page, a different one only
 * for a duplicate programme listing that canonicalises to another slug.
 */
const AdminPageEditor = () => {
  const params = useParams();
  const key = params["*"] ?? "";
  const navigate = useNavigate();
  const { refresh } = useCms();
  const def = useMemo<PageDef | null>(
    () => (isPageKey(key) ? (PAGES[key] as PageDef) : recordPageDef(key)),
    [key],
  );
  const metaKey = def?.meta ? metaKeyForPath(def.path) : null;

  const [tab, setTab] = useState<Tab>("content");
  // Starts as the compiled copy — what the site shows with no overrides — so
  // the form is never empty, even before or without a successful load.
  const [value, setValue] = useState<ContentObject>(() => def?.defaults ?? {});
  const [meta, setMeta] = useState<MetaOverride>({});
  const [loading, setLoading] = useState(true);
  // True when the saved changes could not be fetched: the form then shows the
  // built-in text and saving is blocked, so a stale form can never overwrite
  // edits that are live but unseen.
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!def) return;
    setLoading(true);
    setError("");
    try {
      const state = await fetchCmsPages();
      const entry = state.pages[def.key];
      setValue(mergeContent(def.defaults, entry?.content));
      setMeta((metaKey ? state.pages[metaKey]?.meta : null) ?? {});
      setDirty(false);
      setLoadFailed(false);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setValue(def.defaults);
      setMeta({});
      setLoadFailed(true);
      setError(
        `Couldn't load this page's saved changes from the server (${
          err instanceof Error ? err.message : "no response"
        }). The fields show the built-in text; saving is disabled until the server responds — if api/admin/content.php has not been uploaded yet, upload the api/ folder.`,
      );
    } finally {
      setLoading(false);
    }
  }, [def, metaKey, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  if (!def) {
    return (
      <AdminLayout title="Unknown page">
        <p className="text-[14px] text-ink-mute">
          There is no editable page called “{key}”.{" "}
          <Link to="/admin/pages" className="text-plum hover:underline">Back to pages</Link>
        </p>
      </AdminLayout>
    );
  }

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const content = diffContent(def.defaults, value);
      const cleaned = def.meta ? cleanMeta(meta) : null;
      if (metaKey && metaKey !== def.key) {
        await saveCmsPage(def.key, content, undefined);
        await saveCmsPage(metaKey, undefined, cleaned);
      } else {
        await saveCmsPage(def.key, content, cleaned);
      }
      await refresh(); // the admin's own copy of the site content
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const resetAll = async () => {
    if (!confirm(`Reset every text and SEO change on “${def.label}” back to the original?`)) return;
    setSaving(true);
    setError("");
    try {
      if (metaKey && metaKey !== def.key) {
        // The canonical row also holds another programme's text — clear only
        // this page's own row and the shared row's SEO tags.
        await saveCmsPage(def.key, null, undefined);
        await saveCmsPage(metaKey, undefined, null);
      } else {
        await resetCmsPage(def.key);
      }
      await refresh();
      setValue(def.defaults);
      setMeta({});
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset");
    } finally {
      setSaving(false);
    }
  };

  const setM = (patch: Partial<MetaOverride>) => {
    setMeta((m) => ({ ...m, ...patch }));
    setDirty(true);
  };

  const effTitle = meta.title?.trim() || def.meta?.title || "";
  const effDesc = meta.description?.trim() || def.meta?.description || "";

  return (
    <AdminLayout
      title={def.label}
      subtitle={
        def.path.includes("*") ? (
          def.path
        ) : (
          <a href={def.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-plum">
            {def.path} <ExternalLink className="h-3 w-3" />
          </a>
        )
      }
      actions={
        <>
          <Link
            to="/admin/pages"
            className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[13px] text-ink hover:border-ink transition-snap"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All pages
          </Link>
          <button
            onClick={resetAll}
            disabled={saving || loading || loadFailed}
            className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[13px] text-ink hover:border-ember hover:text-ember transition-snap disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset page
          </button>
          <button
            onClick={save}
            disabled={saving || loading || loadFailed}
            title={loadFailed ? "Saving is disabled until the saved changes can be loaded" : undefined}
            className="inline-flex items-center gap-2 bg-aubergine text-white px-5 py-2.5 text-[13px] font-medium hover:bg-plum transition-snap disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
            {saved ? "Saved — live now" : dirty ? "Save changes" : "Save"}
          </button>
        </>
      }
    >
      {error && (
        <div className="bg-ember/10 border border-ember/30 text-ember text-[13px] px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="max-w-[90ch] leading-relaxed">{error}</span>
          {loadFailed && (
            <button onClick={load} className="shrink-0 underline hover:no-underline">
              Try again
            </button>
          )}
        </div>
      )}
      {def.hint && <p className="text-[13.5px] text-ink-mute mb-6 max-w-[80ch] leading-relaxed">{def.hint}</p>}

      {def.meta && (
        <div className="flex gap-6 border-b border-rule mb-8">
          {(["content", "seo"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-[13px] font-medium border-b-2 -mb-px transition-snap ${
                tab === t ? "border-aubergine text-ink" : "border-transparent text-ink-mute hover:text-ink"
              }`}
            >
              {t === "content" ? "Page text" : "SEO tags"}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-20 flex items-center justify-center text-ink-mute">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : tab === "content" || !def.meta ? (
        <div className="max-w-[900px]">
          <ContentEditor
            defaults={def.defaults}
            value={value}
            onChange={(v) => {
              setValue(v);
              setDirty(true);
            }}
            labels={def.labels}
            templates={def.templates}
          />
        </div>
      ) : (
        <div className="max-w-[760px] space-y-6">
          <label className="block">
            <span className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">Title tag</span>
              <Counter n={effTitle.length} max={60} />
            </span>
            <input
              type="text"
              value={meta.title ?? ""}
              placeholder={def.meta.title}
              onChange={(e) => setM({ title: e.target.value })}
              className={inputCls}
            />
            <span className="mt-1 block text-[11px] text-ink-mute">Default: {def.meta.title}</span>
          </label>

          <label className="block">
            <span className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">Meta description</span>
              <Counter n={effDesc.length} max={155} />
            </span>
            <textarea
              rows={3}
              value={meta.description ?? ""}
              placeholder={def.meta.description}
              onChange={(e) => setM({ description: e.target.value })}
              className={`${inputCls} resize-y leading-relaxed`}
            />
            <span className="mt-1 block text-[11px] text-ink-mute">Default: {def.meta.description}</span>
          </label>

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute block mb-1.5">Keywords</span>
            <input
              type="text"
              value={meta.keywords ?? ""}
              placeholder={def.meta.keywords}
              onChange={(e) => setM({ keywords: e.target.value })}
              className={inputCls}
            />
            <span className="mt-1 block text-[11px] text-ink-mute">Default: {def.meta.keywords}</span>
          </label>

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute block mb-1.5">
              Social share image (Open Graph) — URL
            </span>
            <input
              type="text"
              value={meta.ogImage ?? ""}
              placeholder="https://uecampus.com/uecampus-logo.png"
              onChange={(e) => setM({ ogImage: e.target.value })}
              className={inputCls}
            />
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={meta.noindex === true}
              onChange={(e) => setM({ noindex: e.target.checked })}
              className="h-4 w-4 accent-plum"
            />
            <span className="text-[14px] text-ink">Hide from search engines (noindex)</span>
          </label>

          <div className="border border-rule bg-paper p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute mb-3">Search result preview</p>
            <p className="text-[13px] text-emerald-800">https://uecampus.com{def.path}</p>
            <p className="text-[18px] text-[#1a0dab] leading-snug mt-0.5">{effTitle}</p>
            <p className="text-[13.5px] text-ink-soft leading-relaxed mt-1">{effDesc}</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPageEditor;
