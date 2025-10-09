import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText } from 'lucide-react';

interface DownloadDropdownProps {
  variant?: 'default' | 'mobile' | 'icon-only';
  className?: string;
}

export default function DownloadDropdown({ variant = 'default', className = '' }: DownloadDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleDownload = (format: 'pdf' | 'doc') => {
    console.log(`Downloading as ${format.toUpperCase()}`);
    setIsOpen(false);
  };

  if (variant === 'icon-only') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors ${className}`}
        >
          <Download className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <button
              onClick={() => handleDownload('pdf')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Download as PDF
            </button>
            <button
              onClick={() => handleDownload('doc')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Download as DOC
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
          className={`preview-mobile-download ${className}`}
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[160px]">
            <button
              onClick={() => handleDownload('pdf')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Download as PDF
            </button>
            <button
              onClick={() => handleDownload('doc')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Download as DOC
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
        className={className}
      >
        Download
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[160px]">
          <button
            onClick={() => handleDownload('pdf')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Download as PDF
          </button>
          <button
            onClick={() => handleDownload('doc')}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Download as DOC
          </button>
        </div>
      )}
    </div>
  );
}
