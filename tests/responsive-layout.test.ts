import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(path, "utf8");
}

describe("responsive layout", () => {
  it("does not lock the app shell to desktop sidebar offsets", () => {
    const page = read("app/page.tsx");
    const header = read("components/header.tsx");

    expect(page).not.toContain('className="ml-64');
    expect(header).not.toContain("fixed left-64");
    expect(page).toContain("lg:ml-64");
    expect(header).toContain("lg:left-64");
  });

  it("keeps dashboard grids mobile-first", () => {
    const dashboard = read("components/sections/dashboard-section.tsx");

    expect(dashboard).toContain("grid-cols-1 sm:grid-cols-2 xl:grid-cols-4");
    expect(dashboard).toContain("grid-cols-1 xl:grid-cols-3");
    expect(dashboard).toContain("grid-cols-2 sm:grid-cols-3 lg:grid-cols-5");
  });

  it("exposes a mobile navigation surface", () => {
    const sidebar = read("components/sidebar.tsx");

    expect(sidebar).toContain("lg:hidden");
    expect(sidebar).toContain("overflow-x-auto");
  });
});
