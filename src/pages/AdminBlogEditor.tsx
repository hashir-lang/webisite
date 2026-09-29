import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, ExternalLink, Check, ImagePlus, Link2, Code2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  fetchPost,
  fetchPosts,
  savePost,
  uploadBlogImage,
  blogUrl,
  UnauthorizedError,
  type BlogPostInput,
  type BlogStatus,
} from "@/lib/api";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 190);

const EMPTY: BlogPostInput = {
  title: "", slug: "", excerpt: "", body: "", cover_image: "", cover_alt: "",
  category: "", tags: "", author: "UeCampus", meta_title: "", meta_description: "",
  keywords: "", status: "draft",
};

/** Toolbar commands run through execCommand — deprecated, but universally
 *  supported and dependency-free, which is right for an internal authoring tool. */
const TOOLS: { label: string; title: string; cmd: string; val?: string }[] = [
  { label: "H2", title: "Heading", cmd: "formatBlock", val: "h2" },
  { label: "H3", title: "Subheading", cmd: "formatBlock", val: "h3" },
  { label: "B", title: "Bold", cmd: "bold" },
  { label: "I", title: "Italic", cmd: "italic" },
  { label: "• List", title: "Bulleted list", cmd: "insertUnorderedList" },
  { label: "1. List", title: "Numbered list", cmd: "insertOrderedList" },
  { label: "❝", title: "Quote", cmd: "formatBlock", val: "blockquote" },
  { label: "¶", title: "Normal text", cmd: "formatBlock", val: "p" },
];

const AdminBlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;
  const postId = id ? Number(id) : 0;

  const [fields, setFields] = useState<BlogPostInput>(EMPTY);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState<BlogStatus | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState("");
  const [htmlMode, setHtmlMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  const rte = useRef<HTMLDivElement>(null);
  const html = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const slugTouched = useRef(false);
  const seeded = useRef(false);
  const uploadTarget = useRef<"body" | "cover">("body");

  const set = <K extends keyof BlogPostInput>(k: K, v: BlogPostInput[K]) => {
    setFields((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  // Load an existing post. The body is pushed into the contenteditable
  // imperatively — React must not own that subtree or it fights the caret.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isNew) {
        try {
          const { categories } = await fetchPosts();
          if (!cancelled) setCategories(categories);
        } catch {
          // Categories only power the datalist suggestions — a new post is
          // perfectly writable without them.
        }
        return;
      }
      try {
        const { post, categories } = await fetchPost(postId);
        if (cancelled) return;
        slugTouched.current = true;
        setCategories(categories);
        setPublishedSlug(post.status === "published" ? post.slug : "");
        setFields({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          body: post.body,
          cover_image: post.cover_image ?? "",
          cover_alt: post.cover_alt ?? "",
          category: post.category ?? "",
          tags: post.tags ?? "",
          author: post.author,
          meta_title: post.meta_title ?? "",
          meta_description: post.meta_description ?? "",
          keywords: post.keywords ?? "",
          status: post.status,
        });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(err instanceof Error ? err.message : "Could not load the article");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isNew, postId, navigate]);

  // Seed the contenteditable exactly once, after the fetch has resolved and the
  // editor is actually mounted — while `loading` is true the div does not exist,
  // so writing innerHTML from the fetch itself would silently no-op and the
  // post would open blank (and then save blank over its own body).
  useEffect(() => {
    if (loading || seeded.current || !rte.current) return;
    rte.current.innerHTML = fields.body || "";
    seeded.current = true;
  }, [loading, fields.body]);

  const exec = (cmd: string, val?: string) => {
    rte.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const addLink = () => {
    const url = prompt("Link URL (https://…)");
    if (url) exec("createLink", url);
  };

  const pickImage = (target: "body" | "cover") => {
    uploadTarget.current = target;
    file.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const target = uploadTarget.current;
    setUploading(true);
    setError("");
    try {
      const url = await uploadBlogImage(f);
      if (target === "cover") {
        set("cover_image", url);
      } else {
        rte.current?.focus();
        document.execCommand("insertHTML", false, `<img src="${url}" alt="">`);
      }
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const toggleHtml = () => {
    if (!htmlMode) {
      if (html.current && rte.current) html.current.value = rte.current.innerHTML;
    } else if (rte.current && html.current) {
      rte.current.innerHTML = html.current.value;
    }
    setHtmlMode((m) => !m);
  };

  /** Current body, from whichever editing surface is active. */
  const readBody = () =>
    (htmlMode ? html.current?.value : rte.current?.innerHTML) ?? fields.body ?? "";

  const submit = useCallback(
    async (status: BlogStatus) => {
      if (!fields.title.trim()) {
        setError("Give the article a title before saving.");
        return;
      }
      setSaving(status);
      setError("");
      try {
        const post = await savePost({ ...fields, body: readBody(), status });
        setFields((f) => ({ ...f, id: post.id, slug: post.slug, status: post.status }));
        setPublishedSlug(post.status === "published" ? post.slug : "");
        setSaved(true);
        if (isNew) navigate(`/admin/blog/${post.id}`, { replace: true });
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          navigate("/admin/login", { replace: true });
          return;
        }
        setError(err instanceof Error ? err.message : "Could not save the article");
      } finally {
        setSaving(null);
      }
    },
    // readBody reads refs, so it needs no dependency of its own.
    [fields, isNew, navigate],
  );

  const input =
    "mt-2 w-full bg-white border border-rule px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-mute outline-none focus:border-plum transition-snap";
  const label = "eyebrow text-ink-mute";

  return (
    <AdminLayout
      title={isNew ? "New article" : "Edit article"}
      subtitle={
        <Link to="/admin/blog" className="inline-flex items-center gap-1.5 hover:text-plum transition-snap">
          <ArrowLeft className="h-3 w-3" /> All articles
        </Link>
      }
      actions={
        <>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-emerald-700">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {publishedSlug && (
            <a
              href={blogUrl(`/blog/${publishedSlug}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[13px] text-ink hover:border-ink transition-snap"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View
            </a>
          )}
          <button
            onClick={() => submit("draft")}
            disabled={saving !== null}
            className="inline-flex items-center gap-2 border border-rule px-4 py-2.5 text-[13px] text-ink hover:border-ink transition-snap disabled:opacity-50"
          >
            {saving === "draft" && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save draft
          </button>
          <button
            onClick={() => submit("published")}
            disabled={saving !== null}
            className="inline-flex items-center gap-2 bg-aubergine text-white px-4 py-2.5 text-[13px] font-medium hover:bg-plum transition-snap disabled:opacity-50"
          >
            {saving === "published" && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Publish
          </button>
        </>
      }
    >
      {error && (
        <div className="bg-ember/10 border border-ember/30 text-ember text-[13px] px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-24 flex items-center justify-center text-ink-mute">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_330px] gap-7 items-start">
          {/* Main column */}
          <div className="min-w-0">
            <input
              value={fields.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugTouched.current) set("slug", slugify(e.target.value));
              }}
              placeholder="Article title"
              className="w-full bg-transparent border-0 font-serif text-[30px] py-2 outline-none placeholder:text-ink-mute/50"
            />
            <input
              value={fields.excerpt ?? ""}
              onChange={(e) => set("excerpt", e.target.value)}
              maxLength={500}
              placeholder="Short excerpt / standfirst — used on cards and as the fallback meta description"
              className="w-full bg-transparent border-0 border-b border-rule text-[15px] text-ink-soft py-2.5 mb-5 outline-none focus:border-plum transition-snap placeholder:text-ink-mute/70"
            />

            <div className="flex flex-wrap gap-1 bg-paper border border-rule border-b-0 p-2 sticky top-[68px] z-10">
              {TOOLS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  title={t.title}
                  onClick={() => exec(t.cmd, t.val)}
                  className="min-w-[34px] px-2.5 py-1.5 text-[13px] text-ink hover:bg-paper-soft rounded-sm transition-snap"
                >
                  {t.label === "B" ? <b>B</b> : t.label === "I" ? <i>I</i> : t.label}
                </button>
              ))}
              <button
                type="button"
                title="Insert link"
                onClick={addLink}
                className="px-2.5 py-1.5 text-ink hover:bg-paper-soft rounded-sm transition-snap"
              >
                <Link2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Insert image"
                onClick={() => pickImage("body")}
                disabled={uploading}
                className="px-2.5 py-1.5 text-ink hover:bg-paper-soft rounded-sm transition-snap disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                title="Edit raw HTML"
                onClick={toggleHtml}
                className={`ml-auto px-2.5 py-1.5 rounded-sm transition-snap ${
                  htmlMode ? "bg-aubergine text-white" : "text-ink hover:bg-paper-soft"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div
              ref={rte}
              contentEditable
              suppressContentEditableWarning
              hidden={htmlMode}
              className="admin-rte bg-paper border border-rule min-h-[460px] px-7 py-6 text-[16px] leading-relaxed outline-none focus:ring-2 focus:ring-plum/25"
            />
            <textarea
              ref={html}
              hidden={!htmlMode}
              spellCheck={false}
              className="w-full bg-paper border border-rule min-h-[460px] p-5 font-mono text-[13px] leading-relaxed outline-none resize-y focus:border-plum"
            />
          </div>

          {/* Sidebar column */}
          <aside className="space-y-5">
            <div className="bg-paper border border-rule p-5">
              <h4 className={label}>Cover image</h4>
              {fields.cover_image ? (
                <>
                  <div className="mt-3 aspect-video bg-paper-soft overflow-hidden">
                    <img
                      src={blogUrl(fields.cover_image)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => set("cover_image", "")}
                    className="mt-2.5 w-full border border-rule px-3 py-2 text-[13px] text-ink-mute hover:border-ember hover:text-ember transition-snap"
                  >
                    Remove cover
                  </button>
                </>
              ) : (
                <button
                  onClick={() => pickImage("cover")}
                  disabled={uploading}
                  className="mt-3 w-full border border-dashed border-rule px-3 py-6 text-[13px] text-ink-mute hover:border-plum hover:text-plum transition-snap disabled:opacity-50"
                >
                  {uploading ? "Uploading…" : "Upload cover"}
                </button>
              )}
              <label htmlFor="cover_alt" className={`${label} block mt-4`}>Cover alt text</label>
              <input
                id="cover_alt"
                value={fields.cover_alt ?? ""}
                onChange={(e) => set("cover_alt", e.target.value)}
                placeholder="Describe the image (SEO/accessibility)"
                className={input}
              />
            </div>

            <div className="bg-paper border border-rule p-5">
              <h4 className={label}>Organise</h4>

              <label htmlFor="slug" className={`${label} block mt-4`}>URL slug</label>
              <div className="mt-2 flex items-center border border-rule bg-white focus-within:border-plum transition-snap">
                <span className="pl-3 font-mono text-[12px] text-ink-mute">/blog/</span>
                <input
                  id="slug"
                  value={fields.slug}
                  onChange={(e) => {
                    slugTouched.current = true;
                    set("slug", e.target.value);
                  }}
                  placeholder="auto-from-title"
                  className="w-full bg-transparent border-0 px-1.5 py-2.5 text-[14px] outline-none"
                />
              </div>

              <label htmlFor="category" className={`${label} block mt-4`}>Category</label>
              <input
                id="category"
                list="admin-blog-cats"
                value={fields.category ?? ""}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. Business, Data, AI"
                className={input}
              />
              <datalist id="admin-blog-cats">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>

              <label htmlFor="tags" className={`${label} block mt-4`}>Tags (comma-separated)</label>
              <input
                id="tags"
                value={fields.tags ?? ""}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="online mba, accreditation"
                className={input}
              />

              <label htmlFor="author" className={`${label} block mt-4`}>Author</label>
              <input
                id="author"
                value={fields.author}
                onChange={(e) => set("author", e.target.value)}
                className={input}
              />
            </div>

            <div className="bg-paper border border-rule p-5">
              <h4 className={label}>
                SEO overrides <span className="normal-case tracking-normal text-ink-mute/60">optional</span>
              </h4>

              <label htmlFor="meta_title" className={`${label} block mt-4`}>Meta title</label>
              <input
                id="meta_title"
                value={fields.meta_title ?? ""}
                onChange={(e) => set("meta_title", e.target.value)}
                maxLength={255}
                placeholder="Defaults to “Title | UeCampus”"
                className={input}
              />

              <label htmlFor="meta_description" className={`${label} block mt-4`}>Meta description</label>
              <textarea
                id="meta_description"
                value={fields.meta_description ?? ""}
                onChange={(e) => set("meta_description", e.target.value)}
                rows={3}
                maxLength={320}
                placeholder="Defaults to the excerpt"
                className={`${input} resize-y`}
              />

              <label htmlFor="keywords" className={`${label} block mt-4`}>Keywords</label>
              <input
                id="keywords"
                value={fields.keywords ?? ""}
                onChange={(e) => set("keywords", e.target.value)}
                placeholder="Comma-separated keywords"
                className={input}
              />
            </div>
          </aside>
        </div>
      )}

      <input ref={file} type="file" accept="image/*" hidden onChange={onFile} />
    </AdminLayout>
  );
};

export default AdminBlogEditor;
