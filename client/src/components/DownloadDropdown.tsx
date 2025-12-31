
import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, File } from 'lucide-react';
import { exportResumeToPDF } from '../services/pdfService';
import { useCVStore } from '../store/useCVStore';
import { buildCVPayload } from '../utils/payloadBuilder';
import { Toast, type ToastType } from './ui/Toast';

interface DownloadDropdownProps {
  className?: string;
}

export default function DownloadDropdown({ className = '' }: DownloadDropdownProps) {
  const { cvData, selectedTemplate } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({ message: '', type: 'info', isVisible: false });
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
        const payload = buildCVPayload(cvData, selectedTemplate);
        await exportResumeToPDF(payload, 'cv.pdf');
        setToast({ message: 'PDF exported successfully!', type: 'success', isVisible: true });
      } catch (error) {
        setToast({ message: 'Failed to export PDF. Please try again.', type: 'error', isVisible: true });
      } finally {
        setIsDownloading(false);
      }
    } 
    setIsOpen(false);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
        className={`bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors ${className} ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Download className="w-4 h-4" />
        {isDownloading ? 'Generating...' : 'Export'}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-[9999] min-w-[180px]">
          <button
            onClick={() => handleDownload('pdf')}
            disabled={isDownloading}
            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <File className="w-4 h-4" />
            PDF
          </button>
        </div>
      )}
    </div>
  );
}
