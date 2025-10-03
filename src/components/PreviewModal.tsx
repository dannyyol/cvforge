import React from 'react';
import { X } from 'lucide-react';
import type { CVSection } from '../types/cv';
import { CVPreview } from './preview/CVPreview';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: CVSection[];
  template: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  sections,
  template
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-2xl max-w-[900px] w-full max-h-[90vh] flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200 shadow-sm">
          <h2 className="text-xl font-semibold text-secondary-900">CV Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-secondary-100 p-4 md:p-8">
          <div className="max-w-[8.5in] mx-auto">
            <CVPreview sections={sections} template={template} />
          </div>
        </div>
      </div>
    </div>
  );
};
