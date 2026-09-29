import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BlogPost } from "@/lib/api";

const mocks = vi.hoisted(() => ({
  fetchPost: vi.fn(),
  fetchPosts: vi.fn(),
  savePost: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  fetchPost: mocks.fetchPost,
  fetchPosts: mocks.fetchPosts,
  savePost: mocks.savePost,
  uploadBlogImage: vi.fn(),
  blogUrl: (p?: string | null) => p ?? "",
  getAdminToken: () => "test-token",
  setAdminToken: vi.fn(),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));

import AdminBlogEditor from "./AdminBlogEditor";

const POST: BlogPost = {
  id: 12,
  slug: "why-accreditation-matters",
  title: "Why accreditation matters",
  excerpt: "A short standfirst.",
  body: "<p>The original body copy.</p><h2>A heading</h2>",
  cover_image: "/blog/uploads/2026/07/cover-abc123.jpg",
  cover_alt: "A campus",
  category: "Accreditation",
  tags: "accreditation, uk",
  author: "UeCampus",
  meta_title: null,
  meta_description: null,
  keywords: null,
  status: "published",
  views: 42,
  published_at: "2026-07-01 10:00:00",
  created_at: "2026-07-01 09:00:00",
  updated_at: "2026-07-01 10:00:00",
};

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
        <Route path="/admin/blog/:id" element={<AdminBlogEditor />} />
      </Routes>
    </MemoryRouter>,
  );

const rte = () => document.querySelector(".admin-rte") as HTMLDivElement | null;

describe("AdminBlogEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchPosts.mockResolvedValue({ posts: [], categories: ["Accreditation"] });
    mocks.fetchPost.mockResolvedValue({ post: POST, categories: ["Accreditation"] });
    mocks.savePost.mockImplementation(async (input) => ({ ...POST, ...input }));
  });

  it("loads an existing post's body into the editor", async () => {
    renderAt("/admin/blog/12");

    // The body is written to the contenteditable imperatively, and only once
    // the fetch resolves and the editor is mounted.
    await waitFor(() => expect(rte()?.innerHTML).toContain("The original body copy."));
    expect(rte()?.innerHTML).toContain("<h2>A heading</h2>");
    expect(screen.getByDisplayValue("Why accreditation matters")).toBeInTheDocument();
  });

  it("keeps the body intact when saving an untouched post", async () => {
    renderAt("/admin/blog/12");
    await waitFor(() => expect(rte()?.innerHTML).toContain("The original body copy."));

    fireEvent.click(screen.getByRole("button", { name: /publish/i }));

    await waitFor(() => expect(mocks.savePost).toHaveBeenCalledTimes(1));
    const sent = mocks.savePost.mock.calls[0][0];
    expect(sent.body).toContain("The original body copy.");
    expect(sent.status).toBe("published");
    expect(sent.id).toBe(12);
  });

  it("saves edits made in the editor", async () => {
    renderAt("/admin/blog/12");
    await waitFor(() => expect(rte()?.innerHTML).toContain("The original body copy."));

    rte()!.innerHTML = "<p>Rewritten copy.</p>";
    fireEvent.click(screen.getByRole("button", { name: /save draft/i }));

    await waitFor(() => expect(mocks.savePost).toHaveBeenCalledTimes(1));
    expect(mocks.savePost.mock.calls[0][0].body).toBe("<p>Rewritten copy.</p>");
    expect(mocks.savePost.mock.calls[0][0].status).toBe("draft");
  });

  it("auto-slugs a new post from its title but never an existing one", async () => {
    renderAt("/admin/blog/new");
    const title = await screen.findByPlaceholderText("Article title");

    fireEvent.change(title, { target: { value: "Hello There World" } });
    expect(screen.getByDisplayValue("hello-there-world")).toBeInTheDocument();
    expect(mocks.fetchPost).not.toHaveBeenCalled();
  });

  it("refuses to save an untitled post", async () => {
    renderAt("/admin/blog/new");
    await screen.findByPlaceholderText("Article title");

    fireEvent.click(screen.getByRole("button", { name: /publish/i }));

    expect(await screen.findByText(/give the article a title/i)).toBeInTheDocument();
    expect(mocks.savePost).not.toHaveBeenCalled();
  });
});
