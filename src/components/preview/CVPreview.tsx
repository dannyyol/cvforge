import React, { useRef, useEffect, useState } from 'react';
import type { CVSection } from '../../types/cv';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { BoldTemplate } from './templates/BoldTemplate';

interface CVPreviewProps {
  sections: CVSection[];
  template: string;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ sections, template }) => {
  const visibleSections = sections.filter(s => s.visible).sort((a, b) => a.order - b.order);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<number[]>([0]);

  useEffect(() => {
    if (!contentRef.current) return;

    const A4_HEIGHT_PX = 297 * 3.7795275591;
    const contentHeight = contentRef.current.scrollHeight;
    const pageCount = Math.ceil(contentHeight / A4_HEIGHT_PX);

    setPages(Array.from({ length: Math.max(1, pageCount) }, (_, i) => i));
  }, [visibleSections, template]);

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate sections={visibleSections} />;
      case 'classic':
        return <ClassicTemplate sections={visibleSections} />;
      case 'minimal':
        return <MinimalTemplate sections={visibleSections} />;
      case 'creative':
        return <CreativeTemplate sections={visibleSections} />;
      case 'professional':
        return <ProfessionalTemplate sections={visibleSections} />;
      case 'elegant':
        return <ElegantTemplate sections={visibleSections} />;
      case 'compact':
        return <CompactTemplate sections={visibleSections} />;
      case 'bold':
        return <BoldTemplate sections={visibleSections} />;
      default:
        return <ModernTemplate sections={visibleSections} />;
    }
  };

  return (
    <>
      <style>
        {`
          .cv-pages-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .cv-page-wrapper {
            width: 210mm;
            height: 297mm;
            background: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }

          .cv-page-content {
            width: 100%;
            position: relative;
          }

          .cv-measurement {
            position: absolute;
            left: -9999px;
            top: 0;
            width: 210mm;
            visibility: hidden;
          }

          .page-number {
            position: absolute;
            bottom: 15mm;
            right: 15mm;
            font-size: 10px;
            color: #9ca3af;
            font-family: system-ui, -apple-system, sans-serif;
            z-index: 10;
          }

          @media print {
            .cv-pages-container {
              display: block;
              gap: 0;
            }

            .cv-page-wrapper {
              width: 210mm;
              height: 297mm;
              page-break-after: always;
              box-shadow: none;
              margin: 0;
              overflow: visible;
            }

            .cv-page-wrapper:last-child {
              page-break-after: auto;
            }

            .page-number {
              display: none;
            }
          }
        `}
      </style>

      <div className="cv-measurement" ref={contentRef}>
        {renderTemplate()}
      </div>

      <div className="cv-pages-container">
        {pages.map((pageIndex) => (
          <div key={pageIndex} className="cv-page-wrapper">
            <div
              className="cv-page-content"
              style={{
                transform: `translateY(-${pageIndex * 297}mm)`,
              }}
            >
              {renderTemplate()}
            </div>
            {pages.length > 1 && (
              <div className="page-number">
                Page {pageIndex + 1} of {pages.length}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
