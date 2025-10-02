import React from 'react';
import type { CVSection } from '../types/cv';


interface EditorPanelProps {
  activeSection: CVSection | null;
  onContentChange: (sectionId: string, content: any) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  activeSection,
  onContentChange
}) => {
  if (!activeSection) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No section selected</p>
          <p className="text-gray-400 text-sm">
            Select a section from the sidebar to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto w-full">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 z-10">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          {activeSection.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Edit your {activeSection.title.toLowerCase()} information
        </p>
      </div>

      <div className="p-4 md:p-6"></div>
    </div>
  );
};
