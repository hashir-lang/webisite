import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ExternalLink, Loader2, RefreshCw, RotateCcw, Search } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchCmsPages, saveCmsPage, UnauthorizedError } from "@/lib/api";
import { useCms } from "@/cms/ContentProvider";
import { PAGE_LIST, metaKeyForPath } from "@/cms/registry";
import type { CmsState, MetaOverride } from "@/cms/types";
import { PAGE_META } from "@/seo/siteMeta";
import { courseSeoDefaults, partnerSeoDefaults } from "@/cms/records";
import { courses } from "@/data/courses";
import { partners, partnerHref } from "@/data/partners";

type Group = "Pages" | "Programmes" | "Partners";

type Row = {
  key: string;
  path: string;
  label: string;
  group: Group;
  defaults: { title: string; description: string; keywords: string };
};

/** Every route on the site with its compiled SEO defaults — the same values each page's <Seo> uses. */
function buildRows(): Row[] {
  const rows: Row[] = [];
  const seenPaths = new Set<string>();

  // Static pages the CMS knows (with their labels), then any other PAGE_META route.
  for (const def of PAGE_LIST) {
    if (!def.meta) continue;
    rows.push({ key: def.key, path: def.path, label: def.label, group: "Pages", defaults: def.meta });
    seenPaths.add(def.path);
  }
  for (const m of Object.values(PAGE_META)) {
    if (seenPaths.has(m.path)) continue;
    rows.push({ key: metaKeyForPath(m.path), path: m.path, label: m.title.split("|")[0].trim(), group: "Pages", defaults: m });
    seenPaths.add(m.path);
  }

  // The blog index is rendered by PHP (blog/index.php) but reads the same row
  // from cms_pages; these defaults mirror the ones written there. Individual
  // articles carry their own SEO fields in the Blog editor.
  rows.push({
    key: metaKeyForPath("/blog"),
    path: "/blog",
    label: "Blog (journal index)",
    group: "Pages",
    defaults: {
      title: "Blog | Online Study, Careers & Qualifications | UeCampus",
      description:
        "Guides on online study, UK qualifications, career growth and degree recognition from the UeCampus academic team.",
      keywords: "online education blog, distance learning tips, online study advice, uecampus blog",
    },
  });

  // Programme pages: the same precedence CourseDetail uses (hand-written
  // override file first, generated tags otherwise). Duplicate listings that
  // canonicalise to another slug share that slug's tags, so they are skipped.
  for (const c of courses) {
    if (c.canonicalSlug) continue;
    const path = `/programmes/${c.slug}`;
    rows.push({ key: metaKeyForPath(path), path, label: c.title, group: "Programmes", defaults: courseSeoDefaults(c) });
  }

  for (const p of partners) {
    const path = partnerHref(p);
    rows.push({ key: metaKeyForPath(path), path, label: p.name, group: "Partners", defaults: partnerSeoDefaults(p) });
  }
  return rows;
}

const cleanMeta = (m: MetaOverride): MetaOverride | null => {
  const out: MetaOverride = {};
  if (m.title?.trim()) out.title = m.title.trim();
  if (m.description?.trim()) out.description = m.description.trim();
  if (m.keywords?.trim()) out.keywords = m.keywords.trim();
  if (m.ogImage?.trim()) out.ogImage = m.ogImage.trim();
  if (m.noindex) out.noindex = true;
  return Object.keys(out).length ? out : null;
};

const inputCls =
  "w-full bg-paper border border-rule px-3 py-2 text-[14px] text-ink outline-none focus:border-ink transition-snap";

const Count = ({ n, max }: { n: number; max: number }) => (
  <span className={`font-mono text-[10px] ml-2 ${n > max ? "text-ember" : "text-ink-mute"}`}>
    {n}/{max}
  </span>
);

