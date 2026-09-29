import type { CmsState, ContentObject, MetaOverride, PageEntry } from "@/cms/types";

// Talks to the PHP enquiry backend served by Apache (XAMPP).
//
// Resolution order:
//   1. VITE_API_BASE (set in .env.production → https://uecampus.com/api).
//   2. Development: post cross-origin to local XAMPP Apache.
//   3. Fallback: same-origin /api relative to the build's base path.
export const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ||
  (import.meta.env.DEV
    ? "http://localhost/ue-replica/api"
    : `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api`);

export type EnquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  programme: string;
  programmeTitle: string;
  qualification: string;
  intake: string;
  message: string;
  consent: boolean;
  source?: string;
};

export async function submitEnquiry(payload: EnquiryPayload): Promise<{ ok: true; id: number }> {
  const res = await fetch(`${API_BASE}/submit.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Submission failed");
  }
  return data;
}

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string;
};

/**
 * Contact Us form submissions. These go to their own endpoint and their own
 * table (see api/contact.php) rather than the lead pipeline, because the form
 * captures a subject and a message instead of a programme choice.
 *
 * `duplicate` comes back true when the server recognised the submission as a
 * resend of one it already holds and kept the original instead of storing a
 * second copy.
 */
export async function submitContact(
  payload: ContactPayload,
): Promise<{ ok: true; id: number; duplicate?: boolean }> {
  const res = await fetch(`${API_BASE}/contact.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Submission failed");
  }
  return data;
}

export type SigninPayload = {
  name: string;
  email: string;
  phone?: string;
};

export async function submitSignin(
  payload: SigninPayload,
): Promise<{ ok: true; id: number }> {
  const res = await fetch(`${API_BASE}/signin.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Submission failed");
  }
  return data;
}

// ---------------------------------------------------------------------------
// Admin (enquiry leads dashboard)
//
// The login UI is a React page; only auth + data come from the PHP backend.
// Auth is a stateless Bearer token kept in localStorage, so the frontend can
// run on localhost while the backend is hosted elsewhere (no cross-site
// cookies needed).
// ---------------------------------------------------------------------------
const ADMIN_TOKEN_KEY = "ue_admin_token";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string | null): void {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export type Lead = {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  programme: string;
  programme_title: string;
  qualification: string;
  intake: string;
  message: string;
  consent: number | string;
  source: string;
  ip: string;
};

/** Thrown when a request is rejected for missing/expired credentials. */
export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function adminLogin(
  username: string,
  password: string,
): Promise<{ ok: true; token: string; user: string }> {
  const res = await fetch(`${API_BASE}/admin/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    // Don't follow redirects: an outdated PHP backend redirects to index.php,
    // which we must not chase. A redirect here means the wrong backend.
    redirect: "manual",
  });

  if (res.type === "opaqueredirect" || res.status === 0) {
    throw new Error("The backend at /api is outdated — re-upload the api/ folder to the server.");
  }
  if (!(res.headers.get("content-type") || "").includes("application/json")) {
    throw new Error("Unexpected backend response. Check that /api is deployed and PHP is running.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Incorrect username or password.");
  }
  setAdminToken(data.token);
  return data;
}

export async function fetchLeads(): Promise<Lead[]> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/leads.php`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    setAdminToken(null);
    throw new UnauthorizedError();
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Could not load leads");
  }
  return data.leads as Lead[];
}

export type Signin = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  ip: string;
};

export async function fetchSignins(): Promise<Signin[]> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/signins.php`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    setAdminToken(null);
    throw new UnauthorizedError();
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Could not load sign-ins");
  }
  return data.signins as Signin[];
}

