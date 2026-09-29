import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContentEditor from "./ContentEditor";
import { diffContent } from "@/cms/merge";
import type { ContentObject } from "@/cms/types";

const DEFAULTS = {
  hero: { title: "Welcome", intro: "A short intro." },
  bullets: ["First", "Second"],
  cards: [{ heading: "Card A", body: "Body A" }],
  empty: [] as { label: string; to: string }[],
};

/** Drives the editor the way AdminPageEditor does and exposes the sparse diff. */
const Harness = ({ onDiff }: { onDiff: (d: ContentObject | null) => void }) => {
  const [value, setValue] = useState<ContentObject>(structuredClone(DEFAULTS));
  return (
    <ContentEditor
      defaults={DEFAULTS}
      value={value}
      onChange={(v) => {
        setValue(v);
        onDiff(diffContent(DEFAULTS, v));
      }}
      templates={{ empty: { label: "", to: "" } }}
    />
  );
};

describe("ContentEditor", () => {
  it("renders every default as an editable field", () => {
    render(<Harness onDiff={() => {}} />);
    expect(screen.getByDisplayValue("Welcome")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A short intro.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("First")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Card A")).toBeInTheDocument();
    expect(screen.getByText("Bullets · 2 items")).toBeInTheDocument();
  });

  it("editing a string produces a sparse diff and a Reset control that undoes it", () => {
    let diff: ContentObject | null = null;
    render(<Harness onDiff={(d) => (diff = d)} />);

    fireEvent.change(screen.getByDisplayValue("Welcome"), { target: { value: "Hello there" } });
    expect(diff).toEqual({ hero: { title: "Hello there" } });
    expect(screen.getByText("edited")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reset"));
    expect(diff).toBeNull();
    expect(screen.getByDisplayValue("Welcome")).toBeInTheDocument();
  });

  it("adds, removes and reorders list items", () => {
    let diff: ContentObject | null = null;
    render(<Harness onDiff={(d) => (diff = d)} />);

    const bullets = screen.getByText("Bullets · 2 items").closest("div")!.parentElement!;
    fireEvent.click(within(bullets).getByRole("button", { name: /add/i }));
    expect(screen.getByText("Bullets · 3 items")).toBeInTheDocument();
    expect(diff).toEqual({ bullets: ["First", "Second", ""] });

    // Remove the first item.
    fireEvent.click(within(bullets).getAllByRole("button", { name: /remove/i })[0]);
    expect(diff).toEqual({ bullets: ["Second", ""] });

    // Move "Second" down below the blank one.
    fireEvent.click(within(bullets).getAllByTitle("Move down")[0]);
    expect(diff).toEqual({ bullets: ["", "Second"] });
  });

  it("removing every item stores an empty list (the admin's 'remove this section')", () => {
    let diff: ContentObject | null = null;
    render(<Harness onDiff={(d) => (diff = d)} />);
    const cards = screen.getByText("Cards · 1 item").closest("div")!.parentElement!;
    fireEvent.click(within(cards).getByRole("button", { name: /remove/i }));
    expect(diff).toEqual({ cards: [] });
    expect(within(cards).getByText(/nothing in this list/i)).toBeInTheDocument();
  });

  it("uses the template for lists whose default is empty", () => {
    let diff: ContentObject | null = null;
    render(<Harness onDiff={(d) => (diff = d)} />);
    const empty = screen.getByText("Empty · 0 items").closest("div")!.parentElement!;
    fireEvent.click(within(empty).getByRole("button", { name: /add/i }));
    expect(diff).toEqual({ empty: [{ label: "", to: "" }] });
    // The new item's fields render from the template's keys.
    expect(within(empty).getByText("Label")).toBeInTheDocument();
    expect(within(empty).getByText("To")).toBeInTheDocument();
  });
});