/** One row: the effective tags, expandable into an inline editor. */
const SeoRow = ({
  row,
  override,
  onSaved,
  disabled = false,
}: {
  row: Row;
  override: MetaOverride | undefined;
  onSaved: (key: string, meta: MetaOverride | null) => void;
  /** True while the saved tags could not be loaded — editing would overwrite them blind. */
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<MetaOverride>(override ?? {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(override ?? {});
  }, [override]);

  const eff = {
    title: override?.title || row.defaults.title,
    description: override?.description || row.defaults.description,
    keywords: override?.keywords || row.defaults.keywords,
  };
  const edited = Boolean(override && Object.keys(override).length);

  const save = async (meta: MetaOverride | null) => {
    setSaving(true);
    setError("");
    try {
      await saveCmsPage(row.key, undefined, meta); // meta only — page text untouched
      onSaved(row.key, meta);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr className="border-b border-rule hover:bg-paper-soft/60 align-top">
        <td className="px-3.5 py-3">
          <button onClick={() => setOpen((o) => !o)} className="text-left font-medium text-ink hover:text-plum">
            {row.label}
          </button>
          <a
            href={row.path}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[11px] text-ink-mute mt-0.5 hover:text-plum"
          >
            {row.path} <ExternalLink className="inline h-3 w-3" />
          </a>
        </td>
        <td className="px-3.5 py-3 max-w-[320px]">
          <span className="text-ink">{eff.title}</span>
          <Count n={eff.title.length} max={60} />
        </td>
        <td className="px-3.5 py-3 max-w-[420px] text-ink-soft">
          {eff.description}
          <Count n={eff.description.length} max={155} />
        </td>
        <td className="px-3.5 py-3 max-w-[260px] text-ink-mute text-[12.5px]">{eff.keywords}</td>
        <td className="px-3.5 py-3 whitespace-nowrap">
          {override?.noindex && <span className="block text-[11px] text-ember mb-1">noindex</span>}
          {edited ? (
            <span className="inline-block bg-plum-paper text-plum px-2.5 py-0.5 rounded-full text-[12px]">Customised</span>
          ) : (
            <span className="text-ink-mute">Default</span>
          )}
        </td>
        <td className="px-3.5 py-3 text-right whitespace-nowrap">
          <button
            onClick={() => setOpen((o) => !o)}
            disabled={disabled}
            title={disabled ? "Editing is disabled until the saved tags can be loaded" : undefined}
            className="text-[13px] text-plum hover:underline disabled:opacity-40 disabled:no-underline"
          >
            {open ? "Close" : "Edit"}
          </button>
        </td>
      </tr>
      {open && !disabled && (
        <tr className="border-b border-rule bg-paper-soft/40">
          <td colSpan={6} className="px-3.5 py-5">
            <div className="max-w-[760px] space-y-4">
              {error && <p className="text-[13px] text-ember">{error}</p>}
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute block mb-1.5">
                  Title tag <Count n={(draft.title?.trim() || row.defaults.title).length} max={60} />
                </span>
                <input
                  type="text"
                  value={draft.title ?? ""}
                  placeholder={row.defaults.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute block mb-1.5">
                  Meta description <Count n={(draft.description?.trim() || row.defaults.description).length} max={155} />
                </span>
                <textarea
                  rows={3}
                  value={draft.description ?? ""}
                  placeholder={row.defaults.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                  className={`${inputCls} resize-y leading-relaxed`}
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute block mb-1.5">Keywords</span>
                <input
                  type="text"
                  value={draft.keywords ?? ""}
                  placeholder={row.defaults.keywords}
                  onChange={(e) => setDraft((d) => ({ ...d, keywords: e.target.value }))}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute block mb-1.5">
                  Social share image URL (optional)
                </span>
                <input
                  type="text"
                  value={draft.ogImage ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, ogImage: e.target.value }))}
                  className={inputCls}
                />
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={draft.noindex === true}
                  onChange={(e) => setDraft((d) => ({ ...d, noindex: e.target.checked }))}
                  className="h-4 w-4 accent-plum"
                />
                <span className="text-[14px] text-ink">Hide from search engines (noindex)</span>
              </label>
              <p className="text-[11px] text-ink-mute">Leave a field empty to use its default.</p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => save(cleanMeta(draft))}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-aubergine text-white px-4 py-2 text-[13px] font-medium hover:bg-plum transition-snap disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
                </button>
                {edited && (
                  <button
                    onClick={() => save(null)}
                    disabled={saving}
                    className="inline-flex items-center gap-2 border border-rule px-4 py-2 text-[13px] text-ink hover:border-ember hover:text-ember transition-snap disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Back to default
                  </button>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

/** Every page on the site with its title, description and keywords, editable in place. */
const AdminSeo = () => {
  const navigate = useNavigate();
  const { refresh } = useCms();
  const rows = useMemo(buildRows, []);
  const [state, setState] = useState<CmsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<Group | "All">("All");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setState(await fetchCmsPages());
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(
        `Couldn't load the saved SEO tags from the server (${
          err instanceof Error ? err.message : "no response"
        }). The table shows the built-in tags; editing is disabled until the server responds — if api/admin/content.php has not been uploaded yet, upload the api/ folder.`,
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const onSaved = (key: string, meta: MetaOverride | null) => {
    setState((s) => {
      if (!s) return s;
      const pages = { ...s.pages };
      const prev = pages[key] ?? {};
      if (meta === null && !prev.content) delete pages[key];
      else pages[key] = { ...prev, meta };
      return { ...s, pages };
    });
    void refresh();
  };

  const needle = q.trim().toLowerCase();
  const visible = rows.filter(
    (r) =>
      (group === "All" || r.group === group) &&
      (!needle ||
        r.label.toLowerCase().includes(needle) ||
        r.path.toLowerCase().includes(needle) ||
        r.defaults.title.toLowerCase().includes(needle)),
  );
  const customised = rows.filter((r) => state?.pages[r.key]?.meta).length;

  return (
    <AdminLayout
      title="SEO tags"
      subtitle={loading ? "Loading…" : `${rows.length} pages · ${customised} with custom tags`}
      actions={
        <button
          onClick={load}
          className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[13px] text-ink hover:border-ink transition-snap"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      }
    >
      {error && (
        <div className="bg-ember/10 border border-ember/30 text-ember text-[13px] px-4 py-3 mb-6">{error}</div>
      )}

      <p className="text-[13.5px] text-ink-mute mb-5 max-w-[80ch] leading-relaxed">
        The title tag, meta description and keywords every page sends to search engines. Click a page to
        change them; changes are live immediately. Aim for titles under 60 characters and descriptions under
        155 so they display in full.
      </p>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <label className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-mute" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by page, URL or title…"
            className={`${inputCls} pl-9`}
          />
        </label>
        <div className="flex gap-2">
          {(["All", "Pages", "Programmes", "Partners"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`px-3.5 py-2 text-[13px] border transition-snap ${
                group === g ? "bg-aubergine text-white border-aubergine" : "border-rule text-ink hover:border-ink"
              }`}
            >
              {g}
              <span className="ml-1.5 opacity-60">{g === "All" ? rows.length : rows.filter((r) => r.group === g).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-paper border border-rule overflow-x-auto">
        {loading ? (
          <div className="py-20 flex items-center justify-center text-ink-mute">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-[13.5px] border-collapse">
            <thead>
              <tr className="bg-paper-soft text-left">
                {["Page", "Title tag", "Meta description", "Keywords", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute font-semibold px-3.5 py-3 border-b border-rule whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3.5 py-10 text-center text-ink-mute">No pages match.</td>
                </tr>
              ) : (
                visible.map((r) => (
                  <SeoRow
                    key={r.key}
                    row={r}
                    override={state?.pages[r.key]?.meta ?? undefined}
                    onSaved={onSaved}
                    disabled={state === null}
                  />
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSeo;
