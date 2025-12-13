export const A4_DIMENSIONS = {
  width: 794,
  height: 1123,
  margin: 40,
};

export const SECTION_MARGIN_TOP = 16;
export const BLOCK_MARGIN_TOP = 5;

export type ContentBlock = {
  html: string;
  height: number;
  width: number;
  sectionId: string;
  isAtomic: boolean;
  sumHeight: number;
};

export type PageContent = {
  elements: Array<{ html: string; marginTop: number; height: number }>;
};

export type PaginationResult = {
  pages: PageContent[];
  pageInnerHeight: number;
  pageInnerWidth: number;
};

/**
 * Measures the height, margin and width of an HTML element including margins
 */
const measureSize = (el: HTMLElement): { height: number; width: number } => {
  const rect = el.getBoundingClientRect();
  const style = window.getComputedStyle(el);
  const marginTop = parseFloat(style.marginTop || '0');
  const marginBottom = parseFloat(style.marginBottom || '0');
  let height = rect.height + marginTop + marginBottom;
  

  const className = el.getAttribute('class') || '';
  if (className.includes('cv-header--full-bleed')) {
    const pagePaddingRaw = style.getPropertyValue('--page-padding');
    const pagePadding = pagePaddingRaw ? parseFloat(pagePaddingRaw) : 0;
    height += pagePadding || 0;
  }

  return { height, width: rect.width };
};

/**
 * Extracts content blocks from CV sections for pagination
 */
export const extractContentBlocksAsync = async (measureRef: HTMLElement): Promise<ContentBlock[]> => {
  const sections = Array.from(
    measureRef.querySelectorAll('[data-cv-section]')
  ) as HTMLElement[];

  if (sections.length === 0) return [];

  const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  try {
    // @ts-ignore
    if (document.fonts) await (document.fonts as any).ready;
  } catch {}
  await raf();
  await raf();

  return new Promise<ContentBlock[]>((resolve) => {
    const sizeMap = new Map<HTMLElement, { height: number; width: number }>();
    let sumHeight = 0;

    const finalize = () => {
      const blocks: ContentBlock[] = [];
      for (const section of sections) {
        const sectionId = section.getAttribute('data-section-id') || 'unknown';
        const s = sizeMap.get(section) || measureSize(section);
        sumHeight += s.height;

        if (sectionId === 'header') {
          blocks.push({
            html: section.outerHTML,
            height: s.height,
            width: s.width,
            sectionId,
            isAtomic: true,
            sumHeight,
          });
          continue;
        }

        const children = Array.from(section.children) as HTMLElement[];
        for (const child of children) {
          const tagName = child.tagName.toLowerCase();

          if (tagName === 'ul' || tagName === 'ol') {
            const items = Array.from(child.children) as HTMLElement[];
            const isCvList = (child.getAttribute('class') || '').includes('cv-list');
            for (const item of items) {
              const itemHtml = isCvList
                ? `<div class="${item.getAttribute('class') || ''}">${item.innerHTML}</div>`
                : item.outerHTML;
              const size = measureSize(item);
              blocks.push({
                html: itemHtml,
                height: size.height,
                width: size.width,
                sectionId,
                isAtomic: true,
                sumHeight,
              });
            }
            continue;
          }

          // Preserve containers with background classes or header section
          const className = child.getAttribute('class') || '';
          const isBackgroundContainer = className.includes('bg-');
          const isCvScopedContainer = className
            .split(/\s+/)
            .some((c) => c.startsWith('cv-'));

          if (isBackgroundContainer || sectionId === 'header' || isCvScopedContainer) {
            blocks.push({
              html: child.outerHTML,
              height: measureSize(child).height,
              width: measureSize(child).width,
              sectionId,
              isAtomic: true,
              sumHeight,
            });
            continue;
          }

          const grandChildren = Array.from(child.children) as HTMLElement[];
          if (grandChildren.length > 0) {
            for (const grandChild of grandChildren) {
              blocks.push({
                html: grandChild.outerHTML,
                height: measureSize(grandChild).height,
                width: measureSize(grandChild).width,
                sectionId,
                isAtomic: true,
                sumHeight,
              });
            }
            continue;
          }

          blocks.push({
            html: child.outerHTML,
            height: measureSize(child).height,
            width: measureSize(child).width,
            sectionId,
            isAtomic: true,
            sumHeight,
          });
        }
      }
      resolve(blocks);
    };

    if (typeof ResizeObserver === 'undefined') {
      finalize();
      return;
    }

    setTimeout(() => {
      finalize();
    }, 200);
  });
};


/**
 * Paginates content blocks into pages based on A4 dimensions
 */
export const paginateBlocks = (blocks: ContentBlock[]): PaginationResult => {
  const pageInnerHeight = (A4_DIMENSIONS.height - (2 * A4_DIMENSIONS.margin));
  const pageInnerWidth = A4_DIMENSIONS.width - (2 * A4_DIMENSIONS.margin);

  if (blocks.length === 0) {
    return {
      pages: [],
      pageInnerHeight,
      pageInnerWidth,
    };
  }

  const pages: PageContent[] = [];
  let currentPageElements: Array<{ html: string; marginTop: number; height: number }> = [];
  let currentPageHeight = 0;
  let lastSectionIdOnPage: string | null = null;

  const finalizePage = () => {
    if (currentPageElements.length > 0) {
      console.log('Page', pages.length, 'block heights:', currentPageElements.map((e) => e));
      const blocksTotal = currentPageElements.reduce((sum, e) => sum + e.height, 0);
      console.log('Page', pages.length, 'blocks total height:', blocksTotal);
      pages.push({ elements: [...currentPageElements] });
      currentPageElements = [];
      currentPageHeight = 0;
      lastSectionIdOnPage = null;
    }
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isSectionChange = lastSectionIdOnPage !== null && lastSectionIdOnPage !== block.sectionId;
    let marginTop = isSectionChange ? SECTION_MARGIN_TOP : 0;
    const hasItemTitle = block.html.includes('cv-item-title');
    if (currentPageElements.length > 0 && hasItemTitle) {
      marginTop += BLOCK_MARGIN_TOP;
    }
    console.log('Current pageheight:', currentPageHeight + marginTop + block.height);
    // If it fits, place it and include marginTop in accumulated height
    if (currentPageHeight + marginTop + block.height <= pageInnerHeight) {
      currentPageElements.push({ html: block.html, marginTop, height: block.height });
      currentPageHeight += marginTop + block.height;
      lastSectionIdOnPage = block.sectionId;
      continue;
    }

    // Otherwise start a new page and place the block there
    finalizePage();
    currentPageElements.push({ html: block.html, marginTop: 0, height: block.height });
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
export const performPagination = async (measureRef: HTMLElement): Promise<PaginationResult> => {
  const blocks = await extractContentBlocksAsync(measureRef);
  return paginateBlocks(blocks);
};
