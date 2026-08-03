export const A4_DIMENSIONS = {
  width: 794,
  height: 1123,
  margin: 40,
} as const;

export const pagesEqual = (a: string[], b: string[]): boolean => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * Remove empty regal section-title shells left by the HTML page splitter.
 * Those shells still paint ::before/::after rules; stripping them from the
 * page HTML avoids a post-paint layout jump from display:none.
 */
export const stripRegalOrphanTitleShells = (pageHtml: string): string => {
  if (!pageHtml.includes('cv-regal-section-title')) return pageHtml;

  const doc = new DOMParser().parseFromString(pageHtml, 'text/html');

  doc.querySelectorAll('.cv-regal-section-title').forEach((title) => {
    const text = (title.textContent ?? '').trim();
    if (!text) title.remove();
  });

  doc.querySelectorAll('.cv-regal-section').forEach((section) => {
    const hasBody = section.querySelector(
      '.cv-regal-list, .cv-regal-paragraph, .cv-regal-skills-grid, .cv-regal-inline-list, .cv-regal-section-title',
    );
    if (!hasBody) section.remove();
  });

  return doc.body.innerHTML;
};
