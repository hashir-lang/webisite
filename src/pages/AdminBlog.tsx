import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Loader2, Newspaper, Trash2, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  fetchPosts,
  deletePost,
  blogUrl,
  UnauthorizedError,
  type BlogPostSummary,
} from "@/lib/api";

const fmtDate = (utc: string | null) => {
  if (!utc) return "—";
  const d = new Date(utc.replace(" ", "T") + "Z");
  return isNaN(d.getTime())
    ? utc
    : d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

const AdminBlog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPosts((await fetchPosts()).posts);
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Could not load articles");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (post: BlogPostSummary) => {
    if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setDeleting(post.id);
    setError("");
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Could not delete the article");
    } finally {
      setDeleting(null);
    }
  };

  const published = posts.filter((p) => p.status === "published").length;

  return (
    <AdminLayout
      title="Blog"
      subtitle={
        loading
          ? "Loading…"
          : `${posts.length} ${posts.length === 1 ? "article" : "articles"} · ${published} published`
      }
      actions={
        <>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[13px] text-ink hover:border-ink transition-snap"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 bg-aubergine text-white px-4 py-2.5 text-[13px] font-medium hover:bg-plum transition-snap"
          >
            <Plus className="h-3.5 w-3.5" /> New article
          </Link>
        </>
      }
    >
      {error && (
        <div className="bg-ember/10 border border-ember/30 text-ember text-[13px] px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-paper border border-rule overflow-x-auto">
        {loading ? (
          <div className="py-20 flex items-center justify-center text-ink-mute">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center text-ink-mute text-[14px]">
            <Newspaper className="h-6 w-6 mx-auto mb-3 opacity-60" />
            No articles yet.
            <div className="mt-4">
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center gap-2 bg-aubergine text-white px-4 py-2.5 text-[13px] font-medium hover:bg-plum transition-snap"
              >
                <Plus className="h-3.5 w-3.5" /> Write your first article
              </Link>
            </div>
          </div>
        ) : (
          <table className="w-full text-[13.5px] border-collapse">
            <thead>
              <tr className="bg-paper-soft text-left">
                {["Title", "Status", "Category", "Published", "Views", ""].map((h, i) => (
                  <th
                    key={h || i}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute font-semibold px-3.5 py-3 border-b border-rule whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-rule last:border-b-0 hover:bg-paper-soft/60">
                  <td className="px-3.5 py-3">
                    <Link to={`/admin/blog/${p.id}`} className="font-medium hover:text-plum transition-snap">
                      {p.title}
                    </Link>
                    <div className="font-mono text-[11.5px] text-ink-mute mt-0.5">/blog/{p.slug}</div>
                  </td>
                  <td className="px-3.5 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-[0.08em] ${
                        p.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-paper-soft text-ink-mute"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">{p.category || "—"}</td>
                  <td className="px-3.5 py-3 text-ink-mute whitespace-nowrap">{fmtDate(p.published_at)}</td>
                  <td className="px-3.5 py-3 text-ink-mute">{p.views}</td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                      {p.status === "published" && (
                        <a
                          href={blogUrl(`/blog/${p.slug}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-mute hover:text-plum transition-snap"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> View
                        </a>
                      )}
                      <Link
                        to={`/admin/blog/${p.id}`}
                        className="text-[12.5px] text-ink-mute hover:text-plum transition-snap"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        disabled={deleting === p.id}
                        className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-mute hover:text-ember transition-snap disabled:opacity-50"
                      >
                        {deleting === p.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
