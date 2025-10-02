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

      <div className="relative bg-white rounded-lg shadow-2xl w-[90vw] h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">CV Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <CVPreview sections={sections} template={template} />
        </div>
      </div>
    </div>
  );
};
