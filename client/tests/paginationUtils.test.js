import { describe, expect, it } from "vitest";

import { pagesEqual, stripRegalOrphanTitleShells } from "../src/lib/paginationUtils";

describe("paginationUtils", () => {
  it("pagesEqual compares page arrays by content", () => {
    expect(pagesEqual(["a"], ["a"])).toBe(true);
    expect(pagesEqual(["a"], ["b"])).toBe(false);
    expect(pagesEqual(["a"], ["a", "b"])).toBe(false);
  });

  it("strips empty regal section-title shells left by the splitter", () => {
    const html = `
      <div class="cv-html-root cv-regal">
        <section class="cv-regal-section">
          <h2 class="cv-regal-section-title"></h2>
        </section>
        <section class="cv-regal-section">
          <h2 class="cv-regal-section-title">Experience</h2>
          <ul class="cv-regal-list"><li class="cv-regal-list-item">Role</li></ul>
        </section>
      </div>
    `;

    const cleaned = stripRegalOrphanTitleShells(html);
    expect(cleaned).not.toContain("<h2 class=\"cv-regal-section-title\"></h2>");
    expect(cleaned).toContain("Experience");
    expect(cleaned).toContain("cv-regal-list");
  });
});