export type ContactMessage = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  ip: string;
};

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/contact.php`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (res.status === 401) {
    setAdminToken(null);
    throw new UnauthorizedError();
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Could not load contact messages");
  }
  return data.messages as ContactMessage[];
}

// ---------------------------------------------------------------------------
// CMS — per-page copy and SEO overrides (see src/cms/)
//
// The public feed is fetched by every visitor at boot; the admin endpoints are
// behind the same Bearer token as the rest of the console.
// ---------------------------------------------------------------------------

function normalizeCmsState(data: { version?: unknown; pages?: unknown }): CmsState {
  const pages = data.pages && typeof data.pages === "object" && !Array.isArray(data.pages)
    ? (data.pages as Record<string, PageEntry>)
    : {};
  return { version: String(data.version ?? "0"), pages };
}

/** Public: every override currently set, for the live site. */
export async function fetchSiteContent(): Promise<CmsState> {
  const res = await fetch(`${API_BASE}/content.php`);
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Could not load site content");
  }
  return normalizeCmsState(data);
}

/** Admin: the same rows, with who changed them and when. */
export async function fetchCmsPages(): Promise<CmsState> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/content.php`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (res.status === 401) {
    setAdminToken(null);
    throw new UnauthorizedError();
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Could not load page content");
  }
  return normalizeCmsState(data);
}

async function adminCmsPost(path: string, body: unknown) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/content.php${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    setAdminToken(null);
    throw new UnauthorizedError();
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Could not save");
  }
  return data;
}

/**
 * Save one page's overrides. `content` is the sparse diff from the editor
 * (null = no text overrides); `meta` the SEO overrides (null = none). Leave
 * either out (undefined) to keep what is stored for it — the SEO table saves
 * tags this way without touching a page's text.
 */
export async function saveCmsPage(
  pageKey: string,
  content: ContentObject | null | undefined,
  meta: MetaOverride | null | undefined,
): Promise<PageEntry | null> {
  const body: Record<string, unknown> = { page_key: pageKey };
  if (content !== undefined) body.content = content;
  if (meta !== undefined) body.meta = meta;
  const data = await adminCmsPost("", body);
  return (data.page as PageEntry | null) ?? null;
}

/** Drop every override for a page so it follows the code again. */
export async function resetCmsPage(pageKey: string): Promise<void> {
  await adminCmsPost("?action=reset", { page_key: pageKey });
}

// ---------------------------------------------------------------------------
// Admin (blog)
//
// The blog engine stays in PHP (blog/_core.php renders the public, SEO-complete
// pages). These endpoints expose it as JSON so authoring lives in this same
// admin console, behind the same Bearer token as the leads dashboard.
// ---------------------------------------------------------------------------

export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  cover_alt: string | null;
  category: string | null;
  tags: string | null;
  author: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  status: BlogStatus;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** A post as listed on the dashboard — same shape minus the (large) body. */
export type BlogPostSummary = Omit<BlogPost, "body">;

/** The fields the editor sends back; the server derives the rest. */
export type BlogPostInput = Pick<
  BlogPost,
  | "title" | "slug" | "excerpt" | "body" | "cover_image" | "cover_alt"
  | "category" | "tags" | "author" | "meta_title" | "meta_description"
  | "keywords" | "status"
> & { id?: number };

/**
 * Absolute URL for a blog asset or page.
 *
 * The PHP side stores root-relative paths ("/blog/uploads/…"). Those resolve
 * correctly in production (same origin), but in dev the React app runs on the
 * Vite port while the images are served by Apache — so resolve against the API
 * origin whenever that is absolute.
 */
export function blogUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (!/^https?:\/\//i.test(API_BASE)) return path;
  return new URL(path, API_BASE).href;
}

async function adminBlogFetch(path = "", init: RequestInit = {}) {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/blog.php${path}`, {
    ...init,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401) {
    setAdminToken(null);
    throw new UnauthorizedError();
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Request failed");
  }
  return data;
}

export async function fetchPosts(): Promise<{ posts: BlogPostSummary[]; categories: string[] }> {
  const data = await adminBlogFetch();
  return { posts: data.posts as BlogPostSummary[], categories: (data.categories ?? []) as string[] };
}

export async function fetchPost(id: number): Promise<{ post: BlogPost; categories: string[] }> {
  const data = await adminBlogFetch(`?id=${id}`);
  return { post: data.post as BlogPost, categories: (data.categories ?? []) as string[] };
}

export async function savePost(input: BlogPostInput): Promise<BlogPost> {
  const data = await adminBlogFetch("", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return data.post as BlogPost;
}

export async function deletePost(id: number): Promise<void> {
  await adminBlogFetch("?action=delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
}

/** Upload an image for a cover or an inline body image; returns its URL. */
export async function uploadBlogImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const data = await adminBlogFetch("?action=upload", { method: "POST", body: form });
  return data.url as string;
}
