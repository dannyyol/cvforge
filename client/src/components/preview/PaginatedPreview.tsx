import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
}

interface ReactPageContent {
  elements: React.ReactNode[];
}

export default function PaginatedPreview({ children, onPaginate, scaleMode = 'fit' }: PaginatedPreviewProps) {
  const [pages, setPages] = useState<ReactPageContent[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  const [bottomMargin, setBottomMargin] = useState(48);
  const containerRef = useRef<HTMLDivElement>(null);

  const pageInnerWidth = A4_DIMENSIONS.width - (2 * A4_DIMENSIONS.margin);


  const performPaginationLocal = () => {
    if (!measureRef.current) return;

    const { pages: paginatedPages } = performPagination(measureRef.current);

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
    const timer = setTimeout(() => {
      performPaginationLocal();
    }, 150);

    return () => clearTimeout(timer);
  }, [children]);

  const calculateScaleAndMargin = () => {
    if (!containerRef.current) return;

    const screenHeight = window.innerHeight;
    const containerWidth = containerRef.current.clientWidth;
    
    let margin: number;
    let availableHeight: number;
    let widthMultiplier: number;
    
    if (scaleMode === 'fill') {
      // For customization component - maximize the scale to fill space
      availableHeight = screenHeight * 0.95; // Use more of the available height
      margin = 20; // Smaller margins
      widthMultiplier = 0.99; // Use almost the entire container width
      
      const scaleByWidth = (containerWidth * widthMultiplier) / A4_DIMENSIONS.width;
      const scaleByHeight = availableHeight / A4_DIMENSIONS.height;
      
      // Prioritize width scaling for customization, but ensure it doesn't exceed reasonable bounds
      const baseScale = Math.max(scaleByWidth, Math.min(scaleByWidth, scaleByHeight * 1.2));
      setScale(Math.max(baseScale, 0.8)); // Higher minimum scale for customization
    } else {
      // Original scaling logic for main preview
      if (screenHeight < 768) {
        availableHeight = screenHeight * 0.85;
        margin = 60;
      } else if (screenHeight < 1024) {
        availableHeight = screenHeight * 0.82;
        margin = 80;
      } else if (screenHeight < 1440) {
        availableHeight = screenHeight * 0.80;
        margin = 100;
      } else {
        availableHeight = screenHeight * 0.78;
        margin = 120;
      }
      widthMultiplier = 0.95;
      
      const scaleByWidth = (containerWidth * widthMultiplier) / A4_DIMENSIONS.width;
      const scaleByHeight = availableHeight / A4_DIMENSIONS.height;
      const baseScale = Math.min(scaleByWidth, scaleByHeight);
      setScale(Math.max(baseScale, 0.5));
    }
    setBottomMargin(margin);
  };

  useEffect(() => {
    calculateScaleAndMargin();
  }, [ready, pages.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setReady(false);
      setTimeout(() => {
        performPaginationLocal();
        calculateScaleAndMargin();
      }, 150);
    };

    let resizeObserver: ResizeObserver | null = null;

    try {
      resizeObserver = new ResizeObserver(handleResize);
      if (measureRef.current) {
        resizeObserver.observe(measureRef.current);
      }
    } catch (err) {
      console.warn('ResizeObserver not available');
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
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
      <div 
        ref={containerRef} 
        className="w-full flex flex-col items-center pt-4"
        style={{ paddingBottom: `${bottomMargin}px` }}
      >
        {!ready && (
          <div className="mb-4 text-sm text-gray-500">
            Preparing preview...
          </div>
        )}

        {ready && pages.length > 0 && (
          <>
            {/* Navigation controls */}
            <div className="flex items-center gap-1 mb-4 bg-white rounded-lg shadow-md px-1.5 py-1.5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </button>

              <div className="px-3 py-0.5">
                <span className="text-xs font-medium text-gray-900">
                  Page {currentPage + 1} of {pages.length}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === pages.length - 1}
                className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={16} className="text-gray-700" />
              </button>
            </div>

            <div
              key={`page-${currentPage}`}
              className="page bg-white"
              style={{
                width: `${A4_DIMENSIONS.width}px`,
                height: `${A4_DIMENSIONS.height}px`,
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                borderRadius: 6,
                overflow: 'hidden',
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-in-out',
                marginBottom: `${bottomMargin * 0.3}px`,
              }}
            >
              <div
                className="page-inner cv-preview-container"
                style={{
                  boxSizing: 'border-box',
                  width: `${A4_DIMENSIONS.width}px`,
                  height: `${A4_DIMENSIONS.height}px`,
                  paddingTop: `${A4_DIMENSIONS.margin}px`,
                  paddingBottom: `${A4_DIMENSIONS.margin}px`,
                  paddingLeft: `${A4_DIMENSIONS.margin}px`,
                  paddingRight: `${A4_DIMENSIONS.margin}px`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
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