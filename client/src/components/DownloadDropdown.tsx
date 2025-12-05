import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, File, FileType } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { generateCVPDF } from '../services/pdfService';

interface DownloadDropdownProps {
  variant?: 'default' | 'mobile' | 'icon-only';
  className?: string;
  pdfDocument?: React.ReactElement;
  downloadUrl?: string;
}

export default function DownloadDropdown({ variant = 'default', className = '', pdfDocument, downloadUrl }: DownloadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const triggerUrlDownload = (url?: string) => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.pdf';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = async (format: 'pdf' | 'doc') => {
    if (format === 'pdf') {
      if (downloadUrl) {
        triggerUrlDownload(downloadUrl);
      } else if (pdfDocument) {
        // If no url but a document is provided, let the user click the PDFDownloadLink below
        // We won't trigger here; keep menu open for the link.
      } else {
        // Fallback: legacy service
        setIsDownloading(true);
        try {
          await generateCVPDF('cv.pdf');
        } catch (error) {
          console.error('Failed to generate PDF:', error);
        } finally {
          setIsDownloading(false);
        }
      }
    } else {
      console.log('DOC export not implemented yet');
    }
    setIsOpen(false);
  };

  if (variant === 'icon-only') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isDownloading}
          className={`w-full px-5 py-3 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 ${className}`}
        >
          <Download className="w-4 h-4" />
          {isDownloading && <span className="text-xs">Generating...</span>}
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-[9999]">
            {downloadUrl ? (
              <button
                onClick={() => handleDownload('pdf')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <File className="w-4 h-4" />
                PDF
              </button>
            ) : pdfDocument ? (
              <PDFDownloadLink
                document={pdfDocument}
                fileName="resume.pdf"
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {({ loading }) => (
                  <>
                    <File className="w-4 h-4" />
                    {loading ? 'Preparing PDF...' : 'PDF'}
                  </>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                onClick={() => handleDownload('pdf')}
                disabled={isDownloading}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <File className="w-4 h-4" />
                PDF
              </button>
            )}
            <button
              onClick={() => handleDownload('doc')}
              disabled={isDownloading}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileType className="w-4 h-4" />
              DOC
            </button>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isDownloading}
          className={`preview-mobile-download ${className} ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Generating...' : 'Export'}
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-[9999] min-w-[160px]">
            {downloadUrl ? (
              <button
                onClick={() => handleDownload('pdf')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
              >
                <File className="w-4 h-4" />
                PDF
              </button>
            ) : pdfDocument ? (
              <PDFDownloadLink
                document={pdfDocument}
                fileName="resume.pdf"
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {({ loading }) => (
                  <>
                    <File className="w-4 h-4" />
                    {loading ? 'Preparing PDF...' : 'PDF'}
                  </>
                )}
              </PDFDownloadLink>
            ) : (
              <button
                onClick={() => handleDownload('pdf')}
                disabled={isDownloading}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <File className="w-4 h-4" />
                PDF
              </button>
            )}
            <button
              onClick={() => handleDownload('doc')}
              disabled={isDownloading}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileType className="w-4 h-4" />
              DOC
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
        className={`${className} ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Download className="w-4 h-4" />
        {isDownloading ? 'Generating...' : 'Export'}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-[9999] min-w-[180px]">
          {downloadUrl ? (
            <button
              onClick={() => handleDownload('pdf')}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
            >
              <File className="w-4 h-4" />
              PDF
            </button>
          ) : pdfDocument ? (
            <PDFDownloadLink
              document={pdfDocument}
              fileName="resume.pdf"
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {({ loading }) => (
                <>
                  <File className="w-4 h-4" />
                  {loading ? 'Preparing PDF...' : 'PDF'}
                </>
              )}
            </PDFDownloadLink>
          ) : (
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <File className="w-4 h-4" />
              PDF
            </button>
          )}
          <button
            onClick={() => handleDownload('doc')}
            disabled={isDownloading}
            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileType className="w-4 h-4" />
            DOC
          </button>
        </div>
      )}
    </div>
  );
}
