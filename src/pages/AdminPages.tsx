import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, Globe, Loader2, PencilLine, RefreshCw, Search } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { fetchCmsPages, UnauthorizedError } from "@/lib/api";
import { PAGE_LIST, metaKeyForPath } from "@/cms/registry";
import { allCoursesForAdmin, courseCanonicalPath, courseContentKey, partnerContentKey } from "@/cms/records";
import { partners } from "@/data/partners";
import type { CmsState } from "@/cms/types";

const fmtDate = (utc?: string) => {
  if (!utc) return "";
  const d = new Date(utc.replace(" ", "T") + "Z");
  return isNaN(d.getTime())
    ? utc
    : d.toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

/** One row of any of the tables below. */
type Row = {
  /** What /admin/pages/<editKey> opens. */
  editKey: string;
  /** Where the page's text overrides are stored. */
  contentKey: string;
  /** Where its SEO overrides are stored (null = not a routed page). */
  metaKey: string | null;
  label: string;
  path: string;
  note?: string;
};

const th = "font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute font-semibold px-3.5 py-3 border-b border-rule whitespace-nowrap";
const badge = "inline-block bg-plum-paper text-plum px-2.5 py-0.5 rounded-full text-[12px]";

const Table = ({ rows, state, empty }: { rows: Row[]; state: CmsState | null; empty: string }) => (
  <div className="bg-paper border border-rule overflow-x-auto">
    <table className="w-full text-[13.5px] border-collapse">
      <thead>
        <tr className="bg-paper-soft text-left">
          {["Page", "URL", "Text", "SEO tags", "Last change", ""].map((h) => (
            <th key={h} className={th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-3.5 py-8 text-center text-ink-mute">{empty}</td>
          </tr>
        ) : (
          rows.map((r) => {
            const entry = state?.pages[r.contentKey];
            const metaEntry = r.metaKey ? state?.pages[r.metaKey] : undefined;
            const textEdited = Boolean(entry?.content);
            const seoEdited = Boolean(metaEntry?.meta);
            const last = entry?.updated_at || metaEntry?.updated_at;
            const by = entry?.updated_by || metaEntry?.updated_by;
            return (
              <tr key={r.editKey} className="border-b border-rule last:border-b-0 hover:bg-paper-soft/60 align-top">
                <td className="px-3.5 py-3">
                  <Link to={`/admin/pages/${r.editKey}`} className="font-medium text-ink hover:text-plum">
                    {r.label}
                  </Link>
                  {r.note && <span className="block text-[11px] text-ink-mute mt-0.5">{r.note}</span>}
                </td>
                <td className="px-3.5 py-3 text-ink-mute whitespace-nowrap">
                  {r.path.includes("*") ? (
                    <span>{r.path}</span>
                  ) : (
                    <a href={r.path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-plum">
                      {r.path} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </td>
                <td className="px-3.5 py-3">
                  {textEdited ? <span className={badge}>Customised</span> : <span className="text-ink-mute">Default</span>}
                </td>
                <td className="px-3.5 py-3">
                  {!r.metaKey ? (
                    <span className="text-ink-mute">—</span>
                  ) : seoEdited ? (
                    <span className={badge}>Customised</span>
                  ) : (
                    <span className="text-ink-mute">Default</span>
                  )}
                </td>
                <td className="px-3.5 py-3 text-ink-mute whitespace-nowrap">
                  {last ? (
                    <>
                      {fmtDate(last)}
                      {by && <span className="block text-[11px]">by {by}</span>}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3.5 py-3 text-right whitespace-nowrap">
                  <Link to={`/admin/pages/${r.editKey}`} className="inline-flex items-center gap-1.5 text-[13px] text-plum hover:underline">
                    <PencilLine className="h-3.5 w-3.5" /> Edit
                  </Link>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

/** Every editable page — static pages, then every programme and partner — with what has been customised. */
const AdminPages = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<CmsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

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
      setError(err instanceof Error ? err.message : "Could not load pages");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const globalRows: Row[] = PAGE_LIST.filter((p) => p.group === "Global").map((p) => ({
    editKey: p.key, contentKey: p.key, metaKey: null, label: p.label, path: p.path,
  }));
  const pageRows: Row[] = PAGE_LIST.filter((p) => p.group === "Pages").map((p) => ({
    editKey: p.key,
    contentKey: p.key,
    metaKey: p.meta ? metaKeyForPath(p.path) : null,
    label: p.label,
    path: p.path,
    note: Object.keys(p.defaults).length === 0 ? "No text registered yet" : undefined,
  }));

  const courseRows: Row[] = useMemo(
    () =>
      allCoursesForAdmin().map((c) => ({
        editKey: courseContentKey(c).slice(1),
        contentKey: courseContentKey(c),
        metaKey: metaKeyForPath(courseCanonicalPath(c)),
        label: c.title,
        path: courseContentKey(c),
        note: [c.universityShort, c.hidden ? "hidden from listings" : ""].filter(Boolean).join(" · "),
      })),
    [],
  );
  const partnerRows: Row[] = partners.map((p) => ({
    editKey: partnerContentKey(p).slice(1),
    contentKey: partnerContentKey(p),
    metaKey: metaKeyForPath(partnerContentKey(p)),
    label: p.name,
    path: partnerContentKey(p),
  }));

  const needle = q.trim().toLowerCase();
  const match = (r: Row) => !needle || r.label.toLowerCase().includes(needle) || r.path.toLowerCase().includes(needle);
  const customised = Object.keys(state?.pages ?? {}).length;
  const total = globalRows.length + pageRows.length + courseRows.length + partnerRows.length;

  return (
    <AdminLayout
      title="Pages & content"
      subtitle={loading ? "Loading…" : `${total} editable pages · ${customised} with changes`}
      actions={
        <>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[13px] text-ink hover:border-ink transition-snap"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <Link
            to="/admin/seo"
            className="inline-flex items-center gap-2 bg-aubergine text-white px-4 py-2.5 text-[13px] font-medium hover:bg-plum transition-snap"
          >
            <Globe className="h-3.5 w-3.5" /> All SEO tags
          </Link>
        </>
      }
    >
      {error && (
        <div className="bg-ember/10 border border-ember/30 text-ember text-[13px] px-4 py-3 mb-6">{error}</div>
      )}

      <p className="text-[13.5px] text-ink-mute mb-5 max-w-[72ch] leading-relaxed">
        Change any text on the site — headings, paragraphs, bullet lists, cards, buttons, programme
        details — and its SEO title, description and keywords. Changes go live the moment you save;
        nothing needs rebuilding or re-uploading. Every field can be reset to the original wording.
      </p>

      <label className="relative block max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-mute" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pages, programmes, partners…"
          className="w-full bg-paper border border-rule pl-9 pr-3 py-2 text-[14px] text-ink outline-none focus:border-ink transition-snap"
        />
      </label>

      {loading ? (
        <div className="py-20 flex items-center justify-center text-ink-mute">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <>
          {[
            { heading: "Shown on every page", rows: globalRows.filter(match) },
            { heading: "Pages", rows: pageRows.filter(match) },
            { heading: `Programmes (${courseRows.length})`, rows: courseRows.filter(match) },
            { heading: `Partners (${partnerRows.length})`, rows: partnerRows.filter(match) },
          ].map((s) =>
            needle && s.rows.length === 0 ? null : (
              <section key={s.heading} className="mb-10">
                <h2 className="eyebrow text-ink-mute mb-3">{s.heading}</h2>
                <Table rows={s.rows} state={state} empty="Nothing matches." />
              </section>
            ),
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminPages;
