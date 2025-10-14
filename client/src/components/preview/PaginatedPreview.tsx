import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const A4_UK = {
  width: 794,
  height: 1123,
  margin: 40,
};

interface PaginatedPreviewProps {
  children: React.ReactNode;
}

interface PageContent {
  elements: React.ReactNode[];
}

export default function PaginatedPreview({ children }: PaginatedPreviewProps) {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const pageInnerHeight = A4_UK.height - 2 * A4_UK.margin;

  const measureAndPaginate = () => {
    if (!measureRef.current) return;

    const sectionElements = Array.from(
      measureRef.current.querySelectorAll('[data-cv-section]')
    ) as HTMLElement[];

    if (sectionElements.length === 0) {
      setPages([]);
      setReady(true);
      return;
    }

    const SECTION_MARGIN_BOTTOM = 32;

    const sectionData = sectionElements.map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const marginTop = parseFloat(style.marginTop || '0');
      const marginBottom = parseFloat(style.marginBottom || '0');
      const totalHeight = rect.height + marginTop + marginBottom + SECTION_MARGIN_BOTTOM;

      return {
        element: element.cloneNode(true) as HTMLElement,
        height: totalHeight,
        id: element.getAttribute('data-section-id') || '',
      };
    });

    const newPages: PageContent[] = [];
    let currentPageElements: React.ReactNode[] = [];
    let currentPageHeight = 0;

    for (let i = 0; i < sectionData.length; i++) {
      const section = sectionData[i];
      const isLastSection = i === sectionData.length - 1;
      const sectionHeightToUse = isLastSection ? section.height - SECTION_MARGIN_BOTTOM : section.height;

      if (currentPageHeight + sectionHeightToUse <= pageInnerHeight) {
        currentPageElements.push(
          <div
            key={`page-section-${i}`}
            data-section-id={section.id}
            className={isLastSection && currentPageElements.length > 0 ? '' : 'mb-8'}
            dangerouslySetInnerHTML={{ __html: section.element.innerHTML }}
          />
        );
        currentPageHeight += sectionHeightToUse;
      } else {
        if (currentPageElements.length > 0) {
          newPages.push({ elements: [...currentPageElements] });
        }

        currentPageElements = [
          <div
            key={`page-section-${i}`}
            data-section-id={section.id}
            className="mb-8"
            dangerouslySetInnerHTML={{ __html: section.element.innerHTML }}
          />
        ];
        currentPageHeight = section.height;
      }
    }

    if (currentPageElements.length > 0) {
      newPages.push({ elements: [...currentPageElements] });
    }

    setPages(newPages);
    setReady(true);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        measureAndPaginate();
      }, 100);
    });

    return () => cancelAnimationFrame(raf);
  }, [children]);

  const calculateScale = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = window.innerHeight - 200;

    const scaleByWidth = (containerWidth - 80) / A4_UK.width;
    const scaleByHeight = containerHeight / A4_UK.height;

    const optimalScale = Math.min(scaleByWidth, scaleByHeight, 1);
    setScale(Math.max(optimalScale, 0.4));
  };

  useEffect(() => {
    calculateScale();
  }, [ready, pages.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ro: ResizeObserver | null = null;

    try {
      ro = new ResizeObserver(() => {
        setReady(false);
        requestAnimationFrame(() => {
          setTimeout(() => {
            measureAndPaginate();
            calculateScale();
          }, 100);
        });
      });

      if (measureRef.current) {
        ro.observe(measureRef.current);
      }

      const onResize = () => {
        setReady(false);
        requestAnimationFrame(() => {
          setTimeout(() => {
            measureAndPaginate();
            calculateScale();
          }, 100);
        });
      };

      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        if (ro && measureRef.current) ro.unobserve(measureRef.current);
        ro?.disconnect();
      };
    } catch (err) {
      const onResize = () => {
        setReady(false);
        requestAnimationFrame(() => {
          setTimeout(() => {
            measureAndPaginate();
            calculateScale();
          }, 100);
        });
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1));
  };

  return (
    <>
      <div
        aria-hidden="true"
        ref={measureRef}
        className="invisible fixed left-0 top-0 pointer-events-none"
        style={{
          transform: 'translateY(-10000px)',
          width: `${A4_UK.width - 2 * A4_UK.margin}px`,
          padding: 0,
        }}
      >
        {children}
      </div>

      <div ref={containerRef} className="w-full flex flex-col items-center pt-3 pb-6">
        {!ready && (
          <div className="mb-4 text-sm text-gray-500">
            Preparing preview...
          </div>
        )}

        {ready && pages.length > 0 && (
          <>
            <div className="flex items-center gap-1 mb-3 bg-white rounded-lg shadow-md px-1.5 py-1.5">
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
              className="page bg-white mb-6"
              style={{
                width: `${A4_UK.width}px`,
                height: `${A4_UK.height}px`,
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                borderRadius: 6,
                overflow: 'hidden',
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <div
                className="page-inner cv-preview-container"
                style={{
                  boxSizing: 'border-box',
                  width: `${A4_UK.width}px`,
                  height: `${A4_UK.height}px`,
                  padding: `${A4_UK.margin}px`,
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
