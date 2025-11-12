// ReactPdfPreview component
import { PersonalDetails, ProfessionalSummary, EducationEntry, WorkExperience, SkillEntry, ProjectEntry, CertificationEntry, CVSection } from '../../types/resume';
import { TemplateId } from '../templates/registry';
import { getPdfTemplateComponent } from '../templates/pdf/registry';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useTheme } from '../../theme/ThemeProvider';

// ReactPdfPreview component
interface ReactPdfPreviewProps {
  personalDetails: PersonalDetails | null;
  professionalSummary: ProfessionalSummary | null;
  workExperiences: WorkExperience[];
  educationEntries: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sections: CVSection[];
  accentColor?: string;
  templateId: TemplateId;
  // NEW: emit the blob URL when ready
  onPdfReady?: (url: string) => void;
}

export default function ReactPdfPreview(props: ReactPdfPreviewProps) {
    const { theme } = useTheme();
    
    const PdfTemplate = getPdfTemplateComponent(props.templateId);
    const viewerScale = 0.8;
    // Build a stable key from section order so reordering forces re-mount
    const docKey = props.sections.map(s => `${s.id}:${s.order}`).join('|');
    // Add a signature for content changes to trigger blob regeneration
    const contentKey = JSON.stringify({
      personalDetails: props.personalDetails,
      professionalSummary: props.professionalSummary,
      workExperiences: props.workExperiences,
      educationEntries: props.educationEntries,
      skills: props.skills,
      projects: props.projects,
      certifications: props.certifications,
      sections: props.sections,
      accentColor: props.accentColor,
      templateId: props.templateId,
    });

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.0);

    // Scroll container + per-page refs
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

    const scrollToPage = (n: number) => {
      const scroller = scrollRef.current;
      const el = pageRefs.current[n - 1];
      if (!scroller || !el) return;
      const top = el.offsetTop - 8; // small padding
      scroller.scrollTo({ top, behavior: 'smooth' });
      setPageNumber(n);
    };

    const handleScroll = () => {
      const scroller = scrollRef.current;
      if (!scroller) return;
      const scrollerTop = scroller.getBoundingClientRect().top;
      let nearest = 1;
      let minDist = Number.POSITIVE_INFINITY;
      for (let i = 0; i < pageRefs.current.length; i++) {
        const el = pageRefs.current[i];
        if (!el) continue;
        const dist = Math.abs(el.getBoundingClientRect().top - scrollerTop);
        if (dist < minDist) {
          minDist = dist;
          nearest = i + 1;
        }
      }
      setPageNumber(nearest);
    };

    // Sync worker with the exact API version react-pdf uses
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    useEffect(() => {
      let url: string | null = null;
      const build = async () => {
        const blob = await pdf(<PdfTemplate {...props} key={contentKey} />).toBlob();
        url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setPageNumber(1);
        // NEW: notify parent with the url
        props.onPdfReady?.(url);
      };
      build();
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }, [docKey, contentKey]); // Rebuild when any content or section order changes

    return (
      <div className="w-full flex flex-col items-center pt-3 px-6">
        <div
          style={{
            width: '100%',
            height: '90vh',
            borderRadius: 8,
            transformOrigin: 'top center',
          }}
        >
          {pdfUrl && (
            <div className="flex flex-col h-full">
              {/* Full-width toolbar matching the PDF background width */}
              <div className="sticky top-0 z-10 px-0 py-2 bg-transparent">
                <div className="w-full rounded-none border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
                  <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4 px-4 py-2">
                    {/* Left: navigation */}
                    <div className="flex items-center gap-2 justify-start">
                      <button
                        aria-label="Previous page"
                        onClick={() => scrollToPage(Math.max(1, pageNumber - 1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        ◀
                      </button>
                      <button
                        aria-label="Next page"
                        onClick={() => scrollToPage(Math.min(numPages || 1, pageNumber + 1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        ▶
                      </button>
                    </div>

                    {/* Center: zoom */}
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        aria-label="Zoom out"
                        onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        −
                      </button>
                      <span className="w-12 text-center text-sm text-gray-800 dark:text-gray-200">
                        {(scale * 100).toFixed(0)}%
                      </span>
                      <button
                        aria-label="Zoom in"
                        onClick={() => setScale((s) => Math.min(3, s + 0.1))}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      >
                        +
                      </button>
                    </div>

                    {/* Right: pagination */}
                    <div className="flex items-center gap-2 justify-end">
                      <input
                        type="number"
                        min={1}
                        max={numPages || 1}
                        value={pageNumber}
                        onChange={(e) => {
                          const v = parseInt(e.target.value || '1', 10);
                          const target = Math.min(Math.max(1, v), numPages || 1);
                          scrollToPage(target);
                        }}
                        className="h-8 w-16 rounded-md border border-gray-300 bg-white px-2 text-center text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">/{numPages || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable container: left-align when wider; center when narrower */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-x-auto overflow-y-auto flex justify-start py-4"
                style={{ background: theme === 'dark' ? '#1f2937' : '#f3f4f6', scrollBehavior: 'smooth' }}
              >
                <div className="min-w-max mx-auto px-4">
                  <Document
                    file={pdfUrl}
                    className="flex flex-col items-center"
                    onLoadSuccess={({ numPages }) => {
                      setNumPages(numPages);
                      pageRefs.current = new Array(numPages).fill(null);
                      setTimeout(() => scrollToPage(1), 0);
                    }}
                    loading={<div className="p-4">Loading PDF…</div>}
                  >
                    {Array.from({ length: numPages }, (_, i) => (
                      <div
                        key={`p-${i + 1}`}
                        ref={(el) => (pageRefs.current[i] = el)}
                        className="mx-auto mb-6 inline-block border border-gray-200 dark:border-gray-700 bg-white p-4 shadow-sm"
                      >
                        <Page pageNumber={i + 1} scale={scale} />
                      </div>
                    ))}
                  </Document>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}

