import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { A4_DIMENSIONS, performPagination } from '../../utils/paginationUtils';

interface PaginatedPreviewProps {
  children: React.ReactNode;
  onPaginate?: (data: {
    pages: Array<{
      index: number;
      
      sections: Array<{ sectionId: string; startBlockIndex: number; endBlockIndex: number }>;
      textContent: string[];
    }>;
  }) => void;
  scaleMode?: 'fit' | 'fill'; // 'fit' for normal scaling, 'fill' for maximized scaling
  templateId?: string;
}

interface ReactPageContent {
  elements: React.ReactNode[];
}

export default function PaginatedPreview({ children, onPaginate, scaleMode = 'fit', templateId = '' }: PaginatedPreviewProps) {
  const [pages, setPages] = useState<ReactPageContent[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [bottomMargin, setBottomMargin] = useState(48);
  const containerRef = useRef<HTMLDivElement>(null);
  const minScaleRef = useRef(1);

  const pageInnerWidth = A4_DIMENSIONS.width - (2 * A4_DIMENSIONS.margin);


  const performPaginationLocal = async () => {
    if (!measureRef.current) return;

    const { pages: paginatedPages } = await performPagination(measureRef.current);

    if (paginatedPages.length === 0) {
      setPages([]);
      setReady(true);
      if (onPaginate) onPaginate({ pages: [] });
      return;
    }

    // Convert from shared PageContent to ReactPageContent
    const newPages: ReactPageContent[] = [];
    const pagesJson: Array<{
      index: number;
      sections: Array<{ sectionId: string; startBlockIndex: number; endBlockIndex: number }>;
      textContent: string[];
    }> = [];

    let blockIndex = 0;

    for (let pageIndex = 0; pageIndex < paginatedPages.length; pageIndex++) {
      const page = paginatedPages[pageIndex];
      const currentPageSections: Map<string, { start: number; end: number }> = new Map();
      
      const reactElements: React.ReactNode[] = page.elements.map((element, elementIndex) => {
        // Extract section ID from the HTML to track sections
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.html;
        const sectionElement = tempDiv.querySelector('[data-section-id]');
        const sectionId = sectionElement?.getAttribute('data-section-id') || 'unknown';

        if (currentPageSections.has(sectionId)) {
          const range = currentPageSections.get(sectionId)!;
          range.end = blockIndex;
        } else {
          currentPageSections.set(sectionId, { start: blockIndex, end: blockIndex });
        }

        blockIndex++;

        return (
          <div
            key={`block-${pageIndex}-${elementIndex}`}
            className={`cv-block ${elementIndex === 0 ? 'cv-block--first' : ''}`}
            style={{ marginTop: element.marginTop }}
            dangerouslySetInnerHTML={{ __html: element.html }}
          />
        );
      });

      newPages.push({ elements: reactElements });

      const sectionsArray = Array.from(currentPageSections.entries()).map(([sectionId, range]) => ({
        sectionId,
        startBlockIndex: range.start,
        endBlockIndex: range.end,
      }));

      pagesJson.push({
        index: pageIndex,
        sections: sectionsArray,
        textContent: [],
      });
    }

    setPages(newPages);
    setReady(true);

    if (onPaginate) {
      onPaginate({ pages: pagesJson });
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;

          const proceed = () => {
            if (cancelled) return;
            performPaginationLocal();
            calculateScaleAndMargin();
          };

          if (document.fonts) {
            document.fonts.ready.then(proceed).catch(proceed);
          } else {
            proceed();
          }
        });
      });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [children]);

  const calculateScaleAndMargin = () => {
    if (!containerRef.current) return;

    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    const containerWidth = containerRef.current.clientWidth;

    const isMobile = screenWidth < 640;
    const isTablet = screenWidth >= 640 && screenWidth < 1024;

    const margin = isMobile ? 16 : isTablet ? 24 : 60;
    let widthMultiplier: number;
    let availableHeight: number;

    if (scaleMode === 'fill') {
      widthMultiplier = isMobile ? 0.98 : 0.96;
      availableHeight = screenHeight - (isMobile ? 80 : isTablet ? 100 : 120);
      const scaleByWidth = (containerWidth * widthMultiplier) / A4_DIMENSIONS.width;
      const scaleByHeight = availableHeight / A4_DIMENSIONS.height;
      const nextBase = Math.min(scaleByWidth, scaleByHeight);
      const minScale = isMobile ? 0.55 : 0.9;
      minScaleRef.current = minScale;
      setBaseScale(nextBase);
      setScale(Math.max(nextBase, minScale) * zoom);
    } else {
      widthMultiplier = isMobile ? 0.95 : 0.92;
      availableHeight = screenHeight - (isMobile ? 140 : isTablet ? 160 : 180);
      const scaleByWidth = (containerWidth * widthMultiplier) / A4_DIMENSIONS.width;
      const scaleByHeight = availableHeight / A4_DIMENSIONS.height;
      const nextBase = Math.min(scaleByWidth, scaleByHeight);
      const minScale = isMobile ? 0.45 : 0.8;
      minScaleRef.current = minScale;
      setBaseScale(nextBase);
      setScale(Math.max(nextBase, minScale) * zoom);
    }

    setBottomMargin(margin);
  };

  useEffect(() => {
    calculateScaleAndMargin();
  }, [ready, pages.length]);

  useEffect(() => {
    setScale(Math.max(baseScale, minScaleRef.current) * zoom);
  }, [zoom, baseScale]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
  };

  const ZOOM_STEP = 0.1;
  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 2;

  const handleZoomIn = () => {
    setZoom((z) => Math.min(ZOOM_MAX, parseFloat((z + ZOOM_STEP).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(ZOOM_MIN, parseFloat((z - ZOOM_STEP).toFixed(2))));
  };

  return (
    <>
      {/* Hidden measurement container */}
      <div
        aria-hidden="true"
        ref={measureRef}
        className="invisible fixed left-0 top-0 pointer-events-none"
        style={{
          position: 'fixed',
          transform: 'translateY(-10000px)',
          width: `${pageInnerWidth}px`,
          padding: 0,
          margin: 0,
        }}
      >
        {children}
      </div>

      {/* Main preview container */}
      <div ref={containerRef} className="flex flex-col items-center pt-4">
        {!ready && (
          <div className="mb-4 text-sm text-gray-500">
            Preparing preview...
          </div>
        )}

        {ready && pages.length > 0 && (
          <>
            {/* Navigation controls */}
            <div className="flex items-center gap-1 mb-2 navigation-control rounded-lg shadow-md px-1.5 py-1.5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} className="text-gray-700 dark:text-slate-200" />
              </button>

              <div className="px-3 py-0.5">
                <span className="text-xs font-medium text-gray-900 dark:text-slate-100">
                  Page {currentPage + 1} of {pages.length}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === pages.length - 1}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={16} className="text-gray-700 dark:text-slate-200" />
              </button>

              <div className="mx-2 w-px h-4 bg-gray-200 dark:bg-slate-700" />

              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={16} className="text-gray-700 dark:text-slate-200" />
              </button>

              <div className="px-2 py-0.5 min-w-[48px] text-center">
                <span className="text-xs font-medium text-gray-900 dark:text-slate-100">{Math.round(scale * 100)}%</span>
              </div>

              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn size={16} className="text-gray-700 dark:text-slate-200" />
              </button>
            </div>

            <div
              key={`page-${currentPage}`}
              className="page bg-white cv-page"
              style={{
                width: `${A4_DIMENSIONS.width}px`,
                height: `${A4_DIMENSIONS.height}px`,
                padding: `${A4_DIMENSIONS.margin}px`,
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                borderRadius: 5,
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-in-out',
                background: 'white',
              }}
            >
              <div
                className={`page-inner cv-preview-container cv-${templateId}`}
                style={{
                  boxSizing: 'border-box',
                  height: `${A4_DIMENSIONS.height - (2*A4_DIMENSIONS.margin)}px`,
                  overflow: 'hidden',
                }}
              >
                {pages[currentPage]?.elements}
              </div>
            </div>
          </>
        )}

        {pages.length === 0 && ready && (
          <div className="text-sm text-gray-600">
            No content to preview.
          </div>
        )}
      </div>
    </>
  );
}
