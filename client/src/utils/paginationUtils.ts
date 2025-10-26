export const A4_DIMENSIONS = {
  width: 794,
  height: 1123,
  margin: 40,
};

export const SECTION_MARGIN_TOP = 16;

export type ContentBlock = {
  html: string;
  height: number;
  sectionId: string;
  isAtomic: boolean;
};

export type PageContent = {
  elements: Array<{ html: string; marginTop: number }>;
};

export type PaginationResult = {
  pages: PageContent[];
  pageInnerHeight: number;
  pageInnerWidth: number;
};

/**
 * Measures the height of an HTML element including margins
 */
export const measureHeight = (el: HTMLElement): number => {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  const marginTop = parseFloat(style.marginTop || '0');
  const marginBottom = parseFloat(style.marginBottom || '0');
  return rect.height + marginTop + marginBottom;
};

/**
 * Extracts content blocks from CV sections for pagination
 */
export const extractContentBlocks = (measureRef: HTMLElement): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const sections = Array.from(
    measureRef.querySelectorAll('[data-cv-section]')
  ) as HTMLElement[];

  for (const section of sections) {
    const sectionId = section.getAttribute('data-section-id') || 'unknown';
    const children = Array.from(section.children) as HTMLElement[];

    for (const child of children) {
      const tagName = child.tagName.toLowerCase();

      if (tagName === 'ul' || tagName === 'ol') {
        const items = Array.from(child.children) as HTMLElement[];
        
        for (const item of items) {
          const itemClone = child.cloneNode(false) as HTMLElement;
          itemClone.appendChild(item.cloneNode(true));
          
          blocks.push({
            html: itemClone.outerHTML,
            height: measureHeight(item),
            sectionId,
            isAtomic: true,
          });
        }
        continue;
      }

      // Preserve containers with background classes or header section
      const className = child.getAttribute('class') || '';
      const isBackgroundContainer = className.includes('bg-');

      if (isBackgroundContainer || sectionId === 'header') {
        blocks.push({
          html: child.outerHTML,
          height: measureHeight(child),
          sectionId,
          isAtomic: true,
        });
        continue;
      }

      const grandChildren = Array.from(child.children) as HTMLElement[];
      if (grandChildren.length > 0) {
        for (const grandChild of grandChildren) {
          blocks.push({
            html: grandChild.outerHTML,
            height: measureHeight(grandChild),
            sectionId,
            isAtomic: true,
          });
        }
        continue;
      }

      blocks.push({
        html: child.outerHTML,
        height: measureHeight(child),
        sectionId,
        isAtomic: true,
      });
    }
  }

  return blocks;
};

/**
 * Paginates content blocks into pages based on A4 dimensions
 */
export const paginateBlocks = (blocks: ContentBlock[]): PaginationResult => {
  const pageInnerHeight = A4_DIMENSIONS.height - (2 * A4_DIMENSIONS.margin);
  const pageInnerWidth = A4_DIMENSIONS.width - (2 * A4_DIMENSIONS.margin);

  if (blocks.length === 0) {
    return {
      pages: [],
      pageInnerHeight,
      pageInnerWidth,
    };
  }

  const pages: PageContent[] = [];
  let currentPageElements: Array<{ html: string; marginTop: number }> = [];
  let currentPageHeight = 0;
  let lastSectionIdOnPage: string | null = null;

  const finalizePage = () => {
    if (currentPageElements.length > 0) {
      pages.push({ elements: [...currentPageElements] });
      currentPageElements = [];
      currentPageHeight = 0;
      lastSectionIdOnPage = null;
    }
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isSectionChange = lastSectionIdOnPage !== null && lastSectionIdOnPage !== block.sectionId;
    const marginTop = isSectionChange ? SECTION_MARGIN_TOP : 0;

    if (currentPageHeight + marginTop + block.height <= pageInnerHeight) {
      currentPageElements.push({ html: block.html, marginTop });
      currentPageHeight += block.height + 3;
      lastSectionIdOnPage = block.sectionId;
      continue;
    }

    finalizePage();
    currentPageElements.push({ html: block.html, marginTop: 0 });
    currentPageHeight = block.height;
    lastSectionIdOnPage = block.sectionId;
  }

  finalizePage();

  return {
    pages,
    pageInnerHeight,
    pageInnerWidth,
  };
};

/**
 * Complete pagination process from measure ref to paginated content
 */
export const performPagination = (measureRef: HTMLElement): PaginationResult => {
  const blocks = extractContentBlocks(measureRef);
  return paginateBlocks(blocks);
};