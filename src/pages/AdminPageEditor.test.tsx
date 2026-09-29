import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { courses } from "@/data/courses";
import { partners, partnerHref } from "@/data/partners";

const mocks = vi.hoisted(() => ({
  fetchCmsPages: vi.fn(),
  saveCmsPage: vi.fn(),
  resetCmsPage: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  fetchCmsPages: mocks.fetchCmsPages,
  saveCmsPage: mocks.saveCmsPage,
  resetCmsPage: mocks.resetCmsPage,
  getAdminToken: () => "test-token",
  setAdminToken: vi.fn(),
  UnauthorizedError: class UnauthorizedError extends Error {},
}));

import AdminPageEditor from "./AdminPageEditor";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/admin/pages/*" element={<AdminPageEditor />} />
      </Routes>
    </MemoryRouter>,
  );

const course = courses.find((c) => !c.canonicalSlug)!;

describe("AdminPageEditor", () => {
  beforeEach(() => {
    mocks.fetchCmsPages.mockReset();
    mocks.saveCmsPage.mockReset();
    mocks.saveCmsPage.mockResolvedValue(null);
  });

  it("opens a programme page with its own text and SEO tab, and saves only what changed", async () => {
    mocks.fetchCmsPages.mockResolvedValue({ version: "0", pages: {} });
    renderAt(`/admin/pages/programmes/${course.slug}`);

    // Heading is the programme, fields are its text.
    expect(await screen.findByRole("heading", { name: course.title })).toBeInTheDocument();
    const titleInput = await screen.findByDisplayValue(course.title);
    expect(screen.getByDisplayValue(course.overview)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "SEO tags" })).toBeInTheDocument(); // the editor tab (the sidebar link is separate)

    // Edit the title and save: the sparse diff goes to the page's own key.
    fireEvent.change(titleInput, { target: { value: "Renamed programme" } });
    const save = screen.getByRole("button", { name: /save/i });
    expect(save).toBeEnabled();
    fireEvent.click(save);
    await waitFor(() => expect(mocks.saveCmsPage).toHaveBeenCalledTimes(1));
    expect(mocks.saveCmsPage).toHaveBeenCalledWith(`/programmes/${course.slug}`, { title: "Renamed programme" }, null);
  });

  it("shows saved edits laid over the programme's text", async () => {
    mocks.fetchCmsPages.mockResolvedValue({
      version: "1",
      pages: { [`/programmes/${course.slug}`]: { content: { tagline: "Edited tagline" } } },
    });
    renderAt(`/admin/pages/programmes/${course.slug}`);
    expect(await screen.findByDisplayValue("Edited tagline")).toBeInTheDocument();
    expect(screen.getByDisplayValue(course.title)).toBeInTheDocument(); // untouched field keeps the data
  });

  it("opens a partner page the same way", async () => {
    mocks.fetchCmsPages.mockResolvedValue({ version: "0", pages: {} });
    const p = partners[0];
    renderAt(`/admin/pages${partnerHref(p)}`);
    expect(await screen.findByRole("heading", { name: p.name })).toBeInTheDocument();
    expect(await screen.findByDisplayValue(p.summary)).toBeInTheDocument();
  });

  it("when the backend cannot be reached it still shows the live text but blocks saving", async () => {
    mocks.fetchCmsPages.mockRejectedValue(new Error("Could not load page content"));
    renderAt(`/admin/pages/programmes/${course.slug}`);
    expect(await screen.findByText(/saving is disabled/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(course.title)).toBeInTheDocument(); // not blank
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /reset page/i })).toBeDisabled();
  });

  it("says so for a path that is not a page", async () => {
    mocks.fetchCmsPages.mockResolvedValue({ version: "0", pages: {} });
    renderAt("/admin/pages/programmes/no-such-programme");
    expect(await screen.findByText(/no editable page called/i)).toBeInTheDocument();
  });
});
