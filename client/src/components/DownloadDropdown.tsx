
import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, File, FileType } from 'lucide-react';
import { exportResumeToPDF, ExportPayload } from '../services/pdfService';

interface DownloadDropdownProps {
  variant?: 'default' | 'mobile' | 'icon-only';
  className?: string;
  buildExportPayload?: () => ExportPayload;
}

export default function DownloadDropdown({ variant = 'default', className = '', buildExportPayload }: DownloadDropdownProps) {
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

  const handleDownload = async (format: 'pdf' | 'doc') => {
    if (format === 'pdf') {
      setIsDownloading(true);
      try {
        if (!buildExportPayload) throw new Error('Missing export payload');
        const payload = buildExportPayload();
        await exportResumeToPDF(payload, 'cv.pdf');
      } catch (error) {
        console.error('Failed to generate PDF:', error);
      } finally {
        setIsDownloading(false);
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
          className={`w-full px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <Download className="w-4 h-4" />
          {isDownloading && <span className="text-xs">Generating...</span>}
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999]">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <File className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => handleDownload('doc')}
              disabled={isDownloading}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999] min-w-[160px]">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <File className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => handleDownload('doc')}
              disabled={isDownloading}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999] min-w-[180px]">
          <button
            onClick={() => handleDownload('pdf')}
            disabled={isDownloading}
            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <File className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => handleDownload('doc')}
            disabled={isDownloading}
            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileType className="w-4 h-4" />
            DOC
          </button>
        </div>
      )}
    </div>
  );
}
